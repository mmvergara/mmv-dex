import { employeeReviewKeywordAnalysis } from "../../../utils/helper-functions";
import { DatabaseTypes, peer_reviews } from "../../../types/db/db-types";
import {  useSupabaseClient } from "@supabase/auth-helpers-react";
import { PostgrestResponse } from "@supabase/supabase-js";
import { HiSearchCircle } from "react-icons/hi";
import {  useEffect } from "react";
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

  const fetchEmployeeReviews = async (signal: AbortSignal) => {
    if (pattern.length === 0) return;
    setIsLoading(true);
    setTimeout(async () => {
      let res: PostgrestResponse<peer_reviews> | null = null;
      const rpc = "employee_review_keyword_analysis";
      if (signal) res = (await supabase.rpc(rpc, { pattern }).abortSignal(signal)) as PostgrestResponse<peer_reviews>;
      if (!signal) res = (await supabase.rpc(rpc, { pattern })) as PostgrestResponse<peer_reviews>;
      if (!res) return setIsLoading(false);
      const { data, error } = res;
      if (error) {
        // Ignore error if the error is a "Aborted request"
        if (Number(error.code) === 20) return setIsLoading(false);

        setIsLoading(false);
        toast.error(error.message);
        return;
      }
      if (data) setReviews(data);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    const ac = new AbortController();
    const signal = ac.signal;
    fetchEmployeeReviews(signal);
    return () => ac.abort();
  }, [searchQuery]);
  console.log(reviews)
  const analysis = employeeReviewKeywordAnalysis(reviews, pattern);

  return (
    <>
      <Head>
        <title>Dex | Keyword Analysis - Employee Peer Reviews</title>
      </Head>
      <section>
        <form className='w-[100%] max-w-[600px] mx-auto mt-8' onSubmit={(e) => e.preventDefault()}>
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
              <button disabled className='formButton w-auto flex gap-2 justify-center items-center'>
                <span className='text-xl flex'>
                  {isLoading && SnowFlakeLoading} {!isLoading && <HiSearchCircle />}
                </span>
              </button>
            </div>
            <div>
              <EmployeeReviewsKeywordAnalysisResults isLoading={isLoading} analysis={analysis} pattern={pattern} />
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default EmployeeReviewsAnalysis;
