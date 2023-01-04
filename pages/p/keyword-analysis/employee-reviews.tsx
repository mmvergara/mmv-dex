import { SupabaseClient, useSupabaseClient } from "@supabase/auth-helpers-react";
import { employeeReviewKeywordAnalysis } from "../../../utils/helper-functions";
import { DatabaseTypes, peer_reviews } from "../../../types/db/db-types";
import type { SyntheticEvent } from "react";
import { IoMdRefreshCircle } from "react-icons/io";
import { PostgrestResponse } from "@supabase/supabase-js";
import { HiSearchCircle } from "react-icons/hi";
import { useState } from "react";
import { toast } from "react-toastify";
import EmployeeReviewsKeywordAnalysisResults from "../../../components/keyword-analysis/EmployeeReviewAnalysis";
import useSnowFlakeLoading from "../../../utils/useSnowFlakeLoading";
import Head from "next/head";

const EmployeeReviewsAnalysis: React.FC = () => {
  const supabase = useSupabaseClient<DatabaseTypes>();
  const { SnowFlakeLoading, isLoading, setIsLoading } = useSnowFlakeLoading();

  const [reviews, setReviews] = useState<peer_reviews[] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const pattern = searchQuery.split(",").join("|");

  const fetchEmployeeReviews = async (supabase: SupabaseClient<DatabaseTypes>) => {
    if (pattern.length === 0) return;
    return (await supabase.rpc("employee_review_keyword_analysis", {
      pattern,
    })) as PostgrestResponse<peer_reviews>;
  };

  const handleSearchSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const res = await fetchEmployeeReviews(supabase);
    if (!res) return setIsLoading(false);

    const { data, error } = res;
    if (error) toast.error(error.message);
    if (data) setReviews(data);
    setIsLoading(false);
  };
  const analysis = employeeReviewKeywordAnalysis(reviews, pattern);

  return (
    <>
      <Head>
        <title>Dex | Keyword Analysis - Employee Peer Reviews</title>
      </Head>
      <section>
        <form className='w-[100%] max-w-[600px] mx-auto mt-8' onSubmit={handleSearchSubmit}>
          <div className='mx-2 flex flex-col'>
            <label htmlFor='Name' className='font-Poppins w-[100%] flex m-2 items-center justify-between'>
              Keyword Analysis - Employee Peer Reviews
            </label>
            <div className='w-[100%] flex gap-2 flex-col sm:flex-row'>
              <input
                className='flex-grow p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
                type='text'
                placeholder='seperate using commas  ( , )'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target?.value.trim().toLowerCase())}
              />
              <button className='formButton w-auto flex gap-2 justify-center items-center'>
                <span className='text-xl flex'>
                  {isLoading && SnowFlakeLoading} {!isLoading && !reviews && <HiSearchCircle />}
                  {!isLoading && reviews && <IoMdRefreshCircle />}
                </span>
                {!reviews ? "Search" : "Refresh"}
              </button>
            </div>
            <div>
              <EmployeeReviewsKeywordAnalysisResults isLoading={isLoading} analysis={analysis} />
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EmployeeReviewsAnalysis;
