import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { usePlayer } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';
import { LOCAL_CODEX_ENTRIES } from '../data/realmGate';
import { fetchCodexCatalogForPlayer, isSupabaseConfigured } from '../lib/supabase';

export default function CodexScreen({ navigation }) {
  const { state } = usePlayer();
  const { trackClick } = useHydraEyes();
  const [remoteEntries, setRemoteEntries] = useState([]);
  const [remoteUnlocks, setRemoteUnlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadCodex() {
      if (!isSupabaseConfigured) return;
      setLoading(true);
      setError('');

      try {
        const { entries, unlocks } = await fetchCodexCatalogForPlayer();
        if (!active) return;
        setRemoteEntries(entries || []);
        setRemoteUnlocks((unlocks || []).map((entry) => entry.codex_key));
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load Supabase codex data.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCodex();
    return () => {
      active = false;
    };
  }, []);

  const entries = useMemo(() => {
    const source = (remoteEntries.length ? remoteEntries : LOCAL_CODEX_ENTRIES).filter(Boolean);
    const seen = new Set();
    return source.filter((entry) => {
      if (!entry.key || seen.has(entry.key)) return false;
      seen.add(entry.key);
      return true;
    });
  }, [remoteEntries]);

  const unlockedKeys = useMemo(
    () => new Set([...state.codexUnlocks, ...remoteUnlocks]),
    [state.codexUnlocks, remoteUnlocks]
  );

  const unlockedEntries = entries.filter((entry) => unlockedKeys.has(entry.key));
  const lockedEntries = entries.filter((entry) => !unlockedKeys.has(entry.key));

  const openEntry = (entry) => {
    trackClick('codex_entry', entry.key);
    navigation.navigate('CodexDetail', { entry });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — LORE EYE</Text>
        <Text style={styles.title}>Lore Codex</Text>
        <Text style={styles.subtitle}>
          Unlocked entries open in full. Locked entries remain sealed behind “???” until the gate condition is met.
        </Text>

        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#a78bfa" />
            <Text style={styles.loadingText}>Querying Supabase codex tables…</Text>
          </View>
        )}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.sectionLabel}>Unlocked ({unlockedEntries.length})</Text>
        {unlockedEntries.map((entry) => (
          <TouchableOpacity key={entry.key} style={[styles.card, styles.cardUnlocked]} onPress={() => openEntry(entry)}>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{entry.title}</Text>
              <Text style={styles.cardMeta}>{entry.unlockCondition || entry.unlock_condition}</Text>
            </View>
            <Text style={styles.openLabel}>Open</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionLabel}>Locked ({lockedEntries.length})</Text>
        {lockedEntries.map((entry) => (
          <View key={entry.key} style={styles.card}>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>???</Text>
              <Text style={styles.cardMeta}>Condition hidden until unlocked.</Text>
            </View>
            <Text style={styles.lockedLabel}>Sealed</Text>
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
  title: { color: '#e5e7eb', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#6b7280', fontSize: 13, marginBottom: 16, lineHeight: 20 },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 8,
  },
  loadingCard: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#0d0d14',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 10,
  },
  loadingText: { color: '#9ca3af', fontSize: 12 },
  errorText: {
    color: '#fca5a5',
    backgroundColor: '#2a1116',
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d0d14',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  cardUnlocked: {
    borderColor: '#7c3aed',
    backgroundColor: '#121022',
  },
  cardBody: { flex: 1 },
  cardTitle: { color: '#e5e7eb', fontSize: 13, fontWeight: '700' },
  cardMeta: { color: '#6b7280', fontSize: 11, marginTop: 3, lineHeight: 16 },
  openLabel: { color: '#c4b5fd', fontSize: 11, fontWeight: '700' },
  lockedLabel: { color: '#4b5563', fontSize: 11, fontWeight: '700' },
});
