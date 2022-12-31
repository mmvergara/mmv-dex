import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { DatabaseTypes } from "../../types/db/db-types";

export const getServerSideSupabaseClientSession = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(context);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return { session, supabase };
};

export const getUserProfile = async (GetServerSidePropsContext: GetServerSidePropsContext, email: string) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(GetServerSidePropsContext);

  return await supabase.from("profiles").select("*").eq("email", email).maybeSingle()
};
