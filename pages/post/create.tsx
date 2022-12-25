import { useFormik } from "formik";
import { postValidationSchema } from "../../schemas/FormSchemas";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
const CreatePost: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imgPreviewUrl, setImgUrlPreview] = useState<string | null>(null);

  const submitPostHandler = () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("title", formik.values.title);
    formData.append("description", formik.values.description);
    formData.append("imageUrl", image);
  };

  // create a preview as a side effect, whenever selected file is changed
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
    <form className='flex flex-col mt-8 justify-center items-center max-w-[340px] mx-auto bg-gray- p-4'>
      <h2 className='text-5xl mb-4 font-Poppins'>New Post</h2>
      {titleError && <p className='text-left pl-2 w-[100%] text-red-600'>{titleError}</p>}
      <input
        type='text'
        className='w-[100%] mb-4 p-2 bg-inputPri sha focus:bg-white rounded-md tracking-wide font-Poppins'
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
        className='w-[100%] mb-4 p-2 bg-inputPri sha focus:bg-white rounded-md tracking-wide font-Poppins'
        placeholder='Description'
        value={formik.values.description}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
      ></textarea>
      <input
        type='file'
        onChange={(e) => {
          console.log("FIle changed");
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
        </>
      )}
      <button type='submit' className='formButton'>
        Submit Post
      </button>
    </form>
  );
};

export default CreatePost;
