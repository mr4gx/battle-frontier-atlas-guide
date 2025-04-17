
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const redirectUrl = url.searchParams.get('redirect') || 'https://lovable.dev';
  const userId = url.searchParams.get('user_id');

  if (!code || !userId) {
    return Response.redirect(`${redirectUrl}?error=missing_parameters`, 302);
  }

  try {
    // Exchange code for Discord access token
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
        redirect_uri: `${SUPABASE_URL}/functions/v1/discord-auth`,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Discord token exchange failed:', await tokenResponse.text());
      return Response.redirect(`${redirectUrl}?error=token_exchange_failed`, 302);
    }

    const tokenData = await tokenResponse.json() as DiscordTokenResponse;
    
    // Fetch Discord user data
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `${tokenData.token_type} ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      console.error('Discord user data fetch failed:', await userResponse.text());
      return Response.redirect(`${redirectUrl}?error=user_fetch_failed`, 302);
    }

    const userData = await userResponse.json() as DiscordUserResponse;
    
    // Get token expiry date
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
    
    // Initialize Supabase Admin client (service role)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Store Discord connection in database
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
      return Response.redirect(`${redirectUrl}?error=db_error`, 302);
    }

    // Create default notification preferences if they don't exist
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
    }

    // Redirect back to the app with success
    return Response.redirect(`${redirectUrl}?discord_connected=true`, 302);
  } catch (error) {
    console.error('Discord auth error:', error);
    return Response.redirect(`${redirectUrl}?error=server_error`, 302);
  }
});
