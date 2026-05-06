// Hub screen listing all scenario arenas
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import scenarios from '../data/scenarios.json';
import { usePlayer } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';
import XPBar from '../components/XPBar';
import TigerRankBadge from '../components/TigerRankBadge';

const ARENAS = [
  {
    key: 'shadowArena',
    label: 'Shadow Arena',
    emoji: '⚔️',
    color: '#7c3aed',
    description: 'Test your shadow instincts in the arena of perception and restraint.',
    scenarios: scenarios.shadowArena,
  },
  {
    key: 'kingdomRaid',
    label: 'Kingdom Raid',
    emoji: '🏰',
    color: '#dc2626',
    description: 'Lead your faction in a strategic raid on a rival kingdom.',
    scenarios: scenarios.kingdomRaid,
  },
  {
    key: 'hydraLabyrinth',
    label: 'Hydra Labyrinth',
    emoji: '🌀',
    color: '#059669',
    description: 'Descend into the Hydra\'s own labyrinth and face its awakened eyes.',
    scenarios: scenarios.hydraLabyrinth,
  },
];

export default function ScenariosHubScreen({ navigation }) {
  const { state } = usePlayer();
  const { trackClick } = useHydraEyes();

  const completedScenarioIds = new Set(
    state.scenarioHistory
      .filter((h) => h.type === 'scenario_choice')
      .map((h) => h.scenarioId)
  );

  const handleScenario = (scenarioType, scenario) => {
    trackClick('scenario_card', scenario.id);
    navigation.navigate('Scenario', { scenario, scenarioType });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — LABYRINTH EYE</Text>
        <Text style={styles.title}>Trial Arenas</Text>

        {state.faction && (
          <View style={styles.factionBadge}>
            <Text style={styles.factionText}>
              {state.faction.emoji} {state.faction.shortName} — Lv {state.level}
            </Text>
          </View>
        )}

        <XPBar />
        <TigerRankBadge compact />

        {ARENAS.map((arena) => (
          <View key={arena.key} style={styles.arenaSection}>
            <View style={[styles.arenaHeader, { borderLeftColor: arena.color }]}>
              <Text style={styles.arenaEmoji}>{arena.emoji}</Text>
              <View>
                <Text style={[styles.arenaName, { color: arena.color }]}>{arena.label}</Text>
                <Text style={styles.arenaDesc}>{arena.description}</Text>
              </View>
            </View>

            {arena.scenarios.map((s) => {
              const done = completedScenarioIds.has(s.id);
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.scenarioCard, done && styles.scenarioDone]}
                  onPress={() => handleScenario(arena.key, s)}
                  activeOpacity={0.8}
                >
                  <View style={styles.scenarioRow}>
                    <Text style={styles.scenarioTitle}>{s.title}</Text>
                    {done && <Text style={styles.doneBadge}>✓ Done</Text>}
                  </View>
                  <Text style={styles.scenarioDesc} numberOfLines={2}>
                    {s.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
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
  arenaSection: { marginBottom: 20 },
  arenaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginBottom: 10,
    gap: 10,
  },
  arenaEmoji: { fontSize: 24, marginTop: 1 },
  arenaName: { fontSize: 16, fontWeight: '700' },
  arenaDesc: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  scenarioCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 8,
  },
  scenarioDone: {
    borderColor: '#059669',
    opacity: 0.7,
  },
  scenarioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scenarioTitle: { color: '#e5e7eb', fontSize: 14, fontWeight: '600', flex: 1 },
  doneBadge: { color: '#059669', fontSize: 11, fontWeight: '700' },
  scenarioDesc: { color: '#6b7280', fontSize: 12, lineHeight: 18 },
});
