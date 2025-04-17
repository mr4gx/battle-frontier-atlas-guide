
import { Link, useLocation } from "react-router-dom";
import { Home, Map, Trophy, User, FileText } from "lucide-react";
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
      label: "Facilities",
      icon: Map,
      href: "/facilities",
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
    <nav className="atl-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-t border-white/10">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || 
                         (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "atl-bottom-nav-item flex flex-col items-center justify-center py-2",
              isActive ? "atl-bottom-nav-item-active" : "atl-bottom-nav-item-inactive"
            )}
          >
            <item.icon 
              size={24} 
              className={cn(
                isActive ? "text-white" : "text-white/60",
                "mb-1"
              )} 
            />
            <span className={cn(
              "text-xs",
              isActive ? "text-white" : "text-white/60"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
