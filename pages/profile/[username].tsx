import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { emailToUsername, usernameToEmail } from "../../utils/helper-functions";
import { getUserPostsTitleById } from "../../supabase/services/posts-service";
import { getUserProfileByEmail } from "../../supabase/services/auth-service";
import { useUserRole } from "../../context/RoleContext";
import { useSession } from "@supabase/auth-helpers-react";
import { BiLinkAlt } from "react-icons/bi";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import Head from "next/head";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/db/db-generated-types";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const email = usernameToEmail(ctx.query?.username) || "";
  const supabase = createServerSupabaseClient<Database>(ctx);
  const { data: user, error: userErr } = await getUserProfileByEmail(supabase, email);

  if (!user || userErr) return { notFound: true };

  const { data: posts, error } = await getUserPostsTitleById(supabase, user.id, 5);
  return { props: { user, posts, error } };
};

export default function Profile(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const role = useUserRole();
  const session = useSession();
  const { posts, user, error } = props;
  useEffect(() => {
    if (error) toast.error(error.message);
  }, []);

  const isOwner = session?.user.email === user.email;
  return (
    <>
      <Head>
        <title>Dex | Profile @{emailToUsername(user.email)}</title>
        <meta name='description' content={`${emailToUsername(user.email)} profile`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='flex flex-col justify-center mt-[30px] sm:mt-[80px] mx-4'>
        <section className='mx-auto w-[100%] max-w-[600px] bg-slate-100 drop-shadow-lg p-4 rounded-lg m-2 flex flex-col sm:flex-row gap-2 justify-center sm:justify-between items-center'>
          <div>
            <p className='text-left text-3xl font-Poppins '>@{emailToUsername(user.email)}</p>
            <p>Joined: {new Date(user.inserted_at).toLocaleDateString()}</p>
          </div>
          <div className='flex gap-2'>
            {role === "admin" && (
              <Link
                href={`/p/peer-review/user/${emailToUsername(user.email)}`}
                className='bg-blue-500 text-white p-2 font-Poppins font-semiBold rounded-sm'
              >
                See Reviews
              </Link>
            )}
            {session?.user && !isOwner && (
              <Link
                href={`/peer-review/create?username=${emailToUsername(user.email)}`}
                className='bg-green-500 text-white p-2 font-Poppins font-semiBold rounded-sm'
              >
                Review User
              </Link>
            )}
          </div>
        </section>
        <section className='mx-auto w-[100%] max-w-[600px] bg-slate-100 drop-shadow-lg p-4 rounded-lg m-2 flex flex-col justify-between'>
          <h4 className='text-3xl text-center sm:text-left w-[100%] font-Poppins '>Most Recent Post's</h4>
          <hr className='h-[3px] my-2 w-[100%] bg-slate-200' />
          {posts?.length === 0
            ? "This user has no posts ????"
            : posts?.map((p) => {
                return (
                  <article key={p.id} className=' my-2 p-2 font-Poppins flex flex-wrap justify-between items-center'>
                    <p className='overflow-hidden'>
                      {p.title}
                      <span className='block opacity-50'>{new Date(p.created_at).toLocaleDateString()}</span>
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
