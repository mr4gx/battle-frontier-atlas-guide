
import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, Map, Swords, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNavigation = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    {
      name: "Home",
      icon: Home,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      name: "Battle Areas",
      icon: Map,
      href: "/battle-areas",
      active: pathname === "/battle-areas" || pathname.startsWith("/battle-area/"),
    },
    {
      name: "Battles",
      icon: Swords,
      href: "/battles",
      active: pathname === "/battles" || pathname === "/battles/history" || pathname === "/battle/setup" || pathname === "/bulletin",
    },
    {
      name: "Trainers",
      icon: Users,
      href: "/trainers",
      active: pathname === "/trainers",
    },
    {
      name: "Leaderboard",
      icon: Trophy,
      href: "/leaderboard",
      active: pathname === "/leaderboard",
    },
    {
      name: "Profile",
      icon: User,
      href: "/profile",
      active: pathname === "/profile" || pathname === "/passport",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around z-50">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={cn(
            "flex flex-col items-center justify-center px-2 py-1 text-xs",
            item.active
              ? "text-atl-primary-purple"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <item.icon
            className={cn(
              "h-6 w-6",
              item.active
                ? "text-atl-primary-purple"
                : "text-gray-500 group-hover:text-gray-700"
            )}
          />
          <span>{item.name}</span>
        </Link>
      ))}
    </div>
  );
};
