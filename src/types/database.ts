export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          avatar_url: string | null
          role: string
          subscription_id: string | null
          settings_json: Json
          created_at: string
          updated_at: string
          last_login: string | null
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          role?: string
          subscription_id?: string | null
          settings_json?: Json
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          avatar_url?: string | null
          role?: string
          subscription_id?: string | null
          settings_json?: Json
          created_at?: string
          updated_at?: string
          last_login?: string | null
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          icon: string | null
          schedule_json: Json
          xp_value: number
          privacy_flag: string
          archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          icon?: string | null
          schedule_json?: Json
          xp_value?: number
          privacy_flag?: string
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          icon?: string | null
          schedule_json?: Json
          xp_value?: number
          privacy_flag?: string
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      completions: {
        Row: {
          id: string
          habit_id: string
          user_id: string
          timestamp: string
          source: string | null
          xp_awarded: number
          created_at: string
        }
        Insert: {
          id?: string
          habit_id: string
          user_id: string
          timestamp?: string
          source?: string | null
          xp_awarded?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['completions']['Insert']>
      }
      user_stats: {
        Row: {
          user_id: string
          xp_total: number
          level: number
          current_streak: number
          longest_streak: number
          last_completion_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          xp_total?: number
          level?: number
          current_streak?: number
          longest_streak?: number
          last_completion_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_stats']['Insert']>
      }
      badges: {
        Row: {
          id: string
          name: string
          criteria_json: Json
          icon_url: string | null
          rarity: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          criteria_json?: Json
          icon_url?: string | null
          rarity?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['badges']['Insert']>
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          awarded_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          awarded_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_badges']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          payload_json: Json
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          payload_json?: Json
          read?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
