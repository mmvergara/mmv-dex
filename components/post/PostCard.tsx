import { useState } from "react";
import { postDetails } from "../../types";
import Image from "next/image";
import Link from "next/link";

const PostCard: React.FC<{ post: postDetails }> = ({ post }: { post: postDetails }) => {
  const [isLoading, setLoading] = useState(true);
  const className = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };
  return (
    <Link href={post.id + ""} className=' hover:drop-shadow-2xl transition-all ease-in rounded-xl'>
      <div className='aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-7'>
        <Image
          alt=''
          src={post.image_url}
          fill
          sizes='300px'
          className={className(
            "duration-700 ease-in-out object-cover",
            isLoading ? "scale-110 blur-2xl grayscale" : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <p className='mt-1 text-lg font-medium text-gray-900'>{post.title}</p>
      <p className=' text-sm font-medium text-gray-900 opacity-60'>@{post.author}</p>
      <h3 className='mt-4 text-sm text-gray-700'>{post.description}</h3>
    </Link>
  );
};

export default PostCard;
