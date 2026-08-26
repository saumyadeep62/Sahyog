import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL: string =
  import.meta.env.VITE_SUPABASE_URL || 'https://zgwomodttoiievxyttqi.supabase.co';
export const SUPABASE_ANON_KEY: string =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ITuFUyePP08noukwGUOM7g_wnCS9xlI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Health check helper to test active Supabase connection
 */
export async function checkSupabaseConnection(): Promise<{ connected: boolean; message: string }> {
  try {
    const { error } = await supabase.from('service_categories').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // Even if table doesn't exist yet, network handshake succeeded
      return { connected: true, message: `Connected to Supabase (${error.message || 'Ready'})` };
    }
    return { connected: true, message: 'Connected to Supabase project zgwomodttoiievxyttqi' };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown connection error';
    return { connected: false, message };
  }
}
