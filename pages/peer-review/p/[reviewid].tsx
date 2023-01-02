import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { checkIfUserIsAdminById, getServerSideSupabaseClientSession } from "../../../supabase/services/auth-service";
import { emailToUsername } from "../../../utils/parsers";
import RatingCard from "../../../components/peer-review/RatingCard";
import { peer_review_evaluation } from "../../../types/db/db-types";
import { ObjectEntries } from "../../../types";
import uniqid from "uniqid";
import Link from "next/link";
export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { session, supabase } = await getServerSideSupabaseClientSession(ctx);
  const reviewid = ctx.query?.reviewid || "";

  // Check auth
  if (!session) return { notFound: true };

  // Check if user is admin
  const { isAdmin } = await checkIfUserIsAdminById(supabase, session.user.id);
  if (!isAdmin) return { notFound: true };

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
      <section className='mt-8 font-Poppins w-[100%] max-w-[600px] mx-auto p-4 bg-slate-100 drop-shadow-md rounded-lg'>
        <div className='m-2'>
          <p className='text-3xl '>Peer Review #{review.id}</p>
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
            {optionalRatings.map((r) => (
              <RatingCard key={uniqid()} ratingName={r[0]} ratingComment={r[1]} isOptionalRating={true} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default PeerReview;
