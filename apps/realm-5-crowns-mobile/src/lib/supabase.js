import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import codexEntries from '../data/codexEntries';

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
  const deepestRealmId = state.realmUnlocks?.[state.realmUnlocks.length - 1];
  if (!deepestRealmId) return 'Obsidian Gate';
  return toTitle(deepestRealmId);
}

function getTrialLabel(state) {
  const mostRecentScenario = state.scenarioHistory.find((entry) => entry.trialTitle || entry.scenarioId);
  if (mostRecentScenario?.trialTitle) return mostRecentScenario.trialTitle;
  if (mostRecentScenario?.scenarioId) return toTitle(mostRecentScenario.scenarioId);
  if (state.faction) return 'Crown Selection';
  return 'Awakening';
}

function normalizeCodexKey(codexKey) {
  return codexKey.toLowerCase().replace(/[.\s]+/g, '_');
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
    tiger_rank: state.tigerRank || null,
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
  if (!supabase || !codexKey) return null;

  const deviceId = await getPlayerStateDeviceId();
  const payload = {
    player_id: deviceId,
    codex_key: codexKey,
  };

  const { error } = await supabase.from('codex_unlocks').upsert(payload, {
    onConflict: 'player_id,codex_key',
  });

  if (error) {
    if (__DEV__) {
      console.info('Supabase codex unlock skipped', { codexKey, message: error.message });
    }
    return null;
  }

  return payload;
}

export async function fetchCodexCatalog(localUnlocks = []) {
  const normalizedLocalUnlocks = new Set(localUnlocks.map(normalizeCodexKey));

  if (!supabase) {
    return codexEntries.map((entry) => ({
      ...entry,
      unlocked: normalizedLocalUnlocks.has(normalizeCodexKey(entry.key)),
    }));
  }

  const deviceId = await getPlayerStateDeviceId();
  const [{ data: entryRows, error: entriesError }, { data: unlockRows, error: unlockError }] =
    await Promise.all([
      supabase.from('codex_entries').select('key, title, body, unlock_condition').order('title'),
      supabase.from('codex_unlocks').select('codex_key').eq('player_id', deviceId),
    ]);

  const sourceEntries =
    !entriesError && Array.isArray(entryRows) && entryRows.length > 0
      ? entryRows.map((entry) => ({
          key: entry.key,
          title: entry.title,
          body: entry.body,
          unlockCondition: entry.unlock_condition,
        }))
      : codexEntries;

  const remoteUnlocks =
    unlockError || !unlockRows
      ? []
      : unlockRows.map((entry) => normalizeCodexKey(entry.codex_key));

  const unlocks = new Set([...normalizedLocalUnlocks, ...remoteUnlocks]);

  return sourceEntries.map((entry) => ({
    ...entry,
    unlocked: unlocks.has(normalizeCodexKey(entry.key)),
  }));
}
