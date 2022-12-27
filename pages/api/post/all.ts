import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DatabaseTypes } from "../../../types/db/db-types";
import allowedMethod from "../../../utils/check-method";
import { newError } from "../../../utils/error-handling";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  try {
    if (!allowedMethod(req, "GET")) throw newError("Method not allowed", 405);
    const { data, error } = await supabase.from("posts").select("*, profiles(id,email)");
    if (error) throw newError("Error fetching posts", 500);
    console.log({ data, error });
    res.status(200).send({ data, error });
  } catch (e) {
    const error = e as Error;
    res.status(400).send({ data: null, error: { message: error.message } });
  }
}
