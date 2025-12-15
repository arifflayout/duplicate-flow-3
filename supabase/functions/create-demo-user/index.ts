import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase.auth.admin.createUser({
      email: "demo@example.com",
      password: "demo123",
      email_confirm: true,
    });

    if (error) {
      throw new Error(`Auth error: ${error.message}`);
    }

    if (!data?.user?.id) {
      throw new Error("User created but no ID returned");
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email: "demo@example.com",
        name: "Demo Developer",
        role: "developer",
        company: "Demo Development Co",
        location: "Kuala Lumpur, Malaysia",
        certifications: ["Demo Account"],
      },
    ]);

    if (profileError) {
      throw new Error(`Profile error: ${profileError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Demo account created",
        email: "demo@example.com",
        password: "demo123",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
