import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import realmStatus from '../data/realmStatus';
import colors from '../theme/colors';

export default function RealmViewerScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.kicker}>🌑 REALM VIEWER PLACEHOLDER</Text>
        <Text style={styles.title}>3D Realm Viewer Coming Online</Text>
        <Text style={styles.summary}>
          Obsidian Gate is staged as the first corridor scene while the Unity track brings the
          live environment, encounter trigger, and Gate Warden combat loop online.
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{realmStatus.realm}</Text>
          <Text style={styles.heroSubtitle}>Trial of {realmStatus.trial}</Text>
        </View>

        {realmStatus.realmViewer.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemValue}>{item.value}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.getParent()?.navigate('Home')}
        >
          <Text style={styles.primaryButtonText}>Return to Shadow Crown →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  kicker: {
    color: colors.dim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  summary: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  heroCard: {
    backgroundColor: '#050507',
    borderWidth: 1,
    borderColor: colors.borderAlt,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  heroSubtitle: { color: colors.accent, fontSize: 14, marginTop: 6 },
  itemCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  itemLabel: {
    color: colors.dim,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  itemValue: { color: colors.text, fontSize: 14, fontWeight: '600' },
  primaryButton: {
    marginTop: 8,
    backgroundColor: colors.accentStrong,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
