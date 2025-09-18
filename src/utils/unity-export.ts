import { Trainer, Pokemon, Facility, Battle, BattleRequest, Notification } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export interface UnityExportData {
  gameData: {
    trainers: Trainer[];
    pokemon: Pokemon[];
    facilities: Facility[];
    battles: Battle[];
    battleRequests: BattleRequest[];
    notifications: Notification[];
  };
  gameLogic: {
    battleSystem: string;
    pokemonSearch: string;
    trainerManagement: string;
    facilityRules: string;
  };
  uiStructure: {
    pages: string[];
    components: string[];
    navigation: string;
  };
  assets: {
    images: string[];
    sprites: string[];
    icons: string[];
  };
  database: {
    schema: string;
    relationships: string;
    policies: string;
  };
}

export class UnityExporter {
  async exportAllData(): Promise<UnityExportData> {
    console.log("Starting Unity export...");
    
    const exportData: UnityExportData = {
      gameData: await this.exportGameData(),
      gameLogic: await this.exportGameLogic(),
      uiStructure: this.exportUIStructure(),
      assets: this.exportAssets(),
      database: this.exportDatabaseStructure()
    };

    return exportData;
  }

  private async exportGameData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Export trainers with type conversion
    const { data: supabaseTrainers } = await supabase
      .from('trainers')
      .select('*');

    const trainers: Trainer[] = (supabaseTrainers || []).map(trainer => ({
      id: trainer.id,
      name: trainer.name,
      avatar: trainer.avatar_url || undefined,
      trainerClass: trainer.trainer_class,
      wins: trainer.wins,
      losses: trainer.losses,
      tokens: trainer.tokens,
      badges: [], // Will need to query badges table when it exists
      team: [], // Will need to query team table when it exists
      achievementBadges: [] // Will need to query achievement badges when they exist
    }));

    // Export battle requests with type conversion
    const { data: supabaseBattleRequests } = await supabase
      .from('battle_requests')
      .select('*');

    const battleRequests: BattleRequest[] = (supabaseBattleRequests || []).map(request => ({
      id: request.id,
      trainerId: request.trainer_id,
      trainerName: request.trainer_name,
      trainerAvatar: request.trainer_avatar || undefined,
      trainerClass: request.trainer_class,
      facilityId: request.facility_id,
      facilityName: request.facility_name,
      battleStyle: request.battle_style,
      time: request.time,
      tokensWagered: request.tokens_wagered,
      notes: request.notes || undefined,
      status: request.status as "open" | "accepted" | "completed" | "canceled",
      createdAt: request.created_at,
      opponentId: request.opponent_id || undefined
    }));

    // Mock data for other entities (replace with actual Supabase queries when tables exist)
    const pokemon: Pokemon[] = []; // From Pokemon API cache
    const facilities: Facility[] = []; // From mock data or future Supabase table
    const battles: Battle[] = []; // From future Supabase table
    const notifications: Notification[] = []; // From future Supabase table

