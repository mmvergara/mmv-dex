import axios from "axios";
import { useRouter } from "next/router";
import { BsTrashFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { axiosErrorParse } from "../../utils/error-handling";
import useSnowFlakeLoading from "../../utils/useSnowFlakeLoading";

const DeletePeerReviewBtn: React.FC<{ reviewid: string | number }> = ({ reviewid }) => {
  const { SnowFlakeLoading, isLoading, setIsLoading } = useSnowFlakeLoading();
  const router = useRouter();
  const deleteReviewHandler = async () => {
    setIsLoading(true);
    try {
      await axios.delete("/api/peer-review/delete?reviewid=" + reviewid);
      router.push("/search-users");
      toast.error("Review deleted");
    } catch (e) {
      const { error } = axiosErrorParse(e);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      className='bg-red-500 text-white text-md flex gap-2 items-center p-1 sm:p-2 rounded-sm'
      type='button'
      onClick={deleteReviewHandler}
    >
      <span className='inline text-xl p-2 sm:p-0 '>
        {isLoading ? <span className='flex'>{SnowFlakeLoading}</span> : <BsTrashFill />}
      </span>
      <span className='hidden sm:block text-sm'>Delete Review</span>
    </button>
  );
};

export default DeletePeerReviewBtn;
