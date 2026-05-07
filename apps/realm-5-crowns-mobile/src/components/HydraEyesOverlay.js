import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function clampValue(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function Meter({ label, value, accentColor, trackColor }) {
  const normalizedValue = clampValue(value);

  return (
    <View style={styles.meterBlock}>
      <Text style={[styles.meterLabel, { color: accentColor }]}>{label}</Text>
      <View style={[styles.meterTrack, { backgroundColor: trackColor }]}>
        <View
          style={[
            styles.meterFill,
            {
              backgroundColor: accentColor,
              height: `${normalizedValue}%`,
            },
          ]}
        />
      </View>
      <Text style={styles.meterValue}>{normalizedValue}</Text>
    </View>
  );
}

function StatText({ label, value, accentColor }) {
  return (
    <View style={styles.statTextWrap}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, accentColor && { color: accentColor }]}>{value}</Text>
    </View>
  );
}

export default function HydraEyesOverlay({
  realmName,
  trialName,
  threat,
  opportunity,
  shadow,
  hp,
  crownRank,
  hydraStatus,
}) {
  const insets = useSafeAreaInsets();
  const pulse = useRef(new Animated.Value(0)).current;
  const normalizedThreat = clampValue(threat);
  const normalizedOpportunity = clampValue(opportunity);
  const normalizedShadow = clampValue(shadow);
  const pulseDuration = useMemo(
    () => Math.max(900, 1600 - Math.round((normalizedThreat + normalizedOpportunity + normalizedShadow) * 2.5)),
    [normalizedOpportunity, normalizedShadow, normalizedThreat]
  );

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: pulseDuration,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: pulseDuration,
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();

    return () => {
      loop.stop();
      pulse.stopAnimation();
    };
  }, [pulse, pulseDuration]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.1],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.24, 0.52],
  });

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.topBar, { paddingTop: Math.max(insets.top + 8, 20) }]}>
        <View style={styles.topBarTextWrap}>
          <Text style={styles.realmText}>{realmName}</Text>
          <Text style={styles.supportText}>Meaning Layer</Text>
        </View>
        <View style={styles.topBarTextWrap}>
          <Text style={styles.trialText}>{trialName}</Text>
          <Text style={[styles.supportText, styles.alignRight]}>Trial Vector</Text>
        </View>
      </View>

      <View style={[styles.leftColumn, { top: Math.max(insets.top + 92, 110) }]}>
        <Meter label="THREAT" value={threat} accentColor="#FF3B3B" trackColor="#220000" />
        <Meter label="OPPORTUNITY" value={opportunity} accentColor="#00E5FF" trackColor="#001818" />
        <Meter label="SHADOW" value={shadow} accentColor="#7A00FF" trackColor="#140022" />
      </View>

      <View style={[styles.threatCallout, { top: Math.max(insets.top + 78, 88) }]}>
        <Text style={styles.calloutLabel}>Threat</Text>
        <Text style={[styles.calloutValue, { color: '#FF3B3B' }]}>{normalizedThreat}</Text>
      </View>

      <View style={styles.centerOverlay}>
        <Animated.View
          style={[
            styles.intentPulse,
            {
              opacity: pulseOpacity,
              transform: [{ scale: pulseScale }],
            },
          ]}
        />
        <View style={styles.enemyHighlightOuter}>
          <View style={styles.enemyHighlightInner} />
        </View>
        <Text style={styles.intentLabel}>INTENT</Text>
      </View>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom + 12, 20) }]}>
        <View style={styles.statsPanel}>
          <StatText label="HP" value={hp} accentColor="#e5e7eb" />
          <StatText label="Crown Rank" value={crownRank} accentColor="#00FFF2" />
          <StatText label="Realm" value={realmName} />
          <StatText label="Trial" value={trialName} />
        </View>

        <View style={styles.statusWrap}>
          <Text style={styles.statusText}>{hydraStatus}</Text>
          <View style={styles.statusMetrics}>
            <Text style={[styles.statusMetric, { color: '#00E5FF' }]}>Opportunity {normalizedOpportunity}</Text>
            <Text style={[styles.statusMetric, { color: '#7A00FF' }]}>Shadow {normalizedShadow}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    minHeight: 80,
    paddingHorizontal: 18,
    paddingBottom: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  topBarTextWrap: {
    flex: 1,
  },
  realmText: {
    color: '#00FFF2',
    fontSize: 18,
    fontWeight: '800',
  },
  trialText: {
    color: '#AACCFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
  },
  supportText: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 4,
  },
  alignRight: {
    textAlign: 'right',
  },
  leftColumn: {
    position: 'absolute',
    left: 12,
    width: 82,
    height: '58%',
    justifyContent: 'space-between',
  },
  meterBlock: {
    alignItems: 'center',
    gap: 6,
  },
  meterLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  meterTrack: {
    width: 28,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  meterFill: {
    width: '100%',
    borderRadius: 16,
  },
  meterValue: {
    color: '#d1d5db',
    fontSize: 11,
    fontWeight: '700',
  },
  threatCallout: {
    position: 'absolute',
    top: 88,
    right: 18,
    alignItems: 'flex-end',
  },
  calloutLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  calloutValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  centerOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 220,
    height: 220,
    marginLeft: -110,
    marginTop: -110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intentPulse: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: 'rgba(170, 204, 255, 0.55)',
    backgroundColor: 'rgba(170, 204, 255, 0.18)',
  },
  enemyHighlightOuter: {
    width: 86,
    height: 126,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 242, 0.42)',
    shadowColor: '#00FFF2',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  enemyHighlightInner: {
    width: 58,
    height: 96,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 242, 0.25)',
  },
  intentLabel: {
    marginTop: 16,
    color: '#AACCFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 100,
    paddingHorizontal: 18,
    paddingTop: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  statsPanel: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statTextWrap: {
    minWidth: '42%',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  statValue: {
    color: '#d1d5db',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  statusWrap: {
    alignItems: 'flex-end',
    maxWidth: 180,
  },
  statusText: {
    color: '#00FFF2',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textShadowColor: 'rgba(0, 255, 242, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  statusMetrics: {
    marginTop: 8,
    alignItems: 'flex-end',
    gap: 2,
  },
  statusMetric: {
    fontSize: 11,
    fontWeight: '700',
  },
});
