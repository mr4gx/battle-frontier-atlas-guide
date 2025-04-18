
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  className?: string;
}

export function Logo({ size = "md", variant = "full", className }: LogoProps) {
  const sizeClasses = {
    sm: variant === "full" ? "h-8" : "h-6 w-6",
    md: variant === "full" ? "h-12" : "h-8 w-8",
    lg: variant === "full" ? "h-16" : "h-12 w-12",
  };

  return (
    <div 
      className={cn(
        "flex items-center justify-center", 
        sizeClasses[size], 
        className
      )}
    >
      <img 
        src="/lovable-uploads/420b0422-271a-4d3e-bc38-c95f5f8afd57.png"
        alt="Atlanta Battle Frontier Logo"
        className={cn(
          "object-contain",
          sizeClasses[size]
        )}
      />
    </div>
  );
}
