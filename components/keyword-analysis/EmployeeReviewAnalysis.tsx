import { employeeReviewKeywordAnalysisResults } from "../../utils/helper-functions";
import uniqid from "uniqid";
import * as React from "react";

type Props = {
  analysis: employeeReviewKeywordAnalysisResults;
  isLoading: boolean;
};

const EmployeeReviewsKeywordAnalysisResults: React.FC<Props> = ({ analysis, isLoading }) => {
  if (!analysis || analysis?.length === 0) return <></>;

  return (
    <div className={`fontPoppins flex flex-col gap-2 p-4 mt-4 bg-slate-100 rounded-md ${isLoading && "opacity-20"}`}>
      {!isLoading &&
        analysis.map(([keyword, { reviewsContainingKeyword, keywordOccurrences }]) => {
          if (keyword.length === 0) return <></>;
          return (
            <article key={uniqid()}>
              <h3 className='text-2xl'>
                Results for <b>"{keyword}"</b>
              </h3>
              <article className='my-2 border-2 p-2 rounded-md'>
                <p className='text-lg flex justify-between items-center'>
                  <span>
                    Total times <b>"{keyword}"</b> appeared in peer review comments:
                  </span>
                  <span className='bg-slate-300 p-2 rounded-lg'>{reviewsContainingKeyword}</span>
                </p>
                <hr className='border-1 my-2' />
                <p className='text-lg flex justify-between items-center'>
                  <span>
                    Total occurence of <b>"{keyword}"</b> in peer review comments:
                  </span>
                  <span className='bg-slate-300 p-2 rounded-lg'>{keywordOccurrences}</span>
                </p>
              </article>
            </article>
          );
        })}
    </div>
  );
};

export default EmployeeReviewsKeywordAnalysisResults;
