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
      users: {
        Row: {
          id: string
          clerk_user_id: string
          email: string
          name: string
          picture: string | null
          niche: string[]
          profile_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clerk_user_id: string
          email: string
          name: string
          picture?: string | null
          niche?: string[]
          profile_complete?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clerk_user_id?: string
          email?: string
          name?: string
          picture?: string | null
          niche?: string[]
          profile_complete?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          ai_model: string
          api_key: string | null
          system_prompt: string | null
          brand_kit: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ai_model?: string
          api_key?: string | null
          system_prompt?: string | null
          brand_kit?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ai_model?: string
          api_key?: string | null
          system_prompt?: string | null
          brand_kit?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      user_stats: {
        Row: {
          id: string
          user_id: string
          download_count: number
          carousel_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          download_count?: number
          carousel_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          download_count?: number
          carousel_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      carousels: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category: string
          preferences: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      slides: {
        Row: {
          id: string
          carousel_id: string
          slide_order: number
          headline: string
          body: string
          visual_prompt: string
          background_color: string | null
          font_color: string | null
          background_image: string | null
          background_opacity: number | null
          headline_style: Json | null
          body_style: Json | null
          headline_color: string | null
          body_color: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          carousel_id: string
          slide_order: number
          headline: string
          body: string
          visual_prompt: string
          background_color?: string | null
          font_color?: string | null
          background_image?: string | null
          background_opacity?: number | null
          headline_style?: Json | null
          body_style?: Json | null
          headline_color?: string | null
          body_color?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          carousel_id?: string
          slide_order?: number
          headline?: string
          body?: string
          visual_prompt?: string
          background_color?: string | null
          font_color?: string | null
          background_image?: string | null
          background_opacity?: number | null
          headline_style?: Json | null
          body_style?: Json | null
          headline_color?: string | null
          body_color?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}
