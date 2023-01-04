import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import allowedMethod, { apiError, newError } from "../../../utils/error-handling";
import { DatabaseTypes } from "../../../types/db/db-types";
import { recordNextJsApiCall } from "../../../utils/record-api-call";
import { checkAuthOnServer } from "../../../utils/helper-functions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  const reviewid = req.query.reviewid;
  try {
    // Check method
    if (!allowedMethod(req, "DELETE")) throw newError("Method not allowed", 405);

    // Check auth and get userId
    const user = await checkAuthOnServer(supabase)
    const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
    if (profileErr) throw newError(profileErr.message || "Error occured", 500);
    
    // Check if user is admin
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
