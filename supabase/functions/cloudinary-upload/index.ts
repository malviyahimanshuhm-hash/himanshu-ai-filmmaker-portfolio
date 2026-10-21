-- Supabase Edge Function for Cloudinary Upload Authorization
-- Deploy this to Supabase: https://supabase.com/docs/guides/functions
--
-- Deploy command:
-- supabase functions deploy cloudinary-upload --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const resourceType = (formData.get("resourceType") as string) || "image";
    const folder = (formData.get("folder") as string) || "himanshu-portfolio";

    if (!file) {
      throw new Error("No file provided");
    }

    // Get Cloudinary credentials from environment
    const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const apiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary credentials not configured");
    }

    // Generate signature for secure upload
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    
    const msgUint8 = new TextEncoder().encode(paramsToSign);
    const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // Upload to Cloudinary
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("signature", signature);
    uploadFormData.append("folder", folder);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    const uploadResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(errorData.error?.message || "Cloudinary upload failed");
    }

    const result = await uploadResponse.json();

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
