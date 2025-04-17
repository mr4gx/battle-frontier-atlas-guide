
import { useNavigate } from "react-router-dom";
import { Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBattleLock } from "@/hooks/use-battle-lock";
import { useTrainer } from "@/context/trainer-context";

export function ReturnToBattleButton() {
  const { isLocked, currentBattle } = useBattleLock();
  const { getActiveBattles } = useTrainer();
  const navigate = useNavigate();

  // Check for active battles if not locked
  const activeBattles = getActiveBattles();
  const shouldShowButton = isLocked || activeBattles.length > 0;

  const handleReturnToBattle = () => {
    if (currentBattle) {
      navigate('/battle/results', { state: { battle: currentBattle } });
    } else if (activeBattles.length > 0) {
      navigate('/battle/results', { state: { battle: activeBattles[0] } });
    }
  };

  if (!shouldShowButton) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleReturnToBattle}
      className="border-white/20 text-white hover:bg-white/20 hover:text-white flex items-center gap-1"
    >
      <Sword className="h-4 w-4" />
      <span className="hidden sm:inline">Return to Battle</span>
      <span className="sm:hidden">Battle</span>
    </Button>
  );
}
