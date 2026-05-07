import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import XPBar from '../components/XPBar';
import { useHydraEyes } from '../hooks/useHydraEyes';
import { getNextRealmId, usePlayer } from '../hooks/usePlayer';
import {
  damageProfileFor,
  difficultyFor,
  getEncounterPlayerMaxHp,
  getEncounterWardenMaxHp,
  getStatLabel,
  hasShadowCrownPerk,
  getTrialById,
  getTrialStatOptions,
} from '../data/realmGate';
import { isSupabaseConfigured, unlockCodexEntry, unlockRealmGate } from '../lib/supabase';

function randomDie() {
  return Math.floor(Math.random() * 10) + 1;
}

function HpBar({ label, hp, maxHp, color }) {
  const width = `${Math.max(0, (hp / maxHp) * 100)}%`;
  return (
    <View style={styles.hpBlock}>
      <View style={styles.hpHeader}>
        <Text style={styles.hpLabel}>{label}</Text>
        <Text style={styles.hpValue}>{hp}/{maxHp}</Text>
      </View>
      <View style={styles.hpTrack}>
        <View style={[styles.hpFill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

export default function ScenarioScreen({ route, navigation }) {
  const { trialId } = route.params;
  const { realm, trial } = getTrialById(trialId);
  const { state, dispatch } = usePlayer();
  const {
    trackScenarioStart,
    trackScenarioChoice,
    trackCodexUnlock,
    trackXPGain,
    trackClick,
  } = useHydraEyes();

  const panelOpacity = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState('INTRO');
  const [status, setStatus] = useState('Camera pans across the gate…');
  const playerMaxHp = getEncounterPlayerMaxHp(state.level);
  const maxWardenHp = useMemo(
    () => getEncounterWardenMaxHp(realm.realmNumber, trial.type),
    [realm.realmNumber, trial.type]
  );
  const [playerHp, setPlayerHp] = useState(playerMaxHp);
  const [wardenHp, setWardenHp] = useState(maxWardenHp);
  const [combatLog, setCombatLog] = useState([]);
  const [usedDeepFade, setUsedDeepFade] = useState(false);
  const [usedEchoStep, setUsedEchoStep] = useState(false);
  const [lastAction, setLastAction] = useState('Awaiting your choice.');
  const dc = difficultyFor(trial.type, realm.realmNumber);
  const damageProfile = damageProfileFor(trial.type, realm.realmNumber);
  const statOptions = getTrialStatOptions(trial.type);
  const rankAura = hasShadowCrownPerk(state.level, 'ascendant_aura');

  const recordCodexUnlock = (codexKey) => {
    if (!codexKey || state.codexUnlocks.includes(codexKey)) return;
    dispatch({ type: 'UNLOCK_CODEX', codexId: codexKey });
    trackCodexUnlock(codexKey);
    if (isSupabaseConfigured) {
      unlockCodexEntry(codexKey).catch(() => {});
    }
  };

  useEffect(() => {
    Animated.timing(panelOpacity, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    dispatch({ type: 'SYNC_REALM_ENTRY', realmId: realm.id });
    trackScenarioStart(trial.id, 'realm_gate');
    recordCodexUnlock(realm.introCodexKey);

    const introTimer = setTimeout(() => {
      setStatus('UI fades in. The encounter enters INTRO.');
    }, 500);
    const choiceTimer = setTimeout(() => {
      setPhase('PLAYER_CHOICE');
      setStatus('PLAYER_CHOICE — choose how the Crown answers.');
      setLastAction('The Warden is watching. Select a stat to prepare your move.');
    }, 1200);

    return () => {
      clearTimeout(introTimer);
      clearTimeout(choiceTimer);
    };
  }, []);

  const appendLog = (entry) => {
    setCombatLog((previous) => [
      { id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, text: entry },
      ...previous,
    ].slice(0, 6));
  };

  const buildResolutionSummary = ({ statKey, success, note }) => {
    if (success) {
      return `${getStatLabel(statKey)} succeeds at DC ${dc}. ${damageProfile.successDamage} damage dealt. ${note}`.trim();
    }

    const penaltyText = trial.type === 'void' ? '+1' : '';
    return `${getStatLabel(statKey)} fails at DC ${dc}. ${damageProfile.failureDamage}${penaltyText} damage taken. ${note}`.trim();
  };

  const finishEncounter = (result, summary) => {
    const historyEntry = {
      type: 'trial_result',
      scenarioId: trial.id,
      trialTitle: trial.title,
      realmId: realm.id,
      realmTitle: realm.title,
      outcome: result,
      summary,
    };

    dispatch({ type: 'LOG_SCENARIO', entry: historyEntry });

    if (result === 'victory') {
      dispatch({ type: 'ADD_XP', amount: trial.rewardXp });
      dispatch({
        type: 'ADD_MOCK_STATS',
        joins: 0,
        sales: 0,
        revenue: 0,
        scaleScore: realm.realmNumber + (trial.optional ? 1 : 2),
        clicks: 1,
      });
      trackXPGain(trial.rewardXp, trial.id);

      if (trial.victoryCodexKey) {
        recordCodexUnlock(trial.victoryCodexKey);
      }

      if (hasShadowCrownPerk(state.level, 'shadow_dominion')) {
        dispatch({ type: 'GRANT_VEIL_AUTOWIN', realmId: realm.id });
      }

      const realmAlreadyCleared = state.scenarioHistory.some(
        (entry) => entry.realmId === realm.id && entry.outcome === 'victory'
      );
      const nextRealmId = realmAlreadyCleared ? null : getNextRealmId(realm.id);
      if (nextRealmId) {
        dispatch({ type: 'UNLOCK_REALM', realmId: nextRealmId });
        if (isSupabaseConfigured) {
          unlockRealmGate(nextRealmId).catch(() => {});
        }
      }

      setPhase('VICTORY');
      setStatus('Victory — Warden falls, the gate yields, and the UI fades toward the next realm.');
    } else {
      setPhase('DEFEAT');
      setStatus('Defeat — the Crown bearer falls and the gate remains closed.');
    }

    setLastAction(summary);
    appendLog(summary);
  };

  const handleChoice = (statKey) => {
    if (phase !== 'PLAYER_CHOICE') return;

    setPhase('RESOLVING');
    setStatus('Prep animation plays — the Warden reacts as the roll resolves.');
    trackClick('encounter_choice', `${trial.id}:${statKey}`);

    setTimeout(() => {
      const statValue = state.shadowCrownStats[statKey] || 0;
      const firstRoll = randomDie();
      const secondRoll = randomDie();
      const hasDominionCharge = (state.shadowDominionCharges[realm.id] || 0) > 0;
      const autoSuccessFromDominion = statKey === 'veil' && hasDominionCharge;
      const useDeepFade =
        statKey === 'veil'
        && !autoSuccessFromDominion
        && hasShadowCrownPerk(state.level, 'deep_fade')
        && !usedDeepFade;
      const roll = useDeepFade ? Math.max(firstRoll, secondRoll) : firstRoll;
      const total = statValue + roll;
      let success = autoSuccessFromDominion;
      let resolutionNote = '';

      if (useDeepFade) {
        setUsedDeepFade(true);
        resolutionNote = `Deep Fade chooses ${Math.max(firstRoll, secondRoll)}.`;
      }

      if (!success) {
        success = total >= dc;
      }

      if (success && statKey === 'veil' && hasDominionCharge) {
        dispatch({ type: 'CONSUME_VEIL_AUTOWIN', realmId: realm.id });
        resolutionNote = 'Shadow Dominion spends a stored Veil auto-win.';
      }

      if (!success && statKey === 'veil' && hasShadowCrownPerk(state.level, 'echo_step') && !usedEchoStep) {
        success = true;
        setUsedEchoStep(true);
        resolutionNote = 'Echo Step erases the failed Veil test.';
      }

      let nextPlayerHp = playerHp;
      let nextWardenHp = wardenHp;
      if (success) {
        nextWardenHp = Math.max(0, wardenHp - damageProfile.successDamage);
        setWardenHp(nextWardenHp);
      } else {
        const bonusPenalty = trial.type === 'void' ? 1 : 0;
        nextPlayerHp = Math.max(0, playerHp - damageProfile.failureDamage - bonusPenalty);
        setPlayerHp(nextPlayerHp);
      }

      const summary = buildResolutionSummary({
        statKey,
        success,
        note: resolutionNote,
      });

      trackScenarioChoice(trial.id, statKey, {
        dc,
        realm_id: realm.id,
        stat: statKey,
        roll,
        total,
        success,
      });

      appendLog(summary);
      setLastAction(summary);

      if (success && nextWardenHp <= 0) {
        finishEncounter('victory', `${summary} The Gate Warden collapses.`);
        return;
      }

      if (!success && nextPlayerHp <= 0) {
        finishEncounter('defeat', `${summary} The Crown bearer can no longer stand.`);
        return;
      }

      setPhase('PLAYER_CHOICE');
      setStatus('HP bars update. The fight returns to PLAYER_CHOICE.');
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Animated.View style={[styles.panel, { opacity: panelOpacity }, rankAura && styles.panelAura]}>
          <Text style={styles.phaseLabel}>{phase}</Text>
          <Text style={styles.title}>{trial.title}</Text>
          <Text style={styles.realmTitle}>{realm.title}</Text>
          <Text style={styles.description}>{trial.description}</Text>
          <Text style={styles.status}>{status}</Text>
          {rankAura && state.shadowCrownIntroLine ? (
            <Text style={styles.introLine}>“{state.shadowCrownIntroLine}”</Text>
          ) : null}
        </Animated.View>

        <View style={styles.metaCard}>
          <Text style={styles.metaText}>Type: {trial.type.toUpperCase()} · DC {dc} · Reward +{trial.rewardXp} XP</Text>
          <Text style={styles.metaHint}>Flow: Intro → Player Choice → Resolve → HP Update → End Check</Text>
        </View>

        <XPBar />

        <View style={styles.statsGrid}>
          {Object.entries(state.shadowCrownStats).map(([stat, value]) => (
            <View key={stat} style={styles.statCard}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{getStatLabel(stat)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.hpCard}>
          <HpBar label="Crown Bearer" hp={playerHp} maxHp={playerMaxHp} color="#7c3aed" />
          <HpBar label="Gate Warden" hp={wardenHp} maxHp={maxWardenHp} color="#dc2626" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Choose your approach</Text>
          <View style={styles.choiceGrid}>
            {statOptions.map((statKey) => (
              <TouchableOpacity
                key={statKey}
                style={[styles.choiceButton, phase !== 'PLAYER_CHOICE' && styles.choiceButtonDisabled]}
                onPress={() => handleChoice(statKey)}
                disabled={phase !== 'PLAYER_CHOICE'}
              >
                <Text style={styles.choiceTitle}>Prep with {getStatLabel(statKey)}</Text>
                <Text style={styles.choiceMeta}>{state.shadowCrownStats[statKey]} + d10 vs {dc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Encounter log</Text>
          <View style={styles.logCard}>
            <Text style={styles.lastAction}>{lastAction}</Text>
            {combatLog.map((entry) => (
              <Text key={entry.id} style={styles.logEntry}>{entry.text}</Text>
            ))}
          </View>
        </View>

        <View style={styles.navRow}>
          <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.navBtnText}>← Back to Realm Gate</Text>
          </TouchableOpacity>
          {(phase === 'VICTORY' || phase === 'DEFEAT') && (
            <TouchableOpacity style={[styles.navBtn, styles.navBtnPrimary]} onPress={() => navigation.navigate('Profile')}>
              <Text style={[styles.navBtnText, styles.navBtnTextPrimary]}>View Profile →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { padding: 16, paddingBottom: 40 },
  panel: {
    backgroundColor: '#0d0d14',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
  },
  panelAura: {
    shadowColor: '#7c3aed',
    shadowOpacity: 0.35,
    shadowRadius: 18,
  },
  phaseLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: { color: '#e5e7eb', fontSize: 24, fontWeight: '800' },
  realmTitle: { color: '#a78bfa', fontSize: 13, marginTop: 6 },
  description: { color: '#9ca3af', fontSize: 13, lineHeight: 20, marginTop: 10 },
  status: { color: '#d1d5db', fontSize: 12, lineHeight: 18, marginTop: 10 },
  introLine: { color: '#c4b5fd', fontSize: 12, fontStyle: 'italic', marginTop: 10 },
  metaCard: {
    backgroundColor: '#11131b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginTop: 12,
  },
  metaText: { color: '#e5e7eb', fontSize: 12, fontWeight: '600' },
  metaHint: { color: '#6b7280', fontSize: 11, marginTop: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  statCard: {
    flexBasis: '23%',
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: { color: '#e5e7eb', fontSize: 20, fontWeight: '800' },
  statLabel: { color: '#6b7280', fontSize: 10, marginTop: 4 },
  hpCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginTop: 12,
    gap: 10,
  },
  hpBlock: { gap: 6 },
  hpHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  hpLabel: { color: '#d1d5db', fontSize: 12, fontWeight: '600' },
  hpValue: { color: '#6b7280', fontSize: 11 },
  hpTrack: { height: 8, borderRadius: 999, backgroundColor: '#1f2937', overflow: 'hidden' },
  hpFill: { height: '100%', borderRadius: 999 },
  section: { marginTop: 14 },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  choiceGrid: { gap: 8 },
  choiceButton: {
    backgroundColor: '#11131b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#312e81',
    padding: 14,
  },
  choiceButtonDisabled: { opacity: 0.55 },
  choiceTitle: { color: '#e5e7eb', fontSize: 14, fontWeight: '700' },
  choiceMeta: { color: '#a78bfa', fontSize: 11, marginTop: 4 },
  logCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    gap: 8,
  },
  lastAction: { color: '#d1d5db', fontSize: 12, lineHeight: 18 },
  logEntry: { color: '#6b7280', fontSize: 11, lineHeight: 17 },
  navRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  navBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
  },
  navBtnPrimary: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  navBtnText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
  },
  navBtnTextPrimary: {
    color: '#fff',
  },
});
