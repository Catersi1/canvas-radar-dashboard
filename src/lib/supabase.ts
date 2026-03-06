import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Dashboard will use mock data if available.');
}

let supabaseClient;
try {
  supabaseClient = createClient(
    supabaseUrl || 'https://placeholder.supabase.co', 
    supabaseAnonKey || 'placeholder',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    }
  );
} catch (e) {
  console.error('Supabase init failed:', e);
  supabaseClient = {
    from: () => ({
      select: () => ({
        then: (cb: any) => cb({ data: [], error: new Error('Supabase not initialized') })
      })
    })
  } as any;
}

export const supabase = supabaseClient;
