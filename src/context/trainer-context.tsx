import { 
  ReactNode, 
  createContext, 
  useContext, 
  useState, 
  useEffect 
} from "react";
import { Trainer, Badge, Pokemon, Battle, BattleRequest } from "@/types";
import { mockTrainer, mockBattles } from "@/data/mock-data";
import { useAuth } from "./auth-context";
import { toast } from "@/components/ui/sonner";

const mockBattleRequests: BattleRequest[] = [
  {
    id: "br1",
    trainerId: "t2",
    trainerName: "Blue",
    trainerAvatar: "/assets/trainers/blue.png",
    trainerClass: "Rival",
    facilityId: "f1",
    facilityName: "Battle Tower",
    battleStyle: "Singles",
    time: "2023-05-17T14:30:00Z",
    tokensWagered: 2,
    notes: "Looking for a challenge!",
    status: "open",
    createdAt: "2023-05-17T10:15:00Z",
  },
  {
    id: "br2",
    trainerId: "t3",
    trainerName: "Red",
    trainerAvatar: "/assets/trainers/red.png",
    trainerClass: "Champion",
    facilityId: "f2",
    facilityName: "Battle Dome",
    battleStyle: "Singles",
    time: "2023-05-17T16:00:00Z",
    tokensWagered: 3,
    status: "open",
    createdAt: "2023-05-17T11:30:00Z",
  },
];

interface TrainerContextType {
  trainer: Trainer | null;
  isLoading: boolean;
  battles: Battle[];
  battleRequests: BattleRequest[];
  updateTrainer: (updates: Partial<Trainer>) => void;
  addBadge: (badge: Badge) => void;
  updateBadge: (badgeId: string, updates: Partial<Badge>) => void;
  addTokens: (amount: number) => void;
  subtractTokens: (amount: number) => boolean;
  updateTeam: (team: Pokemon[]) => void;
  addBattle: (battle: Omit<Battle, "id" | "date">) => Battle;
  getBattleHistory: () => Battle[];
  createBattleRequest: (request: Omit<BattleRequest, "id" | "createdAt" | "trainerId" | "trainerName" | "trainerAvatar" | "trainerClass" | "status">) => BattleRequest;
  updateBattleRequest: (id: string, updates: Partial<BattleRequest>) => void;
  acceptBattleRequest: (id: string) => void;
  cancelBattleRequest: (id: string) => void;
  getBattleRequests: () => BattleRequest[];
  getMyBattleRequests: () => BattleRequest[];
}

const TrainerContext = createContext<TrainerContextType | undefined>(undefined);

export function TrainerProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [battleRequests, setBattleRequests] = useState<BattleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      setTrainer(mockTrainer);
      setBattles(mockBattles);
      setBattleRequests(mockBattleRequests);
    } else {
      setTrainer(null);
      setBattles([]);
      setBattleRequests([]);
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

  const createBattleRequest = (request: Omit<BattleRequest, "id" | "createdAt" | "trainerId" | "trainerName" | "trainerAvatar" | "trainerClass" | "status">) => {
    if (!trainer) throw new Error("No trainer logged in");
    
    const newBattleRequest: BattleRequest = {
      ...request,
      id: `br${Date.now()}`,
      trainerId: trainer.id,
      trainerName: trainer.name,
      trainerAvatar: trainer.avatar,
      trainerClass: trainer.trainerClass,
      status: "open",
      createdAt: new Date().toISOString()
    };
    
    setBattleRequests(prev => [newBattleRequest, ...prev]);
    
    toast.success("Battle request posted successfully!");
    
    return newBattleRequest;
  };

  const updateBattleRequest = (id: string, updates: Partial<BattleRequest>) => {
    setBattleRequests(prev => 
      prev.map(request => 
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const acceptBattleRequest = (id: string) => {
    const request = battleRequests.find(r => r.id === id);
    
    if (!request || request.status !== "open") {
      toast.error("Battle request not available");
      return;
    }
    
    updateBattleRequest(id, { status: "accepted" });
    
    addBattle({
      opponentId: request.trainerId,
      opponentName: request.trainerName,
      facilityId: request.facilityId,
      tokensWagered: request.tokensWagered,
      result: "pending"
    });
    
    toast.success(`You accepted a battle with ${request.trainerName}!`);
  };

  const cancelBattleRequest = (id: string) => {
    const request = battleRequests.find(r => r.id === id);
    
    if (!request) {
      toast.error("Battle request not found");
      return;
    }
    
    if (request.trainerId !== trainer?.id) {
      toast.error("You can only cancel your own battle requests");
      return;
    }
    
    updateBattleRequest(id, { status: "canceled" });
    toast.info("Battle request canceled");
  };

  const getBattleRequests = () => {
    return battleRequests
      .filter(request => request.status === "open" && request.trainerId !== trainer?.id)
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  };

  const getMyBattleRequests = () => {
    return battleRequests
      .filter(request => request.trainerId === trainer?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <TrainerContext.Provider
      value={{
        trainer,
        isLoading,
        battles,
        battleRequests,
        updateTrainer,
        addBadge,
        updateBadge,
        addTokens,
        subtractTokens,
        updateTeam,
        addBattle,
        getBattleHistory,
        createBattleRequest,
        updateBattleRequest,
        acceptBattleRequest,
        cancelBattleRequest,
        getBattleRequests,
        getMyBattleRequests
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
