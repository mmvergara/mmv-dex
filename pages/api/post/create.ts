import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DatabaseTypes } from "../../../types/db/db-types";
import formidable, { Formidable } from "formidable";
import allowedMethod from "../../../utils/check-method";
import sharp from "sharp";
import { apiError, newError } from "../../../utils/error-handling";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  const form = new Formidable({ multiples: true, keepExtensions: true });
  return new Promise((resolved, reject) => {
    form.parse(req, async (err, fields, files) => {
      try {
        if (!allowedMethod(req, "PUT")) throw newError("Method not allowed", 405);
        if (err) throw newError("Error parsing request", 500);

        //Check auth
        const { data: user } = await supabase.auth.getSession();
        if (!user.session) {
          throw newError("Unauthorized / Session expired, try logging in again.", 401);
        }

        // Compression (Options)
        type postFormDataFields = { compressed: string; description: string; title: string };
        const { compressed, title, description } = fields as postFormDataFields;
        const img_is_compressed = compressed === "true";
        let quality = 100;
        let compressionLevel = 0;
        if (img_is_compressed) {
          quality = 2;
          compressionLevel = 9;
        }

        const img = files.image as formidable.File;
        const imgBuffer = await sharp(img.filepath)
          .toFormat("png")
          .png({ quality, compressionLevel })
          .toBuffer();

        // Upload Image
        const { data: imgData, error: imgError } = await supabase.storage
          .from("post-images")
          .upload(Math.random().toString() + ".png", imgBuffer, {
            upsert: false,
            contentType: "image/png",
          });
        if (imgError) throw newError("Error uploading image", 409);

        // Insert Post
        const { data: imgPublicUrl } = supabase.storage
          .from("post-images")
          .getPublicUrl(imgData?.path!);

        const { error } = await supabase.from("posts").insert({
          author: user.session.user.id,
          description,
          title,
          img_is_compressed,
          image_url: imgPublicUrl.publicUrl,
        });
        if (error) throw newError(error.message, Number(error.code));

        res.status(201).send({ data: { compressed, title, description }, error: null });
        resolved({});
      } catch (e) {
        const { code, errData } = apiError(e);
        res.status(code).send(errData);
        reject();
      }
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
