import { DatabaseTypes, peer_reviews_evaluation_parsed } from "../../../types/db/db-types";
import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { peerReviewParsedToDb } from "../../../utils/parsers";
import { peerReviewValidation } from "../../../schemas/yup-schemas";
import { recordNextJsApiCall } from "../../../utils/record-api-call";
import { apiError, newError } from "../../../utils/error-handling";
import allowedMethod from "../../../utils/check-method";

import validation from "../../../utils/yup-validator";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });

  try {
    // Check method
    if (!allowedMethod(req, "PUT")) throw newError("Method not allowed", 405);

    // Validate New Peer Review Request body
    let { isValid } = await validation(peerReviewValidation, req.body);
    if (!isValid) throw newError("Invalid Request", 400);
    const newPeerReview = req.body as peer_reviews_evaluation_parsed;
    const JSONBPeerReview = peerReviewParsedToDb(newPeerReview);

    // Check auth and get userId
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized / Session expired, try logging in again.");

    // Insert peer review
    const { error } = await supabase.from("peer_reviews").insert({ evaluation: JSONBPeerReview, reviewer: user.id });
    if (error) throw newError(error.message, 409);

    // Record Api Call
    await recordNextJsApiCall(req, supabase, user.id);
    res.status(200).send({ data: null, error: null });
  } catch (e) {
    const { code, errData } = apiError(e);
    res.status(code || 500).send(errData);
  }
}
