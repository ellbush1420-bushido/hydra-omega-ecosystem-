import * as SecureStore from 'expo-secure-store';
import factions from '../data/factions.json';
import { isSupabaseConfigured, supabase } from './supabase';

const PLAYER_ID_KEY = 'realm5crowns.player_id';
const DEFAULT_DISPLAY_NAME = 'Operative';

async function getPlayerId() {
  return SecureStore.getItemAsync(PLAYER_ID_KEY);
}

async function setPlayerId(playerId) {
  if (!playerId) return;
  await SecureStore.setItemAsync(PLAYER_ID_KEY, playerId);
}

function normalizeRpcResponse(data) {
  if (Array.isArray(data)) return data[0] || null;
  return data || null;
}

export async function saveFactionSelection(factionId) {
  if (!isSupabaseConfigured || !supabase) return null;

  const playerId = await getPlayerId();
  const { data, error } = await supabase.rpc('save_player_faction', {
    p_player_id: playerId,
    p_display_name: DEFAULT_DISPLAY_NAME,
    p_faction_id: factionId,
  });

  if (error) {
    console.error('Error saving faction selection:', error);
    return null;
  }

  const playerState = normalizeRpcResponse(data);

  if (playerState?.id) {
    await setPlayerId(playerState.id);
  }

  return playerState;
}

export async function loadPlayerState() {
  if (!isSupabaseConfigured || !supabase) return null;

  const playerId = await getPlayerId();

  if (!playerId) return null;

  const { data, error } = await supabase.rpc('get_player_by_id', {
    p_player_id: playerId,
  });

  if (error) {
    console.error('Error loading player state:', error);
    return null;
  }

  return normalizeRpcResponse(data);
}

export function getFactionFromPlayerState(playerState) {
  if (!playerState?.faction_id) return null;
  return factions.find((faction) => faction.id === playerState.faction_id) || null;
}
