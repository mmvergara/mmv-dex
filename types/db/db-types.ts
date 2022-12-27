import { Database } from "./db-generated-types";

export type DatabaseTypes = Database;
export type DBTables = Database["public"]["Tables"];
// export type api_calls = DBTables["api_calls"]["Row"];
export type posts = DBTables["posts"]["Row"];
export type profiles = DBTables["profiles"]["Row"];


