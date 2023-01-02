import { getFormikErrorMessages, getRequiredRatings } from "../../utils/helper-functions";
import { GetServerSidePropsContext } from "next";
import { peerReviewValidation } from "../../schemas/yup-schemas";
import { axiosErrorParse } from "../../utils/error-handling";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import useSnowFlakeLoading from "../../utils/useSnowFlakeLoading";
import RequiredRatingField from "../../components/forms/Required-Rating-Field";
import axios from "axios";
import Head from "next/head";
import { getServerSideSupabaseClientSession } from "../../supabase/services/auth-service";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { session } = await getServerSideSupabaseClientSession(context);
  if (!session) return { notFound: true };
  return { props: {} };
};