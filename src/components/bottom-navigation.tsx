
import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, Trophy, User, FileText, Sword } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBattleLock } from "@/hooks/use-battle-lock";

export function BottomNavigation() {
  const location = useLocation();
  const { isLocked, activeBattleRoute } = useBattleLock();
  
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
      label: "Battles",
      icon: Sword,
      href: "/battles",
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
      label: "Passport", // Changed from "Profile"
      icon: User,
      href: "/profile", // Keeping the href the same as it points to the correct route
    },
  ];
  
  // If navigation is locked and we're not on the active battle route, redirect
  const handleNavigation = (e: React.MouseEvent, href: string) => {
    if (isLocked && href !== activeBattleRoute) {
      e.preventDefault();
      // Alert could be replaced with a toast notification
      alert("You cannot navigate away during an active battle!");
      return false;
    }
    return true;
  };
  
  return (
    <nav className="atl-bottom-nav fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-t border-white/10 flex justify-around">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || 
                         (item.href !== "/dashboard" && location.pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={(e) => handleNavigation(e, item.href)}
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
