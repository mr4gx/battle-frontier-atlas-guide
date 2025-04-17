
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const SUPABASE_URL = "https://udsproxacchluxotubqc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkc3Byb3hhY2NobHV4b3R1YnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4ODk1ODUsImV4cCI6MjA2MDQ2NTU4NX0.DXShgo6Cat7azHeli_HEcL1Sno6FJYe_CEpMbjxd3CQ";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Get auth user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const { leaderboardData, channelId } = body;

      // First, check if user has a Discord connection
      const { data: connection, error: connectionError } = await supabase
        .from('discord_connections')
        .select('discord_id')
        .eq('user_id', user.id)
        .single();

      if (connectionError || !connection) {
        return new Response(JSON.stringify({ error: 'Discord not connected' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Format the leaderboard data for Discord
      const formatLeaderboard = (trainers) => {
        let message = "**🏆 Trainer Leaderboard 🏆**\n\n";
        
        trainers.slice(0, 10).forEach((trainer, index) => {
          const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
          message += `${medal} **${trainer.name}** (${trainer.trainerClass}) - ${trainer.tokens} tokens\n`;
        });
        
        message += "\n*Shared via Atlas Trainer League*";
        return message;
      };

      // Create the Discord embed
      const embed = {
        username: "Atlas Trainer League",
        content: formatLeaderboard(leaderboardData),
      };

      // We'll use a webhook URL, which would be stored as a secret in a production app
      // For now, we'll handle just the direct sharing via user's connected Discord
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Leaderboard would be shared to Discord channel",
        embed: embed
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
