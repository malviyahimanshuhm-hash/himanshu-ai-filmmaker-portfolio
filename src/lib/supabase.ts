import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Mock mode: when credentials aren't configured, use local data instead
export const isMockMode = !supabaseUrl || !supabaseAnonKey ||
  supabaseUrl === 'https://your-project.supabase.co' ||
  supabaseAnonKey === 'your-anon-key-here';

let supabaseClient: ReturnType<typeof createClient> | null = null;

if (!isMockMode) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    },
  });
}

export const getSupabase = () => {
  if (isMockMode) {
    throw new Error('Supabase not configured. Running in mock mode. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env');
  }
  return supabaseClient!;
};