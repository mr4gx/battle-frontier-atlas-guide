
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DiscordNotificationPreferences, useDiscord } from "@/hooks/use-discord";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Loader, LogOut, MessageSquare, Webhook } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

export function DiscordSettings() {
  const {
    isLoading,
    isConnected,
    connection,
    notificationPreferences,
    connectToDiscord,
    disconnectDiscord,
    updateNotificationPreferences,
  } = useDiscord();

  const [updatingPreferences, setUpdatingPreferences] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discord Integration</CardTitle>
          <CardDescription>Connect your Discord account to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader className="animate-spin text-atl-primary-purple h-8 w-8" />
        </CardContent>
      </Card>
    );
  }

  const handleTogglePreference = async (key: keyof DiscordNotificationPreferences, value: boolean) => {
    if (!notificationPreferences) return;
    
    setUpdatingPreferences(true);
    try {
      await updateNotificationPreferences({
        [key]: value,
      });
    } finally {
      setUpdatingPreferences(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const success = await disconnectDiscord();
      if (success) {
        setShowDisconnectDialog(false);
      }
    } finally {
      setDisconnecting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Discord Integration</CardTitle>
          <CardDescription>Connect your Discord account to receive notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="bg-gray-100 rounded-full p-4">
              <Webhook className="h-10 w-10 text-atl-primary-purple" />
            </div>
            <div className="text-center">
              <p className="font-medium mb-1">Connect your Discord account</p>
              <p className="text-sm text-gray-500 mb-4">Get battle notifications and updates via Discord</p>
              
              <Button 
                onClick={() => connectToDiscord()}
                className="bg-[#5865F2] hover:bg-[#4752c4] text-white"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  fill="currentColor" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 127.14 96.36"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
                Connect with Discord
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discord Integration</CardTitle>
        <CardDescription>Manage your Discord connection and notification preferences</CardDescription>
      </CardHeader>
      <CardContent>
        {connection && (
          <div className="space-y-6">
            {/* Connected Account */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  {connection.discord_avatar ? (
                    <AvatarImage src={connection.discord_avatar} alt={connection.discord_username} />
                  ) : (
                    <AvatarFallback className="bg-[#5865F2] text-white">
                      {connection.discord_username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{connection.discord_username}</p>
                  <p className="text-xs text-gray-500">Connected on {new Date(connection.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    <LogOut className="h-3.5 w-3.5 mr-1" />
                    Disconnect
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Disconnect Discord?</DialogTitle>
                    <DialogDescription>
                      You will no longer receive notifications through Discord. You can reconnect at any time.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowDisconnectDialog(false)}>Cancel</Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                    >
                      {disconnecting && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                      Disconnect
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {/* Notification Preferences */}
            <div>
              <h3 className="text-sm font-medium mb-3">Notification Preferences</h3>
              
              {notificationPreferences ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">Battle Challenges</div>
                      <div className="text-xs text-gray-500">Get notified when someone challenges you</div>
                    </div>
                    <Switch 
                      checked={notificationPreferences.battle_challenges}
                      disabled={updatingPreferences}
                      onCheckedChange={(checked) => handleTogglePreference('battle_challenges', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">Battle Results</div>
                      <div className="text-xs text-gray-500">Get notified about your battle outcomes</div>
                    </div>
                    <Switch 
                      checked={notificationPreferences.battle_results}
                      disabled={updatingPreferences}
                      onCheckedChange={(checked) => handleTogglePreference('battle_results', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">Leaderboard Updates</div>
                      <div className="text-xs text-gray-500">Get notified about leaderboard changes</div>
                    </div>
                    <Switch 
                      checked={notificationPreferences.leaderboard_updates}
                      disabled={updatingPreferences}
                      onCheckedChange={(checked) => handleTogglePreference('leaderboard_updates', checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-medium text-sm">Badge Unlocks</div>
                      <div className="text-xs text-gray-500">Get notified when you earn a new badge</div>
                    </div>
                    <Switch 
                      checked={notificationPreferences.badge_unlocks}
                      disabled={updatingPreferences}
                      onCheckedChange={(checked) => handleTogglePreference('badge_unlocks', checked)} 
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 py-2">
                  Your notification preferences could not be loaded. Please try again later.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
