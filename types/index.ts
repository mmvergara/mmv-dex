import { posts, profiles } from "./db/db-types";

export interface postDetails {
  id: number;
  title: string;
  description: string;
  image_url: string;
  author: string;
}

export type dbPostDetails = posts & { profiles: profiles };

export type compressionMethod = "server" | "client"
export type uploadServer = "supabase" | "vercel"