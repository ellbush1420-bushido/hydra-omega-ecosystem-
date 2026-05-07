import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

import { LOCAL_CODEX_ENTRIES, getRealmById } from '../data/realmGate';

const DEVICE_ID_KEY = 'realm5crowns.deviceId';
let memoryDeviceId = '';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || Constants.expoConfig?.extra?.supabaseAnonKey || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

function logPlayerState(event, payload) {
  if (__DEV__) {
    console.info(event, payload);
  }
}

function toTitle(value) {
  if (!value) return 'Awakening';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRealmLabel(state) {
  const realm = getRealmById(state.currentRealmId);
  return realm?.title?.replace(/^Realm \d+:\s*/, '') || 'Unclaimed Threshold';
}

function getTrialLabel(state) {
  const mostRecentScenario = state.scenarioHistory.filter((entry) => entry.scenarioId)[0];
  if (mostRecentScenario?.trialTitle) return mostRecentScenario.trialTitle;
  if (mostRecentScenario?.scenarioId) return toTitle(mostRecentScenario.scenarioId);
  if (state.faction) return 'Crown Selection';
  return 'Awakening';
}

async function readStoredDeviceId() {
  try {
    if (Platform.OS === 'web' && globalThis.localStorage) {
      return globalThis.localStorage.getItem(DEVICE_ID_KEY) || '';
    }
    return (await SecureStore.getItemAsync(DEVICE_ID_KEY)) || '';
  } catch (_error) {
    return memoryDeviceId;
  }
}

async function writeStoredDeviceId(deviceId) {
  memoryDeviceId = deviceId;

  try {
    if (Platform.OS === 'web' && globalThis.localStorage) {
      globalThis.localStorage.setItem(DEVICE_ID_KEY, deviceId);
      return;
    }
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  } catch (_error) {
    // Fall back to in-memory storage when secure persistence is unavailable.
  }
}

export async function getPlayerStateDeviceId() {
  let deviceId = await readStoredDeviceId();
  if (!deviceId) {
    deviceId = `realm5_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    await writeStoredDeviceId(deviceId);
  }
  return deviceId;
}

export function buildPlayerStatePayload(state) {
  return {
    crown: state.faction?.shortName || 'Unbound',
    realm: getRealmLabel(state),
    trial: getTrialLabel(state),
    faction_id: state.faction?.id || null,
    tiger_rank: `shadow_crown_${state.level}`,
    level: state.level,
    xp: state.xp,
  };
}

export async function fetchPlayerState() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const deviceId = await getPlayerStateDeviceId();
  const { data, error } = await supabase
    .from('player_state')
    .select('*')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (error) throw error;

  logPlayerState('Supabase player_state fetch', { deviceId, hasData: Boolean(data) });

  return { deviceId, data };
}

export async function savePlayerState(state) {
  if (!supabase) throw new Error('Supabase is not configured.');

  const deviceId = await getPlayerStateDeviceId();
  const payload = {
    device_id: deviceId,
    ...buildPlayerStatePayload(state),
  };

  const { data: existing, error: existingError } = await supabase
    .from('player_state')
    .select('id')
    .eq('device_id', deviceId)
    .maybeSingle();

  if (existingError) throw existingError;

  const query = existing
    ? supabase.from('player_state').update(payload).eq('id', existing.id)
    : supabase.from('player_state').insert(payload);

  const { data, error } = await query.select().single();

  if (error) throw error;

  logPlayerState('Supabase player_state write', { deviceId, hasData: Boolean(data) });

  return { deviceId, data };
}

export async function unlockCodexEntry(codexKey) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const playerId = await getPlayerStateDeviceId();
  const { error } = await supabase.from('codex_unlocks').upsert(
    {
      player_id: playerId,
      codex_key: codexKey,
    },
    {
      onConflict: 'player_id,codex_key',
    }
  );

  if (error) throw error;
  return { playerId, codexKey };
}

export async function unlockRealmGate(realmKey) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const playerId = await getPlayerStateDeviceId();
  const { error } = await supabase.from('realm_unlocks').upsert(
    {
      player_id: playerId,
      realm_key: realmKey,
    },
    {
      onConflict: 'player_id,realm_key',
    }
  );

  if (error) throw error;
  return { playerId, realmKey };
}

export async function fetchCodexCatalogForPlayer() {
  if (!supabase) throw new Error('Supabase is not configured.');

  const playerId = await getPlayerStateDeviceId();
  const [{ data: entries, error: entriesError }, { data: unlocks, error: unlocksError }] =
    await Promise.all([
      supabase.from('codex_entries').select('*').order('title'),
      supabase.from('codex_unlocks').select('codex_key').eq('player_id', playerId),
    ]);

  if (entriesError) throw entriesError;
  if (unlocksError) throw unlocksError;

  return {
    playerId,
    entries: entries?.length ? entries : LOCAL_CODEX_ENTRIES,
    unlocks: unlocks || [],
  };
}
