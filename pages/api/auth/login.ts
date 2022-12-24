import type { NextApiRequest, NextApiResponse } from "next";
import type { authCredentials } from "../../../types/api/auth-types";
import { authValidationSchema } from "../../../schema/FormSchemas";
import validator from "../../../utils/yup-validator";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import allowedMethod from "../../../utils/check-method";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  console.log(!allowedMethod(req, "POST"))
  if (!allowedMethod(req, "POST")) {
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
  console.log('LOGEGEDIN')

  // Sign in
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailifiedUsername,
    password,
  });
  res.status(200).send({ data, error });
}
