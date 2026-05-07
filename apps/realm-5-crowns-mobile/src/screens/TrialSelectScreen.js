import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { getRealmById } from '../data/realms';
import { useHydraEyes } from '../hooks/useHydraEyes';
import { usePlayer } from '../hooks/usePlayer';

export default function TrialSelectScreen({ navigation, route }) {
  const { state, selectTrial } = usePlayer();
  const { trackClick } = useHydraEyes();

  const realmId = route.params?.realmId || state.realmId;
  const realm = state.selectedRealm?.id === realmId ? state.selectedRealm : getRealmById(realmId);

  if (!realm) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Choose a realm first</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('RealmSelect')}
          >
            <Text style={styles.emptyButtonText}>Back to Realm Gates</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleTrial = async (trial) => {
    trackClick('trial_card', `${realm.key}:${trial.trialId}`);
    await selectTrial(trial);
    navigation.navigate('Scenario', { scenario: trial, scenarioType: realm.key, realm });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — TRIAL GATE</Text>
        <Text style={styles.title}>{realm.title}</Text>
        <Text style={styles.subtitle}>
          realm_id {realm.id} is locked in. Select the encounter seed for trial_id sync.
        </Text>

        {realm.trials.map((trial) => (
          <TouchableOpacity
            key={trial.trialId}
            style={[
              styles.card,
              state.trialId === trial.trialId && styles.cardSelected,
            ]}
            activeOpacity={0.85}
            onPress={() => handleTrial(trial)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleWrap}>
                <Text style={styles.cardTitle}>{trial.title}</Text>
                <Text style={styles.cardMeta}>trial_id {trial.trialId}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </View>
            <Text style={styles.cardDescription}>{trial.description}</Text>
            <Text style={styles.choiceCount}>{trial.choices.length} encounter paths</Text>
          </TouchableOpacity>
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
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: '#7c3aed',
    backgroundColor: '#11111c',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  titleWrap: { flex: 1 },
  cardTitle: {
    color: '#e5e7eb',
    fontSize: 15,
    fontWeight: '700',
  },
  cardMeta: {
    color: '#a78bfa',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  cardDescription: {
    color: '#d1d5db',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 10,
  },
  choiceCount: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '600',
  },
  arrow: {
    color: '#7c3aed',
    fontSize: 20,
    fontWeight: '800',
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
