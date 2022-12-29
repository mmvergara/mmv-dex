import type { NextApiRequest, NextApiResponse } from "next";
import type { authCredentials } from "../../../types/api/auth-types";
import { authValidationSchema } from "../../../schemas/yup-schemas";
import { createServerSupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import { DatabaseTypes } from "../../../types/db/db-types";
import validator from "../../../utils/yup-validator";
import allowedMethod from "../../../utils/check-method";
import { apiError, newError } from "../../../utils/error-handling";
import { recordNextJsApiCall } from "../../../utils/record-api-call";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  try {
    if (!allowedMethod(req, "PUT")) throw newError("Method not allowed", 405);

    const { password, username } = req.body as authCredentials;
    const emailifiedUsername = username + "@dexlocalhost.com";

    // Validate Request Body
    const { isValid } = await validator(authValidationSchema, {
      password,
      username: emailifiedUsername,
    });
    if (!isValid) throw newError("Invalid inputs", 422);

    // Sign up
    const {
      error,
      data: { user },
    } = await supabase.auth.signUp({ email: emailifiedUsername, password });
    if (error) throw newError(error?.message || "Signup Failed", 500);

    // If there are no error, record api_call details to supabase
    await recordNextJsApiCall(req, supabase, user?.id);

    res.status(200).send({ data: null, error: null });
  } catch (e) {
    const { errData, code } = apiError(e);
    res.status(code).send(errData);
  }
}
