import React, { useMemo, useState } from 'react';
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
import { formatStatLabel } from '../lib/codex';
import { getShadowCrownState } from '../lib/shadowCrown';
import { describeTrial } from '../lib/trials';
import { unlockCodexEntry } from '../lib/supabase';
import XPBar from '../components/XPBar';
import ShadowCrownPanel from '../components/ShadowCrownPanel';

export default function ScenarioScreen({ route, navigation }) {
  const { scenario, realm } = route.params;
  const { state, dispatch } = usePlayer();
  const {
    trackScenarioStart,
    trackScenarioChoice,
    trackCodexUnlock,
    trackXPGain,
    trackClick,
  } = useHydraEyes();

  const [chosen, setChosen] = useState(null);

  const crown = useMemo(() => getShadowCrownState(state.level), [state.level]);
  const trialDetails = useMemo(
    () => describeTrial(scenario.trialType, realm.tier),
    [scenario.trialType, realm.tier]
  );

  React.useEffect(() => {
    trackScenarioStart(scenario.id, realm.id);
  }, [scenario.id, realm.id, trackScenarioStart]);

  const handleChoice = (choice) => {
    if (chosen) return;

    trackClick('scenario_choice', choice.id);

    const statValue = crown.stats[choice.stat] || 0;
    const roll = Math.floor(Math.random() * 10) + 1;
    const total = statValue + roll;
    const victory = total >= trialDetails.dc;
    const xpAward = victory ? choice.xpSuccess : choice.xpFailure;
    const outcomeText = victory ? choice.successText : choice.failureText;
    const unlockedRealmId = victory ? realm.unlocks : null;
    const codexUnlock =
      (victory && (choice.codexUnlockOnVictory || scenario.codexUnlockOnVictory)) || null;

    const result = {
      ...choice,
      roll,
      total,
      victory,
      xpAward,
      outcomeText,
      codexUnlock,
      unlockedRealmId,
    };

    setChosen(result);
    trackScenarioChoice(scenario.id, choice.id, {
      xp: xpAward,
      scaleScore: realm.tier * (victory ? 5 : 2),
      mock: true,
      extra: {
        realmId: realm.id,
        trialType: scenario.trialType,
        victory,
        total,
        dc: trialDetails.dc,
      },
    });

    if (xpAward) {
      dispatch({ type: 'ADD_XP', amount: xpAward });
      trackXPGain(xpAward, scenario.id);
    }

    dispatch({
      type: 'ADD_MOCK_STATS',
      scaleScore: realm.tier * (victory ? 5 : 2),
      clicks: 1,
    });

    if (unlockedRealmId) {
      dispatch({ type: 'UNLOCK_REALM', realmId: unlockedRealmId });
    }

    if (codexUnlock) {
      dispatch({ type: 'UNLOCK_CODEX', codexId: codexUnlock });
      trackCodexUnlock(codexUnlock);
      unlockCodexEntry(codexUnlock);
    }

    dispatch({
      type: 'LOG_SCENARIO',
      entry: {
        type: 'scenario_choice',
        scenarioId: scenario.id,
        choiceId: choice.id,
        outcome: outcomeText,
        victory,
        realmId: realm.id,
        realmTitle: realm.title,
        trialTitle: scenario.title,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.typeLabel}>{realm.title.toUpperCase()}</Text>

        <Text style={styles.title}>{scenario.title}</Text>
        <Text style={styles.description}>{scenario.description}</Text>

        <XPBar />
        <ShadowCrownPanel compact />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Trial difficulty</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryPill}>{scenario.trialType}</Text>
            <Text style={styles.summaryPill}>DC {trialDetails.dc}</Text>
            <Text style={styles.summaryPill}>{trialDetails.damageProfile}</Text>
          </View>
          <Text style={styles.focusText}>
            Best stats: {trialDetails.statFocus.map((stat) => formatStatLabel(stat)).join(' · ')}
          </Text>
        </View>

        <Text style={styles.choiceLabel}>Choose your approach:</Text>

        {scenario.choices.map((choice) => {
          const isChosen = chosen?.id === choice.id;
          const statValue = crown.stats[choice.stat] || 0;

          return (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceCard,
                isChosen && (chosen.victory ? styles.choiceCardVictory : styles.choiceCardDefeat),
                chosen && !isChosen && styles.choiceCardDimmed,
              ]}
              onPress={() => handleChoice(choice)}
              disabled={!!chosen}
              activeOpacity={0.85}
            >
              <View style={styles.choiceHeader}>
                <Text style={styles.choiceText}>{choice.text}</Text>
                <Text style={styles.statPill}>
                  {choice.stat.toUpperCase()} {statValue}
                </Text>
              </View>
              <Text style={styles.choiceMeta}>
                Success: +{choice.xpSuccess} XP · Failure: +{choice.xpFailure} XP
              </Text>
              {isChosen && (
                <View style={styles.outcomeBox}>
                  <Text style={styles.outcomeLabel}>{chosen.victory ? 'Victory' : 'Defeat'}</Text>
                  <Text style={styles.outcomeText}>{chosen.outcomeText}</Text>
                  <View style={styles.rewardRow}>
                    <Text style={styles.reward}>Roll {chosen.roll}</Text>
                    <Text style={styles.reward}>Total {chosen.total}</Text>
                    <Text style={styles.reward}>DC {trialDetails.dc}</Text>
                    <Text style={styles.reward}>+{chosen.xpAward} XP</Text>
                    {chosen.unlockedRealmId && (
                      <Text style={styles.reward}>🔓 Next Realm</Text>
                    )}
                    {chosen.codexUnlock && <Text style={styles.reward}>📜 Codex</Text>}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          );
        })}

        {chosen && (
          <View style={styles.navRow}>
            <TouchableOpacity style={styles.navBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.navBtnText}>← Back to Realms</Text>
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
  summaryCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  summaryPill: {
    color: '#a78bfa',
    fontSize: 10,
    fontWeight: '700',
    backgroundColor: '#16142a',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  focusText: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 8,
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
  choiceCardVictory: {
    borderColor: '#059669',
    backgroundColor: '#0c1712',
  },
  choiceCardDefeat: {
    borderColor: '#7f1d1d',
    backgroundColor: '#1a0e11',
  },
  choiceCardDimmed: {
    opacity: 0.45,
  },
  choiceHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceText: {
    color: '#e5e7eb',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  statPill: {
    color: '#f59e0b',
    fontSize: 11,
    fontWeight: '700',
  },
  choiceMeta: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 6,
  },
  outcomeBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
  },
  outcomeLabel: {
    color: '#e5e7eb',
    fontSize: 11,
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
