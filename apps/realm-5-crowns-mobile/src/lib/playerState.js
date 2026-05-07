import * as SecureStore from 'expo-secure-store';

import { getRealmById, getTrialById } from '../data/realms';
import factions from '../data/factions.json';
import { getSupabase, hasSupabaseConfig } from './supabase';

const PLAYER_ID_KEY = 'realm5crowns.player_id';

function makePlayerId() {
  return `player_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export async function getOrCreatePlayerId() {
  try {
    const existing = await SecureStore.getItemAsync(PLAYER_ID_KEY);
    if (existing) return existing;

    const playerId = makePlayerId();
    await SecureStore.setItemAsync(PLAYER_ID_KEY, playerId);
    return playerId;
  } catch (error) {
    console.warn('SecureStore player ID initialization failed.', error);
    throw new Error('Unable to create or read the local player ID.');
  }
}

export async function loadPlayerState(playerId) {
  const supabase = getSupabase();

  if (!supabase) {
    return {
      data: null,
      status: hasSupabaseConfig() ? 'error' : 'offline',
      message: hasSupabaseConfig() ? 'Supabase unavailable.' : 'Supabase not configured.',
    };
  }

  const { data, error } = await supabase
    .from('player_state')
    .select('player_id, crown_id, realm_id, trial_id, updated_at')
    .eq('player_id', playerId)
    .maybeSingle();

  if (error) {
    return {
      data: null,
      status: 'error',
      message: error.message,
    };
  }

  return {
    data,
    status: data ? 'synced' : 'idle',
    message: data ? 'Selection state loaded from Supabase.' : 'Selection state ready to sync.',
  };
}

export async function savePlayerState({ playerId, crownId, realmId, trialId }) {
  const supabase = getSupabase();

  if (!supabase) {
    return {
      status: hasSupabaseConfig() ? 'error' : 'offline',
      message: hasSupabaseConfig() ? 'Supabase unavailable.' : 'Supabase not configured.',
    };
  }

  const payload = {
    player_id: playerId,
    crown_id: crownId ?? null,
    realm_id: realmId ?? null,
    trial_id: trialId ?? null,
  };

  const { error } = await supabase.from('player_state').upsert(payload, {
    onConflict: 'player_id',
  });

  if (error) {
    return {
      status: 'error',
      message: error.message,
    };
  }

  return {
    status: 'synced',
    message: 'Selection state synced to Supabase.',
  };
}

export function mapRemoteStateToSelection(remoteState) {
  if (!remoteState) return {};

  const faction = factions.find((entry) => entry.crownId === remoteState.crown_id) || null;
  const selectedTrial = getTrialById(remoteState.trial_id);
  const selectedRealm = getRealmById(remoteState.realm_id) || getRealmById(selectedTrial?.realmId);

  return {
    crownId: remoteState.crown_id ?? null,
    faction,
    realmId: remoteState.realm_id ?? selectedRealm?.id ?? null,
    selectedRealm,
    trialId: remoteState.trial_id ?? selectedTrial?.trialId ?? null,
    selectedTrial,
  };
}
