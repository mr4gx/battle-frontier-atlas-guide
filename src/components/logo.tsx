
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
      {variant === "full" ? (
        <div className="flex items-center">
          <div className="relative">
            <div className="bg-atl-primary-purple h-8 w-8 md:h-10 md:w-10 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg md:text-xl">B</span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-atl-bright-blue h-4 w-4 md:h-5 md:w-5 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs md:text-sm">F</span>
            </div>
          </div>
          <span className="ml-2 font-bold text-lg md:text-xl bg-gradient-to-r from-atl-primary-purple to-atl-bright-blue bg-clip-text text-transparent">
            Atlanta Battle Frontier
          </span>
        </div>
      ) : (
        <div className="relative">
          <div className="bg-atl-primary-purple h-full w-full rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg md:text-xl">B</span>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-atl-bright-blue h-1/2 w-1/2 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs md:text-sm">F</span>
          </div>
        </div>
      )}
    </div>
  );
}
