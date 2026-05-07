import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import factions from '../data/factions.json';
import { usePlayer, getFactionCodexKey } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';
import XPBar from '../components/XPBar';
import { isSupabaseConfigured, unlockCodexEntry } from '../lib/supabase';

export default function FactionSelectScreen({ navigation }) {
  const { state, dispatch } = usePlayer();
  const { trackFactionSelect, trackClick, trackCodexUnlock } = useHydraEyes();

  const handleSelect = (faction) => {
    const codexKey = getFactionCodexKey(faction.id) || faction.codexUnlock;
    trackClick('faction_card', faction.id);
    trackFactionSelect(faction.id);
    dispatch({ type: 'SET_FACTION', faction });
    dispatch({ type: 'ADD_XP', amount: 25 });
    dispatch({ type: 'UNLOCK_CODEX', codexId: codexKey });
    dispatch({ type: 'LOG_SCENARIO', entry: { type: 'faction_select', factionId: faction.id } });
    trackCodexUnlock(codexKey);

    if (isSupabaseConfigured) {
      unlockCodexEntry(codexKey).catch(() => {});
    }

    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — CROWN EYE</Text>
        <Text style={styles.title}>Choose Your Crown</Text>
        <Text style={styles.subtitle}>
          Five factions. One Shadow Crown. Your choice shapes every gate ahead.
        </Text>

        {state.xp > 0 && <XPBar />}

        {factions.map((faction) => (
          <TouchableOpacity
            key={faction.id}
            style={[styles.card, { borderColor: faction.color }]}
            activeOpacity={0.8}
            onPress={() => handleSelect(faction)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.emoji}>{faction.emoji}</Text>
              <View style={styles.cardTitle}>
                <Text style={[styles.shortName, { color: faction.accent }]}>{faction.shortName}</Text>
                <Text style={styles.fullName}>{faction.name}</Text>
              </View>
            </View>
            <Text style={styles.lore}>{faction.lore}</Text>
            <View style={styles.bonusRow}>
              <Text style={[styles.bonus, { color: faction.accent }]}>⚡ {faction.xpBonus}</Text>
              <Text style={styles.rank}>📜 {getFactionCodexKey(faction.id)?.replace('codex.', '')}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={styles.footer}>
          Realm of 5 Crowns is a fictional game module. All factions are symbolic and cinematic.
        </Text>
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
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#e5e7eb',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#0d0d14',
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 12,
  },
  emoji: { fontSize: 32 },
  cardTitle: { flex: 1 },
  shortName: { fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  fullName: { color: '#9ca3af', fontSize: 12, marginTop: 2 },
  lore: { color: '#d1d5db', fontSize: 13, lineHeight: 20, marginBottom: 10 },
  bonusRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  bonus: { fontSize: 11, fontWeight: '600', flex: 1 },
  rank: { color: '#6b7280', fontSize: 11, textTransform: 'capitalize' },
  footer: {
    color: '#374151',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
