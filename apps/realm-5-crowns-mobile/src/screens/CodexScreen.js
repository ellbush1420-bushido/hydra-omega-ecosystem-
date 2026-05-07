import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { usePlayer } from '../hooks/usePlayer';
import { fetchCodexCatalog, isSupabaseConfigured } from '../lib/supabase';

export default function CodexScreen({ navigation }) {
  const { state } = usePlayer();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchCodexCatalog(state.codexUnlocks);
      setEntries(data);
    } catch (err) {
      setError(err.message || 'Unable to load codex entries.');
    } finally {
      setLoading(false);
    }
  }, [state.codexUnlocks]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const unlocked = entries.filter((entry) => entry.unlocked);
  const locked = entries.filter((entry) => !entry.unlocked);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — LORE EYE</Text>
        <Text style={styles.title}>Lore Codex</Text>
        <Text style={styles.subtitle}>
          Unlocked entries can be opened in full. Locked entries remain hidden as you climb the Realm Gate.
        </Text>

        <View style={styles.syncCard}>
          <Text style={styles.syncTitle}>Supabase</Text>
          <Text style={styles.syncText}>
            {isSupabaseConfigured
              ? 'Codex entries merge local unlocks with Supabase-backed lore progress.'
              : 'Add Supabase credentials to sync lore unlocks across sessions.'}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator color="#a78bfa" />
            <Text style={styles.loadingText}>Loading codex entries…</Text>
          </View>
        ) : (
          <>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.sectionLabel}>Unlocked ({unlocked.length})</Text>
            {unlocked.map((entry) => (
              <TouchableOpacity
                key={entry.key}
                style={[styles.card, styles.cardUnlocked]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('CodexDetail', { entry })}
              >
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{entry.title}</Text>
                  <Text style={styles.cardCopy} numberOfLines={2}>
                    {entry.body}
                  </Text>
                </View>
                <Text style={styles.openBadge}>Open</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionLabel}>Locked ({locked.length})</Text>
            {locked.map((entry) => (
              <View
                key={entry.key}
                style={styles.card}
                accessible
                accessibilityLabel={`Locked codex entry. Unlock condition: ${entry.unlockCondition}`}
              >
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>???</Text>
                  <Text style={styles.cardCopy}>{entry.unlockCondition}</Text>
                </View>
                <Text style={styles.lockedBadge}>Locked</Text>
              </View>
            ))}
          </>
        )}
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
  syncCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 14,
  },
  syncTitle: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  syncText: { color: '#d1d5db', fontSize: 12, lineHeight: 18 },
  loadingCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    alignItems: 'center',
  },
  loadingText: { color: '#9ca3af', fontSize: 13, marginTop: 10 },
  errorText: {
    color: '#fca5a5',
    fontSize: 12,
    backgroundColor: '#2a1116',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 4,
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
    borderColor: '#059669',
    backgroundColor: '#0a1a10',
  },
  cardBody: { flex: 1 },
  cardTitle: { color: '#e5e7eb', fontSize: 13, fontWeight: '600' },
  cardCopy: { color: '#6b7280', fontSize: 11, marginTop: 4, lineHeight: 16 },
  openBadge: { color: '#059669', fontSize: 12, fontWeight: '700' },
  lockedBadge: { color: '#4b5563', fontSize: 11, fontWeight: '700' },
});
