import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getPagination, getPosts, postDetailsQuery } from "../supabase/services/posts-service";
import { InferGetServerSidePropsType } from "next";
import { getImagePublicUrl } from "../utils/helper-functions";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import PostCard from "../components/post/PostCard";
import Head from "next/head";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps<postDetailsQuery> = async (context: GetServerSidePropsContext) => {
  const pageNumber = Number(context.query?.page) || 1;
  const postsPerPage = 8;

  const { from, to } = getPagination(pageNumber, postsPerPage);
  const { count, data, error } = await getPosts(context, { from, to });
  const hasMore = !!count && count - 1 > to;
  let countt = 0;

  return { props: { data, error, hasMore } };
};

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: posts, error, hasMore } = props;
  const router = useRouter();
  const currentPage = Number(router.query?.page) || 1;

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
          {posts &&
            (posts.length === 0 ? (
              <h4 className='text-6xl text-center mx-auto'>No post's 🤯 </h4>
            ) : (
              <div className='grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'>
                {posts.map((post) => {
                  if (!(!Array.isArray(post.profiles) && post.profiles?.email)) return;
                  return (
                    <PostCard
                      id={post.id}
                      key={post.id}
                      title={post.title}
                      image_url={getImagePublicUrl(post.image_path, "post-images")}
                      description={post.description}
                      email={post.profiles.email}
                      created_at={post.created_at}
                    />
                  );
                })}
              </div>
            ))}
          <div className='flex justify-center items-center gap-5 mt-10'>
            {currentPage !== 1 && (
              <Link href={`/?page=${currentPage - 1}`} className='paginationButton'>
                back
              </Link>
            )}
            {hasMore && (
              <Link href={`?page=${currentPage + 1}`} className='paginationButton'>
                next
              </Link>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
