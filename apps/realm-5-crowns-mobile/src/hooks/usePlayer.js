// Global player state context — XP, Crown rank, realm unlocks, codex, scenario history

import React, { createContext, useContext, useReducer } from 'react';
import {
  getShadowCrownRank,
  getShadowCrownState,
  xpToNextShadowRank,
} from '../lib/shadowCrown';
import { normalizeCodexKey } from '../lib/codex';

const DEFAULT_REALM_UNLOCKS = ['obsidian_gate'];

const initialState = {
  xp: 0,
  level: 1,
  xpToNext: 50,
  faction: null,
  tigerRank: null, // null | 'black_tiger_I' | 'black_tiger_II' | 'white_tiger_I' | 'white_tiger_II'
  realmUnlocks: DEFAULT_REALM_UNLOCKS,
  codexUnlocks: [],
  scenarioHistory: [],
  mockStats: {
    joins: 0,
    sales: 0,
    revenue: 0,
    scaleScore: 0,
    clicks: 0,
  },
  hydraRecommendation: null,
};

function computeRecommendation(state) {
  const { faction, mockStats, level, realmUnlocks } = state;
  if (!faction) return null;
  if (realmUnlocks.includes('azure_spire')) {
    return '🜁 Azure Spire open — Prepare for the Ascension Encounter.';
  }
  if (level >= 9) {
    return '👑 Shadow Dominion stirs — Use Veil trials to secure your ascent.';
  }
  if (realmUnlocks.includes('crimson_wilds')) {
    return '🩸 Crimson Wilds unlocked — Steel and Void trials now hit harder.';
  }
  if (level >= 5) {
    return '🌒 Deep Fade awakened — Your Shadow Crown now bends Veil in your favor.';
  }
  if (mockStats.scaleScore > 20) {
    return '📡 Trial momentum rising — Push deeper into the next unlocked Realm.';
  }
  return '🚪 Initiate Path — Clear Obsidian Gate to open the Golden Arena.';
}

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_FACTION':
      return { ...state, faction: action.faction };

    case 'ADD_XP': {
      const newXp = state.xp + action.amount;
      const newLevel = getShadowCrownRank(newXp);
      const newState = {
        ...state,
        xp: newXp,
        level: newLevel,
        xpToNext: xpToNextShadowRank(newXp),
      };
      return { ...newState, hydraRecommendation: computeRecommendation(newState) };
    }

    case 'UNLOCK_CODEX': {
      const codexId = normalizeCodexKey(action.codexId);
      if (!codexId || state.codexUnlocks.includes(codexId)) return state;
      return { ...state, codexUnlocks: [...state.codexUnlocks, codexId] };
    }

    case 'UNLOCK_REALM': {
      if (!action.realmId || state.realmUnlocks.includes(action.realmId)) return state;
      const newState = { ...state, realmUnlocks: [...state.realmUnlocks, action.realmId] };
      return { ...newState, hydraRecommendation: computeRecommendation(newState) };
    }

    case 'PROMOTE_TIGER': {
      const newState = { ...state, tigerRank: action.rank };
      return { ...newState, hydraRecommendation: computeRecommendation(newState) };
    }

    case 'LOG_SCENARIO':
      return {
        ...state,
        scenarioHistory: [
          { ...action.entry, ts: new Date().toISOString() },
          ...state.scenarioHistory,
        ].slice(0, 50),
      };

    case 'ADD_MOCK_STATS': {
      const newStats = {
        joins: state.mockStats.joins + (action.joins || 0),
        sales: state.mockStats.sales + (action.sales || 0),
        revenue: state.mockStats.revenue + (action.revenue || 0),
        scaleScore: state.mockStats.scaleScore + (action.scaleScore || 0),
        clicks: state.mockStats.clicks + (action.clicks || 0),
      };
      const newState = { ...state, mockStats: newStats };
      return { ...newState, hydraRecommendation: computeRecommendation(newState) };
    }

    default:
      return state;
  }
}

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  return (
    <PlayerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export function getPlayerShadowCrown(state) {
  return getShadowCrownState(state.level);
}
