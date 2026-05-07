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
import { usePlayer } from '../hooks/usePlayer';
import colors from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const { state } = usePlayer();

  const handleTabJump = (routeName) => {
    navigation.getParent()?.navigate(routeName);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.kicker}>🜁 COMPANION APP CORE</Text>
        <Text style={styles.title}>{realmStatus.title}</Text>
        <Text style={styles.meta}>Realm: {realmStatus.realm}</Text>
        <Text style={styles.meta}>Trial: {realmStatus.trial}</Text>
        <Text style={styles.summary}>{realmStatus.summary}</Text>

        <View style={styles.statusCard}>
          <Text style={styles.sectionLabel}>Current Operative</Text>
          <Text style={styles.statusText}>
            {state.faction
              ? `${state.faction.emoji} ${state.faction.shortName} · Level ${state.level}`
              : 'No crown chosen yet'}
          </Text>
          <Text style={styles.statusSubtle}>
            {state.faction
              ? `${state.codexUnlocks.length} codex unlocks · ${state.scenarioHistory.length} logged events`
              : 'Choose a crown to begin the Obsidian Gate loop.'}
          </Text>
        </View>

        <View style={styles.quickGrid}>
          <QuickAction
            label="Choose Crown"
            emoji="👑"
            onPress={() => navigation.navigate('FactionSelect')}
          />
          <QuickAction
            label="Trial Arenas"
            emoji="⚔️"
            onPress={() => navigation.navigate('ScenariosHub')}
          />
          <QuickAction
            label="Codex"
            emoji="📜"
            onPress={() => handleTabJump('Codex')}
          />
          <QuickAction
            label="Realm Viewer"
            emoji="🌑"
            onPress={() => handleTabJump('Realm')}
          />
        </View>

        <Text style={styles.sectionLabel}>Launch Status</Text>
        {realmStatus.highlights.map((item) => (
          <View key={item.id} style={styles.highlightCard}>
            <Text style={styles.highlightTitle}>{item.title}</Text>
            <Text style={styles.highlightDetail}>{item.detail}</Text>
          </View>
        ))}

        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.profileButtonText}>Open Operative Profile →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function QuickAction({ emoji, label, onPress }) {
  return (
    <TouchableOpacity style={styles.quickCard} activeOpacity={0.85} onPress={onPress}>
      <Text style={styles.quickEmoji}>{emoji}</Text>
      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: 20, paddingBottom: 40 },
  kicker: {
    color: colors.dim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: { color: colors.text, fontSize: 28, fontWeight: '800' },
  meta: { color: colors.muted, fontSize: 15, marginTop: 8 },
  summary: { color: colors.dim, fontSize: 14, lineHeight: 22, marginTop: 12, marginBottom: 18 },
  statusCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderAlt,
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  sectionLabel: {
    color: colors.dim,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  statusText: { color: colors.text, fontSize: 16, fontWeight: '700' },
  statusSubtle: { color: colors.muted, fontSize: 12, marginTop: 6 },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 18,
  },
  quickCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
  },
  quickEmoji: { fontSize: 22, marginBottom: 10 },
  quickLabel: { color: colors.text, fontSize: 13, fontWeight: '600' },
  highlightCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  highlightTitle: { color: colors.accent, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  highlightDetail: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  profileButton: {
    marginTop: 8,
    backgroundColor: colors.accentStrong,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  profileButtonText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});
