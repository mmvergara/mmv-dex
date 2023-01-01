import { getServerSideSupabaseClientSession } from "../../supabase/services/auth-service";
import { getServerSidePropsRedirectTo } from "../../utils/helper-functions";
import { GetServerSidePropsContext } from "next";
import { peerReviewValidation } from "../../schemas/yup-schemas";
import { useState } from "react";
import { useRouter } from "next/router";
import { Formik, FormikProps, FormikValues, useFormik } from "formik";
import axios from "axios";
import { fork } from "child_process";
import uniqid from "uniqid";
import RequiredRatingField from "../../components/forms/Required-Rating-Field";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { session } = await getServerSideSupabaseClientSession(context);
  if (!session) return getServerSidePropsRedirectTo("/");
  return { props: {} };
};
const CreatePeerReview: React.FC = () => {
  const router = useRouter();
  const initialUsername = typeof router.query.username === "string" ? router.query.username : "";

  const handleSubmitPeerReview = () => {
    axios.post("/api/peer-review/create", { ...formik.values });
  };

  const formik = useFormik({
    initialValues: {
      name: initialUsername,
      date: new Date().getTime(),
      presentation_score_comment: "",
      presentation_score_rating: 1,

      technical_score_comment: "",
      technical_score_rating: 1,

      assists_peers_score_comment: "",
      assists_peers_score_rating: 1,

      documentation_score_comment: "",
      documentation_score_rating: 1,

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
          return formikFields.endsWith("rating") || formikFields.endsWith("comment");
        })
        .map((x) => x.split("_score")[0]) // remove "get required rating names"
    ) // turn to set to remove duplicates
  ); // Conver back to array

  const errors = Object.keys(formik.touched).map((touchedKey)=> {return touchedKey && formik.errors?[touchedKey] : ''} )
  console.log(errors)
  return (
    <section>
      <h1 className='text-4xl sm:text-7xl text-center font-Poppins sm:mt-10 mt-8'>Create Review</h1>
      <form className='w-[100%] max-w-[500px] mx-auto'>
        <div className='mx-2'>
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
          {RequiredRatings.map((r) => {
            return (
              <RequiredRatingField
                ratingValueName={r + "_score_rating"}
                commentValueName={r + "_score_comment"}
                label={r + " Score"}
                formikValues={formik.values}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
              />
            );
          })}
        </div>
      </form>
    </section>
  );
};

export default CreatePeerReview;
