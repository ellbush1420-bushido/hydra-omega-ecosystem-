import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePlayer } from '../hooks/usePlayer';
import { SHADOW_CROWN_THRESHOLDS } from '../lib/shadowCrown';

export default function XPBar() {
  const { state } = usePlayer();
  const { xp, level, xpToNext } = state;

  const currentLevelXp = SHADOW_CROWN_THRESHOLDS[level - 1] || 0;
  const nextLevelXp = SHADOW_CROWN_THRESHOLDS[level] || xp;
  const range = nextLevelXp - currentLevelXp;
  const progress = range > 0 ? Math.min((xp - currentLevelXp) / range, 1) : 1;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.levelText}>Shadow Crown Rank {level}</Text>
        <Text style={styles.xpText}>{xp} XP</Text>
        {xpToNext > 0 && <Text style={styles.toNextText}>{xpToNext} to next rank</Text>}
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${Math.round(progress * 100)}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  levelText: {
    color: '#a78bfa',
    fontSize: 12,
    fontWeight: '700',
  },
  xpText: {
    color: '#e5e7eb',
    fontSize: 12,
    flex: 1,
  },
  toNextText: {
    color: '#6b7280',
    fontSize: 11,
  },
  barBg: {
    height: 6,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 4,
  },
});
