import { postDetailProps } from "../../supabase/services/posts-service";
import { emailToUsername } from "../../utils/parsers";
import { classNameJoin, limitStringToNLength } from "../../utils/helper-functions";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PostCard: React.FC<postDetailProps> = (post) => {
  const { description, id, email, image_url, title } = post;
  const [imgIsLoading, setImgIsLoading] = useState(true);

  return (
    <Link href={`post/${id}`} className=' hover:drop-shadow-2xl transition-all ease-in rounded-xl'>
      <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-7'>
        <Image
          alt={`${title || ""} preview image`}
          src={image_url}
          fill
          sizes='300px'
          className={classNameJoin(
            "duration-700 ease-in-out object-cover",
            imgIsLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setImgIsLoading(false)}
        />
      </div>
      <p className='mt-1 text-lg font-medium text-gray-900 break-words'>{title}</p>
      <p className=' text-sm font-medium text-gray-900 opacity-60 '>@{emailToUsername(email)}</p>
      <h3 className='mt-4 text-sm text-gray-700 break-words'>{limitStringToNLength(description, 150)}</h3>
    </Link>
  );
};

export default PostCard;
