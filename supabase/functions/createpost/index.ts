// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { encode } from "https://deno.land/x/imagescript@1.2.15/png/src/png.mjs";
import { Buffer } from "https://deno.land/std@0.139.0/node/buffer.ts";
import { v4 } from "https://deno.land/std@0.91.0/uuid/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: req.headers.get("Authorization")! } },
  });

  try {
    // Check auth and get userId
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Unauthorized / Session expired, try logging in again.");
    const userId = user?.id;

    // Parse Form Data
    const formData = await req.formData();
    let formFields = {};
    formData.forEach((value: string, key: string) => {
      formFields = { ...formFields, [key]: value };
    });
    const { compressed, image, description, title, compressionMethod } = formFields;

    let imageBuffer = await image.arrayBuffer();
    // Compression Options
    let compressionLevel = 1;
    const img_is_compressed = compressed === "true";
    const compressionInSever = compressionMethod === "server";
    if (img_is_compressed && compressionInSever) compressionLevel = 9;

    // Process Image
    const { bitmap, width, height } = await decode(imageBuffer);
    const encodedImg = await encode(bitmap, {
      width,
      height,
      channels: 4,
      level: compressionLevel,
    });
    imageBuffer = new Buffer(encodedImg);

    // Upload Image to storage bucket
    let imageName = `supabase-${compressionMethod}compressed=${compressed}-${v4.generate()}.png`;
    const { data: imgData, error: imgError } = await supabaseClient.storage
      .from("post-images")
      .upload(imageName, imageBuffer, {
        upsert: false,
        contentType: "image/png",
        cacheControl: "3600"
      });
    if (imgError) throw new Error("Error upload image");

    // Insert Post
    const { error } = await supabaseClient.from("posts").insert({
      author: userId,
      description,
      title,
      img_is_compressed,
      image_path: imgData?.path,
    });

    if (error) throw new Error(error.message || "Error submitting post");
    return new Response(JSON.stringify({ data: null, error: null }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.log(err);
    const error = err as Error;
    return new Response(JSON.stringify({ data: null, error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
