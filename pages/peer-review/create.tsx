import { getServerSideSupabaseClientSession } from "../../supabase/services/auth-service";
import { getFormikErrorMessages, getServerSidePropsRedirectTo } from "../../utils/helper-functions";
import { GetServerSidePropsContext } from "next";
import { peerReviewValidation } from "../../schemas/yup-schemas";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import axios from "axios";
import RequiredRatingField from "../../components/forms/Required-Rating-Field";
import useSnowFlakeLoading from "../../utils/useSnowFlakeLoading";
import Head from "next/head";
export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { session } = await getServerSideSupabaseClientSession(context);
  if (!session) return getServerSidePropsRedirectTo("/");
  return { props: {} };
};

const CreatePeerReview: React.FC = () => {
  const router = useRouter();
  const { SnowFlakeLoading, isLoading, setIsLoading } = useSnowFlakeLoading();
  const initialUsername = typeof router.query.username === "string" ? router.query.username : "";

  const handleSubmitPeerReview = async () => {
    setIsLoading(true);
    console.log("SUBMITTED");
    await axios.put("/api/peer-review/create", { ...formik.values, date: new Date().toUTCString() });
    setIsLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      name: initialUsername,
      date: "Sun, 01 Jan 2023 06:02:15 GMT",

      presentation_rating_score: 1,
      presentation_rating_comment: "",

      technical_rating_score: 1,
      technical_rating_comment: "",

      assists_peers_rating_score: 1,
      assists_peers_rating_comment: "",

      documentation_rating_score: 1,
      documentation_rating_comment: "",

      optional_rating_stood_out: "",
    },
    validationSchema: peerReviewValidation,
    onSubmit: handleSubmitPeerReview,
  });

  const RequiredRatings = Array.from(
    new Set(
      Object.keys(formik.values)
        .filter((formikFields) => {
          // Get required fields from formik.values
          return formikFields.endsWith("score") || formikFields.endsWith("comment");
        })
        .map((x) => x.split("_rating")[0]) // remove "get required rating names"
    ) // turn to set to remove duplicates
  ); // Conver back to array

  console.log(RequiredRatings);
  const formikErrors = getFormikErrorMessages<typeof formik["initialValues"]>(formik);
  return (
    <>
      <Head>
        <title>Dex | {initialUsername ? `@${initialUsername} Peer Review` : "New Peer Review"}</title>
        <meta name='description' content='Create new peer review' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <section className='mb-40'>
        <h1 className='text-4xl sm:text-7xl text-center font-Poppins sm:mt-10 mt-8 mb-8 '>Create Review</h1>
        <form className='w-[100%] max-w-[500px] mx-auto' onSubmit={formik.handleSubmit}>
          <div className='mx-2'>
            <label htmlFor='name' className='text-2xl font-semibold'>
              {" "}
              Review for :
            </label>
            <input
              type='text'
              className='w-[100%] mb-4 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
              placeholder=' Username'
              id='name'
              name='name'
              value={formik.values.name}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
            {formikErrors.length > 0 && (
              <div className='border-2 border-red-600 p-2 text-red-500 font-Poppins'>
                {formikErrors.map((msg) => {
                  return <p>{msg}</p>;
                })}
              </div>
            )}
            {RequiredRatings.map((r) => {
              return (
                <RequiredRatingField
                  ratingValueName={r + "_rating_score"}
                  commentValueName={r + "_rating_comment"}
                  label={r + " Score"}
                  formikValues={formik.values}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              );
            })}
            <div className='border-2 p-4 shadow-md rounded-sm '>
              <p className='font-Poppins text-1xl sm:text-2xl'>Optional Ratings:</p>
              <input
                type='text'
                className='w-[100%] mb-4 my-2 p-2 bg-inputPri focus:bg-white rounded-md tracking-wide font-Poppins'
                placeholder='Stood out in?'
                id='optional_rating_stood_out'
                name='optional_rating_stood_out'
                value={formik.values.optional_rating_stood_out}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            </div>

            <button type='submit' className='formButton mt-4 flex justify-center items-center gap-2'>
              Submit Review <span className='text-xl flex'>{isLoading && SnowFlakeLoading}</span>
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default CreatePeerReview;
