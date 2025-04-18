
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
  
  console.log("Received callback with code and state:", !!code, !!state);

  if (!code || !state) {
    console.error("Missing code or state parameter", { code, state });
    const errorPage = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Discord Authentication Error</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; text-align: center; color: #333; }
            .container { max-width: 500px; margin: 0 auto; background: #f7f8f9; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #5865F2; }
            .button { background: #5865F2; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Authentication Error</h1>
            <p>Missing required parameters for Discord connection. Please try again.</p>
            <a href="/" class="button">Return to App</a>
          </div>
        </body>
      </html>
    `;
    
    return new Response(errorPage, {
      status: 400,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/html' 
      },
    });
  }

  try {
    // Parse state parameter to get user ID and redirect URL
    let stateParams;
    
    try {
      stateParams = JSON.parse(decodeURIComponent(state));
    } catch (e) {
      console.error("Error parsing state parameter:", e);
      return new Response(JSON.stringify({ error: 'Invalid state parameter format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const userId = stateParams.user_id;
    const redirectUrl = stateParams.redirect || '/profile';

    if (!userId) {
      console.error("Missing user_id in state parameter", stateParams);
      return new Response(JSON.stringify({ error: 'Missing user_id in state parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Redirecting to discord-auth with parameters:", { code, userId, redirectUrl });
    
    // Redirect to the discord-auth function with necessary parameters
    const authUrl = `${SUPABASE_URL}/functions/v1/discord-auth?code=${encodeURIComponent(code)}&user_id=${encodeURIComponent(userId)}&redirect=${encodeURIComponent(redirectUrl)}`;
    
    return Response.redirect(authUrl, 302);
  } catch (error) {
    console.error('Error processing callback:', error);
    
    // Create a user-friendly error page
    const errorPage = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Discord Authentication Error</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; text-align: center; color: #333; }
            .container { max-width: 500px; margin: 0 auto; background: #f7f8f9; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            h1 { color: #5865F2; }
            .button { background: #5865F2; color: white; border: none; padding: 10px 20px; border-radius: 5px; font-size: 16px; cursor: pointer; text-decoration: none; display: inline-block; margin-top: 20px; }
            .error { color: #e74c3c; font-family: monospace; text-align: left; background: #f9f2f4; padding: 10px; border-radius: 4px; margin-top: 20px; overflow-wrap: break-word; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Authentication Error</h1>
            <p>There was a problem connecting your Discord account. Please try again.</p>
            <div class="error">${String(error).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
            <a href="/" class="button">Return to App</a>
          </div>
        </body>
      </html>
    `;
    
    return new Response(errorPage, {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'text/html' },
    });
  }
});
