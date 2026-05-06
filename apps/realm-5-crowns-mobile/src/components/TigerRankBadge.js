import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePlayer } from '../hooks/usePlayer';

const TIGER_INFO = {
  black_tiger_I: { label: 'Black Tiger I', color: '#374151', emoji: '🐯' },
  black_tiger_II: { label: 'Black Tiger II', color: '#1f2937', emoji: '🐯' },
  white_tiger_I: { label: 'White Tiger I', color: '#d1d5db', emoji: '🐅' },
  white_tiger_II: { label: 'White Tiger II', color: '#f3f4f6', emoji: '🐅' },
};

const TRACKS = [
  { key: 'black_tiger_I', label: 'Black Tiger I', color: '#4b5563', emoji: '🐯' },
  { key: 'black_tiger_II', label: 'Black Tiger II', color: '#374151', emoji: '🐯' },
  { key: 'white_tiger_I', label: 'White Tiger I', color: '#9ca3af', emoji: '🐅' },
  { key: 'white_tiger_II', label: 'White Tiger II', color: '#e5e7eb', emoji: '🐅' },
];

const RANK_ORDER = ['black_tiger_I', 'black_tiger_II', 'white_tiger_I', 'white_tiger_II'];

export default function TigerRankBadge({ compact = false }) {
  const { state } = usePlayer();
  const rank = state.tigerRank;
  const currentIdx = rank ? RANK_ORDER.indexOf(rank) : -1;

  if (compact) {
    if (!rank) return null;
    const info = TIGER_INFO[rank];
    return (
      <View style={[styles.badge, { backgroundColor: info.color + '33', borderColor: info.color }]}>
        <Text style={styles.badgeText}>{info.emoji} {info.label}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tiger Promotion Track</Text>
      <View style={styles.track}>
        {TRACKS.map((t, i) => {
          const achieved = i <= currentIdx;
          return (
            <View key={t.key} style={styles.trackStep}>
              <View style={[styles.dot, achieved ? { backgroundColor: t.color } : styles.dotInactive]}>
                <Text style={styles.dotEmoji}>{t.emoji}</Text>
              </View>
              <Text style={[styles.trackLabel, achieved ? { color: t.color } : styles.inactiveLabel]}>
                {t.label}
              </Text>
            </View>
          );
        })}
      </View>
      {!rank && <Text style={styles.hint}>Complete Shadow Arena trials to earn your first Tiger rank.</Text>}
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
    justifyContent: 'space-around',
  },
  trackStep: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInactive: {
    backgroundColor: '#1f2937',
  },
  dotEmoji: {
    fontSize: 18,
  },
  trackLabel: {
    fontSize: 9,
    textAlign: 'center',
    maxWidth: 60,
  },
  inactiveLabel: {
    color: '#4b5563',
  },
  hint: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    color: '#e5e7eb',
    fontSize: 11,
    fontWeight: '600',
  },
});
