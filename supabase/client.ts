import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config';
import { DatabaseTypes } from '../types/db/db-types';

export const supabaseClient = createClient<DatabaseTypes>(SUPABASE_URL, SUPABASE_ANON_KEY);
