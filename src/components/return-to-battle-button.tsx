
import { useNavigate } from "react-router-dom";
import { Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBattleLock } from "@/hooks/use-battle-lock";

export function ReturnToBattleButton() {
  const { isLocked, activeBattleRoute } = useBattleLock();
  const navigate = useNavigate();

  if (!isLocked || !activeBattleRoute) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={() => navigate(activeBattleRoute)}
      className="border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-1"
    >
      <Sword className="h-4 w-4" />
      <span className="hidden sm:inline">Return to Battle</span>
      <span className="sm:hidden">Battle</span>
    </Button>
  );
}
