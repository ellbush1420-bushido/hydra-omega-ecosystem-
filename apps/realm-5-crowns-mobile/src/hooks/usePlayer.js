import React, { createContext, useContext, useReducer } from 'react';

import {
  FACTION_CODEX_KEYS,
  REALM_PROGRESSIONS,
  SHADOW_CROWN_THRESHOLDS,
  getNextRealm,
  getRealmById,
  getShadowCrownMilestone,
  getShadowCrownRank,
} from '../data/realmGate';

function getLevel(xp) {
  return getShadowCrownRank(xp);
}

function xpToNextLevel(xp) {
  const rank = getLevel(xp);
  if (rank >= 10) return 0;
  return SHADOW_CROWN_THRESHOLDS[rank] - xp;
}

function getDerivedShadowState(xp) {
  const level = getLevel(xp);
  const milestone = getShadowCrownMilestone(level);
  return {
    level,
    xpToNext: xpToNextLevel(xp),
    shadowCrownStats: milestone.stats,
    shadowCrownPerk: milestone.perk,
    shadowCrownIntroLine: milestone.introLine || '',
  };
}

const initialDerived = getDerivedShadowState(0);

const initialRankCodex = getShadowCrownMilestone(initialDerived.level).unlockCodexKey;

const initialState = {
  xp: 0,
  level: initialDerived.level,
  xpToNext: initialDerived.xpToNext,
  faction: null,
  codexUnlocks: initialRankCodex ? [initialRankCodex] : [],
  scenarioHistory: [],
  mockStats: {
    joins: 0,
    sales: 0,
    revenue: 0,
    scaleScore: 0,
    clicks: 0,
  },
  hydraRecommendation: 'Enter the Obsidian Gate to claim the first Crown threshold.',
  realmUnlocks: [REALM_PROGRESSIONS[0].id],
  currentRealmId: REALM_PROGRESSIONS[0].id,
  shadowCrownStats: initialDerived.shadowCrownStats,
  shadowCrownPerk: initialDerived.shadowCrownPerk,
  shadowCrownIntroLine: initialDerived.shadowCrownIntroLine,
  shadowDominionCharges: {},
};

function computeRecommendation(state) {
  const realm = getRealmById(state.currentRealmId);
  if (!state.faction) return 'Choose a Crown to begin shaping the Shadow Crown path.';
  if (state.level >= 10) return 'Ascendant Crown — return to Azure Spire and hold the final threshold.';
  if (state.realmUnlocks.includes('azure_spire')) return 'Azure Spire unlocked — only the Ascension Encounter remains.';
  if (state.level >= 9) return 'Shadow Dominion online — store Veil victories inside the active realm.';
  if (state.level >= 7) return 'Echo Step is active — failed Veil tests can bend once per encounter.';
  return `Advance through ${realm.title} to push the Shadow Crown beyond Rank ${state.level}.`;
}

function unlockCodex(state, codexId) {
  if (!codexId || state.codexUnlocks.includes(codexId)) return state;
  return { ...state, codexUnlocks: [...state.codexUnlocks, codexId] };
}

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_FACTION': {
      const nextState = { ...state, faction: action.faction };
      return {
        ...nextState,
        hydraRecommendation: computeRecommendation(nextState),
      };
    }

    case 'ADD_XP': {
      const newXp = state.xp + action.amount;
      const derived = getDerivedShadowState(newXp);
      let newState = {
        ...state,
        xp: newXp,
        ...derived,
      };

      const milestoneCodex = getShadowCrownMilestone(derived.level).unlockCodexKey;
      if (milestoneCodex) {
        newState = unlockCodex(newState, milestoneCodex);
      }

      return {
        ...newState,
        hydraRecommendation: computeRecommendation(newState),
      };
    }

    case 'UNLOCK_CODEX': {
      const nextState = unlockCodex(state, action.codexId);
      return nextState === state
        ? state
        : { ...nextState, hydraRecommendation: computeRecommendation(nextState) };
    }


    case 'LOG_SCENARIO':
      return {
        ...state,
        scenarioHistory: [
          { ...action.entry, ts: new Date().toISOString() },
          ...state.scenarioHistory,
        ].slice(0, 80),
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

    case 'UNLOCK_REALM': {
      if (!action.realmId || state.realmUnlocks.includes(action.realmId)) return state;
      const nextState = {
        ...state,
        realmUnlocks: [...state.realmUnlocks, action.realmId],
      };
      return { ...nextState, hydraRecommendation: computeRecommendation(nextState) };
    }

    case 'SET_CURRENT_REALM': {
      const nextState = { ...state, currentRealmId: action.realmId || state.currentRealmId };
      return { ...nextState, hydraRecommendation: computeRecommendation(nextState) };
    }

    case 'GRANT_VEIL_AUTOWIN': {
      if (!action.realmId) return state;
      const current = state.shadowDominionCharges[action.realmId] || 0;
      const nextState = {
        ...state,
        shadowDominionCharges: {
          ...state.shadowDominionCharges,
          [action.realmId]: current + 1,
        },
      };
      return { ...nextState, hydraRecommendation: computeRecommendation(nextState) };
    }

    case 'CONSUME_VEIL_AUTOWIN': {
      if (!action.realmId) return state;
      const current = state.shadowDominionCharges[action.realmId] || 0;
      if (current <= 0) return state;
      const nextState = {
        ...state,
        shadowDominionCharges: {
          ...state.shadowDominionCharges,
          [action.realmId]: current - 1,
        },
      };
      return { ...nextState, hydraRecommendation: computeRecommendation(nextState) };
    }

    case 'SYNC_REALM_ENTRY': {
      const nextState = {
        ...state,
        currentRealmId: action.realmId || state.currentRealmId,
      };
      return { ...nextState, hydraRecommendation: computeRecommendation(nextState) };
    }

    default:
      return state;
  }
}

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  return <PlayerContext.Provider value={{ state, dispatch }}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export function getFactionCodexKey(factionId) {
  return FACTION_CODEX_KEYS[factionId] || null;
}

export function getNextRealmId(realmId) {
  return getNextRealm(realmId)?.id || null;
}
