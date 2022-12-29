import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { dbPostDetails, postDetails } from "../types";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { axiosErrorParse } from "../utils/error-handling";
import { DatabaseTypes } from "../types/db/db-types";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Head from "next/head";
import PostCard from "../components/post/PostCard";
import { getAccessAndRefreshTokenAsCookie } from "../utils/auth-cookies";

export async function getAllPosts(context: GetServerSidePropsContext) {
  const supabase = createServerSupabaseClient<DatabaseTypes>(context);
  const host = context.req.headers.referer;

  // Check auth and set accessToken and refreshToken Cookies
  const cookie = await getAccessAndRefreshTokenAsCookie(supabase);

  try {
    // Fetch posts
    type getAllPostApiResponse = { data: dbPostDetails[] | null; error: PostgrestError | null };
    const result = await fetch(`${host}/api/post/all`, {
      headers: { cookie: cookie || "" },
    });
    let error: PostgrestError | null = null;
    const { data: allPosts, error: dbErr } = (await result.json()) as getAllPostApiResponse;
    
    if (dbErr) error = dbErr;

    // Create postInfo array
    let posts: postDetails[] = [];
    if (allPosts && allPosts?.length > 0)
      posts = allPosts.map((p) => {
        return {
          id: p.id,
          title: p.title,
          description: p.description,
          image_url: p.image_url,
          author: p.profiles.email.split("@").slice(0, -1).join(""),
        };
      });

    return { data: posts, error };
  } catch (err) {
    console.log({err})
    return axiosErrorParse(err);
  }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { data, error } = await getAllPosts(context);

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
