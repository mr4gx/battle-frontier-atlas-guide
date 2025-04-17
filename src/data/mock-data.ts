import { Trainer, Facility, Badge, Battle, Notification, Tournament, Pokemon } from "@/types";

export const mockTrainer: Trainer = {
  id: "T12345",
  name: "Ash Ketchum",
  avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=64&h=64",
  trainerClass: "Pokémon Master",
  wins: 8,
  losses: 2,
  badges: [
    { id: "b1", name: "Battle Arena", facilityId: "f1", obtained: true, dateObtained: "2025-04-12" },
    { id: "b2", name: "Battle Factory", facilityId: "f2", obtained: true, dateObtained: "2025-04-13" },
    { id: "b3", name: "Battle Palace", facilityId: "f3", obtained: false },
  ],
  tokens: 35,
  team: [
    { id: 25, name: "Pikachu", moves: ["Thunderbolt", "Quick Attack", "Iron Tail", "Electroweb"], level: 50 },
    { id: 6, name: "Charizard", moves: ["Flamethrower", "Dragon Claw", "Air Slash", "Blast Burn"], level: 50 },
    { id: 9, name: "Blastoise", moves: ["Hydro Pump", "Ice Beam", "Flash Cannon", "Skull Bash"], level: 50 },
    { id: 3, name: "Venusaur", moves: ["Solar Beam", "Sludge Bomb", "Earth Power", "Sleep Powder"], level: 50 },
    { id: 149, name: "Dragonite", moves: ["Dragon Dance", "Outrage", "Hurricane", "Extreme Speed"], level: 50 },
    { id: 448, name: "Lucario", moves: ["Aura Sphere", "Close Combat", "Meteor Mash", "Extreme Speed"], level: 50 },
  ],
  achievementBadges: ["First Win", "Token Master", "Early Bird"]
};

export const mockFacilities: Facility[] = [
  {
    id: "f1",
    name: "Battle Arena",
    description: "Test your skill in one-on-one battles where strategy is key.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&h=170",
    battleStyle: "Single Battle",
    rules: ["Level 50 Pokémon", "No items during battle", "Best of 3 matches"],
    entryRequirements: ["Min. 5 Battle Tokens"],
    badgeId: "b1",
    status: "completed"
  },
  {
    id: "f2",
    name: "Battle Factory",
    description: "Use rental Pokémon to prove you can win with any team.",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=300&h=170",
    battleStyle: "Single Battle",
    rules: ["Rental Pokémon only", "Level 50 Pokémon", "Best of 3 matches"],
    entryRequirements: ["Min. 10 Battle Tokens", "Arena Badge"],
    badgeId: "b2",
    status: "completed"
  },
  {
    id: "f3",
    name: "Battle Palace",
    description: "Your Pokémon battle independently based on their nature.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=300&h=170",
    battleStyle: "Single Battle",
    rules: ["No direct commands", "Nature-based moves", "Best of 3 matches"],
    entryRequirements: ["Min. 15 Battle Tokens", "Factory Badge"],
    badgeId: "b3",
    status: "available"
  }
];

export const mockBattles: Battle[] = [
  {
    id: "btl1",
    opponentId: "T54321",
    opponentName: "Gary Oak",
    facilityId: "f1",
    result: "win",
    tokensWagered: 5,
    date: "2025-04-12T14:30:00",
    notes: "Close battle, won with final Pokémon"
  },
  {
    id: "btl2",
    opponentId: "T98765",
    opponentName: "Misty",
    facilityId: "f1",
    result: "win",
    tokensWagered: 8,
    date: "2025-04-12T16:45:00"
  },
  {
    id: "btl3",
    opponentId: "T24680",
    opponentName: "Brock",
    facilityId: "f2",
    result: "loss",
    tokensWagered: 10,
    date: "2025-04-13T10:15:00",
    notes: "Need to improve against Rock types"
  },
  {
    id: "btl4",
    opponentId: "T13579",
    opponentName: "Dawn",
    facilityId: "f2",
    result: "win",
    tokensWagered: 12,
    date: "2025-04-13T13:20:00"
  },
  {
    id: "btl5",
    opponentId: "T11111",
    opponentName: "Cynthia",
    facilityId: "f2",
    result: "win",
    tokensWagered: 15,
    date: "2025-04-14T09:45:00",
    notes: "Championship-level battle"
  }
];

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    title: "Battle Challenge",
    message: "Gary Oak has challenged you to a battle!",
    date: "2025-04-15T08:30:00",
    read: false,
    type: "battle",
    actionPath: "/battle/setup"
  },
  {
    id: "n2",
    title: "Badge Earned",
    message: "Congratulations! You earned the Battle Factory Badge!",
    date: "2025-04-13T13:45:00",
    read: true,
    type: "badge"
  },
  {
    id: "n3",
    title: "Tokens Awarded",
    message: "You received 10 tokens for your consecutive wins!",
    date: "2025-04-14T10:20:00",
    read: true,
    type: "token"
  },
  {
    id: "n4",
    title: "Event Update",
    message: "Championship brackets have been updated. Check your matches!",
    date: "2025-04-15T07:15:00",
    read: false,
    type: "event",
    actionPath: "/brackets"
  }
];

export const mockTournament: Tournament = {
  id: "t2025",
  name: "Atlanta Battle Frontier Championship 2025",
  matches: [
    {
      id: "m1",
      round: 1,
      participant1Id: mockTrainer.id,
      participant2Id: "T54321",
      winnerId: mockTrainer.id,
      time: "2025-04-16T10:00:00",
      completed: true
    },
    {
      id: "m2",
      round: 1,
      participant1Id: "T98765",
      participant2Id: "T24680",
      winnerId: "T98765",
      time: "2025-04-16T11:00:00",
      completed: true
    },
    {
      id: "m3",
      round: 1,
      participant1Id: "T13579",
      participant2Id: "T11111",
      winnerId: "T11111",
      time: "2025-04-16T12:00:00",
      completed: true
    },
    {
      id: "m4",
      round: 1,
      participant1Id: "T22222",
      participant2Id: "T33333",
      winnerId: "T22222",
      time: "2025-04-16T13:00:00",
      completed: true
    },
    {
      id: "m5",
      round: 2,
      participant1Id: mockTrainer.id,
      participant2Id: "T98765",
      winnerId: undefined,
      time: "2025-04-17T10:00:00",
      completed: false
    },
    {
      id: "m6",
      round: 2,
      participant1Id: "T11111",
      participant2Id: "T22222",
      winnerId: undefined,
      time: "2025-04-17T11:00:00",
      completed: false
    },
    {
      id: "m7",
      round: 3,
      participant1Id: undefined,
      participant2Id: undefined,
      winnerId: undefined,
      time: "2025-04-18T10:00:00",
      completed: false
    }
  ],
  participants: [
    mockTrainer.id,
    "T54321",
    "T98765",
    "T24680",
    "T13579",
    "T11111",
    "T22222",
    "T33333"
  ],
  currentRound: 2,
  totalRounds: 3
};
