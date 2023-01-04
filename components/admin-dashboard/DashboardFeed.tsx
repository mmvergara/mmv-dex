import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { MdRssFeed } from "react-icons/md";
import { useState } from "react";
import useSnowFlakeLoading from "../../utils/useSnowFlakeLoading";
import RecentPosts from "./RecentPosts";
import RecentReviews from "./RecentReviews";

const DashboardFeed: React.FC = () => {
  const supabase = useSupabaseClient();
  const [reviews, setReviews] = useState([]);
  const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(false);

  const { SnowFlakeLoading, isLoading, setIsLoading } = useSnowFlakeLoading("text-purplePri", true);

  return (
    <article className='bg-slate-200 p-4 w-[100%] max-w-[600px] rounded-sm'>
      <h2 className='font-Poppins font-semibold flex items-center gap-2'>
        Feed <MdRssFeed /> {SnowFlakeLoading}
      </h2>
      <RecentPosts setIsLoading={setIsLoading} />
      <hr className='border-1 my-2 bg-slate-50' />
      <RecentReviews setIsLoading={setIsLoading}/>
    </article>
  );
};

export default DashboardFeed;
