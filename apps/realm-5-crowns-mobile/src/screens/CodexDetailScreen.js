import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CodexDetailScreen({ route }) {
  const { entry } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — ARCHIVE EYE</Text>
        <Text style={styles.title}>{entry.title}</Text>
        <View style={styles.metaCard}>
          <Text style={styles.metaLabel}>Unlock condition</Text>
          <Text style={styles.metaValue}>{entry.unlockCondition || entry.unlock_condition || 'Unknown'}</Text>
        </View>
        <View style={styles.bodyCard}>
          <Text style={styles.bodyText}>{entry.body}</Text>
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
  title: { color: '#e5e7eb', fontSize: 26, fontWeight: '800', marginBottom: 14 },
  metaCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 14,
    marginBottom: 12,
  },
  metaLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  metaValue: { color: '#c4b5fd', fontSize: 12, lineHeight: 18 },
  bodyCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
  },
  bodyText: { color: '#d1d5db', fontSize: 14, lineHeight: 22 },
});
