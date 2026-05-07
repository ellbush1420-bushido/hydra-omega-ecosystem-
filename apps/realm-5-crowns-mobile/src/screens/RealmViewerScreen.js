import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import RealmCanvas from '../components/RealmCanvas';

export default function RealmViewerScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — REALM EYE</Text>
        <Text style={styles.title}>Obsidian Gate</Text>
        <Text style={styles.subtitle}>
          Step into the corridor and watch the gate pulse with live blue fire.
        </Text>

        <View style={styles.canvasFrame}>
          <RealmCanvas />
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Scene Notes</Text>
          <Text style={styles.infoText}>Ambient shadow, flickering point light, and a reflective corridor frame the gate.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  content: { flex: 1, padding: 16, paddingBottom: 24 },
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
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
  },
  canvasFrame: {
    flex: 1,
    minHeight: 320,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    overflow: 'hidden',
    backgroundColor: '#05070d',
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    backgroundColor: '#0d0d14',
    padding: 14,
  },
  infoLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
  },
});
