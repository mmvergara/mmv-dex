import { posts, profiles } from "./db/db-types";

export interface postDetails {
  id: number;
  author: string;
  title: string;
  description: string;
  image_url: string;
  img_is_compressed: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    email: string;
  };
}

export interface evaluationRequiredRatingScores {
  score: number;
  comment: string;
}
export interface optional_rating {
  stood_out?: string;
}
export interface evaluationDefault {
  name: string;
  date: Date;
  required_rating: {
    presentation_score: evaluationRequiredRatingScores;
    technical_score: evaluationRequiredRatingScores;
    assists_peers_score: evaluationRequiredRatingScores;
    documentation_score: evaluationRequiredRatingScores;
  };
  optional_rating: optional_rating;
}
export interface evaluationNotParsed {
  name: string;
  date: Date;
  stood_out?: string;
  presentation_score_comment: evaluationRequiredRatingScores["comment"];
  presentation_score_rating: evaluationRequiredRatingScores["score"];

  technical_score_comment: evaluationRequiredRatingScores["comment"];
  technical_score_rating: evaluationRequiredRatingScores["score"];

  assists_peers_score_comment: evaluationRequiredRatingScores["comment"];
  assists_peers_score_rating: evaluationRequiredRatingScores["score"];

  documentation_score_comment: evaluationRequiredRatingScores["comment"];
  documentation_score_rating: evaluationRequiredRatingScores["score"];

  optional_rating_stood_out?: optional_rating["stood_out"];
}

export type dbPostDetails = posts & { profiles: profiles };
export type compressionMethod = "server" | "client";
export type uploadServer = "supabase" | "vercel";
