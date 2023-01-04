import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { validation, formidableFileValidation, postValidationSchema } from "../../../utils/models-validators";
import formidable, { Formidable } from "formidable";
import { recordNextJsApiCall } from "../../../utils/record-api-call";
import allowedMethod, { apiError, newError } from "../../../utils/error-handling";
import { DatabaseTypes } from "../../../types/db/db-types";
import uniqid from "uniqid";
import sharp from "sharp";
import { checkAuthOnServer } from "../../../utils/helper-functions";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient<DatabaseTypes>({ req, res });
  const form = new Formidable({ multiples: true, keepExtensions: true });

  // Promisify
  // https://stackoverflow.com/questions/60684227/api-resolved-without-sending-a-response-in-nextjs
  return new Promise((resolved, reject) => {
    form.parse(req, async (err, fields, files) => {
      files.image;
      try {
        if (!allowedMethod(req, "PUT")) throw newError("Method not allowed", 405);
        if (err) throw newError("Error parsing request", 500);

        // Check auth and get userId
        const user = await checkAuthOnServer(supabase);

        // Parse Form Data
        type postFormDataFields = {
          compressed: string;
          description: string;
          title: string;
          compressionMethod: string;
        };
        const img = files.image as formidable.File;
        const { compressed, title, description, compressionMethod } = fields as postFormDataFields;

        // Validate title and description
        let { isValid } = await validation(postValidationSchema, { title, description });
        if (!isValid) throw newError("Invalid request", 403);

        // Validate image file
        const { error: fileValidationError } = formidableFileValidation(img, ["png", "jpg", "jpeg"]);
        if (fileValidationError) throw newError(fileValidationError.message, 403);

        // Compression Options
        const img_is_compressed = compressed === "true";
        const compressionInSever = compressionMethod === "server";
        let quality = 100;
        let compressionLevel = 1;
        if (img_is_compressed && compressionInSever) {
          quality = 2;
          compressionLevel = 9;
        }

        // Process Image
        const imgBuffer = await sharp(img.filepath).toFormat("png").png({ quality, compressionLevel }).toBuffer();

        // Upload Image to storage bucket
        const imageName = `vercel-${compressionMethod}compressed=${compressed}-${uniqid()}.png`;
        const { data: imgData, error: imgError } = await supabase.storage
          .from("post-images")
          .upload(imageName, imgBuffer, {
            upsert: false,
            contentType: "image/png",
            cacheControl: "3600",
          });
        if (imgError) throw newError(imgError.message, 409);
        if (!imgData) throw newError("Error uploading image", 409);

        // Insert Post
        const { error } = await supabase.from("posts").insert({
          author: user.id,
          description,
          title,
          img_is_compressed,
          image_path: imgData.path,
        });
        if (error) throw newError(error.message, Number(error.code));

        // If there are no error, record api_call details to supabase
        await recordNextJsApiCall(req, supabase, user.id);

        res.status(201).send({ data: { compressed, title, description }, error: null });
        resolved(null);
      } catch (e) {
        const { code, errData } = apiError(e);
        res.status(code || 500).send(errData);
        reject(null);
      }
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
