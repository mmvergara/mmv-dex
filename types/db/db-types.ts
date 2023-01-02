import { Database } from "./db-generated-types";

export type DatabaseTypes = Database;

export type DBTables = Database["public"]["Tables"];
export type posts = DBTables["posts"]["Row"];
export type profiles = DBTables["profiles"]["Row"];
export type api_calls = DBTables["api_calls"]["Row"];
export type peer_reviews = DBTables["peer_reviews"]["Row"];


export type peer_review_formik = {
  name: string;
  date: string;
  presentation_rating_score: number;
  presentation_rating_comment: string;
  technical_rating_score: number;
  technical_rating_comment: string;
  assists_peers_rating_score: number;
  assists_peers_rating_comment: string;
  documentation_rating_score: number;
  documentation_rating_comment: string;
  optional_rating_stood_out: string;
};

export type peer_review_evaluation = {
  name: string;
  date: string;
  required_rating: {
    presentation_score: { score: number; comment: string };
    technical_score: { score: number; comment: string };
    assists_peers_score: { score: number; comment: string };
    documentation_score: { score: number; comment: string };
  };
  optional_rating: {
    stood_out: string;
  };
};
