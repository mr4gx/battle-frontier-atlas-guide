
export interface Trainer {
  id: string;
  name: string;
  avatar?: string;
  trainerClass: string;
  wins: number;
  losses: number;
  badges: Badge[];
  tokens: number;
  team: Pokemon[];
  achievementBadges: string[];
}

export interface Pokemon {
  id: number;
  name: string;
  moves: string[];
  level: number;
}

export interface Badge {
  id: string;
  name: string;
  facilityId: string;
  obtained: boolean;
  dateObtained?: string;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  image: string;
  battleStyle: string;
  rules: string[];
  entryRequirements: string[];
  badgeId: string;
  status: "completed" | "available" | "locked";
}

export interface Battle {
  id: string;
  opponentId: string;
  opponentName: string;
  facilityId?: string;
  result: "win" | "loss" | "pending";
  tokensWagered: number;
  date: string;
  notes?: string;
  linkCode?: string;
  verificationImage?: string;
}

export interface BattleRequest {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar?: string;
  trainerClass: string;
  facilityId: string;
  facilityName: string;
  battleStyle: string;
  time: string;
  tokensWagered: number;
  notes?: string;
  status: "open" | "accepted" | "completed" | "canceled";
  createdAt: string;
  opponentId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "system" | "battle" | "badge" | "token" | "event";
  actionPath?: string;
}

export interface Tournament {
  id: string;
  name: string;
  matches: TournamentMatch[];
  participants: string[];
  currentRound: number;
  totalRounds: number;
}

export interface TournamentMatch {
  id: string;
  round: number;
  participant1Id?: string;
  participant2Id?: string;
  winnerId?: string;
  time?: string;
  completed: boolean;
}
