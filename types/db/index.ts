export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      api_calls: {
        Row: {
          id: number
          api_path: string
          called_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: number
          api_path: string
          called_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: number
          api_path?: string
          called_at?: string | null
          user_id?: string | null
        }
      }
      posts: {
        Row: {
          id: number
          title: string
          description: string
          image_url: string
          img_is_compressed: boolean
          created_at: string | null
          author: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          image_url: string
          img_is_compressed?: boolean
          created_at?: string | null
          author: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          image_url?: string
          img_is_compressed?: boolean
          created_at?: string | null
          author?: string
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
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
