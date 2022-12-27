import axios, { AxiosResponse } from "axios";
import { axiosErrorParse } from "../utils/error-handling";
import { useEffect } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { toast } from "react-toastify";
import Head from "next/head";
import PostCard from "../components/post/PostCard";
import { dbPostDetails, postDetails } from "../types";

export async function getAllPosts() {
  try {
    // Fetch posts
    type getAllPostApiResponse = { data: dbPostDetails[] | null; error: PostgrestError | null };
    const result = (await axios.get(
      "http:localhost:3000/api/post/all"
    )) as AxiosResponse<getAllPostApiResponse>;
    let error: PostgrestError | null = null;
    const { data: allPosts, error: dbErr } = result.data;
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
    return axiosErrorParse(err);
  }
}

export async function getServerSideProps() {
  const { data, error } = await getAllPosts();
  return {
    props: {
      posts: data || [],
      error,
    },
  };
}

type HomeProps = { posts: postDetails[]; error: PostgrestError | null };
export default function Home({ posts, error }: HomeProps) {
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
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
