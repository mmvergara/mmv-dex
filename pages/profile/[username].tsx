import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { emailToUsername, usernameToEmail } from "../../utils/parsers";
import { getUserPostsTitleById } from "../../supabase/services/posts-service";
import { getUserProfile } from "../../supabase/services/auth-service";
import { BiLinkAlt } from "react-icons/bi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import Head from "next/head";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const email = usernameToEmail(ctx.query?.username) || "";
  const { data: user, error: userErr } = await getUserProfile(ctx, email);
  if (!user || userErr) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const { data: posts, error } = await getUserPostsTitleById(ctx, user.id, 5);
  return { props: { user, posts, error } };
};

export default function Profile(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { posts, user, error } = props;

  useEffect(() => {
    if (error) toast.error(error.message);
  }, []);
  const username = emailToUsername(user.email);
  return (
    <>
      <Head>
        <title>Dex | Profile @{username}</title>
        <meta name='description' content={`${username} profile`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex flex-col justify-center mt-[30px] sm:mt-[80px] mx-4'>
        <section className='mx-auto w-[100%] max-w-[600px] bg-slate-100 drop-shadow-lg p-4 rounded-lg m-2 flex flex-col sm:flex-row gap-2 justify-center sm:justify-between items-center'>
          <div>
            <p className='text-left text-3xl font-Poppins '>@{username}</p>
            <p>Joined: {new Date(user.inserted_at).toLocaleDateString()}</p>
          </div>
          <Link
            href={`/peer-review/create?username=${username}`}
            className='bg-green-500 text-white p-2 font-Poppins font-semiBold rounded-sm'
          >
            Review User
          </Link>
        </section>
        <section className='mx-auto w-[100%] max-w-[600px] bg-slate-100 drop-shadow-lg p-4 rounded-lg m-2 flex flex-col justify-between'>
          <h4 className='text-3xl text-center sm:text-left w-[100%] font-Poppins '>Most Recent Post's</h4>
          <hr className='h-[3px] my-2 w-[100%] bg-slate-200' />
          {posts?.length === 0
            ? "This user has no posts 😢"
            : posts?.map((p) => {
                return (
                  <article key={p.id} className=' my-2 p-2 font-Poppins flex flex-wrap justify-between items-center'>
                    <p className='overflow-hidden'>
                      {p.title}
                      <p className='opacity-50'>{new Date(p.created_at).toLocaleDateString()}</p>
                    </p>
                    <Link href={`/post/${p.id}`} className='bg-emerald-500 text-white rounded-sm p-2 text-xl '>
                      {<BiLinkAlt />}
                    </Link>
                  </article>
                );
              })}
        </section>
      </div>
    </>
  );
}
