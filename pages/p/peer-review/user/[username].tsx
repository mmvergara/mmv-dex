import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { DatabaseTypes } from "../../../../types/db/db-types";
import { BiLinkAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import useSnowFlakeLoading from "../../../../utils/useSnowFlakeLoading";
import Link from "next/link";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { emailToUsername, usernameToEmail } from "../../../../utils/helper-functions";
import Head from "next/head";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  ctx.res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=59");
  const supabase = createServerSupabaseClient(ctx);
  const email = usernameToEmail(ctx.query?.username) || "";

  // Check if peer_review reviewee exists
  const { data: reviewee, error: revieweeErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (revieweeErr || !reviewee) return { notFound: true };

  //Fetch user reviews
  return { props: { reviewee } };
};

type peerReviewIdandReviewee =
  | ({ id: number } & { reviewer: string } & { profiles: { email: string } | { email: string }[] | null })[]
  | null;

function UserPeerReviews({ reviewee }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const supabase = useSupabaseClient<DatabaseTypes>();

  const { SnowFlakeLoading, isLoading, setIsLoading } = useSnowFlakeLoading("text-9xl", true);
  const [peerReviews, setPeerReviews] = useState<peerReviewIdandReviewee>(null);

  const getUserReviews = async () => {
    const { data: peerReview, error } = await supabase
      .from("peer_reviews")
      .select("id,reviewer,profiles!peer_reviews_reviewer_fkey(email)")
      .eq("reviewee", reviewee.id);

    if (error) {
      toast.error(error.message);
      setPeerReviews([]);
    }
    if (!error) setPeerReviews(peerReview);

    setIsLoading(false);
  };

  useEffect(() => {
    getUserReviews();
  }, []);

  if (isLoading) return <LoadingUI SnowFlakeLoading={SnowFlakeLoading} />;

  return (
    <>
      <Head>
        <title>Dex | User Peer Reviews</title>
      </Head>
      <h1 className='text-center mt-8 mb-4 font-Poppins font-semibold text-2xl'>
        @{emailToUsername(reviewee.email)} | Peer Reviews
      </h1>
      <section>
        <table className='table-auto w-[100%] max-w-[500px] mx-auto border-2 text-left'>
          <thead className='border-2'>
            <tr>
              <th className='p-2'>Review ID</th>
              <th className='p-2'>Reviewer </th>
              <th className='p-2 text-center'>Link</th>
            </tr>
          </thead>
          <tbody>
            {peerReviews &&
              peerReviews.length > 0 &&
              peerReviews.map((pr) => {
                const reviewerName = !Array.isArray(pr.profiles) && emailToUsername(pr.profiles?.email);
                if (!reviewerName) return;
                return (
                  <tr>
                    <td className='p-2 font-semibold'>#{pr.id}</td>
                    <td className='p-2 font-semibold'>
                      <Link href={`/profile/${reviewerName}`} className='hover:bg-emerald-100 p-1 rounded-lg'>
                        @{reviewerName}
                      </Link>
                    </td>
                    <td className=' text-white flex justify-center items-center'>
                      <Link href={`/p/peer-review/${pr.id}`} className='my-auto bg-emerald-500 p-2 mt-1 rounded-sm'>
                        <BiLinkAlt />
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {!peerReviews?.length && <p className='text-center p-4 w-[100%]'> This user has no reviews yet. 😖</p>}
      </section>
    </>
  );
}

export default UserPeerReviews;

function LoadingUI({ SnowFlakeLoading }: { SnowFlakeLoading: JSX.Element }) {
  return (
    <span className='flex text-xl items-center justify-center mt-8 flex-wrap flex-col'>
      <span className='text-2xl sm:text-4xl mb-4 font-Poppins font-semibold'>Loading Peer Review</span>
      <span className='flex'>{SnowFlakeLoading}</span>
    </span>
  );
}
