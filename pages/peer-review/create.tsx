import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { getServerSideSupabaseClientSession } from "../../supabase/services/auth-service";
import { getServerSidePropsRedirectTo } from "../../utils/helper-functions";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import { peerReviewValidation } from "../../schemas/yup-schemas";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { session } = await getServerSideSupabaseClientSession(context);
  if (!session) return getServerSidePropsRedirectTo("/");
  return { props: {} };
};
const CreatePeerReview: React.FC = () => {
  const router = useRouter();
  console.log(router.query);
  const initialUsername = typeof router.query.username === "string" ? router.query.username : "";
  const [username, setUsername] = useState<string>(initialUsername);

  const formik = useFormik({
    initialValues: {
      name: username,
      date: new Date().getTime(),
      presentation_score_comment: "",
      presentation_score_rating: 0,
      technical_score_comment: "",
      technical_score_rating: 0,
      assists_peers_score: "",
      assists_peers_rating: 0,
      documentation_score: "",
      documentation_score_rating: 0,
      optional_rating_stood_out: "",
    },
    validationSchema: peerReviewValidation,
    onSubmit: () => {},
  });

  const handleSubmitPeerReview = () => {
    const {} = formik.values;
  };
  return (
    <section>
      <h1>Create a review</h1>

      <form></form>
      {username}
    </section>
  );
};

export default CreatePeerReview;
