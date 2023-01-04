import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { DatabaseTypes,  peer_reviews_no_eval } from "../../types/db/db-types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { BiLinkAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import Link from "next/link";

type props = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const RecentReviews: React.FC<props> = ({ setIsLoading }) => {
  const [reviews, setPosts] = useState<peer_reviews_no_eval[]>([]);
  const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(false);

  const supabase = useSupabaseClient<DatabaseTypes>();

  const fetchReviews = async () => {
    setIsLoading(true);
    const { data, error, count } = await supabase
      .from("peer_reviews")
      .select("*", { count: "exact" })
      .order("inserted_at", { ascending: true })
      .range(reviews.length, reviews.length + 4);

    if (error) {
      toast.error(error.message);
      return setIsLoading(false);
    }

    if (data && count) {
      setHasMoreReviews(!(data.length < 5));
      setPosts((prevPosts) => {
        if (prevPosts && data) {
          const seenIds = new Set();
          return [...prevPosts, ...data].filter((post) => {
            if (seenIds.has(post.id)) {
              return false;
            } else {
              seenIds.add(post.id);
              return true;
            }
          });
        }
        return prevPosts;
      });
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  console.log({ reviews });
  useEffect(() => {
    fetchReviews();
  }, []);
  return (
    <div>
      <h3 className='font-semibold my-2'>Most Recent Reviews :</h3>
      <div className='rounded-sm bg-slate-100 '>
        <hr className='border-1 my-2' />
        {reviews &&
          reviews?.map((r) => {
            return (
              <>
                <article className='p-1 px-2 flex justify-between items-center'>
                  <div>sadasdas</div>
                  <Link href={`/post/${r.id}`} className='bg-emerald-500 text-white rounded-sm p-2 text-xl '>
                    {<BiLinkAlt />}
                  </Link>
                </article>
                <hr className='border-1 my-2' />
              </>
            );
          })}
      </div>
      {hasMoreReviews && (
        <button className='bg-purplePri font-Poppins  text-white p-2 my-2 rounded-sm' onClick={fetchReviews}>
          Load more
        </button>
      )}
    </div>
  );
};

export default RecentReviews;
