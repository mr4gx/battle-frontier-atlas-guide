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
import { Award } from "lucide-react";
import { BadgeAchievementToast } from "@/components/ui/badge-achievement-toast";
import { mockFacilities } from "@/data/mock-data";

const mockTrainers: Trainer[] = [
  mockTrainer,
  {
    id: "T54321",
    name: "Gary Oak",
    avatar: "/assets/trainers/blue.png",
    trainerClass: "Rival",
    wins: 12,
    losses: 3,
    badges: [],
    tokens: 45,
    team: [],
    achievementBadges: []
  },
  {
    id: "T98765",
    name: "Misty",
    avatar: "/assets/trainers/misty.png",
    trainerClass: "Gym Leader",
    wins: 10,
    losses: 5,
    badges: [],
    tokens: 30,
    team: [],
    achievementBadges: []
  },
  {
    id: "T24680",
    name: "Brock",
    avatar: "/assets/trainers/brock.png",
    trainerClass: "Gym Leader",
    wins: 8,
    losses: 4,
    badges: [],
    tokens: 25,
    team: [],
    achievementBadges: []
  },
  {
    id: "T13579",
    name: "Dawn",
    avatar: "/assets/trainers/dawn.png",
    trainerClass: "Coordinator",
    wins: 7,
    losses: 6,
    badges: [],
    tokens: 20,
    team: [],
    achievementBadges: []
  },
  {
    id: "T11111",
    name: "Cynthia",
    avatar: "/assets/trainers/cynthia.png",
    trainerClass: "Champion",
    wins: 15,
    losses: 1,
    badges: [],
    tokens: 50,
    team: [],
    achievementBadges: []
  }
];

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
  getAllTrainers: () => Trainer[];
  startBattle: (battleId: string) => void;
  getReadyBattles: () => Battle[];
  getActiveBattles: () => Battle[];
  checkBadgeAchievements: (facilityId: string) => void;
  getBattlesByFacility: (facilityId: string) => Battle[];
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
    
    toast.success(`+${amount} tokens added to your account`);
  };

  const subtractTokens = (amount: number) => {
    if (!trainer) return false;
    
    if (trainer.tokens < amount) {
      toast.error("Not enough tokens");
      return false;
    }
    
    setTrainer({
      ...trainer,
      tokens: trainer.tokens - amount
    });
    
    toast.info(`-${amount} tokens deducted from your account`);
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
      date: new Date().toISOString(),
      status: battle.status || "ready"
    };
    
    setBattles(prev => [newBattle, ...prev]);
    
    if (battle.result === "win") {
      updateTrainer({ wins: (trainer?.wins || 0) + 1 });
      if (battle.facilityId && battle.status === "completed") {
        // Check for badge achievement when a battle is won and completed
        checkBadgeAchievements(battle.facilityId);
      }
    } else if (battle.result === "loss") {
      updateTrainer({ losses: (trainer?.losses || 0) + 1 });
    }
    
    return newBattle;
  };

  const getBattleHistory = () => {
    return battles.filter(battle => battle.status === "completed")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getBattlesByFacility = (facilityId: string) => {
    return battles.filter(battle => 
      battle.facilityId === facilityId && 
      battle.status === "completed" && 
      battle.result === "win"
    );
  };

  const checkBadgeAchievements = (facilityId: string) => {
    if (!trainer) return;

    // Get the facility-specific badge
    const badge = trainer.badges.find(b => b.facilityId === facilityId);
    if (!badge || badge.obtained) return; // Skip if badge doesn't exist or is already obtained

    // Count completed wins for this facility
    const facilityWins = getBattlesByFacility(facilityId).length;
    
    // Find the facility name for better user experience
    const facility = mockFacilities.find(f => f.id === facilityId);
    const facilityName = facility ? facility.name : "Unknown Area";
    
    // Check if trainer has won at least 7 battles in this facility
    if (facilityWins >= 7) {
      // Update the badge to obtained
      updateBadge(badge.id, { 
        obtained: true, 
        dateObtained: new Date().toISOString() 
      });
      
      // Show achievement notification
      toast.custom(() => (
        <BadgeAchievementToast badgeName={facilityName} />
      ), {
        duration: 6000,
        position: "top-center",
      });
    }
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
    
    const linkCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    
    const battle = addBattle({
      opponentId: request.trainerId,
      opponentName: request.trainerName,
      facilityId: request.facilityId,
      tokensWagered: request.tokensWagered,
      result: "pending",
      linkCode: linkCode,
      status: "ready"
    });
    
    toast.success(`You accepted a battle with ${request.trainerName}!`);
    
    toast.info(`Notification sent to ${request.trainerName} about your acceptance`);
    
    subtractTokens(request.tokensWagered);
    
    return battle;
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

  const getAllTrainers = () => {
    return mockTrainers;
  };

  const startBattle = (battleId: string) => {
    setBattles(prev => 
      prev.map(battle => 
        battle.id === battleId 
          ? { ...battle, status: "active" } 
          : battle
      )
    );
    
    toast.success("Battle started! Good luck!");
  };

  const getReadyBattles = () => {
    return battles.filter(battle => battle.status === "ready");
  };

  const getActiveBattles = () => {
    return battles.filter(battle => 
      battle.status === "active" && battle.result === "pending"
    );
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
        getMyBattleRequests,
        getAllTrainers,
        startBattle,
        getReadyBattles,
        getActiveBattles,
        checkBadgeAchievements,
        getBattlesByFacility
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
