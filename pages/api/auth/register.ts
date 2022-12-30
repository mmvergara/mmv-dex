import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { authCredentials } from "../../../types/api/auth-types";
import { authValidationSchema } from "../../../schemas/yup-schemas";
import { recordNextJsApiCall } from "../../../utils/record-api-call";
import { apiError, newError } from "../../../utils/error-handling";
import { usernameToEmail } from "../../../utils/parsers";
import { DatabaseTypes } from "../../../types/db/db-types";
import allowedMethod from "../../../utils/check-method";
import validator from "../../../utils/yup-validator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  try {
    if (!allowedMethod(req, "PUT")) throw newError("Method not allowed", 405);

    const { password, username } = req.body as authCredentials;
    const email = usernameToEmail(username);

    // Validate Request Body
    const { isValid } = await validator(authValidationSchema, { password, username: email });
    if (!isValid) throw newError("Invalid inputs", 422);

    // Sign up
    const { data, error } = await supabase.auth.signUp({ email, password });
    const { user } = data;
    if (error) throw newError(error.message, 400);

    // If there are no error, record api_call details to supabase
    await recordNextJsApiCall(req, supabase, user?.id);
    res.status(200).send({ data: null, error: null });
  } catch (e) {
    const { errData, code } = apiError(e);
    res.status(code).send(errData);
  }
}
