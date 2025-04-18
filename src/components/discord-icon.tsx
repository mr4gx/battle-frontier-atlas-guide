
import React from "react";

interface DiscordIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  alt?: string;
}

export const DiscordIcon = ({ 
  size = 24, 
  className = "", 
  style,
  alt = "Discord icon",
  ...props 
}: DiscordIconProps) => {
  return (
    <img
      src="/lovable-uploads/bb683c9c-9f15-4778-a026-dbd24ac41c4d.png"
      alt={alt}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      style={style}
      {...props as React.ImgHTMLAttributes<HTMLImageElement>}
    />
  );
};
