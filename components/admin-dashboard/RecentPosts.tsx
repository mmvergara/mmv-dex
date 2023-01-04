import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { emailToUsername, limitStringToNLength } from "../../utils/helper-functions";
import { getPosts, postWithProfilesResponse } from "../../supabase/services/posts-service";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { BiLinkAlt } from "react-icons/bi";
import { toast } from "react-toastify";
import Link from "next/link";

type props = {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

const RecentPosts: React.FC<props> = ({ setIsLoading }) => {
  const [posts, setPosts] = useState<postWithProfilesResponse["data"]>([]);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(false);

  const supabase = useSupabaseClient();

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error, count } = await getPosts(supabase, { from: posts?.length || 0, to: (posts?.length || 0) + 4 });
    if (error) {
      toast.error(error.message);
      return setIsLoading(false);
    }

    if (data && count) {
      setHasMorePosts(!(data.length < 5));
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

  useEffect(() => {
    console.log("USE EFFECT");
    fetchPosts();
  }, []);
  return (
    <div>
      <h3 className='font-semibold my-2'>Most Recent Posts :</h3>
      <div className='rounded-sm bg-slate-100 '>
        <hr className='border-1 my-2' />
        {posts &&
          posts?.map((p) => {
            return (
              <>
                <article className='p-1 px-2 flex justify-between items-center'>
                  <div>
                    {!Array.isArray(p.profiles) && (
                      <span className='mr-2 '>@{emailToUsername(p.profiles?.email)} |</span>
                    )}
                    <span>{limitStringToNLength(p.title, 15)}</span>
                  </div>
                  <Link href={`/post/${p.id}`} className='bg-emerald-500 text-white rounded-sm p-2 text-xl '>
                    {<BiLinkAlt />}
                  </Link>
                </article>
                <hr className='border-1 my-2' />
              </>
            );
          })}
      </div>
      {hasMorePosts && (
        <button className='bg-purplePri font-Poppins  text-white p-2 my-2 rounded-sm' onClick={fetchPosts}>
          Load more
        </button>
      )}
    </div>
  );
};

export default RecentPosts;
