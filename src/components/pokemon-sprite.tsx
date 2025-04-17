
import { cn } from "@/lib/utils";

interface PokemonSpriteProps {
  id: number;
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PokemonSprite({ 
  id, 
  name, 
  size = "md", 
  className 
}: PokemonSpriteProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };
  
  // This is a temporary solution for demo purposes
  // In a real application, we would use actual Pokemon sprites
  const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  
  return (
    <div 
      className={cn(
        "flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      <img 
        src={spriteUrl} 
        alt={name} 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback for missing sprites
          e.currentTarget.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
        }}
      />
    </div>
  );
}
