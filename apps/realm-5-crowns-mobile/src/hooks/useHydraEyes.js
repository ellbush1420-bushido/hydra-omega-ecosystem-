// Hydra Eyes event tracking hook
// Logs events locally and optionally sends to Supabase hydra_events table

import { useCallback, useSyncExternalStore } from 'react';

const SESSION_START = Date.now();
const MAX_EVENTS = 200;
const listeners = new Set();

let _supabase = null;
let hydraEventLog = [];

export function initSupabase(client) {
  _supabase = client;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return hydraEventLog;
}

function publish(event) {
  hydraEventLog = [event, ...hydraEventLog].slice(0, MAX_EVENTS);
  listeners.forEach((listener) => listener());
}

// Only schema-backed fields are normalized here; all other payload keys are preserved in `extra`
// so local UI state can stay rich without breaking Supabase inserts.
function normalizePayload(payload = {}) {
  const {
    player_id,
    faction_id,
    scenario_id,
    scenario_type,
    choice_id,
    codex_id,
    element,
    context,
    amount,
    xp,
    scale_score,
    mock,
    ...extra
  } = payload;

  const normalized = {
    player_id,
    faction_id,
    scenario_id,
    scenario_type,
    choice_id,
    codex_id,
    element,
    context,
    amount,
    xp,
    scale_score,
    mock,
  };

  const cleanExtra = Object.fromEntries(
    Object.entries(extra).filter(([, value]) => value !== undefined)
  );

  const remotePayload = Object.fromEntries(
    Object.entries(normalized).filter(([, value]) => value !== undefined)
  );

  if (Object.keys(cleanExtra).length > 0) {
    remotePayload.extra = cleanExtra;
  }

  return {
    localPayload: {
      ...remotePayload,
      ...cleanExtra,
    },
    remotePayload,
  };
}

export function useHydraEyes() {
  const eventLog = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const track = useCallback(async (eventType, payload = {}) => {
    const { localPayload, remotePayload } = normalizePayload(payload);
    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      event_type: eventType,
      session_ms: Date.now() - SESSION_START,
      ts: new Date().toISOString(),
      ...localPayload,
    };

    publish(event);

    // Send to Supabase when configured
    if (_supabase) {
      try {
        await _supabase.from('hydra_events').insert([
          {
            id: event.id,
            event_type: event.event_type,
            session_ms: event.session_ms,
            ts: event.ts,
            ...remotePayload,
          },
        ]);
      } catch (_err) {
        // Non-fatal — local log always succeeds
      }
    }
  }, []);

  const trackFactionSelect = useCallback(
    (factionId) => track('faction_select', { faction_id: factionId }),
    [track]
  );

  const trackScenarioStart = useCallback(
    (scenarioId, scenarioType) =>
      track('scenario_start', { scenario_id: scenarioId, scenario_type: scenarioType }),
    [track]
  );

  const trackScenarioChoice = useCallback(
    (scenarioId, choiceId, outcomeData) =>
      track('scenario_choice', { scenario_id: scenarioId, choice_id: choiceId, ...outcomeData }),
    [track]
  );

  const trackCodexUnlock = useCallback(
    (codexId) => track('codex_unlock', { codex_id: codexId }),
    [track]
  );

  const trackJoin = useCallback(
    () => track('join', { mock: true }),
    [track]
  );

  const trackSale = useCallback(
    (productName, amount) =>
      track('sale', { product: productName, amount, mock: true }),
    [track]
  );

  const trackXPGain = useCallback(
    (amount, source) => track('xp_gain', { amount, source }),
    [track]
  );

  const trackTigerPromotion = useCallback(
    (rank) => track('tiger_promotion', { rank }),
    [track]
  );

  const trackClick = useCallback(
    (element, context) => track('click', { element, context }),
    [track]
  );

  return {
    eventLog,
    track,
    trackFactionSelect,
    trackScenarioStart,
    trackScenarioChoice,
    trackCodexUnlock,
    trackJoin,
    trackSale,
    trackXPGain,
    trackTigerPromotion,
    trackClick,
  };
}
