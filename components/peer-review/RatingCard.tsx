import RatingScore from "./RatingScore";

interface RatingCardProps {
  ratingName: string;
  ratingComment: string;
  ratingScore?: number;
  isOptionalRating?: boolean;
}

const RatingCard: React.FC<RatingCardProps> = ({ ratingComment, ratingName, ratingScore, isOptionalRating }) => {
  const nameRemoveScore = ratingName.replace("_score", "").replace("_", " ");
  const RatingNameTransformed = nameRemoveScore.charAt(0).toUpperCase() + nameRemoveScore.slice(1);
  return (
    <>
      <article className=' my-2 p-2'>
        <hr className='border-1 my-2' />
        <h5 className='text-2xl flex items-center justify-between'>
          <span>
            {RatingNameTransformed} {!isOptionalRating && "Score"}
          </span>
          {ratingScore && <RatingScore rating={ratingScore} />}
        </h5>
        <p className='opacity-80 mt-4'>{ratingComment}</p>
      </article>
    </>
  );
};

export default RatingCard;
