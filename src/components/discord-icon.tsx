
import React from "react";

interface DiscordIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const DiscordIcon = ({ 
  size = 24, 
  className = "", 
  ...props 
}: DiscordIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide ${className}`}
      {...props}
    >
      <path d="M9 12a9 9 0 0 1-7.895-4.654" />
      <circle cx="12" cy="12" r="10" />
      <path d="M15.9 11.1a5.5 5.5 0 0 0-7.8 0" />
      <path d="M16 16.5c2-2.5 2-4.5 2-6 0-3.5-2.5-5.5-6-5.5s-6 2-6 5.5c0 1.5 0 3.5 2 6 2 2.5 4 2.5.5 0 1.5 1 2.5 1 3.5 0 1.5-1.5 3.5-1.5 4 0Z" />
    </svg>
  );
};
