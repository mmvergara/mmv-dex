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
      peer_reviews: {
        Row: {
          id: number
          evaluation: Json
          reviewer: string
          reviewee: string
          inserted_at: string
        }
        Insert: {
          id?: never
          evaluation: Json
          reviewer: string
          reviewee: string
          inserted_at?: string
        }
        Update: {
          id?: never
          evaluation?: Json
          reviewer?: string
          reviewee?: string
          inserted_at?: string
        }
      }
      posts: {
        Row: {
          id: number
          author: string
          title: string
          description: string
          image_path: string
          img_is_compressed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: never
          author: string
          title: string
          description: string
          image_path: string
          img_is_compressed: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          author?: string
          title?: string
          description?: string
          image_path?: string
          img_is_compressed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          role: string
          inserted_at: string
        }
        Insert: {
          id: string
          email: string
          role: string
          inserted_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          inserted_at?: string
        }
      }
      test: {
        Row: {
          id: number
          data: Json | null
        }
        Insert: {
          id?: number
          data?: Json | null
        }
        Update: {
          id?: number
          data?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      employee_review_keyword_analysis: {
        Args: { pattern: string }
        Returns: unknown
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
