// Hydra Eyes event tracking hook
// Logs events locally and optionally sends to Supabase hydra_events table

import { useState, useCallback } from 'react';

const SESSION_START = Date.now();

let _supabase = null;

export function initSupabase(client) {
  _supabase = client;
}

export function useHydraEyes() {
  const [eventLog, setEventLog] = useState([]);

  const track = useCallback(async (eventType, payload = {}) => {
    const {
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

    const event = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      event_type: eventType,
      session_ms: Date.now() - SESSION_START,
      ts: new Date().toISOString(),
      ...(faction_id !== undefined ? { faction_id } : {}),
      ...(scenario_id !== undefined ? { scenario_id } : {}),
      ...(scenario_type !== undefined ? { scenario_type } : {}),
      ...(choice_id !== undefined ? { choice_id } : {}),
      ...(codex_id !== undefined ? { codex_id } : {}),
      ...(element !== undefined ? { element } : {}),
      ...(context !== undefined ? { context } : {}),
      ...(amount !== undefined ? { amount } : {}),
      ...(xp !== undefined ? { xp } : {}),
      ...(scale_score !== undefined ? { scale_score } : {}),
      ...(mock !== undefined ? { mock } : {}),
      ...(Object.keys(extra).length > 0 ? { extra } : {}),
    };

    setEventLog((prev) => [event, ...prev].slice(0, 200));

    // Send to Supabase when configured
    if (_supabase) {
      try {
        await _supabase.from('hydra_events').insert([event]);
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
      track('scenario_choice', {
        scenario_id: scenarioId,
        choice_id: choiceId,
        xp: outcomeData.xp,
        scale_score: outcomeData.scaleScore,
        amount: outcomeData.mockRevenue,
        mockJoins: outcomeData.mockJoins,
        mockSales: outcomeData.mockSales,
      }),
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
      track('sale', { context: productName, amount, mock: true }),
    [track]
  );

  const trackXPGain = useCallback(
    (amount, source) => track('xp_gain', { xp: amount, context: source }),
    [track]
  );

  const trackTigerPromotion = useCallback(
    (rank) => track('tiger_promotion', { context: rank }),
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
