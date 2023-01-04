import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import allowedMethod, { apiError, newError } from "../../../utils/error-handling";
import { DatabaseTypes } from "../../../types/db/db-types";
import { checkAuthOnServer } from "../../../utils/helper-functions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  try {
    if (!allowedMethod(req, "GET")) throw newError("Method not allowed", 405);
    await checkAuthOnServer(supabase)
    res.status(200).send({ data: "sdasd", error: null });
  } catch (e) {
    const { code, errData } = apiError(e);
    res.status(code || 500).send(errData);
  }
}
