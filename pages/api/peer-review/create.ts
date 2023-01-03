import { DatabaseTypes, peer_review_evaluation } from "../../../types/db/db-types";
import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { usernameToEmail } from "../../../utils/parsers";
import { peerReviewValidation } from "../../../schemas/yup-schemas";
import { recordNextJsApiCall } from "../../../utils/record-api-call";
import allowedMethod, { apiError, newError } from "../../../utils/error-handling";
import { validation } from "../../../utils/validators";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  const { body } = req;
  try {
    // Check method
    if (!allowedMethod(req, "PUT")) throw newError("Method not allowed", 405);

    // Validate New Peer Review Request body
    let { isValid } = await validation(peerReviewValidation, body);
    if (!isValid) throw newError("Invalid Request", 400);

    const peer_review_evaluation: peer_review_evaluation = {
      name: body.name,
      date: new Date().toUTCString(),
      required_rating: {
        presentation_score: { score: body.presentation_rating_score, comment: body.presentation_rating_comment },
        technical_score: { score: body.technical_rating_score, comment: body.technical_rating_comment },
        assists_peers_score: {
          score: body.assists_peers_rating_score,
          comment: body.assists_peers_rating_comment,
        },
        documentation_score: {
          score: body.documentation_rating_score,
          comment: body.assists_peers_rating_comment,
        },
      },
      optional_rating: {
        stood_out: body.optional_rating_stood_out,
      },
    };

    // Check auth and get userId
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized / Session expired, try logging in again.");

    // Check if reviewee exists
    const { data: reviewee, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", usernameToEmail(peer_review_evaluation.name))
      .maybeSingle();
    if (error) throw newError(error.message, 400);
    if (!reviewee) throw newError("User does not exist", 400);

    // Check if the user is trying to create a review for him/herself
    if (reviewee.id === user.id) throw newError("You cannot create a review for yourself", 409);

    // Insert peer review
    const { error: insertErr } = await supabase
      .from("peer_reviews")
      .insert({ evaluation: peer_review_evaluation, reviewer: user.id, reviewee: reviewee.id });
    if (insertErr) throw newError(insertErr.message, 409);

    // Record Api Call
    await recordNextJsApiCall(req, supabase, user.id);
    res.status(200).send({ data: null, error: null });
  } catch (e) {
    const { code, errData } = apiError(e);
    res.status(code || 500).send(errData);
  }
}
