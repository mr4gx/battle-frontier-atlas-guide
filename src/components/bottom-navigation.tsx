
import { Link, useLocation } from "react-router-dom";
import { Home, Map, Trophy, User, QrCode } from "lucide-react";
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
      label: "QR Scanner",
      icon: QrCode,
      href: "/scanner",
    },
    {
      label: "Brackets",
      icon: Trophy,
      href: "/brackets",
    },
    {
      label: "Profile",
      icon: User,
      href: "/profile",
    },
  ];
  
  return (
    <nav className="atl-bottom-nav z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "atl-bottom-nav-item",
              isActive ? "atl-bottom-nav-item-active" : "atl-bottom-nav-item-inactive"
            )}
          >
            <item.icon 
              size={24} 
              className={cn(
                isActive ? "text-atl-primary-purple" : "text-gray-500",
                "mb-1"
              )} 
            />
            <span className="text-xs">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
