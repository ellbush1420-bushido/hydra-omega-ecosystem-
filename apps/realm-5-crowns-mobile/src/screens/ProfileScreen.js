import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { usePlayer } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';
import XPBar from '../components/XPBar';
import TigerRankBadge from '../components/TigerRankBadge';
import HydraEyesPanel from '../components/HydraEyesPanel';
import { getRealmById } from '../data/realmGate';

export default function ProfileScreen({ navigation }) {
  const { state } = usePlayer();
  const { eventLog, trackClick } = useHydraEyes();
  const { faction, level, xp, codexUnlocks, scenarioHistory, mockStats, hydraRecommendation } = state;
  const currentRealm = getRealmById(state.currentRealmId);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — CHARACTER EYE</Text>
        <Text style={styles.title}>Operative Profile</Text>

        {faction ? (
          <View style={[styles.factionCard, { borderColor: faction.color }]}> 
            <Text style={styles.factionEmoji}>{faction.emoji}</Text>
            <View>
              <Text style={[styles.factionName, { color: faction.accent }]}>{faction.shortName}</Text>
              <Text style={styles.factionFullName}>{faction.name}</Text>
              <Text style={styles.realmLine}>{currentRealm.title}</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.noFactionCard}
            onPress={() => {
              trackClick('choose_faction_btn', 'profile');
              navigation.navigate('FactionSelect');
            }}
          >
            <Text style={styles.noFactionText}>⬡ Choose Your Crown →</Text>
          </TouchableOpacity>
        )}

        <XPBar />
        <TigerRankBadge />

        <View style={styles.statsRow}>
          <StatBox label="Rank" value={level} color="#a78bfa" />
          <StatBox label="XP" value={xp} color="#f59e0b" />
          <StatBox label="Codex" value={codexUnlocks.length} color="#059669" />
          <StatBox label="Realms" value={state.realmUnlocks.length} color="#3b82f6" />
        </View>

        <View style={styles.recommendationCard}>
          <Text style={styles.sectionLabel}>Recommendation</Text>
          <Text style={styles.recommendationText}>{hydraRecommendation}</Text>
        </View>

        <View style={styles.recommendationCard}>
          <Text style={styles.sectionLabel}>Shadow Crown Stats</Text>
          <View style={styles.shadowStatsRow}>
            {Object.entries(state.shadowCrownStats).map(([key, value]) => (
              <View key={key} style={styles.shadowStatChip}>
                <Text style={styles.shadowStatValue}>{value}</Text>
                <Text style={styles.shadowStatLabel}>{key.toUpperCase()}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.realmLine}>Active perk: {state.shadowCrownPerk}</Text>
          <Text style={styles.realmLine}>Stored Veil auto-wins here: {state.shadowDominionCharges[state.currentRealmId] || 0}</Text>
        </View>

        <HydraEyesPanel events={eventLog} />

        {scenarioHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionLabel}>Encounter History</Text>
            {scenarioHistory.slice(0, 8).map((history, index) => (
              <View key={`${history.scenarioId || history.type}-${index}`} style={styles.historyRow}>
                <Text style={styles.historyType}>
                  {history.type === 'faction_select' ? '👑 Crown chosen' : `${history.outcome === 'victory' ? '🏆' : history.outcome === 'defeat' ? '☠️' : '⚔️'} ${history.trialTitle || history.scenarioId}`}
                </Text>
                <Text style={styles.historyTs}>{new Date(history.ts).toLocaleTimeString()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.navGrid}>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => {
              trackClick('nav_scenarios', 'profile');
              navigation.navigate('Scenarios');
            }}
          >
            <Text style={styles.navCardEmoji}>⚔️</Text>
            <Text style={styles.navCardLabel}>Realm Gate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => {
              trackClick('nav_codex', 'profile');
              navigation.navigate('Codex');
            }}
          >
            <Text style={styles.navCardEmoji}>📜</Text>
            <Text style={styles.navCardLabel}>Lore Codex</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navCard}
            onPress={() => {
              trackClick('nav_faction', 'profile');
              navigation.navigate('FactionSelect');
            }}
          >
            <Text style={styles.navCardEmoji}>👑</Text>
            <Text style={styles.navCardLabel}>Change Crown</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recommendationCard}>
          <Text style={styles.sectionLabel}>Mock Economy</Text>
          <Text style={styles.recommendationText}>
            Scale Score {mockStats.scaleScore} · Joins {mockStats.joins} · Sales {mockStats.sales} · Revenue ${mockStats.revenue}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, color }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
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
  title: { color: '#e5e7eb', fontSize: 26, fontWeight: '800', marginBottom: 12 },
  factionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 4,
  },
  factionEmoji: { fontSize: 36 },
  factionName: { fontSize: 16, fontWeight: '800', letterSpacing: 2 },
  factionFullName: { color: '#6b7280', fontSize: 12, marginTop: 2 },
  realmLine: { color: '#9ca3af', fontSize: 12, marginTop: 4 },
  noFactionCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    borderStyle: 'dashed',
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  noFactionText: { color: '#6b7280', fontSize: 14 },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#0d0d14',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 10,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '700' },
  statLabel: { color: '#6b7280', fontSize: 10, marginTop: 2 },
  recommendationCard: {
    marginTop: 8,
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 12,
  },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  recommendationText: { color: '#d1d5db', fontSize: 12, lineHeight: 18 },
  shadowStatsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  shadowStatChip: {
    minWidth: 64,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#11131b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  shadowStatValue: { color: '#e5e7eb', fontSize: 13, fontWeight: '700' },
  shadowStatLabel: { color: '#6b7280', fontSize: 9, marginTop: 2 },
  historySection: {
    marginTop: 8,
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 12,
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  historyType: { color: '#a78bfa', fontSize: 12, flex: 1 },
  historyTs: { color: '#4b5563', fontSize: 11 },
  navGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  navCard: {
    flex: 1,
    backgroundColor: '#0d0d14',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  navCardEmoji: { fontSize: 24 },
  navCardLabel: { color: '#9ca3af', fontSize: 11, textAlign: 'center', fontWeight: '600' },
});
