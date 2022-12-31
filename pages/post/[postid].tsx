import { classNameJoin, getImagePublicUrl, getServerSidePropsRedirectTo } from "../../utils/helper-functions";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { emailToUsername } from "../../utils/parsers";
import { useUserRole } from "../../context/RoleContext";
import { getPostById } from "../../supabase/services/posts-service";
import { useUser } from "@supabase/auth-helpers-react";
import { toast } from "react-toastify";
import Image from "next/image";
import Head from "next/head";
import axios from "axios";
import { axiosErrorParse } from "../../utils/error-handling";
import Link from "next/link";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const postid = String(context.params?.postid);
  if (!postid) return getServerSidePropsRedirectTo("/");
  const props = await getPostById(context, postid);
  return { props };
};

export default function Post(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [imgIsLoading, setImgIsLoading] = useState(true);
  const user = useUser();
  const role = useUserRole();
  const { data: post, error } = props;

  const deletePostHandler = async () => {
    try {
      await axios.delete(`/api/post/delete?postid=${post?.id}`);
      toast.success("Post delete successfully");
    } catch (e) {
      const { error } = axiosErrorParse(e);
      if (error) toast.error(error.message);
    }
  };

  useEffect(() => {
    if (error) toast.error(error.message);
  }, []);

  if (!post) return <h1 className='text-3xl sm:text-6xl text-center mt-10'>Post not found 😭</h1>;
  const canDelete = post.author === user?.id || role === "admin";

  return (
    <>
      <Head>
        <title>Dex | {post.title}</title>
        <meta name='description' content={`${post.title} details`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section className='flex  items-center mt-2 sm:mt-5 m-4 mx-auto w-[100%] max-w-[600px] drop-shadow-lg'>
        <div className='flex flex-col m-4'>
          {!Array.isArray(post.profiles) && (
            <Link href={`/profile/${emailToUsername(post.profiles?.email)}`} className='text-3xl font-Poppins mb-2'>
              @{emailToUsername(post.profiles?.email)}
            </Link>
          )}
          <Image
            alt={`${post.title || ""} post preview image`}
            src={getImagePublicUrl(post.image_path, "post-images")}
            width='600'
            height='600'
            className={classNameJoin(
              "duration-700 ease-in-out object-cover rounded-lg",
              imgIsLoading ? "scale-110 blur-md grayscale" : "scale-100 blur-0 grayscale-0"
            )}
            onLoadingComplete={() => setImgIsLoading(false)}
          />
          <div className='font-Poppins mt-2'>
            <h1 className='text-xl sm:text-3xl text-left w-[100%] tracking-wide'>{post.title}</h1>
            <p className='opacity-80 text-sm sm:text-2xl'>{post.description}</p>
          </div>
          {user && (
            <div className='flex mt-8 items-center gap-2 font-Poppins text-white'>
              {(canDelete || true) && (
                <button className='bg-red-500 p-1 sm:p-2 rounded-sm' type='button' onClick={deletePostHandler}>
                  Delete Post
                </button>
              )}
              <Link
                href={`/peer-review/create?username=${
                  !Array.isArray(post.profiles) && emailToUsername(post.profiles?.email)
                }`}
                className='bg-green-500 p-1 sm:p-2 rounded-sm'
              >
                Review User
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
