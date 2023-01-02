import { getServerSideSupabaseClientSession } from "../supabase/services/auth-service";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { MdOutlineRateReview } from "react-icons/md";
import { emailToUsername } from "../utils/parsers";
import { DatabaseTypes } from "../types/db/db-types";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";
import useSnowFlakeLoading from "../utils/useSnowFlakeLoading";
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
        <title>Dex | Search Users</title>
        <meta name='description' content='Page to select user to a peer review' />
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
              list='users'
              name='Name'
              className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
              type='text'
              placeholder='Username'
              onChange={(e) => setUsername(e.target?.value)}
            />
            <div>
              <article>
                {usernameLists?.map((user) => {
                  const username = emailToUsername(user.email);
                  return (
                    <div className='flex items-center flex-wrap group gap-2 text-center sm:text-left w-[100%] hover:bg-slate-200 font-Poppins  border-2 p-2 my-2'>
                      <p className='mr-auto font-semibold'>@{username}</p>
                      <Link
                        href={"/"}
                        className='bg-sky-500 text-white p-2 ml-2 rounded-sm text-sm flex flex-grow-1 gap-1 items-center justify-center'
                      >
                        <span className='text-xl'>
                          <CgProfile />
                        </span>
                        <span className="hidden sm:block">see profile</span>
                      </Link>{" "}
                      <Link
                        href={"/"}
                        className='bg-emerald-500 text-white p-2 ml-2 rounded-sm text-sm flex flex-grow-1 gap-1 items-center justify-center'
                      >
                        <span className='text-xl'>
                          <MdOutlineRateReview />
                        </span>
                        <span className="hidden sm:block">review user</span>
                      </Link>
                    </div>
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
