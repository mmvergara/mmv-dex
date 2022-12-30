import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { DatabaseTypes } from "../../types/db/db-types";

export const getAllPosts = async (context: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(context);
  return await supabase.from("posts").select("*, profiles(id,email)");
};

export const getSinglePosts = async (context: GetServerSidePropsContext, post_id: string) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(context);
  return await supabase.from("posts").select("*, profiles(id,email)").eq("id", post_id).single();
};

export type postWithProfilesResponse = Awaited<ReturnType<typeof getAllPosts>>;

export type postDetails = {
  data: postWithProfilesResponse["data"];
  error: postWithProfilesResponse["error"];
};
