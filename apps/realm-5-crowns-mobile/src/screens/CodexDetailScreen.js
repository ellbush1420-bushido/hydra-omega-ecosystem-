import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CodexDetailScreen({ route }) {
  const { entry } = route.params;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — LORE EYE</Text>
        <Text style={styles.title}>{entry.title}</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Unlock condition</Text>
          <Text style={styles.unlockCondition}>{entry.unlockCondition}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Entry</Text>
          <Text style={styles.body}>{entry.body}</Text>
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
  title: {
    color: '#e5e7eb',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 14,
    marginBottom: 10,
  },
  label: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  unlockCondition: {
    color: '#a78bfa',
    fontSize: 12,
    lineHeight: 18,
  },
  body: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 22,
  },
});
