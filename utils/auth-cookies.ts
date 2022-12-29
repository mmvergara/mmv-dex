import { SupabaseClient } from "@supabase/supabase-js";
import { DatabaseTypes } from "../types/db/db-types";

export const setSupabaseSession = async (
  accessToken: string | undefined,
  refreshToken: string | undefined,
  supabase: SupabaseClient
) => {
  if (!accessToken || !refreshToken) {
    return { data: null, error: { message: "access token and refresh token is not present " } };
  }
  return await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
};

export const getAccessAndRefreshTokenAsCookie = async (supabase: SupabaseClient<DatabaseTypes>) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return null;
  const { access_token, refresh_token } = session;
  const accessToken = `accessToken=${access_token};`;
  const refreshToken = `refreshToken=${refresh_token};`;
  return accessToken + refreshToken;
};
