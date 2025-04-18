
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
    <img
      src="/public/lovable-uploads/bb683c9c-9f15-4778-a026-dbd24ac41c4d.png"
      alt="Discord icon"
      width={size}
      height={size}
      className={`inline-block ${className}`}
      {...props}
    />
  );
};
