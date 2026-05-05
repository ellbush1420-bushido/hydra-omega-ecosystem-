// Global player state context — XP, faction, tiger rank, codex, scenario history

import React, { createContext, useContext, useReducer } from 'react';

const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];

function getLevel(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) level = i + 1;
    else break;
  }
  return Math.min(level, 10);
}

function xpToNextLevel(xp) {
  const level = getLevel(xp);
  if (level >= 10) return 0;
  return LEVEL_THRESHOLDS[level] - xp;
}

const initialState = {
  xp: 0,
  level: 1,
  xpToNext: 100,
  faction: null,
  tigerRank: null, // null | 'black_tiger_I' | 'black_tiger_II' | 'white_tiger_I' | 'white_tiger_II'
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
  const { faction, tigerRank, mockStats, level } = state;
  if (!faction) return null;
  if (tigerRank && tigerRank.startsWith('white_tiger')) {
    return '🐅 White Tiger Path — You are ready for the Hydra Founders Council.';
  }
  if (mockStats.revenue > 100) {
    return '💰 Commerce Eye Active — Focus on the Codex Vault Membership conversion path.';
  }
  if (mockStats.scaleScore > 30) {
    return '📡 Scale Score Elevated — Shadow Arena expansion recommended.';
  }
  if (level >= 5) {
    return '⬆️ Mid-Rank — Kingdom Raid campaigns are now available.';
  }
  return '🐍 Initiate Path — Complete Shadow Arena trials to unlock your next rank.';
}

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_FACTION':
      return { ...state, faction: action.faction };

    case 'ADD_XP': {
      const newXp = state.xp + action.amount;
      const newLevel = getLevel(newXp);
      const newState = {
        ...state,
        xp: newXp,
        level: newLevel,
        xpToNext: xpToNextLevel(newXp),
      };
      return { ...newState, hydraRecommendation: computeRecommendation(newState) };
    }

    case 'UNLOCK_CODEX':
      if (state.codexUnlocks.includes(action.codexId)) return state;
      return { ...state, codexUnlocks: [...state.codexUnlocks, action.codexId] };

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
