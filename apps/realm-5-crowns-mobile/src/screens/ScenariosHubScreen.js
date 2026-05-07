import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { usePlayer } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';
import XPBar from '../components/XPBar';
import TigerRankBadge from '../components/TigerRankBadge';
import { REALM_PROGRESSIONS, TRIAL_TYPE_RULES, difficultyFor } from '../data/realmGate';

export default function ScenariosHubScreen({ navigation }) {
  const { state, dispatch } = usePlayer();
  const { trackClick } = useHydraEyes();

  const completedTrialIds = new Set(
    state.scenarioHistory.filter((entry) => entry.type === 'trial_result' && entry.outcome === 'victory').map((entry) => entry.scenarioId)
  );

  const handleScenario = (realm, trial) => {
    trackClick('realm_gate_trial', trial.id);
    dispatch({ type: 'SET_CURRENT_REALM', realmId: realm.id });
    navigation.navigate('Scenario', {
      realmId: realm.id,
      trialId: trial.id,
      trialTitle: trial.title,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — LABYRINTH EYE</Text>
        <Text style={styles.title}>Realm Gate Progression</Text>
        <Text style={styles.subtitle}>
          Victory in each realm unlocks the next gate. Optional trials sharpen the Crown but only one win is needed to advance.
        </Text>

        {state.faction && (
          <View style={styles.factionBadge}>
            <Text style={styles.factionText}>
              {state.faction.emoji} {state.faction.shortName} · Rank {state.level}
            </Text>
          </View>
        )}

        <XPBar />
        <TigerRankBadge compact />

        {REALM_PROGRESSIONS.map((realm) => {
          const unlocked = state.realmUnlocks.includes(realm.id);
          const active = realm.id === state.currentRealmId;
          return (
            <View key={realm.id} style={[styles.realmSection, active && styles.realmSectionActive]}>
              <View style={styles.realmHeader}>
                <View style={[styles.realmStatus, unlocked ? styles.realmUnlocked : styles.realmLocked]} />
                <View style={styles.realmHeaderBody}>
                  <Text style={styles.realmName}>{realm.title}</Text>
                  <Text style={styles.realmDesc}>{realm.summary}</Text>
                  <Text style={styles.realmMeta}>{unlocked ? 'Unlocked' : 'Locked'} · Unlocks next realm on first victory</Text>
                </View>
              </View>

              {realm.trials.map((trial) => {
                const done = completedTrialIds.has(trial.id);
                const rules = TRIAL_TYPE_RULES[trial.type] || TRIAL_TYPE_RULES.steel;
                const dc = difficultyFor(trial.type, realm.realmNumber);
                return (
                  <TouchableOpacity
                    key={trial.id}
                    style={[
                      styles.scenarioCard,
                      done && styles.scenarioDone,
                      !unlocked && styles.scenarioLocked,
                    ]}
                    onPress={() => unlocked && handleScenario(realm, trial)}
                    activeOpacity={0.85}
                    disabled={!unlocked}
                  >
                    <View style={styles.scenarioRow}>
                      <Text style={styles.scenarioTitle}>{trial.title}</Text>
                      <Text style={styles.doneBadge}>{done ? '✓ Cleared' : trial.optional ? 'Optional' : 'Core'}</Text>
                    </View>
                    <Text style={styles.scenarioDesc}>{trial.description}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaChip}>{rules.label}</Text>
                      <Text style={styles.metaChip}>DC {dc}</Text>
                      <Text style={styles.metaChip}>+{trial.rewardXp} XP</Text>
                    </View>
                    <Text style={styles.ruleText}>{rules.blurb}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { padding: 16, paddingBottom: 40 },
  eyeLabel: {
    color: '#4b5563',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: '#e5e7eb',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: { color: '#6b7280', fontSize: 13, lineHeight: 19, marginBottom: 10 },
  factionBadge: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  factionText: { color: '#a78bfa', fontSize: 12, fontWeight: '600' },
  realmSection: {
    marginTop: 10,
    marginBottom: 12,
    backgroundColor: '#0d0d14',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
  },
  realmSectionActive: { borderColor: '#7c3aed' },
  realmHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  realmStatus: { width: 10, borderRadius: 999 },
  realmUnlocked: { backgroundColor: '#7c3aed' },
  realmLocked: { backgroundColor: '#374151' },
  realmHeaderBody: { flex: 1 },
  realmName: { color: '#e5e7eb', fontSize: 16, fontWeight: '700' },
  realmDesc: { color: '#9ca3af', fontSize: 12, marginTop: 4, lineHeight: 18 },
  realmMeta: { color: '#6b7280', fontSize: 11, marginTop: 6 },
  scenarioCard: {
    backgroundColor: '#11131b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 8,
  },
  scenarioDone: { borderColor: '#059669' },
  scenarioLocked: { opacity: 0.45 },
  scenarioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  scenarioTitle: { color: '#e5e7eb', fontSize: 14, fontWeight: '700', flex: 1 },
  doneBadge: { color: '#c4b5fd', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  scenarioDesc: { color: '#9ca3af', fontSize: 12, lineHeight: 18 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  metaChip: {
    color: '#c4b5fd',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#1a1a2e',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ruleText: { color: '#6b7280', fontSize: 11, marginTop: 8 },
});
