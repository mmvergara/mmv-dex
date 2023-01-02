const RatingScore: React.FC<{ rating: number }> = ({ rating }: { rating: number }) => {
  let bgColor = "bg-amber-500";

  if (rating === 1) bgColor = 'bg-red-600'
  if (rating === 2) bgColor = 'bg-orange-600'
  if (rating === 3) bgColor = 'bg-green-600'
  if (rating === 4) bgColor = 'bg-teal-600'
  if (rating === 5) bgColor = 'bg-sky-600'


  return <span className={`'inline w-[30px] h-[30px] text-center rounded-md text-white opacity-90 ${bgColor}`}>{rating}</span>;
};

export default RatingScore;
