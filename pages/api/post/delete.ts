import type { NextApiRequest, NextApiResponse } from "next";
import allowedMethod, { apiError, newError } from "../../../utils/error-handling";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DatabaseTypes } from "../../../types/db/db-types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  const post_id = String(req.query.postid) || null;
  try {
    if (!post_id) throw newError("post_id is required", 409);
    if (!allowedMethod(req, "DELETE")) throw newError("Method not allowed", 405);

    // Check auth
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized / Session expired, try logging in again.");

    // Fetch post
    const { data: post, error: postErr } = await supabase.from("posts").select("*").eq("id", post_id).maybeSingle();
    if (postErr || !post) throw newError(postErr?.message || "Error fetching post", Number(postErr?.code) || 400);

    // Check post ownership ( Disabled as users with role 'admin' are able to delete any post and RLS is enabled for unauthorized acces)
    // if (post.author !== user.id) throw newError("You are not the owner of this post", 401);

    // Delete post (DB Function automatically deletes the image)
    const { error: postDelErr } = await supabase.from("posts").delete().eq("id", post_id);
    if (postDelErr) throw newError("Could not delete post" + postDelErr.message, 400);


    res.status(200).send({ data: { message: "Post deleted successfully" }, error: null });
  } catch (e) {
    const { code, errData } = apiError(e);
    res.status(code).send(errData);
  }
}
