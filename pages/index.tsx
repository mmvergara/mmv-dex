import { PostgrestError } from "@supabase/supabase-js";
import { postDetails } from "../types";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { DatabaseTypes } from "../types/db/db-types";
import { useEffect } from "react";
import { toast } from "react-toastify";
import PostCard from "../components/post/PostCard";
import Head from "next/head";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient<DatabaseTypes>(context);
  const { data, error } = await supabase.from("posts").select("*, profiles(id,email)");
  console.log(data)
  return {
    props: {
      posts: data || [],
      error,
    },
  };
}

type HomeProps = { posts: postDetails[]; error: PostgrestError | null | { message: string } };
export default function Home({ posts, error }: HomeProps) {
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
