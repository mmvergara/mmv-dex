import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { DatabaseTypes } from "../../../types/db/db-types";
import { apiError, newError } from "../../../utils/error-handling";
import formidable, { Formidable } from "formidable";
import allowedMethod from "../../../utils/check-method";
import sharp from "sharp";
import uniqid from "uniqid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  const form = new Formidable({ multiples: true, keepExtensions: true });

  // Promisify
  // https://stackoverflow.com/questions/60684227/api-resolved-without-sending-a-response-in-nextjs
  return new Promise((resolved, reject) => {
    form.parse(req, async (err, fields, files) => {
      try {
        if (!allowedMethod(req, "PUT")) throw newError("Method not allowed", 405);
        if (err) throw newError("Error parsing request", 500);

        // Check auth and get userId
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Unauthorized / Session expired, try logging in again.");
        const userId = user.id;

        // Parse Form Data
        type postFormDataFields = {
          compressed: string;
          description: string;
          title: string;
          compressionMethod: string;
        };
        const { compressed, title, description, compressionMethod } = fields as postFormDataFields;

        // Compression Options
        const img_is_compressed = compressed === "true";
        const compressionInSever = compressionMethod === "server";
        let quality = 100; // 100 is default
        let compressionLevel = 1;
        if (img_is_compressed && compressionInSever) {
          quality = 2;
          compressionLevel = 9;
        }

        // Process Image
        const img = files.image as formidable.File;
        const imgBuffer = await sharp(img.filepath)
          .toFormat("png")
          .png({ quality, compressionLevel })
          .toBuffer();

        // Upload Image to storage bucket
        const imageName = `vercel-${compressionMethod}compressed=${compressed}-${uniqid()}.png`;
        const { data: imgData, error: imgError } = await supabase.storage
          .from("post-images")
          .upload(imageName, imgBuffer, {
            upsert: false,
            contentType: "image/png",
          });
        if (imgError) throw newError("Error uploading image", 409);

        // Get Image Public Url
        const { data: imgPublicUrl } = supabase.storage
          .from("post-images")
          .getPublicUrl(imgData?.path!);

        // Insert Post
        const { error } = await supabase.from("posts").insert({
          author: userId,
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
