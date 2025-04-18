import { 
  ReactNode, 
  createContext, 
  useContext, 
  useState, 
  useEffect 
} from "react";
import { Trainer, Badge, Pokemon, Battle, BattleRequest } from "@/types";
import { mockTrainer } from "@/data/mock-data";
import { useAuth } from "./auth-context";
import { toast } from "@/components/ui/sonner";
import { BadgeAchievementToast } from "@/components/ui/badge-achievement-toast";
import { supabase } from "@/integrations/supabase/client";
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
  acceptBattleRequest: (id: string) => Battle | undefined;
  cancelBattleRequest: (id: string) => void;
  getBattleRequests: () => BattleRequest[];
  getMyBattleRequests: () => BattleRequest[];
  getAllTrainers: () => Trainer[];
  startBattle: (battleId: string) => void;
  getReadyBattles: () => Battle[];
  getActiveBattles: () => Battle[];
  checkBadgeAchievements: (facilityId: string) => void;
  getBattlesByFacility: (facilityId: string) => Battle[];
  getTrainerByIdOrName: (idOrName: string) => Trainer | undefined;
  hasPendingBattleRequestFrom: (trainerId: string) => boolean;
}

const TrainerContext = createContext<TrainerContextType | undefined>(undefined);

export function TrainerProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [battleRequests, setBattleRequests] = useState<BattleRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      const savedTrainer = localStorage.getItem("atlTrainer");
      
      if (savedTrainer) {
        setTrainer(JSON.parse(savedTrainer));
      } else {
        setTrainer(mockTrainer);
      }
      
      setBattles(mockBattles);
      setBattleRequests(mockBattleRequests);
    } else {
      setTrainer(null);
      setBattles([]);
      setBattleRequests([]);
    }
    
    setIsLoading(false);
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (trainer) {
      localStorage.setItem("atlTrainer", JSON.stringify(trainer));
    }
  }, [trainer]);

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

    const badge = trainer.badges.find(b => b.facilityId === facilityId);
    if (!badge || badge.obtained) return;

    const facilityWins = getBattlesByFacility(facilityId).length;
    const facility = mockFacilities.find(f => f.id === facilityId);
    const facilityName = facility ? facility.name : "Unknown Area";

    if (facilityWins >= 7) {
      updateBadge(badge.id, { 
        obtained: true, 
        dateObtained: new Date().toISOString() 
      });
      
      toast.custom(() => (
        <BadgeAchievementToast badgeName={facilityName} />
      ), {
        duration: 6000,
        position: "top-center",
      });
    }
  };

  const createBattleRequest = async (request: Omit<BattleRequest, "id" | "createdAt" | "trainerId" | "trainerName" | "trainerAvatar" | "trainerClass" | "status">) => {
    if (!trainer) throw new Error("No trainer logged in");

    try {
      const { data, error } = await supabase
        .from('battle_requests')
        .insert({
          trainer_id: trainer.id,
          trainer_name: trainer.name,
          trainer_avatar: trainer.avatar,
          trainer_class: trainer.trainerClass,
          facility_id: request.facilityId,
          facility_name: request.facilityName,
          battle_style: request.battleStyle,
          time: request.time,
          tokens_wagered: request.tokensWagered,
          notes: request.notes,
          opponent_id: request.opponentId
        })
        .select()
        .single();

      if (error) throw error;

      const newRequest: BattleRequest = {
        id: data.id,
        trainerId: data.trainer_id,
        trainerName: data.trainer_name,
        trainerAvatar: data.trainer_avatar,
        trainerClass: data.trainer_class,
        facilityId: data.facility_id,
        facilityName: data.facility_name,
        battleStyle: data.battle_style,
        time: data.time,
        tokensWagered: data.tokens_wagered,
        notes: data.notes,
        status: data.status,
        createdAt: data.created_at,
        opponentId: data.opponent_id
      };

      setBattleRequests(prev => [newRequest, ...prev]);
      
      toast.success("Battle request sent successfully!");
      return newRequest;
    } catch (error: any) {
      toast.error("Failed to create battle request");
      throw error;
    }
  };

  const updateBattleRequest = async (id: string, updates: Partial<BattleRequest>) => {
    try {
      const { error } = await supabase
        .from('battle_requests')
        .update({
          status: updates.status,
          opponent_id: updates.opponentId
        })
        .eq('id', id);

      if (error) throw error;

      setBattleRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, ...updates } : request
        )
      );
    } catch (error: any) {
      toast.error("Failed to update battle request");
      throw error;
    }
  };

  const cancelBattleRequest = async (id: string) => {
    try {
      const { error } = await supabase
        .from('battle_requests')
        .update({ status: 'canceled' })
        .eq('id', id);

      if (error) throw error;

      setBattleRequests(prev => 
        prev.map(request => 
          request.id === id ? { ...request, status: 'canceled' } : request
        )
      );
      
      toast.info("Battle request canceled");
    } catch (error: any) {
      toast.error("Failed to cancel battle request");
      throw error;
    }
  };

  const getBattleRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('battle_requests')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((request): BattleRequest => ({
        id: request.id,
        trainerId: request.trainer_id,
        trainerName: request.trainer_name,
        trainerAvatar: request.trainer_avatar,
        trainerClass: request.trainer_class,
        facilityId: request.facility_id,
        facilityName: request.facility_name,
        battleStyle: request.battle_style,
        time: request.time,
        tokensWagered: request.tokens_wagered,
        notes: request.notes,
        status: request.status,
        createdAt: request.created_at,
        opponentId: request.opponent_id
      }));
    } catch (error: any) {
      console.error("Failed to fetch battle requests:", error);
      return [];
    }
  };

  const getMyBattleRequests = async () => {
    if (!trainer) return [];

    try {
      const { data, error } = await supabase
        .from('battle_requests')
        .select('*')
        .eq('trainer_id', trainer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((request): BattleRequest => ({
        id: request.id,
        trainerId: request.trainer_id,
        trainerName: request.trainer_name,
        trainerAvatar: request.trainer_avatar,
        trainerClass: request.trainer_class,
        facilityId: request.facility_id,
        facilityName: request.facility_name,
        battleStyle: request.battle_style,
        time: request.time,
        tokensWagered: request.tokens_wagered,
        notes: request.notes,
        status: request.status,
        createdAt: request.created_at,
        opponentId: request.opponent_id
      }));
    } catch (error: any) {
      console.error("Failed to fetch my battle requests:", error);
      return [];
    }
  };

  const getAllTrainers = () => {
    return mockTrainers;
  };

  const getTrainerByIdOrName = (idOrName: string) => {
    const allTrainers = getAllTrainers();
    
    let foundTrainer = allTrainers.find(t => t.id === idOrName);
    
    if (!foundTrainer) {
      foundTrainer = allTrainers.find(t => 
        t.name.toLowerCase() === idOrName.toLowerCase()
      );
    }
    
    return foundTrainer;
  };

  const hasPendingBattleRequestFrom = (trainerId: string) => {
    return battleRequests.some(request => 
      request.trainerId === trainerId && 
      request.status === "open" &&
      (request.opponentId === trainer?.id || !request.opponentId)
    );
  };

  const startBattle = (battleId: string) => {
    const battle = battles.find(b => b.id === battleId);
    
    if (!battle) {
      toast.error("Battle not found");
      return;
    }
    
    setBattles(prev => 
      prev.map(b => 
        b.id === battleId 
          ? { ...b, status: "active" } 
          : b
      )
    );
    
    if (battle.linkCode) {
      toast.info(`Battle started! Link code: ${battle.linkCode}`);
    } else {
      toast.success("Battle started! Good luck!");
    }
  };

  const getReadyBattles = () => {
    return battles.filter(battle => battle.status === "ready");
  };

  const getActiveBattles = () => {
    return battles.filter(battle => 
      battle.status === "active" && battle.result === "pending"
    );
  };

  // Add real-time subscription for battle requests
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('battle-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'battle_requests'
        },
        async (payload) => {
          // Refresh the battle requests list when changes occur
          const requests = await getBattleRequests();
          setBattleRequests(requests);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  // Initial fetch of battle requests
  useEffect(() => {
    if (isAuthenticated) {
      getBattleRequests().then(setBattleRequests);
    }
  }, [isAuthenticated]);

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
        getBattlesByFacility,
        getTrainerByIdOrName,
        hasPendingBattleRequestFrom
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
