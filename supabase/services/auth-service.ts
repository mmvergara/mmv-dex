import { createServerSupabaseClient, SupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { DatabaseTypes } from "../../types/db/db-types";

export const getServerSideSupabaseClientSession = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(context);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return { session, supabase };
};

export const getUserProfileByEmail = async (GetServerSidePropsContext: GetServerSidePropsContext, email: string) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(GetServerSidePropsContext);
  return await supabase.from("profiles").select("*").eq("email", email).maybeSingle();
};

// Check if the user is an admin
export const checkIfUserIsAdminById = async (supabase: SupabaseClient, userId?: string) => {
  if (!userId) return { isAdmin: false };
  const { data } = await supabase.from("profiles").select("role,id").eq("id", userId).maybeSingle();
  if (data?.role === "admin") return { isAdmin: true };
  return { isAdmin: false };
};
