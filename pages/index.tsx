import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { InferGetServerSidePropsType } from "next";
import { getAllPosts, postDetails } from "../supabase/services/posts";
import { useEffect } from "react";
import { toast } from "react-toastify";
import PostCard from "../components/post/PostCard";
import Head from "next/head";

export const getServerSideProps: GetServerSideProps<postDetails> = async (ctx: GetServerSidePropsContext) => {
  const props = await getAllPosts(ctx);
  return { props };
};

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: posts, error } = props;
  useEffect(() => {
    if (error) toast.error(error.message);
  }, []);

  return (
    <>
      <Head>
        <title>Dex</title>
        <meta name='description' content='Dex home page' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <h1 className='text-4xl sm:text-7xl text-center font-Poppins sm:mt-10 mt-8'>Explore</h1>
        <section className='mx-auto max-w-2xl py-8 px-4 sm:py-10 sm:px-6 lg:max-w-7xl lg:px-8 font-Poppins'>
          <div className='grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
            {posts && posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </section>
      </main>
    </>
  );
}
