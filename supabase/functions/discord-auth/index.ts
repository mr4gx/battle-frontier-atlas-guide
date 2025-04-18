
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

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

interface DiscordUserResponse {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
}

function createErrorPage(message: string, details?: string): string {
  return `
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
          <p>${message}</p>
          ${details ? `<div class="error">${details.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>` : ''}
          <a href="/" class="button">Return to App</a>
        </div>
        <script>
          // This script attempts to close the popup/redirect back to the app after a delay
          setTimeout(() => {
            try {
              if (window.opener) {
                window.opener.postMessage({ type: 'DISCORD_AUTH_ERROR', message: '${message.replace(/'/g, "\\'")}' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            } catch (e) {
              console.error('Error redirecting:', e);
            }
          }, 5000);
        </script>
      </body>
    </html>
  `;
}

function createSuccessPage(): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Discord Authentication Success</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; text-align: center; color: #333; }
          .container { max-width: 500px; margin: 0 auto; background: #f7f8f9; padding: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h1 { color: #5865F2; }
          .checkmark { color: #2ecc71; font-size: 48px; margin: 20px 0; }
          .message { margin-bottom: 20px; }
          .loading { margin: 20px 0; }
          .spinner { border: 4px solid rgba(0, 0, 0, 0.1); width: 36px; height: 36px; border-radius: 50%; border-left-color: #5865F2; animation: spin 1s linear infinite; display: inline-block; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Discord Connected!</h1>
          <div class="checkmark">✓</div>
          <p class="message">Your Discord account has been successfully connected.</p>
          <div class="loading">
            <div class="spinner"></div>
            <p>Redirecting back to the app...</p>
          </div>
        </div>
        <script>
          // This script attempts to redirect back to the app after a delay
          setTimeout(() => {
            try {
              if (window.opener) {
                window.opener.postMessage({ type: 'DISCORD_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/profile?discord_connected=true';
              }
            } catch (e) {
              console.error('Error redirecting:', e);
              window.location.href = '/profile?discord_connected=true';
            }
          }, 2000);
        </script>
      </body>
    </html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const redirectUrl = url.searchParams.get('redirect') || '/profile';
  const userId = url.searchParams.get('user_id');

  console.log("Discord auth function called with:", { hasCode: !!code, hasUserId: !!userId, redirectUrl });

  if (!code || !userId) {
    console.error("Missing code or user_id parameters");
    return new Response(
      createErrorPage("Missing required parameters for Discord connection. Please try again."),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      }
    );
  }

  try {
    // Exchange code for Discord access token
    console.log("Exchanging Discord code for token...");
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${SUPABASE_URL}/functions/v1/discord-auth-callback`,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Discord token exchange failed:', errorText);
      return new Response(
        createErrorPage("Failed to authenticate with Discord.", errorText),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        }
      );
    }

    const tokenData = await tokenResponse.json() as DiscordTokenResponse;
    console.log("Received Discord token successfully");
    
    // Fetch Discord user data
    console.log("Fetching Discord user data...");
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Discord user data fetch failed:', errorText);
      return new Response(
        createErrorPage("Failed to fetch Discord user data.", errorText),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        }
      );
    }

    const userData = await userResponse.json() as DiscordUserResponse;
    console.log("Fetched Discord user data for:", userData.username);
    
    // Get token expiry date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
    
    // Initialize Supabase Admin client (service role)
    console.log("Initializing Supabase client...");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Store Discord connection in database
    console.log("Storing Discord connection in database...");
    const { error } = await supabase
      .from('discord_connections')
      .upsert({
        user_id: userId,
        discord_id: userData.id,
        discord_username: userData.username,
        discord_avatar: userData.avatar ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : null,
        discord_access_token: tokenData.access_token,
        discord_refresh_token: tokenData.refresh_token,
        token_expires_at: expiresAt.toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('Error saving Discord connection:', error);
      return new Response(
        createErrorPage("Failed to save Discord connection.", JSON.stringify(error)),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'text/html' },
        }
      );
    }

    // Create default notification preferences if they don't exist
    console.log("Creating default notification preferences...");
    const { error: notifError } = await supabase
      .from('discord_notifications')
      .upsert({
        user_id: userId,
        battle_challenges: true,
        battle_results: true,
        leaderboard_updates: true,
        badge_unlocks: true,
      }, {
        onConflict: 'user_id',
      });

    if (notifError) {
      console.error('Error saving notification preferences:', notifError);
      // Continue despite this error
    }

    // Return a success page with appropriate Javascript to handle the redirect
    console.log("Discord connection successful! Returning success page.");
    return new Response(
      createSuccessPage(),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    console.error('Discord auth error:', error);
    return new Response(
      createErrorPage("An unexpected error occurred while connecting your Discord account.", String(error)),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'text/html' },
      }
    );
  }
});
