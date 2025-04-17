import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Bell, BadgeCheck, CheckCheck, Shield, X, Clock } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/data/mock-data";
import { cn } from "@/lib/utils";
import { useTrainer } from "@/context/trainer-context";
import { toast } from "@/components/ui/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NotificationsPage = () => {
  const { battleRequests, acceptBattleRequest, cancelBattleRequest } = useTrainer();
  const [notifications, setNotifications] = useState(mockNotifications);
  const navigate = useNavigate();
  
  const getIcon = (type: string) => {
    switch (type) {
      case "battle":
        return (
          <div className="bg-red-100 p-2 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>
        );
      case "badge":
        return (
          <div className="bg-purple-100 p-2 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-purple-500"
            >
              <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        );
      case "token":
        return (
          <div className="bg-blue-100 p-2 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-blue-500"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12" />
              <path d="M8 12h8" />
            </svg>
          </div>
        );
      case "event":
        return (
          <div className="bg-yellow-100 p-2 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-yellow-600"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
          </div>
        );
      case "battle_request":
        return (
          <div className="bg-red-100 p-2 rounded-full">
            <Shield className="h-4 w-4 text-red-500" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 p-2 rounded-full">
            <Bell className="h-4 w-4 text-gray-500" />
          </div>
        );
    }
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleAcceptBattleRequest = (requestId: string) => {
    const battle = acceptBattleRequest(requestId);
    if (battle) {
      navigate("/battle/results", { 
        state: { battle } 
      });
    }
  };

  const handleRejectBattleRequest = (requestId: string) => {
    cancelBattleRequest(requestId);
    toast.info("Battle request rejected");
  };
  
  // Sort notifications by date (newest first) and read status (unread first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    // Sort by read status first
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    // Then by date
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Get open battle requests
  const openBattleRequests = battleRequests.filter(
    request => request.status === "open"
  );
  
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white px-4 py-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-atl-dark-purple">Notifications</h1>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.read)}
          >
            <BadgeCheck className="h-4 w-4 mr-1" />
            Mark All Read
          </Button>
        </div>
      </header>

      <main className="p-4">
        {/* Battle Requests Section */}
        {openBattleRequests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-atl-primary-purple" />
              Battle Requests
            </h2>
            
            <div className="space-y-3">
              {openBattleRequests.map((request) => (
                <div 
                  key={request.id}
                  className="bg-white rounded-lg shadow-sm border-l-4 border-l-atl-primary-purple p-4"
                >
                  <div className="flex items-start">
                    <Avatar className="h-10 w-10 mr-3">
                      {request.trainerAvatar ? (
                        <AvatarImage src={request.trainerAvatar} alt={request.trainerName} />
                      ) : (
                        <AvatarFallback className="bg-atl-primary-purple text-white">
                          {request.trainerName.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">
                          {request.trainerName} 
                          <span className="text-sm text-gray-500 ml-1">({request.trainerClass})</span>
                        </h3>
                        
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(request.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className="text-sm mt-1">
                        <p>Requesting a {request.battleStyle} battle at {request.facilityName}.</p>
                        <p className="font-medium text-atl-primary-purple mt-1">
                          Tokens Wagered: {request.tokensWagered}
                        </p>
                        {request.notes && (
                          <p className="text-gray-600 mt-1">"{request.notes}"</p>
                        )}
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs border-red-500 text-red-500 hover:bg-red-50"
                          onClick={() => handleRejectBattleRequest(request.id)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs bg-atl-primary-purple hover:bg-atl-secondary-purple"
                          onClick={() => handleAcceptBattleRequest(request.id)}
                        >
                          <CheckCheck className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Other Notifications */}
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Bell className="h-5 w-5 mr-2 text-gray-700" />
          Notifications
        </h2>
        
        <div className="space-y-3">
          {sortedNotifications.length > 0 ? (
            sortedNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={cn(
                  "bg-white rounded-lg shadow-sm border overflow-hidden",
                  !notification.read && "border-l-4 border-l-atl-primary-purple"
                )}
              >
                <div className="p-3 flex">
                  <div className="mr-3 flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={cn(
                        "font-medium text-sm",
                        !notification.read && "text-atl-dark-purple"
                      )}>
                        {notification.title}
                      </h3>
                      
                      <div className="text-xs text-gray-500">
                        {new Date(notification.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className={cn(
                      "text-sm mt-1",
                      notification.read ? "text-gray-500" : "text-gray-700"
                    )}>
                      {notification.message}
                    </p>
                    
                    <div className="flex justify-between items-center mt-2">
                      {notification.actionPath ? (
                        <Link 
                          to={notification.actionPath}
                          className="text-xs text-atl-primary-purple font-medium"
                        >
                          View Details
                        </Link>
                      ) : (
                        <div></div>
                      )}
                      
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <CheckCheck className="h-3 w-3 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="text-gray-400 mb-2">
                <Bell className="h-10 w-10 mx-auto" />
              </div>
              <h3 className="text-lg font-medium mb-1">No notifications</h3>
              <p className="text-gray-500 text-sm">
                You're all caught up!
              </p>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default NotificationsPage;
