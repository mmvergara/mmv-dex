import type { NextApiRequest, NextApiResponse } from "next";
import type { authCredentials } from "../../../types/api/auth-types";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { authValidationSchema } from "../../../schemas/FormSchemas";
import { DatabaseTypes } from "../../../types/db/db-types";
import validator from "../../../utils/yup-validator";
import allowedMethod from "../../../utils/check-method";
import { apiError, newError } from "../../../utils/error-handling";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });

  try {
    if (!allowedMethod(req, "POST")) throw newError("Method not allowed", 405);

    const { password, username } = req.body as authCredentials;
    const emailifiedUsername = username + "@dexlocalhost.com";

    // Validate Request Body
    const { isValid } = await validator(authValidationSchema, {
      password,
      username: emailifiedUsername,
    });
    if (!isValid) throw newError("Invalid inputs", 422);

    // Sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailifiedUsername,
      password,
    });
    if (error) throw newError(error.message, 400);
    res.status(200).send({ data, error });
  } catch (e) {
    const { errData, code } = apiError(e);
    res.status(code).send(errData);
  }
}
