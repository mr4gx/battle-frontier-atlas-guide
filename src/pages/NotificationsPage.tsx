
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Bell, BadgeCheck, CheckCheck } from "lucide-react";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { mockNotifications } from "@/data/mock-data";
import { cn } from "@/lib/utils";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  
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
  
  // Sort notifications by date (newest first) and read status (unread first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    // Sort by read status first
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    // Then by date
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
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
        {/* Notifications List */}
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
