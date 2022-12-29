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
          called_by: string | null
          called_at: string
        }
        Insert: {
          id?: never
          api_path: string
          called_by?: string | null
          called_at?: string
        }
        Update: {
          id?: never
          api_path?: string
          called_by?: string | null
          called_at?: string
        }
      }
      posts: {
        Row: {
          id: number
          author: string
          title: string
          description: string
          img_is_compressed: boolean
          created_at: string
          updated_at: string
          image_url: string
        }
        Insert: {
          id?: never
          author: string
          title: string
          description: string
          img_is_compressed: boolean
          created_at?: string
          updated_at?: string
          image_url: string
        }
        Update: {
          id?: never
          author?: string
          title?: string
          description?: string
          img_is_compressed?: boolean
          created_at?: string
          updated_at?: string
          image_url?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          updated_at: string
          inserted_at: string
        }
        Insert: {
          id: string
          email: string
          updated_at?: string
          inserted_at?: string
        }
        Update: {
          id?: string
          email?: string
          updated_at?: string
          inserted_at?: string
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
