import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useHydraEyes } from '../hooks/useHydraEyes';
import { usePlayer } from '../hooks/usePlayer';
import { realms } from '../data/realms';

export default function RealmSelectScreen({ navigation }) {
  const { state, selectRealm } = usePlayer();
  const { trackClick } = useHydraEyes();

  const completedScenarioIds = new Set(
    state.scenarioHistory
      .filter((entry) => entry.type === 'scenario_choice')
      .map((entry) => entry.scenarioId)
  );

  const handleRealm = async (realm) => {
    trackClick('realm_card', realm.key);
    await selectRealm(realm);
    navigation.navigate('TrialSelect', { realmId: realm.id });
  };

  if (!state.faction) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Choose a Crown first</Text>
          <Text style={styles.emptyText}>
            Your crown selection seeds the realm and trial state written to Supabase.
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('FactionSelect')}
          >
            <Text style={styles.emptyButtonText}>Go to Crown Select</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — REALM GATE</Text>
        <Text style={styles.title}>Choose Your Realm</Text>
        <Text style={styles.subtitle}>
          {state.faction.emoji} Crown {state.crownId} is active. Pick the gate to write your realm_id.
        </Text>

        {realms.map((realm) => {
          const completedCount = realm.trials.filter((trial) => completedScenarioIds.has(trial.id)).length;

          return (
            <TouchableOpacity
              key={realm.id}
              style={[
                styles.card,
                { borderColor: realm.color },
                state.realmId === realm.id && styles.cardSelected,
              ]}
              activeOpacity={0.85}
              onPress={() => handleRealm(realm)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardEmoji}>{realm.emoji}</Text>
                <View style={styles.cardTitleWrap}>
                  <Text style={[styles.cardTitle, { color: realm.color }]}>{realm.title}</Text>
                  <Text style={styles.cardSubtitle}>{realm.shortName}</Text>
                </View>
                <View style={styles.idBadge}>
                  <Text style={styles.idBadgeText}>realm_id {realm.id}</Text>
                </View>
              </View>

              <Text style={styles.cardDescription}>{realm.description}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{realm.trials.length} trials</Text>
                <Text style={styles.metaText}>{completedCount} cleared</Text>
              </View>
            </TouchableOpacity>
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
  subtitle: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#0d0d14',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
  },
  cardSelected: {
    backgroundColor: '#11111c',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  cardEmoji: { fontSize: 28 },
  cardTitleWrap: { flex: 1 },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  idBadge: {
    backgroundColor: '#1a1a2e',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  idBadgeText: {
    color: '#d1d5db',
    fontSize: 10,
    fontWeight: '700',
  },
  cardDescription: {
    color: '#d1d5db',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: '#e5e7eb',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
