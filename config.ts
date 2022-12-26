if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("SUPABASE URL is not defined");
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("SUPABASE_ANON_KEY is not defined");

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
