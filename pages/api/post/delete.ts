import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { apiError, newError } from "../../../utils/error-handling";
import { DatabaseTypes } from "../../../types/db/db-types";
import allowedMethod from "../../../utils/check-method";

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
    const image_path = post.image_path;

    // Check post ownership ( Disabled as users with role 'admin' are able to delete any post )
    // if (post.author !== user.id) throw newError("You are not the owner of this post", 401);

    // Delete post
    const { error: postDelErr } = await supabase.from("posts").delete().eq("id", post_id)
    if (postDelErr) throw newError("Could not delete post" + postDelErr.message, 400);

    // Delete post image
    const { error: postImgErr } = await supabase.storage.from("post-images").remove([image_path]);
    if (postImgErr) throw newError("Error deleting post image", 400);
    
    res.status(200).send({ data: { message: "Post deleted successfully" }, error: null });
  } catch (e) {
    console.log(e);
    const { code, errData } = apiError(e);
    res.status(code).send(errData);
  }
}
