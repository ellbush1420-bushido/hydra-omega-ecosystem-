// Shared scenario screen used by Shadow Arena, Kingdom Raid, and Hydra Labyrinth
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { usePlayer } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';
import XPBar from '../components/XPBar';

export default function ScenarioScreen({ route, navigation }) {
  const { scenario, scenarioType } = route.params;
  const { dispatch } = usePlayer();
  const {
    trackScenarioStart,
    trackScenarioChoice,
    trackCodexUnlock,
    trackJoin,
    trackSale,
    trackXPGain,
    trackTigerPromotion,
    trackClick,
  } = useHydraEyes();

  const [chosen, setChosen] = useState(null);

  React.useEffect(() => {
    trackScenarioStart(scenario.id, scenarioType);
  }, []);

  const handleChoice = (choice) => {
    if (chosen) return;
    setChosen(choice);
    trackClick('scenario_choice', choice.id);

    const outcomeData = {
      xp: choice.xp,
      scaleScore: choice.scaleScore,
      mockRevenue: choice.mockRevenue,
      mockJoins: choice.mockJoins,
      mockSales: choice.mockSales,
    };
    trackScenarioChoice(scenario.id, choice.id, outcomeData);

    // Apply XP
    if (choice.xp) {
      dispatch({ type: 'ADD_XP', amount: choice.xp });
      trackXPGain(choice.xp, scenario.id);
    }

    // Apply scale score + stats
    dispatch({
      type: 'ADD_MOCK_STATS',
      joins: choice.mockJoins || 0,
      sales: choice.mockSales || 0,
      revenue: choice.mockRevenue || 0,
      scaleScore: choice.scaleScore || 0,
      clicks: 1,
    });

    // Codex unlock
    if (choice.codexUnlock) {
      dispatch({ type: 'UNLOCK_CODEX', codexId: choice.codexUnlock });
      trackCodexUnlock(choice.codexUnlock);
    }

    // Tiger promotion
    if (choice.tigerPromotion) {
      dispatch({ type: 'PROMOTE_TIGER', rank: choice.tigerPromotion });
      trackTigerPromotion(choice.tigerPromotion);
    }

    // Mock joins / sales
    if (choice.mockJoins > 0) trackJoin();
    if (choice.mockSales > 0) trackSale('game_scenario', choice.mockRevenue || 0);

    // Log to history
    dispatch({
      type: 'LOG_SCENARIO',
      entry: {
        type: 'scenario_choice',
        scenarioId: scenario.id,
        choiceId: choice.id,
        outcome: choice.outcome,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.typeLabel}>
          {scenarioType === 'shadowArena' && '⚔️ SHADOW ARENA'}
          {scenarioType === 'kingdomRaid' && '🏰 KINGDOM RAID'}
          {scenarioType === 'hydraLabyrinth' && '🌀 HYDRA LABYRINTH'}
        </Text>

        <Text style={styles.title}>{scenario.title}</Text>
        <Text style={styles.description}>{scenario.description}</Text>

        <XPBar />

        <Text style={styles.choiceLabel}>Choose your path:</Text>

        {scenario.choices.map((c) => {
          const isChosen = chosen?.id === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.choiceCard,
                isChosen && styles.choiceCardChosen,
                chosen && !isChosen && styles.choiceCardDimmed,
              ]}
              onPress={() => handleChoice(c)}
              disabled={!!chosen}
              activeOpacity={0.8}
            >
              <Text style={styles.choiceText}>{c.text}</Text>
              {isChosen && (
                <View style={styles.outcomeBox}>
                  <Text style={styles.outcomeLabel}>Outcome</Text>
                  <Text style={styles.outcomeText}>{c.outcome}</Text>
                  <View style={styles.rewardRow}>
                    <Text style={styles.reward}>+{c.xp} XP</Text>
                    <Text style={styles.reward}>📈 +{c.scaleScore} Score</Text>
                    {c.mockRevenue > 0 && (
                      <Text style={styles.reward}>💰 +${c.mockRevenue}</Text>
                    )}
                    {c.tigerPromotion && (
                      <Text style={styles.reward}>🐯 {c.tigerPromotion}</Text>
                    )}
                    {c.codexUnlock && (
                      <Text style={styles.reward}>📜 Codex</Text>
                    )}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {chosen && (
          <View style={styles.navRow}>
            <TouchableOpacity
              style={styles.navBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.navBtnText}>← Back to Scenarios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navBtn, styles.navBtnPrimary]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Text style={[styles.navBtnText, styles.navBtnTextPrimary]}>View Profile →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a0f' },
  scroll: { padding: 16, paddingBottom: 40 },
  typeLabel: {
    color: '#4b5563',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    color: '#e5e7eb',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
  },
  description: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  choiceLabel: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginTop: 8,
  },
  choiceCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 14,
    marginBottom: 10,
  },
  choiceCardChosen: {
    borderColor: '#7c3aed',
    backgroundColor: '#0f0a1e',
  },
  choiceCardDimmed: {
    opacity: 0.4,
  },
  choiceText: {
    color: '#e5e7eb',
    fontSize: 14,
    lineHeight: 20,
  },
  outcomeBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  outcomeLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  outcomeText: {
    color: '#d1d5db',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  reward: {
    color: '#a78bfa',
    fontSize: 11,
    fontWeight: '600',
    backgroundColor: '#1a1a2e',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  navRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  navBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
    alignItems: 'center',
  },
  navBtnPrimary: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  navBtnText: {
    color: '#9ca3af',
    fontSize: 13,
    fontWeight: '600',
  },
  navBtnTextPrimary: {
    color: '#fff',
  },
});
