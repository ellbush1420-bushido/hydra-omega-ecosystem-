import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import TigerRankBadge from '../components/TigerRankBadge';
import { usePlayer } from '../hooks/usePlayer';
import {
  buildPlayerStatePayload,
  fetchPlayerState,
  isSupabaseConfigured,
  savePlayerState,
} from '../lib/supabase';
import { REALM_PROGRESSIONS, getRealmById } from '../data/realmGate';

function DataRow({ label, value, accent }) {
  return (
    <View style={styles.dataRow}>
      <Text style={styles.dataLabel}>{label}</Text>
      <Text style={[styles.dataValue, accent && { color: accent }]}>{value || '—'}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { state } = usePlayer();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [remoteState, setRemoteState] = useState(null);

  const currentRealm = getRealmById(state.currentRealmId);
  const unlockedCount = state.realmUnlocks.length;
  const localSnapshot = useMemo(() => buildPlayerStatePayload(state), [state]);

  const loadRemoteState = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Add Supabase credentials to .env.local to enable player sync.');
      setRemoteState(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { deviceId: syncedDeviceId, data } = await fetchPlayerState();
      setDeviceId(syncedDeviceId);
      setRemoteState(data);
    } catch (err) {
      setError(err.message || 'Unable to load player state.');
      setRemoteState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSync = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured.');
      return;
    }

    setSyncing(true);
    setError('');

    try {
      const { deviceId: syncedDeviceId, data } = await savePlayerState(state);
      setDeviceId(syncedDeviceId);
      setRemoteState(data);
    } catch (err) {
      setError(err.message || 'Unable to save player state.');
    } finally {
      setSyncing(false);
    }
  }, [state]);

  useFocusEffect(
    useCallback(() => {
      loadRemoteState();
    }, [loadRemoteState])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — HOME EYE</Text>
        <Text style={styles.title}>Realm Home</Text>
        <Text style={styles.subtitle}>
          Track Shadow Crown evolution, realm unlocks, and optional Supabase progression sync.
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Current Crown Path</Text>
          <Text style={styles.heroValue}>
            {state.faction ? `${state.faction.emoji} ${state.faction.shortName}` : 'Unbound'}
          </Text>
          <Text style={styles.heroMeta}>
            {currentRealm.title} · Rank {state.level}
          </Text>
          <Text style={styles.heroHint}>{state.hydraRecommendation}</Text>
        </View>

        <TigerRankBadge />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Realm Gate Progress</Text>
          <View style={styles.realmProgressCard}>
            {REALM_PROGRESSIONS.map((realm) => {
              const unlocked = state.realmUnlocks.includes(realm.id);
              const active = realm.id === state.currentRealmId;
              return (
                <View key={realm.id} style={styles.realmProgressRow}>
                  <View style={[styles.realmDot, unlocked ? styles.realmDotUnlocked : styles.realmDotLocked]} />
                  <View style={styles.realmProgressBody}>
                    <Text style={[styles.realmProgressTitle, active && styles.realmProgressTitleActive]}>
                      {realm.title}
                    </Text>
                    <Text style={styles.realmProgressMeta}>
                      {unlocked ? 'Unlocked' : 'Locked'} · {realm.trials.length} trials
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatValue}>{unlockedCount}</Text>
              <Text style={styles.quickStatLabel}>Unlocked Realms</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatValue}>{state.codexUnlocks.length}</Text>
              <Text style={styles.quickStatLabel}>Codex Unlocks</Text>
            </View>
            <View style={styles.quickStatCard}>
              <Text style={styles.quickStatValue}>{state.shadowDominionCharges[state.currentRealmId] || 0}</Text>
              <Text style={styles.quickStatLabel}>Veil Auto-Wins</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Supabase Sync</Text>
          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color="#a78bfa" />
              <Text style={styles.loadingText}>Loading player_state…</Text>
            </View>
          ) : (
            <>
              <Text style={styles.deviceText}>Device: {deviceId || 'Not connected yet'}</Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <View style={styles.dataCard}>
                <Text style={styles.cardLabel}>Remote player_state</Text>
                <DataRow label="Crown" value={remoteState?.crown} accent="#f59e0b" />
                <DataRow label="Realm" value={remoteState?.realm} accent="#7c3aed" />
                <DataRow label="Trial" value={remoteState?.trial} accent="#38bdf8" />
                <DataRow label="Shadow Rank" value={remoteState?.level} accent="#c4b5fd" />
                <DataRow
                  label="Updated"
                  value={remoteState?.updated_at ? new Date(remoteState.updated_at).toLocaleString() : 'No row yet'}
                />
              </View>
              <View style={styles.dataCard}>
                <Text style={styles.cardLabel}>Prepared local write</Text>
                <DataRow label="Crown" value={localSnapshot.crown} accent="#f59e0b" />
                <DataRow label="Realm" value={localSnapshot.realm} accent="#7c3aed" />
                <DataRow label="Trial" value={localSnapshot.trial} accent="#38bdf8" />
                <DataRow label="Shadow Rank" value={localSnapshot.level} accent="#c4b5fd" />
              </View>
            </>
          )}

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={loadRemoteState}>
              <Text style={styles.secondaryButtonText}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.primaryButton, syncing && styles.buttonDisabled]}
              onPress={handleSync}
              disabled={syncing}
            >
              <Text style={styles.primaryButtonText}>{syncing ? 'Syncing…' : 'Sync Local State'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Realm Access</Text>
          <TouchableOpacity
            style={styles.viewerCard}
            onPress={() => navigation.navigate('RealmViewer')}
            activeOpacity={0.85}
          >
            <Text style={styles.viewerEmoji}>🜁</Text>
            <View style={styles.viewerBody}>
              <Text style={styles.viewerTitle}>Open 3D Realm Viewer</Text>
              <Text style={styles.viewerDesc}>
                Explore a fog-drenched corridor with real-time shadows and the Obsidian Gate.
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryNav} onPress={() => navigation.navigate('Scenarios')}>
            <Text style={styles.secondaryNavText}>Enter the realm gate tree →</Text>
          </TouchableOpacity>
        </View>
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
  title: { color: '#e5e7eb', fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: '#6b7280', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  heroCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    marginBottom: 16,
  },
  heroTitle: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  heroValue: { color: '#e5e7eb', fontSize: 24, fontWeight: '800', marginTop: 10 },
  heroMeta: { color: '#a78bfa', fontSize: 12, marginTop: 6 },
  heroHint: { color: '#9ca3af', fontSize: 12, marginTop: 8, lineHeight: 18 },
  section: { marginBottom: 16 },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  realmProgressCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 14,
    marginBottom: 10,
    gap: 10,
  },
  realmProgressRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  realmDot: { width: 10, height: 10, borderRadius: 5 },
  realmDotUnlocked: { backgroundColor: '#7c3aed' },
  realmDotLocked: { backgroundColor: '#374151' },
  realmProgressBody: { flex: 1 },
  realmProgressTitle: { color: '#d1d5db', fontSize: 13, fontWeight: '600' },
  realmProgressTitleActive: { color: '#c4b5fd' },
  realmProgressMeta: { color: '#6b7280', fontSize: 11, marginTop: 2 },
  quickStatsRow: { flexDirection: 'row', gap: 10 },
  quickStatCard: {
    flex: 1,
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    alignItems: 'center',
  },
  quickStatValue: { color: '#e5e7eb', fontSize: 20, fontWeight: '800' },
  quickStatLabel: { color: '#6b7280', fontSize: 10, textAlign: 'center', marginTop: 4 },
  loadingCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  loadingText: { color: '#9ca3af', fontSize: 13, marginTop: 10 },
  deviceText: { color: '#4b5563', fontSize: 11, marginBottom: 8 },
  errorText: {
    color: '#fca5a5',
    fontSize: 12,
    backgroundColor: '#2a1116',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  dataCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 10,
  },
  cardLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  dataLabel: { color: '#6b7280', fontSize: 12 },
  dataValue: { color: '#e5e7eb', fontSize: 12, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  primaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    borderRadius: 10,
    paddingVertical: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0d0d14',
    paddingVertical: 12,
  },
  secondaryButtonText: { color: '#9ca3af', fontSize: 13, fontWeight: '700' },
  buttonDisabled: { opacity: 0.7 },
  viewerCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#0d0d14',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 14,
  },
  viewerEmoji: { fontSize: 28 },
  viewerBody: { flex: 1 },
  viewerTitle: { color: '#e5e7eb', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  viewerDesc: { color: '#6b7280', fontSize: 12, lineHeight: 18 },
  secondaryNav: {
    marginTop: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    paddingVertical: 12,
  },
  secondaryNavText: { color: '#a78bfa', fontSize: 13, fontWeight: '700' },
});
