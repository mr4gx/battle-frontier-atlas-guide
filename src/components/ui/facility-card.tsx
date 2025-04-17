
import { cn } from "@/lib/utils";
import { BadgeIcon } from "./badge-icon";

interface FacilityCardProps {
  name: string;
  badgeObtained: boolean;
  image: string;
  className?: string;
  onClick?: () => void;
  status?: "completed" | "available" | "locked";
}

export function FacilityCard({ 
  name, 
  badgeObtained, 
  image, 
  className,
  onClick,
  status = "available"
}: FacilityCardProps) {
  const statusClasses = {
    completed: "border-green-500",
    available: "border-atl-light-purple/30",
    locked: "border-gray-300 opacity-70"
  };
  
  return (
    <div 
      className={cn(
        "atl-facility-card cursor-pointer",
        statusClasses[status],
        className
      )}
      onClick={onClick}
    >
      <div className="relative h-24 bg-gray-200 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
        
        {status === "locked" && (
          <div className="absolute inset-0 bg-gray-800/50 flex items-center justify-center">
            <div className="bg-white rounded-full p-1">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-gray-500"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <BadgeIcon name={name} obtained={badgeObtained} size="sm" />
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-sm">{name}</h3>
        <div className="mt-1 text-xs text-gray-500">
          {status === "completed" ? "Completed" : 
           status === "available" ? "Available" : "Locked"}
        </div>
      </div>
    </div>
  );
}
