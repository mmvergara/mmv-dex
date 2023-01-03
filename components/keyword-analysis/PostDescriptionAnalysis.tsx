import { PostAnalysisResult } from "../../utils/helper-functions";
type props = {
  analysis: PostAnalysisResult;
  searchQuery: string;
  isLoading: boolean;
};
const PostDescriptionKeywordAnalysisResult: React.FC<props> = ({ analysis, searchQuery, isLoading }) => {
  if (!analysis) return <></>;

  return (
    <article className={`fontPoppins flex flex-col gap-2 p-4 mt-4 bg-slate-100 rounded-md ${isLoading && "opacity-20"}`}>
      <h3 className='font-semibold text-3xl'>
        Results for <b>"{searchQuery}"</b>
      </h3>
      <hr className='border-1 my-2' />
      <p className='text-xl flex justify-between items-center'>
        <span> Total Posts : </span>
        <span className='bg-slate-300 p-2 rounded-lg'>{analysis.totalPosts}</span>
      </p>
      <hr className='border-1 my-2' />
      <p className='text-xl flex justify-between items-center'>
        <span>
          Total posts where <b>"{searchQuery}"</b> is in the description :{" "}
        </span>
        <span className='bg-slate-300 p-2 rounded-lg'>
          {analysis.total_OccurenceOf_X_InEachPostDescription_WithId.length}
        </span>
      </p>
      <hr className='border-1 my-2' />
      <p className='text-xl flex justify-between items-center'>
        <span>
          Total occurences of <b>"{searchQuery}"</b> in descriptions :{" "}
        </span>
        <span className='bg-slate-300 p-2 rounded-lg'>{analysis.total_OccurenceOf_X_InDesc}</span>
      </p>

      <hr className='border-1 my-2' />
      <p className='text-xl flex justify-between items-center'>
        <span>
          Total users using <b>"{searchQuery}"</b> in the description :{" "}
        </span>
        <span className='bg-slate-300 p-2 rounded-lg'>{analysis.total_UsersUsing_X_inTheirDesc}</span>
      </p>
    </article>
  );
};

export default PostDescriptionKeywordAnalysisResult;
