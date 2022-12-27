// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { Buffer } from "https://deno.land/std@0.139.0/node/buffer.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
  );

  const formData = await req.formData();
  let formFields = {};
  formData.forEach((value: string, key: string) => {
    formFields = { ...formFields, [key]: value };
  });

  let imageFile = formFields.image;
  let imageBuffer = await imageFile.arrayBuffer();
  let compressionLevel = 0;
  if (formFields.compressed === "true") {
    compressionLevel = 3;
  }

  try {
  const imgScriptData = await decode(imageBuffer);
  console.log({compressionLevel})
  const encodedImg = await imgScriptData.encode(compressionLevel);
    console.log(encodedImg);
    imageBuffer = new Buffer(imageBuffer);
    console.log({ imageBuffer });
  } catch (error) {
    console.log({ error });
  }
  let imageType = formFields.image.type.split("/").pop();
  let imageName = Math.random().toString() + "." + imageType;
  let data = null;
  let error = null;

  const { data: upload, error: uploadError } = await supabaseClient.storage
    .from("post-images")
    .upload(formFields.compressed + imageName, imageBuffer, {
      contentType: "image/png",
      cacheControl: "3600",
      upsert: false,
    });
  error = uploadError;
  data = upload;
  try {
    console.log({ data, error });
    return new Response(JSON.stringify({ data, error }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.log({ error });
    return new Response(JSON.stringify({ data: null, error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/browser-with-cors' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
