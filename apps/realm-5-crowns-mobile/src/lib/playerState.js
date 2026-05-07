import * as SecureStore from 'expo-secure-store';
import factions from '../data/factions.json';
import { isSupabaseConfigured, supabase } from './supabase';

const DEVICE_ID_KEY = 'realm5crowns.device_id';
const DEFAULT_DISPLAY_NAME = 'Operative';

function createDeviceId() {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return `realm5c_${globalThis.crypto.randomUUID()}`;
  }

  return `realm5c_${Date.now()}_${Math.random().toString(36).slice(2)}${Math.random()
    .toString(36)
    .slice(2)}`;
}

async function getDeviceId() {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = createDeviceId();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

function normalizeRpcResponse(data) {
  if (Array.isArray(data)) return data[0] || null;
  return data || null;
}

export async function saveFactionSelection(factionId) {
  if (!isSupabaseConfigured || !supabase) return null;

  const deviceId = await getDeviceId();
  const { data, error } = await supabase.rpc('save_player_faction', {
    p_device_id: deviceId,
    p_display_name: DEFAULT_DISPLAY_NAME,
    p_faction_id: factionId,
  });

  if (error) {
    console.log('Error saving crown selection:', error);
    return null;
  }

  return normalizeRpcResponse(data);
}

export async function loadPlayerState() {
  if (!isSupabaseConfigured || !supabase) return null;

  const deviceId = await getDeviceId();
  const { data, error } = await supabase.rpc('get_player_by_device', {
    p_device_id: deviceId,
  });

  if (error) {
    console.log('Error loading player state:', error);
    return null;
  }

  return normalizeRpcResponse(data);
}

export function getFactionFromPlayerState(playerState) {
  if (!playerState?.faction_id) return null;
  return factions.find((faction) => faction.id === playerState.faction_id) || null;
}
