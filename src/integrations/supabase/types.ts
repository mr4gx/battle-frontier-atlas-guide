export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      battle_requests: {
        Row: {
          battle_style: string
          created_at: string
          facility_id: string
          facility_name: string
          id: string
          notes: string | null
          opponent_id: string | null
          status: string
          time: string
          tokens_wagered: number
          trainer_avatar: string | null
          trainer_class: string
          trainer_id: string
          trainer_name: string
        }
        Insert: {
          battle_style: string
          created_at?: string
          facility_id: string
          facility_name: string
          id?: string
          notes?: string | null
          opponent_id?: string | null
          status?: string
          time: string
          tokens_wagered: number
          trainer_avatar?: string | null
          trainer_class: string
          trainer_id: string
          trainer_name: string
        }
        Update: {
          battle_style?: string
          created_at?: string
          facility_id?: string
          facility_name?: string
          id?: string
          notes?: string | null
          opponent_id?: string | null
          status?: string
          time?: string
          tokens_wagered?: number
          trainer_avatar?: string | null
          trainer_class?: string
          trainer_id?: string
          trainer_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "battle_requests_opponent_id_fkey"
            columns: ["opponent_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "battle_requests_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainers"
            referencedColumns: ["id"]
          },
        ]
      }
      discord_connections: {
        Row: {
          created_at: string
          discord_access_token: string
          discord_avatar: string | null
          discord_id: string
          discord_refresh_token: string
          discord_username: string
          id: string
          token_expires_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discord_access_token: string
          discord_avatar?: string | null
          discord_id: string
          discord_refresh_token: string
          discord_username: string
          id?: string
          token_expires_at: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discord_access_token?: string
          discord_avatar?: string | null
          discord_id?: string
          discord_refresh_token?: string
          discord_username?: string
          id?: string
          token_expires_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      discord_notifications: {
        Row: {
          badge_unlocks: boolean
          battle_challenges: boolean
          battle_results: boolean
          created_at: string
          id: string
          leaderboard_updates: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          badge_unlocks?: boolean
          battle_challenges?: boolean
          battle_results?: boolean
          created_at?: string
          id?: string
          leaderboard_updates?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          badge_unlocks?: boolean
          battle_challenges?: boolean
          battle_results?: boolean
          created_at?: string
          id?: string
          leaderboard_updates?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trainers: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          instagram_url: string | null
          losses: number
          name: string
          tokens: number
          trainer_class: string
          twitch_url: string | null
          twitter_url: string | null
          updated_at: string
          wins: number
          youtube_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          instagram_url?: string | null
          losses?: number
          name: string
          tokens?: number
          trainer_class?: string
          twitch_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          wins?: number
          youtube_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          instagram_url?: string | null
          losses?: number
          name?: string
          tokens?: number
          trainer_class?: string
          twitch_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          wins?: number
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
