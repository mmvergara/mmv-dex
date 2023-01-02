import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { peer_review_evaluation } from "../../../types/db/db-types";
import { emailToUsername } from "../../../utils/parsers";
import { ObjectEntries } from "../../../types";
import DeletePeerReviewBtn from "../../../components/peer-review/DeletePeerReviewBtn";
import RatingCard from "../../../components/peer-review/RatingCard";
import uniqid from "uniqid";
import Link from "next/link";
import Head from "next/head";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const reviewid = ctx.query?.reviewid || "";

  // Check if peer_review exists
  const { data: review, error } = await supabase
    .from("peer_reviews")
    .select("*,peer_reviews_reviewer_fkey(reviewer:email),peer_reviews_reviewee_fkey(reviewee:email)")
    .eq("id", reviewid)
    .maybeSingle();
  if (error) return { notFound: true };
  if (!review) return { notFound: true };

  //Fetch user reviews
  return { props: { review } };
};

// red orange green cyangreen cyan
function PeerReview({ review }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const evaluation = review.evaluation as peer_review_evaluation;
  const { required_rating, optional_rating } = evaluation;

  const requiredRatings = Object.entries(required_rating) as ObjectEntries<typeof required_rating>;
  const optionalRatings = Object.entries(optional_rating) as ObjectEntries<typeof optional_rating>;

  const { peer_reviews_reviewee_fkey, peer_reviews_reviewer_fkey } = review;

  const revieweeName =
    (!Array.isArray(peer_reviews_reviewee_fkey) && emailToUsername(peer_reviews_reviewee_fkey?.reviewee)) || "";
  const reviewerName =
    (!Array.isArray(peer_reviews_reviewer_fkey) && emailToUsername(peer_reviews_reviewer_fkey?.reviewer)) || "";
  return (
    <>
      <Head>
        <title>Dex | Peer Review #{review.id}</title>
      </Head>
      <section className='mt-8 font-Poppins w-[100%] max-w-[600px] mx-auto p-4 bg-slate-100 drop-shadow-md rounded-lg'>
        <div className='m-2'>
          <p className='text-3xl flex justify-between items-center'>
            <span>Peer Review #{review.id}</span>
            <span>
              <DeletePeerReviewBtn reviewid={review.id} />
            </span>
          </p>
          <div className='opacity-80 ml-1'>
            <Link href={`/profile/${revieweeName}`} className='hover:underline'>
              Reviewee: @{revieweeName}
            </Link>{" "}
            <br />
            <Link href={`/profile/${reviewerName}`} className='hover:underline'>
              Reviewer: @{reviewerName}
            </Link>
          </div>
          <div>
            {requiredRatings.map((r) => (
              <RatingCard key={uniqid(r[0])} ratingName={r[0]} ratingComment={r[1].comment} ratingScore={r[1].score} />
            ))}
            {optionalRatings.map((r) => {
              if (!r[1]) return;
              return <RatingCard key={uniqid()} ratingName={r[0]} ratingComment={r[1]} isOptionalRating={true} />;
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default PeerReview;
