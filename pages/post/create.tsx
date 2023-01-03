import { getServerSideSupabaseClientSession } from "../../supabase/services/auth-service";
import { useRef, useState, useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { postValidationSchema } from "../../utils/models-validators";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { axiosErrorParse } from "../../utils/error-handling";
import { DatabaseTypes } from "../../types/db/db-types";
import { AiFillHome } from "react-icons/ai";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import useSnowFlakeLoading from "../../utils/useSnowFlakeLoading";
import useUploadSettings from "../../utils/useUploadSettings";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { session } = await getServerSideSupabaseClientSession(ctx);
  if (!session) return { notFound: true };
  return { props: {} };
};

const CreatePost: React.FC = () => {
  const supabase = useSupabaseClient<DatabaseTypes>();
  const [image, setImage] = useState<File | null>(null);
  const [imgPreviewUrl, setImgUrlPreview] = useState<string | null>(null);
  const { SnowFlakeLoading, setIsLoading } = useSnowFlakeLoading();
  const { uploadSettings, UploadSettingsUI } = useUploadSettings();
  const { compressionMethod, isCompressed, uploadServer } = uploadSettings;

  const submitPostHandler = async () => {
    setIsLoading(true);
    if (!image) {
      toast.error("Please provide an image.");
      return setIsLoading(false);
    }
    let imgFile = image;

    // Compress client side
    try {
      if (compressionMethod === "client") imgFile = await imageCompression(image, { maxSizeMB: 5 });
    } catch (error: any) {
      toast.error(error.message || "Error compressing image on client side");
      return setIsLoading(false);
    }

    const formData = new FormData();
    formData.append("title", formik.values.title);
    formData.append("description", formik.values.description);
    formData.append("image", imgFile);
    formData.append("compressed", String(isCompressed));
    formData.append("compressionMethod", compressionMethod);

    // Upload post to supabase or vercel server
    try {
      if (uploadServer === "supabase") {
        const { error } = await supabase.functions.invoke("createpost", { body: formData });
        if (error) throw new Error(error.message);
      }
      if (uploadServer === "vercel") await axios.put("/api/post/create", formData);
    } catch (e) {
      // Axios Error Parse also works on normal throw new Error()
      const { error } = axiosErrorParse(e);
      toast.error(error.message);
    } finally {
      setImage(null);
      setIsLoading(false);
      formik.resetForm();
      toast.success("Post Uploaded");
    }
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

  const clickUploadHandler = () => postImageInputRef.current.click();
  const postImageInputRef = useRef<HTMLInputElement>(null!);
  const postTitleInputRef = useRef<HTMLInputElement>(null!);
  const titleError = formik.touched.title && formik.errors.title;
  const descriptionError = formik.touched.description && formik.errors.description;

  useEffect(() => {
    postTitleInputRef.current.focus();
  }, []);
  return (
    <>
      <Head>
        <title>Dex | Create new post</title>
        <meta name='description' content={`New post form`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <form
        className='flex flex-col mt-8 justify-center items-center max-w-[500px] mx-auto bg-gray- p-4'
        onSubmit={formik.handleSubmit}
      >
        <div className='flex w-[100%] justify-between items-center mb-4'>
          <h2 className='text-3xl sm:text-5xl font-Poppins'>New Post</h2>
          <Link href='/' className='navLink p-2 sm:p-3 border-2 font-semibold sm:text-2xl'>
            <AiFillHome />
          </Link>
        </div>
        {titleError && <p className='text-left pl-2 w-[100%] text-red-600'>{titleError}</p>}
        <input
          type='text'
          className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
          placeholder='Title'
          id='title'
          name='title'
          ref={postTitleInputRef}
          value={formik.values.title}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
        />
        {descriptionError && <p className='text-left pl-2 w-[100%] text-red-600'>{descriptionError}</p>}
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
            <div className='relative w-[400px] h-[280px] pt-2 aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-lg mb-4 bg-gray-800 xl:aspect-w-7 xl:aspect-h-8'>
              <Image alt='post image preview' src={imgPreviewUrl} className='object-cover' fill />
            </div>
            {UploadSettingsUI}
          </>
        )}

        <button type='submit' className='formButton flex items-center justify-center gap-2'>
          Submit Post
          {SnowFlakeLoading}
        </button>
      </form>
    </>
  );
};

export default CreatePost;
