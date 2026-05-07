import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function HydraEyesOverlay({
  crownName = 'Unbound Crown',
  realmName = 'Unclaimed Threshold',
  trialName = 'Awakening',
  lastResult = 'None',
  threat = 0,
  opportunity = 0,
  shadow = 0,
}) {
  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View style={styles.topBar}>
        <Text style={styles.realm}>{realmName}</Text>
        <Text style={styles.trial}>{trialName}</Text>
      </View>

      <View style={styles.crownBlock}>
        <Text style={styles.crown}>{crownName}</Text>
        <Text style={styles.lastResult}>Last: {lastResult}</Text>
      </View>

      <View style={styles.threatBlock}>
        <Text style={styles.threat}>Threat: {threat}</Text>
      </View>

      <View style={styles.opportunityBlock}>
        <Text style={styles.opportunity}>Opportunity: {opportunity}</Text>
      </View>

      <View style={styles.shadowBlock}>
        <Text style={styles.shadow}>Shadow: {shadow}</Text>
      </View>

      <View style={styles.intentPulse}>
        <Text style={styles.intentText}>INTENT</Text>
      </View>
    </View>
  );
}

export default HydraEyesOverlay;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topBar: {
    paddingTop: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  realm: {
    color: '#00fff2',
    fontSize: 18,
    fontWeight: '700',
  },
  trial: {
    color: '#aaccff',
    fontSize: 14,
  },
  crownBlock: {
    position: 'absolute',
    top: 72,
    left: 16,
  },
  crown: {
    color: '#00fff2',
    fontSize: 14,
    fontWeight: '700',
  },
  lastResult: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
  threatBlock: {
    position: 'absolute',
    top: 24,
    right: 16,
  },
  threat: {
    color: '#ff3b3b',
    fontSize: 13,
    fontWeight: '700',
  },
  opportunityBlock: {
    position: 'absolute',
    bottom: 24,
    left: 16,
  },
  opportunity: {
    color: '#00e5ff',
    fontSize: 13,
    fontWeight: '700',
  },
  shadowBlock: {
    position: 'absolute',
    bottom: 24,
    right: 16,
  },
  shadow: {
    color: '#7a00ff',
    fontSize: 13,
    fontWeight: '700',
  },
  intentPulse: {
    position: 'absolute',
    top: '45%',
    left: '45%',
  },
  intentText: {
    color: '#aaccff',
    fontSize: 12,
    letterSpacing: 1.5,
  },
});
