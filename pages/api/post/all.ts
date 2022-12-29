import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { apiError, newError } from "../../../utils/error-handling";
import { DatabaseTypes } from "../../../types/db/db-types";
import allowedMethod from "../../../utils/check-method";
import { recordNextJsApiCall } from "../../../utils/record-api-call";
import { setSupabaseSession } from "../../../utils/auth-cookies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  // Set User Session if exist
  const { accessToken, refreshToken } = req.cookies;
  const { data: user } = await setSupabaseSession(accessToken, refreshToken, supabase);

  try {
    if (!allowedMethod(req, "GET")) throw newError("Method not allowed", 405);

    const { data, error } = await supabase.from("posts").select("*, profiles(id,email)");
    console.log({error})
    if (error) throw newError("Error fetching posts", 500);

    // If there are no error, record api_call details to supabase
    await recordNextJsApiCall(req, supabase, user?.user?.id);

    res.status(200).send({ data, error: null });
  } catch (e) {
    const { code, errData } = apiError(e);
    res.status(code).send(errData);
  }
}
