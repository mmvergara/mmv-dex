import type { NextApiRequest, NextApiResponse } from "next";
import type { authCredentials } from "../../../types/api/auth-types";
import { authValidationSchema } from "../../../schemas/FormSchemas";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DatabaseTypes } from "../../../types/db/db-types";
import validator from "../../../utils/yup-validator";
import allowedMethod from "../../../utils/check-method";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  if (!allowedMethod(req, "PUT")) {
    return res.status(405).send({ message: "Method not allowed" });
  }

  const { password, username } = req.body as authCredentials;
  const emailifiedUsername = username + "@dexlocalhost.com";

  // Validate Request Body
  const { isValid } = await validator(authValidationSchema, {
    password,
    username: emailifiedUsername,
  });
  if (!isValid) {
    return res.status(422).send({ data: {}, error: { message: "Invalid inputs", code: 422 } });
  }

  // Sign up
  const { data, error } = await supabase.auth.signUp({ email: emailifiedUsername, password });
  res.status(200).send({ data, error });
}
