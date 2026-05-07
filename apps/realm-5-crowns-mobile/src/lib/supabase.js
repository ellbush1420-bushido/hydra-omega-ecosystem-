import Constants from 'expo-constants';
import { createClient } from '@supabase/supabase-js';

import { initSupabase as initHydraEyesSupabase } from '../hooks/useHydraEyes';

let supabaseClient;

export function getSupabaseConfig() {
  const extra = Constants.expoConfig?.extra || {};
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL || extra.supabaseUrl || '';
  const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || extra.supabaseAnonKey || '';

  return {
    url: url.trim(),
    anonKey: anonKey.trim(),
  };
}

export function hasSupabaseConfig() {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

export function getSupabase() {
  if (supabaseClient !== undefined) return supabaseClient;

  if (!hasSupabaseConfig()) {
    supabaseClient = null;
    return supabaseClient;
  }

  const { url, anonKey } = getSupabaseConfig();

  supabaseClient = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  initHydraEyesSupabase(supabaseClient);

  return supabaseClient;
}
