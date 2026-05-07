import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePlayer } from '../hooks/usePlayer';
import { SHADOW_CROWN_MILESTONES } from '../data/realmGate';

export default function TigerRankBadge({ compact = false }) {
  const { state } = usePlayer();
  const currentRank = state.level;

  if (compact) {
    return (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>👑 Rank {currentRank} · {state.shadowCrownPerk}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shadow Crown Evolution</Text>
      <View style={styles.track}>
        {SHADOW_CROWN_MILESTONES.map((milestone) => {
          const achieved = milestone.rank <= currentRank;
          return (
            <View key={milestone.rank} style={styles.trackStep}>
              <View style={[styles.dot, achieved ? styles.dotActive : styles.dotInactive]}>
                <Text style={styles.dotText}>{milestone.rank}</Text>
              </View>
              <Text style={[styles.trackLabel, achieved ? styles.activeLabel : styles.inactiveLabel]}>
                {milestone.label}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={styles.hint}>{state.shadowCrownPerk}</Text>
      <View style={styles.statsRow}>
        {Object.entries(state.shadowCrownStats).map(([stat, value]) => (
          <View key={stat} style={styles.statChip}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{stat.toUpperCase()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#0f0f14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    marginVertical: 8,
  },
  title: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  track: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  trackStep: {
    width: '18%',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dotActive: {
    backgroundColor: '#7c3aed33',
    borderColor: '#7c3aed',
  },
  dotInactive: {
    backgroundColor: '#111827',
    borderColor: '#1f2937',
  },
  dotText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '700',
  },
  trackLabel: {
    fontSize: 9,
    textAlign: 'center',
  },
  activeLabel: {
    color: '#c4b5fd',
  },
  inactiveLabel: {
    color: '#4b5563',
  },
  hint: {
    color: '#d1d5db',
    fontSize: 11,
    marginTop: 10,
    lineHeight: 17,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  statChip: {
    minWidth: 64,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#141420',
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
  },
  statValue: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '700',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 9,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7c3aed',
    backgroundColor: '#7c3aed22',
    marginBottom: 8,
  },
  badgeText: {
    color: '#e5e7eb',
    fontSize: 11,
    fontWeight: '600',
  },
});
