import { MdOutlineAnalytics } from "react-icons/md";
import { HiSearchCircle } from "react-icons/hi";
import { VscPreview } from "react-icons/vsc";
import Link from "next/link";

const DashboardLinks: React.FC = () => {
  return (
    <article className='bg-slate-200 p-4 w-[100%] max-w-[600px] rounded-sm'>
      <h2 className='font-Poppins font-semibold flex gap-2 items-center'>
        Keyword Analysis
        <span className='text-2xl'>
          <MdOutlineAnalytics />
        </span>
      </h2>
      <Link
        href={"/p/keyword-analysis/post-description"}
        className='w-[100%] formButton my-2 rounded-sm flex justify-center'
      >
        Post Descriptions
      </Link>
      <Link
        href={"/p/keyword-analysis/employee-reviews"}
        className='w-[100%] formButton my-2 rounded-sm flex justify-center'
      >
        Employee Reviews
      </Link>
      <hr className='border-2 my-2 border-slate-300' />
      <h2 className='font-Poppins font-semibold whitespace-nowrap flex gap-2 items-center'>
        Peer Reviews{" "}
        <span className='text-2xl'>
          <VscPreview />
        </span>
      </h2>
      <Link href={"/search-users"} className=' formButton my-2 rounded-sm flex justify-center items-center gap-2'>
        Search Reviews for?
        <span className='text-2xl'>
          <HiSearchCircle />
        </span>
      </Link>
    </article>
  );
};

export default DashboardLinks;
