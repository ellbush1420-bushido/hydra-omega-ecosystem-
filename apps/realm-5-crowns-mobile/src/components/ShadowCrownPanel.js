import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { usePlayer } from '../hooks/usePlayer';
import { getShadowCrownState } from '../lib/shadowCrown';

function StatChip({ label, value }) {
  return (
    <View style={styles.statChip}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ShadowCrownPanel({ compact = false }) {
  const { state } = usePlayer();
  const crown = getShadowCrownState(state.level);

  if (compact) {
    return (
      <View style={styles.compactCard}>
        <Text style={styles.compactTitle}>👑 Shadow Crown Rank {crown.rank}</Text>
        <Text style={styles.compactCopy}>
          Veil {crown.stats.veil} · Edge {crown.stats.edge} · Pulse {crown.stats.pulse} · Flux {crown.stats.flux}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Shadow Crown Evolution</Text>
      <Text style={styles.subtitle}>
        Rank {crown.rank} governs Veil, Edge, Pulse, and Flux across the Realm Gate climb.
      </Text>

      <View style={styles.statsRow}>
        <StatChip label="Veil" value={crown.stats.veil} />
        <StatChip label="Edge" value={crown.stats.edge} />
        <StatChip label="Pulse" value={crown.stats.pulse} />
        <StatChip label="Flux" value={crown.stats.flux} />
      </View>

      <Text style={styles.sectionLabel}>Milestone perks</Text>
      {crown.perks.length > 0 ? (
        crown.perks.map((perk) => (
          <Text key={perk.rank} style={styles.perk}>
            Rank {perk.rank} · {perk.description}
          </Text>
        ))
      ) : (
        <Text style={styles.emptyState}>Reach Rank 5 to awaken your first Shadow Crown perk.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginVertical: 8,
  },
  compactCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginVertical: 8,
  },
  compactTitle: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '700',
  },
  compactCopy: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 4,
  },
  title: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  subtitle: {
    color: '#d1d5db',
    fontSize: 12,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  statChip: {
    flexGrow: 1,
    minWidth: '22%',
    backgroundColor: '#141826',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  statValue: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 3,
  },
  sectionLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginTop: 12,
    marginBottom: 6,
  },
  perk: {
    color: '#e5e7eb',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  emptyState: {
    color: '#6b7280',
    fontSize: 11,
  },
});