    return {
      trainers,
      pokemon,
      facilities,
      battles,
      battleRequests,
      notifications
    };
  }

  private async exportGameLogic() {
    return {
      battleSystem: `
        // Battle system logic for Unity (C#)
        public class BattleSystem {
          public enum BattleResult { Win, Loss, Pending }
          public enum BattleStatus { Ready, Active, Completed }
          
          public class Battle {
            public string Id;
            public string OpponentId;
            public string OpponentName;
            public string FacilityId;
            public BattleResult Result;
            public int TokensWagered;
            public DateTime Date;
            public string Notes;
            public string LinkCode;
            public string VerificationImage;
            public BattleStatus Status;
          }
          
          public static int CalculateTokenReward(int wagered, BattleResult result) {
            return result == BattleResult.Win ? wagered * 2 : 0;
          }
        }
      `,
      pokemonSearch: `
        // Pokemon search system for Unity (C#)
        public class PokemonSearchSystem {
          [System.Serializable]
          public class Pokemon {
            public int id;
            public string name;
            public string[] moves;
            public int level;
          }
          
          public static List<Pokemon> SearchPokemon(string searchTerm) {
            // Implement search logic
            return new List<Pokemon>();
          }
        }
      `,
      trainerManagement: `
        // Trainer management for Unity (C#)
        public class TrainerManager {
          [System.Serializable]
          public class Trainer {
            public string id;
            public string name;
            public string avatar;
            public string trainerClass;
            public int wins;
            public int losses;
            public int tokens;
            public Pokemon[] team;
            public string[] achievementBadges;
          }
          
          public static void UpdateTrainerStats(Trainer trainer, BattleResult result) {
            if (result == BattleResult.Win) trainer.wins++;
            else if (result == BattleResult.Loss) trainer.losses++;
          }
        }
      `,
      facilityRules: `
        // Facility rules system for Unity (C#)
        public class FacilitySystem {
          public enum FacilityStatus { Completed, Available, Locked }
          
          [System.Serializable]
          public class Facility {
            public string id;
            public string name;
            public string description;
            public string image;
            public string battleStyle;
            public string[] rules;
            public string[] entryRequirements;
            public string badgeId;
            public FacilityStatus status;
          }
        }
      `
    };
  }

  private exportUIStructure() {
    return {
      pages: [
        "DashboardPage - Main hub with trainer stats and quick actions",
        "BattleBulletinPage - View and create battle requests",
        "BattleSetupPage - Configure battle parameters",
        "BattleAreasMapPage - Map view of battle facilities",
        "BattleAreaDetailPage - Detailed facility information",
        "BattleHistoryPage - Past battles and results",
        "BattleResultsPage - Battle outcome display",
        "BracketPage - Tournament bracket view",
        "LeaderboardPage - Global rankings",
        "ProfilePage - Trainer profile management",
        "TeamManagementPage - Pokemon team builder",
        "PassportPage - Badge collection display",
        "NotificationsPage - System notifications",
        "TrainersListPage - Browse other trainers",
        "QRScannerPage - QR code battle linking"
      ],
      components: [
        "BottomNavigation - Mobile navigation bar",
        "PokemonSprite - Pokemon image display",
        "TokenDisplay - Token counter UI",
        "AvatarUpload - Profile picture management",
        "DiscordNotificationCard - Discord integration",
        "ReturnToBattleButton - Battle state management",
        "FacilityCard - Facility display component",
        "BadgeIcon - Achievement badge display"
      ],
      navigation: `
        Unity UI Navigation System:
        - Use Unity's UI system with Canvas and EventSystem
        - Implement page transitions with Animator
        - Mobile-first responsive design
        - Bottom navigation for main actions
        - Modal dialogs for detailed views
      `
    };
  }

  private exportAssets() {
    return {
      images: [
        "/lovable-uploads/420b0422-271a-4d3e-bc38-c95f5f8afd57.png",
        "/lovable-uploads/bb683c9c-9f15-4778-a026-dbd24ac41c4d.png"
      ],
      sprites: [
        "Pokemon sprites from PokeAPI",
        "Trainer avatars",
        "Badge icons",
        "Facility images"
      ],
      icons: [
        "Lucide React icons - convert to Unity UI sprites",
        "Navigation icons",
        "Action buttons",
        "Status indicators"
      ]
    };
  }

  private exportDatabaseStructure() {
    return {
      schema: `
        Unity equivalent using ScriptableObjects or JSON:
        
        // Trainers table
        public class TrainerData : ScriptableObject {
          public string id;
          public string name;
          public string avatar;
          public string trainerClass;
          public int wins;
          public int losses;
          public int tokens;
          public List<Pokemon> team;
          public List<string> achievementBadges;
        }
        
        // Battle Requests table
        public class BattleRequestData : ScriptableObject {
          public string id;
          public string trainerId;
          public string trainerName;
          public string facilityId;
          public string facilityName;
          public string battleStyle;
          public DateTime time;
          public int tokensWagered;
          public string status;
        }
      `,
      relationships: `
        - Trainers have many Battle Requests
        - Battle Requests belong to Trainers
        - Trainers have many Battles
        - Battles reference Facilities
        - Trainers have many Badges
      `,
      policies: `
        Unity Security Implementation:
        - Use Unity Authentication for user management
        - Implement role-based access control
        - Validate data on server side
        - Use Unity Cloud Save for persistent data
      `
    };
  }

  async downloadExport() {
    const exportData = await this.exportAllData();
    
    // Create downloadable files
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'battle-frontier-unity-export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Also create C# scripts file
    const csharpContent = this.generateCSharpScripts(exportData);
    const csharpBlob = new Blob([csharpContent], { type: 'text/plain' });
    const csharpUrl = URL.createObjectURL(csharpBlob);
    const csharpLink = document.createElement('a');
    csharpLink.href = csharpUrl;
    csharpLink.download = 'BattleFrontierScripts.cs';
    document.body.appendChild(csharpLink);
    csharpLink.click();
    document.body.removeChild(csharpLink);
    URL.revokeObjectURL(csharpUrl);

    return exportData;
  }

  private generateCSharpScripts(exportData: UnityExportData): string {
    return `
using System;
using System.Collections.Generic;
using UnityEngine;

namespace BattleFrontier {
  ${exportData.gameLogic.battleSystem}
  
  ${exportData.gameLogic.pokemonSearch}
  
  ${exportData.gameLogic.trainerManagement}
  
  ${exportData.gameLogic.facilityRules}
  
  // Migration Guide:
  /*
  1. Import this script into Unity
  2. Create ScriptableObjects for data storage
  3. Set up Unity UI system following the exported UI structure
  4. Import assets from the assets list
  5. Implement Unity Authentication for user management
  6. Use Unity Cloud Save or your preferred backend for data persistence
  7. Convert React components to Unity UI prefabs
  8. Implement the navigation system using Unity's UI system
  */
}
    `;
  }
}

// Export instance for use in components
export const unityExporter = new UnityExporter();