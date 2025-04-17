
import { PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenDisplayProps {
  count: number;
  showAddButton?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onAdd?: () => void;
}

export function TokenDisplay({ 
  count, 
  showAddButton = false, 
  size = "md", 
  className,
  onAdd 
}: TokenDisplayProps) {
  const sizeClasses = {
    sm: "h-6 text-xs",
    md: "h-8 text-sm",
    lg: "h-10 text-base",
  };
  
  return (
    <div 
      className={cn(
        "flex items-center bg-atl-soft-blue text-atl-dark-purple rounded-full px-3",
        sizeClasses[size],
        className
      )}
    >
      <div className="flex items-center">
        <div className="w-4 h-4 mr-1.5 bg-atl-bright-blue rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">T</span>
        </div>
        <span className="font-medium">{count}</span>
      </div>
      
      {showAddButton && (
        <button 
          onClick={onAdd}
          className="ml-1.5 text-atl-primary-purple hover:text-atl-secondary-purple transition-colors"
        >
          <PlusCircle size={16} />
        </button>
      )}
    </div>
  );
}
