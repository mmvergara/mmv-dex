import axios from "axios";
import { useRouter } from "next/router";
import { BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { axiosErrorParse } from "../../utils/error-handling";
import useSnowFlakeLoading from "../../utils/useSnowFlakeLoading";
type props = { postId: string | number };
const DeletePostButton: React.FC<props> = ({ postId }) => {
  const router = useRouter();
  const { SnowFlakeLoading, isLoading, setIsLoading } = useSnowFlakeLoading("text-2xl");
  const deletePostHandler = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`/api/post/delete?postid=${postId}`);
      toast.success("Post delete successfully");
      router.push("/");
    } catch (e) {
      const { error } = axiosErrorParse(e);
      if (error) toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className='bg-red-500 flex gap-2 items-center p-1 sm:p-2 rounded-sm'
        type='button'
        onClick={deletePostHandler}
      >
        {isLoading ? (
          <>
            {SnowFlakeLoading}
            Deleting . . .
          </>
        ) : (
          <>
            <span className='inline text-2xl p-2 sm:p-0 '>
              <BsTrashFill />
            </span>
            <span className='hidden sm:block'>Delete Post</span>
          </>
        )}
      </button>
    </>
  );
};

export default DeletePostButton;
