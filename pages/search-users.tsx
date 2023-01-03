import { getServerSideSupabaseClientSession } from "../supabase/services/auth-service";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { MdOutlineRateReview, MdReviews } from "react-icons/md";
import { DatabaseTypes } from "../types/db/db-types";
import { useUserRole } from "../context/RoleContext";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";
import useSnowFlakeLoading from "../utils/useSnowFlakeLoading";
import Link from "next/link";
import Head from "next/head";
import { emailToUsername } from "../utils/helper-functions";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { session } = await getServerSideSupabaseClientSession(ctx);
  if (!session) return { notFound: true };
  return { props: {} };
};

const NewPeerReview: React.FC = () => {
  const supabase = useSupabaseClient<DatabaseTypes>();
  const session = useSession();
  const role = useUserRole();
  const { SnowFlakeLoading, isLoading, setIsLoading } = useSnowFlakeLoading("", false);
  const [usernameLists, setUsernameLists] = useState<{ email: string; id: string }[] | null>(null);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const ac = new AbortController();
    const signal = ac.signal;
    getProfiles(username, signal);
    return () => {
      ac.abort();
    };
  }, [username]);

  async function getProfiles(username: string, signal: AbortSignal) {
    setTimeout(async () => {
      setIsLoading(true);
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id,email")
        .like("email", `${username}%`)
        .limit(15)
        .abortSignal(signal);
      if (error) {
        // Ignore error if the error is a "Aborted request"
        if (Number(error.code) === 20) return;

        setIsLoading(false);
        toast.error(error.message);
        return;
      }

      if (profiles) setUsernameLists(profiles.filter((p) => p.id !== session?.user.id));
      setIsLoading(false);
    }, 500);
  }

  return (
    <>
      <Head>
        <title>Dex | Search Users</title>
        <meta name='description' content='find users by searching their username' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section>
        <form className='w-[100%] max-w-[600px] mx-auto mt-8'>
          <div className='mx-2'>
            <label htmlFor='Name' className='font-Poppins flex m-2 items-center justify-between'>
              Search Users:
              <div className='flex text-purpleSec text-2xl'>{isLoading && SnowFlakeLoading}</div>
            </label>
            <input
              name='Name'
              className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
              type='text'
              placeholder='Username'
              onChange={(e) => setUsername(e.target?.value)}
            />
            <div>
              <article>
                {session?.user && usernameLists?.map((user) => UserLinks(emailToUsername(user.email), role))}
                {usernameLists?.length === 0 && <p>No User's Found 😞</p>}
              </article>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default NewPeerReview;

function UserLinks(username: string, role?: string | null): JSX.Element {
  return (
    <div className='flex items-center flex-wrap group gap-2 text-center sm:text-left w-[100%] hover:bg-slate-200 font-Poppins border-2 p-2 my-2'>
      <p className='mr-auto font-semibold'>@{username}</p>
      {role === "admin" && (
        <Link
          href={`/p/peer-review/user/${username}`}
          className='bg-blue-500 text-white p-2 ml-2 rounded-sm text-sm flex flex-grow-1 gap-1 items-center justify-center'
        >
          <span className='text-xl'>
            <MdReviews />
          </span>
          <span className='hidden sm:block'>see reviews</span>
        </Link>
      )}
      <Link
        href={`/profile/${username}`}
        className='bg-sky-500 text-white p-2 ml-2 rounded-sm text-sm flex flex-grow-1 gap-1 items-center justify-center'
      >
        <span className='text-xl'>
          <CgProfile />
        </span>
        <span className='hidden sm:block'>see profile</span>
      </Link>{" "}
      <Link
        href={`/peer-review/create?username=${username}`}
        className='bg-emerald-500 text-white p-2 ml-2 rounded-sm text-sm flex flex-grow-1 gap-1 items-center justify-center'
      >
        <span className='text-xl'>
          <MdOutlineRateReview />
        </span>
        <span className='hidden sm:block'>review user</span>
      </Link>
    </div>
  );
}
