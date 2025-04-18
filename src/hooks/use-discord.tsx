
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export interface DiscordConnection {
  id: string;
  user_id: string;
  discord_id: string;
  discord_username: string;
  discord_avatar: string | null;
  token_expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface DiscordNotificationPreferences {
  id: string;
  user_id: string;
  battle_challenges: boolean;
  battle_results: boolean;
  leaderboard_updates: boolean;
  badge_unlocks: boolean;
  created_at: string;
  updated_at: string;
}

export function useDiscord() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [connection, setConnection] = useState<DiscordConnection | null>(null);
  const [notificationPreferences, setNotificationPreferences] = useState<DiscordNotificationPreferences | null>(null);

  const DISCORD_CLIENT_ID = "1234567890123456789"; // Actual client ID is stored in Supabase
  const REDIRECT_URI = "https://udsproxacchluxotubqc.supabase.co/functions/v1/discord-auth-callback";

  const fetchDiscordConnection = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('discord_connections')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching Discord connection:', error);
        toast.error('Failed to load Discord connection');
      }

      if (data) {
        setConnection(data);
        setIsConnected(true);
      } else {
        setConnection(null);
        setIsConnected(false);
      }
    } catch (error) {
      console.error('Error fetching Discord connection:', error);
      toast.error('Failed to load Discord connection');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchNotificationPreferences = useCallback(async () => {
    if (!user || !isConnected) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('discord_notifications')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification preferences:', error);
        toast.error('Failed to load notification preferences');
      }

      if (data) {
        setNotificationPreferences(data);
      } else {
        setNotificationPreferences(null);
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      toast.error('Failed to load notification preferences');
    }
  }, [user, isConnected]);

  const updateNotificationPreferences = async (preferences: Partial<DiscordNotificationPreferences>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('discord_notifications')
        .upsert({
          user_id: user.id,
          ...preferences,
        }, {
          onConflict: 'user_id',
        });

      if (error) {
        console.error('Error updating notification preferences:', error);
        toast.error('Failed to update notification preferences');
        return false;
      }

      await fetchNotificationPreferences();
      toast.success('Notification preferences updated');
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      toast.error('Failed to update notification preferences');
      return false;
    }
  };

  const disconnectDiscord = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('discord_connections')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error disconnecting Discord:', error);
        toast.error('Failed to disconnect Discord');
        return false;
      }

      setConnection(null);
      setIsConnected(false);
      toast.success('Discord disconnected successfully');
      return true;
    } catch (error) {
      console.error('Error disconnecting Discord:', error);
      toast.error('Failed to disconnect Discord');
      return false;
    }
  };

  const getDiscordAuthUrl = (redirectPath = '/profile') => {
    if (!user) return '';

    // Create a more reliable state object with user ID and redirect path
    const state = encodeURIComponent(JSON.stringify({
      user_id: user.id,
      redirect: redirectPath,
      timestamp: new Date().getTime(), // Add timestamp to prevent caching issues
    }));

    // Force disable animations for mobile to prevent potential display issues
    const discordParams = new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      redirect_uri: encodeURIComponent(REDIRECT_URI),
      response_type: 'code',
      scope: 'identify guilds messages.read',
      state,
      prompt: 'consent', // Always force consent screen to prevent caching issues
      disable_guild_select: 'true', // Simplify the UI for mobile
    });

    return `https://discord.com/api/oauth2/authorize?${discordParams.toString()}`;
  };

  const connectToDiscord = (redirectPath = '/profile') => {
    const authUrl = getDiscordAuthUrl(redirectPath);
    if (authUrl) {
      // For mobile, add some additional delay before redirect
      if (isMobile) {
        toast.info('Redirecting to Discord...');
        setTimeout(() => {
          window.location.href = authUrl;
        }, 500);
      } else {
        window.location.href = authUrl;
      }
    }
  };

  useEffect(() => {
    fetchDiscordConnection();
  }, [fetchDiscordConnection]);

  useEffect(() => {
    if (isConnected) {
      fetchNotificationPreferences();
    }
  }, [isConnected, fetchNotificationPreferences]);

  return {
    isLoading,
    isConnected,
    connection,
    notificationPreferences,
    connectToDiscord,
    disconnectDiscord,
    updateNotificationPreferences,
  };
}
