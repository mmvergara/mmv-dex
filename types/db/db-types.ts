import { Database } from "./db-generated-types";

export type DatabaseTypes = Database;
export type DBTables = Database["public"]["Tables"];

export type posts = DBTables["posts"]["Row"];
export type profiles = DBTables["profiles"]["Row"];
export type api_calls = DBTables["api_calls"]["Row"];
export type peer_reviews = DBTables['peer_reviews']['Row']
