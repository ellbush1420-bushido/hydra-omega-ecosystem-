import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import HydraEyesOverlay from '../components/HydraEyesOverlay';
import RealmCanvas from '../components/RealmCanvas';
import { usePlayer } from '../hooks/usePlayer';
import { getHydraEyesSnapshot } from '../lib/realmState';

export default function RealmViewerScreen() {
  const { state } = usePlayer();
  const hydraEyes = useMemo(() => getHydraEyesSnapshot(state), [state]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.viewerFrame}>
        <RealmCanvas
          threat={hydraEyes.threat}
          opportunity={hydraEyes.opportunity}
          shadow={hydraEyes.shadow}
        />
        <HydraEyesOverlay
          realmName={hydraEyes.realmName}
          trialName={hydraEyes.trialName}
          threat={hydraEyes.threat}
          opportunity={hydraEyes.opportunity}
          shadow={hydraEyes.shadow}
          hp={hydraEyes.hp}
          crownRank={hydraEyes.crownRank}
          hydraStatus={hydraEyes.hydraStatus}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#05060a' },
  viewerFrame: {
    flex: 1,
  },
});
