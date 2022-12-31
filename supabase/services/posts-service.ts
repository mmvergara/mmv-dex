import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { posts, profiles } from "../../types/db/db-types";
import { DatabaseTypes } from "../../types/db/db-types";

// getPagination codeby: silentworks https://github.com/supabase/supabase/discussions/1223
export const getPagination = (page: number, size: number) => {
  const limit = size ? +size : 3;
  const from = page ? (page - 1) * limit : 0;
  const to = page ? from + size - 1 : size - 1;
  return { from, to };
};

export const getPosts = async (context: GetServerSidePropsContext, paginate?: { from: number; to: number }) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(context);
  if (paginate) {
    return await supabase
      .from("posts")
      .select("id,title,description,created_at,image_path, profiles( * )", { count: "exact" })
      .range(paginate.from, paginate.to);
  }
  return await supabase
    .from("posts")
    .select("id,title,description,created_at,image_path, profiles( * )", { count: "exact" });
};

export const getPostById = async (context: GetServerSidePropsContext, postid: string) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(context);
  return await supabase.from("posts").select("*,profiles(id,email)").eq("id", postid).maybeSingle();
};

export const getUserPostsById = async (context: GetServerSidePropsContext, user_id: string, limit?: number) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(context);
  if (limit) {
    return await supabase
      .from("posts")
      .select("id,title,description,created_at,image_path,author")
      .eq("author", user_id)
      .limit(limit);
  }
  return await supabase.from("posts").select("id,title,description,created_at,image_path").eq("id", user_id);
};
export const getUserPostsTitleById = async (
  GetServerSidePropsContext: GetServerSidePropsContext,
  user_id: string,
  limit?: number
) => {
  const supabase = createServerSupabaseClient<DatabaseTypes>(GetServerSidePropsContext);
  if (limit) {
    return await supabase.from("posts").select("id,title,created_at").eq("author", user_id).limit(limit);
  }
  return await supabase.from("posts").select("id,title,created_at").eq("id", user_id);
};

export type postWithProfilesResponse = Awaited<ReturnType<typeof getPosts>>;
export type postDetails = postWithProfilesResponse["data"];
export type postDetailsQuery = {
  data: postWithProfilesResponse["data"];
  error: postWithProfilesResponse["error"];
  hasMore: boolean;
};
export type postDetailProps = {
  id: posts["id"];
  title: posts["title"];
  description: posts["description"];
  image_url: string;
  created_at: posts["created_at"];
} & { email: profiles["email"] };
