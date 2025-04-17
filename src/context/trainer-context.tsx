
import { 
  ReactNode, 
  createContext, 
  useContext, 
  useState, 
  useEffect 
} from "react";
import { Trainer, Badge, Pokemon, Battle } from "@/types";
import { mockTrainer, mockBattles } from "@/data/mock-data";
import { useAuth } from "./auth-context";

interface TrainerContextType {
  trainer: Trainer | null;
  isLoading: boolean;
  battles: Battle[];
  updateTrainer: (updates: Partial<Trainer>) => void;
  addBadge: (badge: Badge) => void;
  updateBadge: (badgeId: string, updates: Partial<Badge>) => void;
  addTokens: (amount: number) => void;
  subtractTokens: (amount: number) => boolean;
  updateTeam: (team: Pokemon[]) => void;
  addBattle: (battle: Omit<Battle, "id" | "date">) => Battle;
  getBattleHistory: () => Battle[];
}

const TrainerContext = createContext<TrainerContextType | undefined>(undefined);

export function TrainerProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      // In a real app, we'd fetch this data from an API
      // For now, we'll use mock data
      setTrainer(mockTrainer);
      setBattles(mockBattles);
    } else {
      setTrainer(null);
      setBattles([]);
    }
    
    setIsLoading(false);
  }, [isAuthenticated]);

  const updateTrainer = (updates: Partial<Trainer>) => {
    if (!trainer) return;
    
    setTrainer({
      ...trainer,
      ...updates
    });
  };

  const addBadge = (badge: Badge) => {
    if (!trainer) return;
    
    setTrainer({
      ...trainer,
      badges: [...trainer.badges, badge]
    });
  };

  const updateBadge = (badgeId: string, updates: Partial<Badge>) => {
    if (!trainer) return;
    
    setTrainer({
      ...trainer,
      badges: trainer.badges.map(badge => 
        badge.id === badgeId ? { ...badge, ...updates } : badge
      )
    });
  };

  const addTokens = (amount: number) => {
    if (!trainer) return;
    
    setTrainer({
      ...trainer,
      tokens: trainer.tokens + amount
    });
  };

  const subtractTokens = (amount: number) => {
    if (!trainer) return false;
    
    if (trainer.tokens < amount) {
      return false;
    }
    
    setTrainer({
      ...trainer,
      tokens: trainer.tokens - amount
    });
    
    return true;
  };

  const updateTeam = (team: Pokemon[]) => {
    if (!trainer) return;
    
    setTrainer({
      ...trainer,
      team
    });
  };

  const addBattle = (battle: Omit<Battle, "id" | "date">) => {
    const newBattle: Battle = {
      ...battle,
      id: `btl${Date.now()}`,
      date: new Date().toISOString()
    };
    
    setBattles(prev => [newBattle, ...prev]);
    
    // Update win/loss stats
    if (battle.result === "win") {
      updateTrainer({ wins: (trainer?.wins || 0) + 1 });
    } else if (battle.result === "loss") {
      updateTrainer({ losses: (trainer?.losses || 0) + 1 });
    }
    
    return newBattle;
  };

  const getBattleHistory = () => {
    return battles.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  return (
    <TrainerContext.Provider
      value={{
        trainer,
        isLoading,
        battles,
        updateTrainer,
        addBadge,
        updateBadge,
        addTokens,
        subtractTokens,
        updateTeam,
        addBattle,
        getBattleHistory
      }}
    >
      {children}
    </TrainerContext.Provider>
  );
}

export function useTrainer() {
  const context = useContext(TrainerContext);
  
  if (context === undefined) {
    throw new Error("useTrainer must be used within a TrainerProvider");
  }
  
  return context;
}
