import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import realmTrials from '../data/realmTrials';
import { usePlayer } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';
import { unlockCodexIfNeeded } from '../lib/codexUnlocks';
import XPBar from '../components/XPBar';
import ShadowCrownPanel from '../components/ShadowCrownPanel';
import { describeTrial } from '../lib/trials';

export default function ScenariosHubScreen({ navigation }) {
  const { state, dispatch } = usePlayer();
  const { trackClick, trackCodexUnlock } = useHydraEyes();

  const completedScenarioIds = new Set(
    state.scenarioHistory
      .filter((entry) => entry.type === 'scenario_choice' && entry.victory)
      .map((entry) => entry.scenarioId)
  );

  useEffect(() => {
    realmTrials
      .filter((realm) => state.realmUnlocks.includes(realm.id) && realm.codexKey)
      .forEach((realm) => {
        unlockCodexIfNeeded({
          codexKey: realm.codexKey,
          codexUnlocks: state.codexUnlocks,
          dispatch,
          trackCodexUnlock,
        });
      });
  }, [state.realmUnlocks, state.codexUnlocks, dispatch, trackCodexUnlock]);

  const handleScenario = (realm, scenario) => {
    trackClick('trial_card', scenario.id);
    navigation.navigate('Scenario', { scenario, realm });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — LABYRINTH EYE</Text>
        <Text style={styles.title}>Realm Gate Progression</Text>

        {state.faction && (
          <View style={styles.factionBadge}>
            <Text style={styles.factionText}>
              {state.faction.emoji} {state.faction.shortName} · Rank {state.level}
            </Text>
          </View>
        )}

        <XPBar />
        <ShadowCrownPanel compact />

        <View style={styles.ruleCard}>
          <Text style={styles.ruleLabel}>Unlock rule</Text>
          <Text style={styles.ruleText}>Victory in Realm N unlocks Realm N+1.</Text>
        </View>

        {realmTrials.map((realm) => {
          const unlocked = state.realmUnlocks.includes(realm.id);
          return (
            <View
              key={realm.id}
              style={[styles.realmSection, !unlocked && styles.realmSectionLocked]}
            >
              <View style={styles.realmHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.realmTitle}>{realm.title}</Text>
                  <Text style={styles.realmSummary}>{realm.summary}</Text>
                </View>
                <Text style={unlocked ? styles.unlockedBadge : styles.lockedBadge}>
                  {unlocked ? 'Unlocked' : 'Locked'}
                </Text>
              </View>

              {realm.trials.map((scenario) => {
                const details = describeTrial(scenario.trialType, realm.tier);
                const done = completedScenarioIds.has(scenario.id);
                return (
                  <TouchableOpacity
                    key={scenario.id}
                    style={[
                      styles.scenarioCard,
                      done && styles.scenarioDone,
                      !unlocked && styles.scenarioLocked,
                    ]}
                    onPress={() => unlocked && handleScenario(realm, scenario)}
                    disabled={!unlocked}
                    activeOpacity={0.85}
                  >
                    <View style={styles.scenarioRow}>
                      <Text style={styles.scenarioTitle}>{scenario.title}</Text>
                      <View style={styles.tagRow}>
                        {scenario.core && <Text style={styles.coreBadge}>Core</Text>}
                        {done && <Text style={styles.doneBadge}>✓ Victory</Text>}
                      </View>
                    </View>
                    <Text style={styles.scenarioDesc}>{scenario.description}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaPill}>{scenario.trialType}</Text>
                      <Text style={styles.metaPill}>DC {details.dc}</Text>
                      <Text style={styles.metaPill}>+{details.damageBonus} damage</Text>
                    </View>
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
    marginBottom: 8,
  },
  factionBadge: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  factionText: { color: '#a78bfa', fontSize: 12, fontWeight: '600' },
  ruleCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 12,
  },
  ruleLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  ruleText: {
    color: '#d1d5db',
    fontSize: 13,
  },
  realmSection: {
    marginBottom: 16,
    backgroundColor: '#0d0d14',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
  },
  realmSectionLocked: {
    opacity: 0.5,
  },
  realmHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  realmTitle: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: '700',
  },
  realmSummary: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
    lineHeight: 18,
  },
  unlockedBadge: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '700',
  },
  lockedBadge: {
    color: '#4b5563',
    fontSize: 11,
    fontWeight: '700',
  },
  scenarioCard: {
    backgroundColor: '#0a0a0f',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 12,
    marginBottom: 8,
  },
  scenarioDone: {
    borderColor: '#059669',
  },
  scenarioLocked: {
    borderStyle: 'dashed',
  },
  scenarioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 4,
  },
  scenarioTitle: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  coreBadge: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '700',
  },
  doneBadge: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '700',
  },
  scenarioDesc: {
    color: '#9ca3af',
    fontSize: 12,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  metaPill: {
    color: '#a78bfa',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#16142a',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});
