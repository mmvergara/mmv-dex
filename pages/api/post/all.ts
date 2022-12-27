import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { apiError, newError } from "../../../utils/error-handling";
import { DatabaseTypes } from "../../../types/db/db-types";
import allowedMethod from "../../../utils/check-method";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  try {
    if (!allowedMethod(req, "GET")) throw newError("Method not allowed", 405);
    const { data, error } = await supabase.from("posts").select("*, profiles(id,email)");
    if (error) throw newError("Error fetching posts", 500);
    res.status(200).send({ data, error });
  } catch (e) {
    const { code, errData } = apiError(e);
    res.status(code).send(errData);
  }
}
