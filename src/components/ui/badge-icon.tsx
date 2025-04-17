
import { cn } from "@/lib/utils";

interface BadgeIconProps {
  name: string;
  obtained?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function BadgeIcon({ 
  name, 
  obtained = false, 
  size = "md", 
  className 
}: BadgeIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };
  
  return (
    <div 
      className={cn(
        "rounded-full flex flex-shrink-0 items-center justify-center",
        obtained 
          ? "bg-gradient-to-br from-atl-primary-purple to-atl-sky-blue text-white" 
          : "bg-gray-200 text-gray-400",
        sizeClasses[size],
        className
      )}
    >
      {obtained ? (
        <div className="flex items-center justify-center">
          <span className="font-bold text-xs">{name.charAt(0).toUpperCase()}</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className="text-xs">?</span>
        </div>
      )}
    </div>
  );
}
