import { SupabaseClient } from "@supabase/supabase-js";
import { NextApiRequest } from "next";
import { DatabaseTypes } from "../types/db/db-types";

export const getNextJsApiPath = (req: NextApiRequest) => {
  let api_path: string | null = (req.headers.origin || req.headers.host || "") + (req.url || "");
  if (api_path.length === 0) api_path = null;
  return api_path;
};

export const recordNextJsApiCall = async (
  req: NextApiRequest,
  supabase: SupabaseClient<DatabaseTypes>,
  userId?: string | null | undefined
) => {
  if (!userId) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id || null;
  }
  const api_path = getNextJsApiPath(req);
  if (!api_path) return;
  return await supabase.from("api_calls").insert({ api_path, called_by: userId });
};
