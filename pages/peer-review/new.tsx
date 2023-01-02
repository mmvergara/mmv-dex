import { getServerSideSupabaseClientSession } from "../../supabase/services/auth-service";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { MdOutlineRateReview } from "react-icons/md";
import { emailToUsername } from "../../utils/parsers";
import { DatabaseTypes } from "../../types/db/db-types";
import { toast } from "react-toastify";
import useSnowFlakeLoading from "../../utils/useSnowFlakeLoading";
import Link from "next/link";
import Head from "next/head";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { session } = await getServerSideSupabaseClientSession(ctx);
  if (!session) return { notFound: true };
  return { props: {} };
};

const NewPeerReview: React.FC = () => {
  const supabase = useSupabaseClient<DatabaseTypes>();
  const session = useSession();
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
      console.log("username", username);
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
        <title>Dex | New Peer Review</title>
        <meta name='description' content='Page to select user to a peer review' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section>
        <form className='w-[100%] max-w-[500px] mx-auto mt-8'>
          <div className='mx-2'>
            <label htmlFor='Name' className='font-Poppins flex m-2 items-center justify-between'>
              Create Review for:
              <div className='flex text-purpleSec text-2xl'>{isLoading && SnowFlakeLoading}</div>
            </label>
            <input
              list='users'
              name='Name'
              className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
              type='text'
              placeholder='Search Username'
              onChange={(e) => setUsername(e.target?.value)}
            />
            <div>
              <article>
                {usernameLists?.map((user) => {
                  const username = emailToUsername(user.email);
                  return (
                    <Link
                      key={user.id}
                      href={`/peer-review/create?username=${username}`}
                      className='flex items-center group w-[100%] hover:bg-slate-200 font-Poppins font-semibold border-2 p-2 my-2'
                    >
                      <p className='mr-auto'>@{username}</p>
                      <span className='text-2xl flex flex-grow-1 gap-2'>
                        <p className='text-sm text-white group-hover:text-black  underline'>Click to review user</p>
                        <MdOutlineRateReview />
                      </span>
                    </Link>
                  );
                })}
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
