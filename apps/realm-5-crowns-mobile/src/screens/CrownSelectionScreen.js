import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import factions from '../data/factions.json';
import { usePlayer } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';
import XPBar from '../components/XPBar';

export default function CrownSelectionScreen({ navigation }) {
  const { state, dispatch } = usePlayer();
  const { trackFactionSelect, trackClick } = useHydraEyes();
  const [selectedFaction, setSelectedFaction] = useState(null);

  const currentFactionId = state.faction?.id;
  const isFirstSelection = !state.faction;
  const isCurrentSelection = selectedFaction?.id === currentFactionId;

  const confirmLabel = (() => {
    if (isCurrentSelection) return 'Continue with Current Crown';
    if (isFirstSelection) return 'Claim This Crown';
    return 'Switch Crown';
  })();

  const handlePreview = (faction) => {
    setSelectedFaction(faction);
    trackClick('crown_preview', faction.id);
  };

  const handleConfirm = () => {
    if (!selectedFaction) return;

    trackClick('crown_confirm', selectedFaction.id);

    if (selectedFaction.id === currentFactionId) {
      navigation.navigate('Profile');
      return;
    }

    trackFactionSelect(selectedFaction.id);
    dispatch({ type: 'SET_FACTION', faction: selectedFaction });

    if (isFirstSelection) {
      dispatch({ type: 'ADD_XP', amount: 25 });
    }

    dispatch({ type: 'UNLOCK_CODEX', codexId: selectedFaction.codexUnlock });
    dispatch({
      type: 'LOG_SCENARIO',
      entry: {
        type: 'faction_select',
        factionId: selectedFaction.id,
        previousFactionId: currentFactionId || null,
      },
    });

    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — CROWN EYE</Text>
        <Text style={styles.title}>Choose Your Crown</Text>
        <Text style={styles.subtitle}>
          Select a crown to shape your codex access, trial focus, and operative identity.
        </Text>

        {state.xp > 0 && <XPBar />}

        {currentFactionId && (
          <View style={styles.currentBanner}>
            <Text style={styles.currentBannerText}>
              Active Crown: {state.faction.emoji} {state.faction.shortName}
            </Text>
          </View>
        )}

        {factions.map((faction) => {
          const isSelected = selectedFaction?.id === faction.id;
          const isCurrent = currentFactionId === faction.id;

          return (
            <TouchableOpacity
              key={faction.id}
              style={[
                styles.card,
                {
                  borderColor: isSelected ? faction.accent : faction.color,
                  backgroundColor: faction.bg || '#0d0d14',
                },
                isSelected && styles.cardSelected,
              ]}
              activeOpacity={0.85}
              onPress={() => handlePreview(faction)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardTitleRow}>
                  <Text style={styles.emoji}>{faction.emoji}</Text>
                  <View style={styles.cardTitle}>
                    <Text style={[styles.shortName, { color: faction.accent }]}>{faction.shortName}</Text>
                    <Text style={styles.fullName}>{faction.name}</Text>
                  </View>
                </View>
                <View style={styles.badgeColumn}>
                  {isCurrent && <Text style={styles.currentBadge}>ACTIVE</Text>}
                  {isSelected && <Text style={styles.selectedBadge}>SELECTED</Text>}
                </View>
              </View>
              <Text style={styles.lore}>{faction.lore}</Text>
              <View style={styles.metaGrid}>
                <MetaPill label="Trial Focus" value={faction.trialType} accent={faction.accent} />
                <MetaPill label="Initiation" value={faction.xpBonus} accent={faction.accent} />
                <MetaPill label="Starting Rank" value={faction.startingRank} accent={faction.accent} />
              </View>
            </TouchableOpacity>
          );
        })}

        {selectedFaction && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Selected Crown</Text>
            <Text style={[styles.detailTitle, { color: selectedFaction.accent }]}>
              {selectedFaction.emoji} {selectedFaction.name}
            </Text>
            <Text style={styles.detailText}>
              Codex unlock: {selectedFaction.codexUnlock}
            </Text>
            <Text style={styles.detailText}>
              Trial focus: {selectedFaction.trialType}
            </Text>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: selectedFaction.color }]}
              activeOpacity={0.85}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmBtnText}>{confirmLabel}</Text>
            </TouchableOpacity>
            {!isFirstSelection && !isCurrentSelection && (
              <Text style={styles.helperText}>
                Switching crowns updates your active path and unlocks the new codex without re-awarding the initiation XP.
              </Text>
            )}
          </View>
        )}

        {!selectedFaction && (
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Select a Crown</Text>
            <Text style={styles.detailTitle}>Choose a faction to preview its path.</Text>
            <Text style={styles.detailText}>
              Your first claim grants the initiation codex unlock and starts your operative record.
            </Text>
          </View>
        )}

        <Text style={styles.footer}>
          Realm of 5 Crowns is a fictional game module. All factions are symbolic and cinematic.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaPill({ label, value, accent }) {
  return (
    <View style={styles.metaPill}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={[styles.metaValue, { color: accent }]}>{value}</Text>
    </View>
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
  currentBanner: {
    backgroundColor: '#1a1a2e',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'center',
    marginBottom: 14,
  },
  currentBannerText: {
    color: '#c4b5fd',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 12,
  },
  cardSelected: {
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  badgeColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  emoji: { fontSize: 32 },
  cardTitle: { flex: 1 },
  shortName: { fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  fullName: { color: '#d1d5db', fontSize: 12, marginTop: 2 },
  currentBadge: {
    color: '#e5e7eb',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    backgroundColor: '#1f2937',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  selectedBadge: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  lore: { color: '#e5e7eb', fontSize: 13, lineHeight: 20, marginBottom: 12 },
  metaGrid: {
    gap: 8,
  },
  metaPill: {
    backgroundColor: 'rgba(10, 10, 15, 0.55)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  detailCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    marginTop: 8,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  detailTitle: {
    color: '#e5e7eb',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  detailText: {
    color: '#d1d5db',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  confirmBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  confirmBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 11,
    lineHeight: 18,
    marginTop: 10,
  },
  footer: {
    color: '#374151',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
