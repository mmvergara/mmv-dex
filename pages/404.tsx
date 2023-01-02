import Head from "next/head";
import { useRouter } from "next/router";

const PageNotFound: React.FC = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Dex | 404 Page not found </title>
        <meta name='description' content='Create new peer review' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='h-[30vh] sm:h-[50vh] text-center flex justify-center items-center flex-col'>
        <h1 className='text-lg sm:text-3xl'>404 | This page could not be found. 💔</h1>
        <button
          type='button'
          onClick={() => router.back()}
          className='bg-purpleSec text-white font-Poppins p-4 rounded-md font-semibold mt-4'
        >
          ⬅ Go Back
        </button>
      </div>
    </>
  );
};

export default PageNotFound;
