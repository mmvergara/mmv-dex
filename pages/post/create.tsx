import { useRef, useState, useEffect } from "react";
import { postValidationSchema } from "../../schemas/FormSchemas";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { axiosErrorParse } from "../../utils/error-handling";
import { DatabaseTypes } from "../../types/db/db-types";
import { GiSnowflake2 } from "react-icons/gi";
import { useFormik } from "formik";
import { toast } from "react-toastify";

import axios from "axios";
import Image from "next/image";
import useUploadSettings from "../../utils/useUploadSettings";
import imageCompression from "browser-image-compression";

const CreatePost: React.FC = () => {
  const supabase = useSupabaseClient<DatabaseTypes>();
  const [image, setImage] = useState<File | null>(null);
  const [imgPreviewUrl, setImgUrlPreview] = useState<string | null>(null);
  const { uploadSettings, UploadSettingsUI } = useUploadSettings();
  const { compressionMethod, isCompressed, uploadServer } = uploadSettings;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitPostHandler = async () => {
    if (!image) return;
    let imgFile = image;
    if (compressionMethod === "client") {
      imgFile = await imageCompression(image, { maxSizeMB: 5 });
    }
    console.log({ imgFile });
    const formData = new FormData();
    formData.append("title", formik.values.title);
    formData.append("description", formik.values.description);
    formData.append("image", imgFile);
    formData.append("compressed", String(isCompressed));
    formData.append("compressionMethod", compressionMethod);
    console.log({ uploadServer, isCompressed, compressionMethod });

    try {
      setIsLoading(true);
      if (uploadServer === "supabase") {
        const { data, error } = await supabase.functions.invoke("createpost", {
          body: formData,
        });
        console.log({ data, error });
      }
      if (uploadServer === "vercel") {
        await axios.put("/api/post/create", formData);
      }
      toast.success("Post Uploaded", { position: "top-left" });
      // formik.resetForm();
      // setImage(null);
    } catch (e) {
      const { error } = axiosErrorParse(e);
      toast.error(error.message, { position: "top-left" });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (!image) {
      setImgUrlPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(image);
    setImgUrlPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: postValidationSchema,
    onSubmit: submitPostHandler,
  });

  const postImageInputRef = useRef<HTMLInputElement>(null!);
  const clickUploadHandler = () => postImageInputRef.current.click();

  const titleError = formik.touched.title && formik.errors.title;
  const descriptionError = formik.touched.description && formik.errors.description;
  return (
    <form
      className='flex flex-col mt-8 justify-center items-center max-w-[340px] mx-auto bg-gray- p-4'
      onSubmit={formik.handleSubmit}
    >
      <h2 className='text-5xl mb-4 font-Poppins'>New Post</h2>
      {titleError && <p className='text-left pl-2 w-[100%] text-red-600'>{titleError}</p>}
      <input
        type='text'
        className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
        placeholder='Title'
        id='title'
        name='title'
        value={formik.values.title}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      />
      {descriptionError && (
        <p className='text-left pl-2 w-[100%] text-red-600'>{descriptionError}</p>
      )}
      <textarea
        name='description'
        id='description'
        className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
        placeholder='Description'
        value={formik.values.description}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      ></textarea>
      <input
        type='file'
        onChange={(e) => {
          ("FIle changed");
          if (!e.target.files || e.target.files.length === 0) {
            setImage(null);
            return;
          }
          setImage(e.target.files[0]);
        }}
        ref={postImageInputRef}
        hidden
      />

      <button type='button' onClick={clickUploadHandler} className='formButton mb-4'>
        Upload Post Image *
      </button>
      {imgPreviewUrl && (
        <>
          <div className='relative w-[300px] h-[280px] pt-2 aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-lg mb-4 bg-gray-800 xl:aspect-w-7 xl:aspect-h-8'>
            <Image alt='post image preview' src={imgPreviewUrl} className='object-cover ' fill />
          </div>
          {UploadSettingsUI}
        </>
      )}

      <button type='submit' className='formButton flex items-center justify-center gap-2'>
        Submit Post
        {isLoading && (
          <span className='spin'>
            <GiSnowflake2 />
          </span>
        )}
      </button>
    </form>
  );
};

export default CreatePost;
