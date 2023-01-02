import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { apiError, newError } from "../../../utils/error-handling";
import { DatabaseTypes } from "../../../types/db/db-types";
import allowedMethod from "../../../utils/check-method";
import { recordNextJsApiCall } from "../../../utils/record-api-call";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  const reviewid = req.query.reviewid;
  try {
    // Check method
    if (!allowedMethod(req, "DELETE")) throw newError("Method not allowed", 405);

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized / Session expired, try logging in again.");

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    if (profileErr) throw newError(profileErr.message || "Error occured", 500);
    if (profile?.role !== "admin") throw newError("You cannot delete peer reviews", 401);

    // Delete Peer review
    const { error } = await supabase.from("peer_reviews").delete().eq("id", reviewid);
    if (error) throw newError(error.message, 409);
    
    await recordNextJsApiCall(req, supabase, user.id);
    res.status(200).send({ data: { message: "Post deleted successfully" }, error: null });
  } catch (e) {
    const { code, errData } = apiError(e);
    res.status(code).send(errData);
  }
}
