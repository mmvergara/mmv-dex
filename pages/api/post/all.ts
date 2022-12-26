import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DatabaseTypes } from "../../../types/db/db-types";
import allowedMethod from "../../../utils/check-method";
import newError from "../../../utils/newError";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });

  try {
    if (!allowedMethod(req, "GET")) throw newError("Method not allowed", 405);
    supabase.from("posts, ")
  } catch (e) {
    console.log(e);
    const error = e as Error;
    res.status(400).send({ data: null, error: { message: error.message } });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
