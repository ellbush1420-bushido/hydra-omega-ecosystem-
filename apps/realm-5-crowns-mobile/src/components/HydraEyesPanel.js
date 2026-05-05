import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { usePlayer } from '../hooks/usePlayer';

export default function HydraEyesPanel({ events = [] }) {
  const { state } = usePlayer();
  const { mockStats, hydraRecommendation } = state;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👁 Hydra Eyes</Text>

      {hydraRecommendation && (
        <View style={styles.recommendation}>
          <Text style={styles.recLabel}>Recommendation</Text>
          <Text style={styles.recText}>{hydraRecommendation}</Text>
        </View>
      )}

      <View style={styles.grid}>
        <StatTile icon="🖱" label="Clicks" value={mockStats.clicks} color="#7c3aed" />
        <StatTile icon="🤝" label="Joins" value={mockStats.joins} color="#059669" />
        <StatTile icon="🛒" label="Sales" value={mockStats.sales} color="#d97706" />
        <StatTile icon="💰" label="Revenue" value={`$${mockStats.revenue}`} color="#f59e0b" />
        <StatTile icon="📈" label="Scale Score" value={mockStats.scaleScore} color="#3b82f6" />
      </View>

      {events.length > 0 && (
        <View style={styles.log}>
          <Text style={styles.logTitle}>Recent Events</Text>
          <ScrollView style={styles.logScroll} nestedScrollEnabled>
            {events.slice(0, 10).map((e) => (
              <View key={e.id} style={styles.logRow}>
                <Text style={styles.logType}>{e.event_type}</Text>
                <Text style={styles.logTs}>{new Date(e.ts).toLocaleTimeString()}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

function StatTile({ icon, label, value, color }) {
  return (
    <View style={[styles.tile, { borderColor: color + '55' }]}>
      <Text style={styles.tileIcon}>{icon}</Text>
      <Text style={[styles.tileValue, { color }]}>{value}</Text>
      <Text style={styles.tileLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 14,
    marginVertical: 8,
  },
  title: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 10,
  },
  recommendation: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  recLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  recText: {
    color: '#e5e7eb',
    fontSize: 12,
    lineHeight: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tile: {
    flex: 1,
    minWidth: '28%',
    backgroundColor: '#0a0a0f',
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
  },
  tileIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tileValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  tileLabel: {
    color: '#6b7280',
    fontSize: 10,
    marginTop: 2,
  },
  log: {
    marginTop: 10,
  },
  logTitle: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  logScroll: {
    maxHeight: 120,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  logType: {
    color: '#a78bfa',
    fontSize: 11,
  },
  logTs: {
    color: '#4b5563',
    fontSize: 11,
  },
});
