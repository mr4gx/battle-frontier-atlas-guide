
import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, Trophy, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const location = useLocation();
  
  const navItems = [
    {
      label: "Home",
      icon: Home,
      href: "/dashboard",
    },
    {
      label: "Battle Areas",
      icon: MapPin,
      href: "/battle-areas",
    },
    {
      label: "Bulletin",
      icon: FileText,
      href: "/bulletin",
    },
    {
      label: "Leaderboard",
      icon: Trophy,
      href: "/leaderboard",
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
    },
  ];
  
  return (
    <nav className="atl-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-t border-white/10 flex justify-around">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || 
                         (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-3 px-2 w-full",
              isActive 
                ? "text-[#1EAEDB]" 
                : "text-[#0EA5E9] hover:text-[#1EAEDB] transition-colors"
            )}
          >
            <item.icon 
              size={24} 
              className={cn(
                isActive ? "text-[#1EAEDB]" : "text-[#0EA5E9]",
                "mb-1"
              )} 
            />
            <span className={cn(
              "text-xs font-medium",
              isActive ? "text-[#1EAEDB]" : "text-[#0EA5E9]"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
