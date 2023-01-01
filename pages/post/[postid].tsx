import { classNameJoin, getImagePublicUrl, getServerSidePropsRedirectTo } from "../../utils/helper-functions";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { MdOutlineRateReview } from "react-icons/md";
import { useEffect, useState } from "react";
import { useSession, useUser } from "@supabase/auth-helpers-react";
import { emailToUsername } from "../../utils/parsers";
import { useUserRole } from "../../context/RoleContext";
import { getPostById } from "../../supabase/services/posts-service";
import { toast } from "react-toastify";
import DeletePostButton from "../../components/post/DeletePostButton";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const postid = String(context.params?.postid);
  if (!postid) return getServerSidePropsRedirectTo("/");
  const props = await getPostById(context, postid);
  return { props };
};

export default function Post(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [imgIsLoading, setImgIsLoading] = useState(true);
  const { data: post, error } = props;
  const session = useSession();
  const role = useUserRole();
  const user = useUser();

  useEffect(() => {
    if (error) toast.error(error.message);
  }, []);

  if (!post) return <h1 className='text-3xl sm:text-6xl text-center mt-10'>Post not found 😭</h1>;
  const canDelete = role === "admin" || post.author === user?.id;

  return (
    <>
      <Head>
        <title>Dex | {post.title}</title>
        <meta name='description' content={`${post.title} details`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section className='flex  items-center mt-2 sm:mt-5 m-4 mx-auto h-[100%] max-w-[630px] drop-shadow-lg '>
        <div className='flex flex-col m-4 h-[100%]'>
          {!Array.isArray(post.profiles) && (
            <Link
              href={`/profile/${emailToUsername(post.profiles?.email)}`}
              className='text-3xl hover:underline underline-offset-4 font-Poppins mb-2'
            >
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
          <div className='font-Poppins mt-2 flex flex-col '>
            <h1 className='text-xl sm:text-3xl text-left break-words tracking-wide max-w-[600px]'>{post.title}</h1>
            <p className='break-all max-w-[600px]'>{post.description}</p>
          </div>
          {user && (
            <div className='flex mt-8 items-center gap-2 font-Poppins text-white text-center'>
              {canDelete && <DeletePostButton postId={post.id} />}
              {!Array.isArray(post.profiles) && session?.user.email !== post.profiles?.email && (
                <Link
                  href={`/peer-review/create?username=${emailToUsername(post.profiles?.email)}`}
                  className='bg-emerald-500  p-1 flex gap-2 items-center sm:p-2 rounded-sm'
                >
                  <span className='inline text-2xl p-2 sm:p-0 '>
                    <MdOutlineRateReview />
                  </span>{" "}
                  <span className='hidden sm:block'>Review User</span>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
