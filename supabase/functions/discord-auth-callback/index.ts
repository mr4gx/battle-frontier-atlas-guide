
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const DISCORD_CLIENT_ID = Deno.env.get("DISCORD_CLIENT_ID") as string;
const DISCORD_CLIENT_SECRET = Deno.env.get("DISCORD_CLIENT_SECRET") as string;
const SUPABASE_URL = "https://udsproxacchluxotubqc.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    return new Response(JSON.stringify({ error: 'Missing code or state parameter' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    // Parse state parameter to get user ID and redirect URL
    const stateParams = JSON.parse(decodeURIComponent(state));
    const userId = stateParams.user_id;
    const redirectUrl = stateParams.redirect || '/profile';

    if (!userId) {
      return new Response(JSON.stringify({ error: 'Invalid state parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Redirect to the discord-auth function with necessary parameters
    const authUrl = `${SUPABASE_URL}/functions/v1/discord-auth?code=${code}&user_id=${userId}&redirect=${encodeURIComponent(redirectUrl)}`;
    
    return Response.redirect(authUrl, 302);
  } catch (error) {
    console.error('Error processing callback:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
