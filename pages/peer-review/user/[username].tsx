import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { getServerSideSupabaseClientSession } from "../../../supabase/services/auth-service";
import { getServerSidePropsRedirectTo } from "../../../utils/helper-functions";
import { usernameToEmail } from "../../../utils/parsers";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { session, supabase } = await getServerSideSupabaseClientSession(ctx);

  // Check auth
  if (!session) return getServerSidePropsRedirectTo("/");

  // Check if user is admin
  const { data, error } = await supabase.from("profiles").select("id,role").eq("id", session.user.id).maybeSingle();
  if (error) return getServerSidePropsRedirectTo("/");
  if (data?.role !== "admin") return getServerSidePropsRedirectTo("/");

  //23

  return { props: {} };
};

const UserPeerReviews: React.FC = () => {
  const router = useRouter();
  const email = usernameToEmail(router.query?.username) || "";

  return <>aaa</>;
};

export default UserPeerReviews;
