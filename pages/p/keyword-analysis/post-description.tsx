import { SupabaseClient, useSupabaseClient } from "@supabase/auth-helpers-react";
import { postsKeywordAnalysis } from "../../../utils/helper-functions";
import type { SyntheticEvent } from "react";
import { IoMdRefreshCircle } from "react-icons/io";
import { HiSearchCircle } from "react-icons/hi";
import { DatabaseTypes } from "../../../types/db/db-types";
import { useState } from "react";
import { toast } from "react-toastify";
import PostDescriptionKeywordAnalysisResult from "../../../components/keyword-analysis/PostDescriptionAnalysis";
import useSnowFlakeLoading from "../../../utils/useSnowFlakeLoading";
import Head from "next/head";

const PostDescriptionAnalysis: React.FC = () => {
  const supabase = useSupabaseClient<DatabaseTypes>();
  const { SnowFlakeLoading, isLoading, setIsLoading } = useSnowFlakeLoading();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const fetchPostDescriptions = async (supabase: SupabaseClient<DatabaseTypes>) => {
    return await supabase.from("posts").select("id,description,author");
  };
  type PostIDandDescription = Awaited<ReturnType<typeof fetchPostDescriptions>>;

  const [posts, setPosts] = useState<PostIDandDescription["data"] | null>(null);

  const handleSearchSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const { data, error } = await fetchPostDescriptions(supabase);

    if (error) toast.error(error.message);
    if (data) setPosts(data);
    setIsLoading(false);
  };

  // Refer to X as the "search query string"
  const analysis = postsKeywordAnalysis(posts, searchQuery);

  return (
    <>
      <Head>
        <title>Dex | Keyword Analysis - Post description</title>
      </Head>
      <section>
        <form className='w-[100%] max-w-[600px] mx-auto mt-8' onSubmit={handleSearchSubmit}>
          <div className='mx-2 flex flex-col'>
            <label htmlFor='Name' className='font-Poppins w-[100%] flex m-2 items-center justify-between'>
              Keyword Analysis - Post Description
            </label>
            <div className='w-[100%] flex gap-2 flex-col sm:flex-row'>
              <input
                className='flex-grow p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
                type='text'
                placeholder='keyword | ex. addidas'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target?.value.trim())}
              />
              <button className='formButton w-auto flex gap-2 justify-center items-center'>
                <span className='text-xl flex'>
                  {isLoading && SnowFlakeLoading} {!isLoading && !posts && <HiSearchCircle />}
                  {!isLoading && posts && <IoMdRefreshCircle />}
                </span>
                {!posts ? "Search" : "Refresh"}
              </button>
            </div>
            <PostDescriptionKeywordAnalysisResult analysis={analysis} searchQuery={searchQuery} isLoading={isLoading} />
          </div>
        </form>
      </section>
    </>
  );
};

export default PostDescriptionAnalysis;
