if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("SUPABASE URL is not defined");
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) throw new Error("SUPABASE_ANON_KEY is not defined");
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// on-demand ISR REVALIDATE TOKEN
// if(!process.env.NEXT_SECRET_REVALIDATE_TOKEN) throw new Error("SECRET_REVALIDATE_TOKEN is not defined")
// export const SECRET_REVALIDATE_TOKEN = process.env.NEXT_SECRET_REVALIDATE_TOKEN
