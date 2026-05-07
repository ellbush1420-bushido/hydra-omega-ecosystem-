import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

import { usePlayer } from '../hooks/usePlayer';
import { buildPlayerStatePayload, fetchPlayerState, isSupabaseConfigured } from '../lib/supabase';

const HUD_COLORS = {
  threat: '#FF3B3B',
  opportunity: '#00E5FF',
  shadow: '#7A00FF',
  intentBase: '#AACCFF',
  text: '#00FFF2',
};

const PANEL_BG = 'rgba(0, 0, 0, 0.35)';

const CROWN_IDS = {
  shadow_serpent: 1,
  scarlet_temple: 2,
  ophiuchus: 3,
  black_sun: 4,
  lazarus: 5,
};

const THREAT_CONFIG = {
  levelMultiplier: 8,
  remoteSyncBonus: 6,
  trialBonus: {
    default: 12,
    steel: 26,
    siege: 18,
  },
  realmBonus: {
    default: 6,
    obsidian: 14,
  },
};

const HUD_SCALE = {
  overlayPulseDivisor: 220,
  sceneIntentDivisor: 480,
  opportunityOpacityDivisor: 170,
  shadowOpacityDivisor: 170,
  threatOpacityDivisor: 220,
  attackOpacityDivisor: 150,
  highlightOpacityDivisor: 180,
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function mixHexColors(fromHex, toHex, ratio) {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  const amount = clamp(ratio, 0, 1);

  const channel = (start, end) => Math.round(start + (end - start) * amount);

  return `#${channel(from.r, to.r).toString(16).padStart(2, '0')}${channel(from.g, to.g)
    .toString(16)
    .padStart(2, '0')}${channel(from.b, to.b).toString(16).padStart(2, '0')}`.toUpperCase();
}

function hexToRgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getCurrentScenarioId(state) {
  return state.scenarioHistory.find((entry) => entry.scenarioId)?.scenarioId || '';
}

function getTrialId(scenarioId) {
  if (scenarioId.startsWith('sa_')) return 1;
  if (scenarioId.startsWith('kr_')) return 2;
  if (scenarioId.startsWith('hl_')) return 3;
  return 0;
}

function getRealmId(realmName) {
  return realmName === 'Obsidian Gate' ? 1 : 2;
}

function deriveViewerState(localState, remoteState) {
  const snapshot = buildPlayerStatePayload(localState);
  const scenarioId = getCurrentScenarioId(localState);
  const trialId = getTrialId(scenarioId);
  const realmName = remoteState?.realm || snapshot.realm;
  const trialName = remoteState?.trial || snapshot.trial;
  const realmId = getRealmId(realmName);
  const crownKey = localState.faction?.id ?? remoteState?.faction_id;
  const crownId = crownKey ? CROWN_IDS[crownKey] || 0 : 0;

  const threatLevel = clamp(
    localState.level * THREAT_CONFIG.levelMultiplier +
      (trialId === 1
        ? THREAT_CONFIG.trialBonus.steel
        : trialId === 2
          ? THREAT_CONFIG.trialBonus.siege
          : THREAT_CONFIG.trialBonus.default) +
      (realmId === 1 ? THREAT_CONFIG.realmBonus.obsidian : THREAT_CONFIG.realmBonus.default) +
      (remoteState ? THREAT_CONFIG.remoteSyncBonus : 0),
    0,
    100
  );

  const opportunityLevel = clamp(
    localState.mockStats.scaleScore * 2 +
      localState.mockStats.joins * 10 +
      localState.mockStats.sales * 8 +
      (localState.faction ? 14 : 0) +
      (trialId === 3 ? 14 : 0),
    0,
    100
  );

  const shadowAdvantage = clamp(
    (crownId === 1 ? 34 : 8) +
      (localState.tigerRank?.startsWith('white_tiger') ? 28 : 0) +
      (localState.tigerRank?.startsWith('black_tiger') ? 18 : 0) +
      (realmId === 1 ? 16 : 0),
    0,
    100
  );

  return {
    crownId,
    enemyAboutToStrike: threatLevel >= 70 || trialId === 1,
    intentColor: mixHexColors(HUD_COLORS.intentBase, HUD_COLORS.threat, threatLevel / 100),
    opportunityLevel,
    opportunityText:
      opportunityLevel >= 60 ? 'Openings exposed' : 'Scanning for fractures',
    realmId,
    realmName,
    shadowAdvantage,
    shadowText:
      shadowAdvantage >= 60 ? 'Shadow edge secured' : 'Shadow lanes forming',
    syncText: !isSupabaseConfigured
      ? 'Local doctrine overlay'
      : remoteState
        ? 'Supabase overlay synced'
        : 'Supabase echo pending',
    threatLabel:
      threatLevel >= 70 ? 'Imminent strike' : threatLevel >= 40 ? 'Elevated' : 'Measured',
    threatLevel,
    trialId,
    trialName,
  };
}

function createFlowLine(points, color, opacity) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
  });
  return new THREE.Line(geometry, material);
}

function HydraEyesHUDOverlay({ loadingRemote, pulseValue, viewerState }) {
  const pulseScale = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1 + viewerState.threatLevel / HUD_SCALE.overlayPulseDivisor],
  });

  const pulseOpacity = pulseValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.45, viewerState.enemyAboutToStrike ? 0.95 : 0.72],
  });

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.topRow}>
        <View style={[styles.panel, styles.topLeftPanel]}>
          <Text style={styles.panelLabel}>Realm Name</Text>
          <Text style={styles.realmName}>{viewerState.realmName}</Text>
          <Text style={styles.trialName}>{viewerState.trialName}</Text>
        </View>

        <View style={[styles.panel, styles.topRightPanel]}>
          <Text style={[styles.panelLabel, styles.rightAligned]}>Threat Level</Text>
          <Text style={[styles.metricValue, styles.rightAligned, { color: HUD_COLORS.threat }]}>
            {viewerState.threatLevel}%
          </Text>
          <Text style={[styles.metricNote, styles.rightAligned]}>{viewerState.threatLabel}</Text>
          {loadingRemote ? (
            <ActivityIndicator color={HUD_COLORS.text} size="small" style={styles.loader} />
          ) : (
            <Text style={[styles.syncText, styles.rightAligned]}>{viewerState.syncText}</Text>
          )}
        </View>
      </View>

      <View style={styles.centerOverlay}>
        <Animated.View
          style={[
            styles.centerPulseGlow,
            styles.intentPulseOuter,
            {
              backgroundColor: hexToRgba(viewerState.intentColor, 0.12),
              borderColor: viewerState.intentColor,
              opacity: pulseOpacity,
              transform: [{ scale: pulseScale }],
            },
          ]}
        >
          <View
            style={[
              styles.intentPulseInner,
              {
                backgroundColor: hexToRgba(viewerState.intentColor, 0.18),
                borderColor: viewerState.intentColor,
              },
            ]}
          />
        </Animated.View>
        <Text style={styles.intentTitle}>Intent Pulse</Text>
        <Text style={styles.intentStatus}>Hydra Eyes: ACTIVE</Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={[styles.panel, styles.bottomPanel]}>
          <Text style={styles.panelLabel}>Opportunity</Text>
          <Text style={[styles.metricValue, { color: HUD_COLORS.opportunity }]}>
            {viewerState.opportunityLevel}%
          </Text>
          <Text style={styles.metricNote}>{viewerState.opportunityText}</Text>
        </View>

        <View style={[styles.panel, styles.bottomPanel, styles.bottomRightPanel]}>
          <Text style={[styles.panelLabel, styles.rightAligned]}>Shadow Advantage</Text>
          <Text style={[styles.metricValue, styles.rightAligned, { color: HUD_COLORS.shadow }]}>
            {viewerState.shadowAdvantage}%
          </Text>
          <Text style={[styles.metricNote, styles.rightAligned]}>{viewerState.shadowText}</Text>
        </View>
      </View>
    </View>
  );
}

export default function RealmViewerScreen() {
  const frameRef = useRef(null);
  const cleanupRef = useRef(() => {});
  const pulseValue = useRef(new Animated.Value(0)).current;
  const viewerStateRef = useRef(null);

  const { state } = usePlayer();
  const [remoteState, setRemoteState] = useState(null);
  const [loadingRemote, setLoadingRemote] = useState(isSupabaseConfigured);

  const viewerState = useMemo(() => deriveViewerState(state, remoteState), [remoteState, state]);
  viewerStateRef.current = viewerState;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulseValue]);

  useEffect(() => {
    let active = true;

    if (!isSupabaseConfigured) {
      setLoadingRemote(false);
      return () => {
        active = false;
      };
    }

    setLoadingRemote(true);

    fetchPlayerState()
      .then(({ data }) => {
        if (active) {
          setRemoteState(data);
        }
      })
      .catch(() => {
        if (active) {
          setRemoteState(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingRemote(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const onContextCreate = useCallback((gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05060a);
    scene.fog = new THREE.FogExp2(0x05060a, 0.15);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4);
    camera.lookAt(0, 1, 0);

    const renderer = new Renderer({ gl });
    renderer.setClearColor(0x05060a);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambientLight = new THREE.AmbientLight(0x4c3f69, 1.15);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xded7ff, 1.8);
    mainLight.position.set(4, 8, 6);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 40;
    mainLight.shadow.camera.left = -12;
    mainLight.shadow.camera.right = 12;
    mainLight.shadow.camera.top = 12;
    mainLight.shadow.camera.bottom = -12;
    scene.add(mainLight);

    const fillLight = new THREE.PointLight(0x7c3aed, 20, 18, 2);
    fillLight.position.set(0, 3, -7);
    scene.add(fillLight);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 28),
      new THREE.MeshStandardMaterial({
        color: 0x11131a,
        roughness: 0.92,
        metalness: 0.12,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -1.2, -4);
    floor.receiveShadow = true;
    scene.add(floor);

    const corridor = new THREE.Group();
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x171923,
      roughness: 0.88,
      metalness: 0.2,
    });

    for (let index = 0; index < 6; index += 1) {
      const depth = 2 - index * 3;

      const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.75, 3.5, 0.75), wallMaterial);
      leftPillar.position.set(-2.6, 0.55, depth);
      leftPillar.castShadow = true;
      leftPillar.receiveShadow = true;
      corridor.add(leftPillar);

      const rightPillar = leftPillar.clone();
      rightPillar.position.x = 2.6;
      corridor.add(rightPillar);

      const lintel = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.4, 0.75), wallMaterial);
      lintel.position.set(0, 2.25, depth);
      lintel.castShadow = true;
      lintel.receiveShadow = true;
      corridor.add(lintel);
    }

    const gate = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.05, 0.28, 120, 18),
      new THREE.MeshStandardMaterial({
        color: 0x9370db,
        emissive: 0x24113d,
        emissiveIntensity: 1,
        roughness: 0.35,
        metalness: 0.82,
      })
    );
    gate.position.set(0, 1.1, -8.2);
    gate.castShadow = true;
    gate.receiveShadow = true;
    corridor.add(gate);

    const gateHalo = new THREE.Mesh(
      new THREE.RingGeometry(1.55, 2.15, 64),
      new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22,
      })
    );
    gateHalo.position.set(0, 1.1, -8.45);
    corridor.add(gateHalo);

    const threatZone = new THREE.Mesh(
      new THREE.RingGeometry(1.7, 2.55, 48),
      new THREE.MeshBasicMaterial({
        color: 0xff3b3b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
      })
    );
    threatZone.rotation.x = -Math.PI / 2;
    threatZone.position.set(0, -1.09, -3.8);
    threatZone.visible = false;
    scene.add(threatZone);

    const shadowZone = new THREE.Mesh(
      new THREE.CircleGeometry(1.3, 48),
      new THREE.MeshBasicMaterial({
        color: 0x7a00ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.18,
      })
    );
    shadowZone.rotation.x = -Math.PI / 2;
    shadowZone.position.set(-1.45, -1.08, -6.2);
    shadowZone.visible = false;
    scene.add(shadowZone);

    const intentPulse = new THREE.Mesh(
      new THREE.CircleGeometry(0.45, 48),
      new THREE.MeshBasicMaterial({
        color: 0xaaccff,
        transparent: true,
        opacity: 0.45,
      })
    );
    intentPulse.position.set(0, 1.05, -2.25);
    scene.add(intentPulse);

    const openingLine = createFlowLine(
      [new THREE.Vector3(0, -0.85, 0.8), new THREE.Vector3(1.6, -0.3, -3.6)],
      0x00e5ff,
      0.55
    );
    scene.add(openingLine);

    const shadowLine = createFlowLine(
      [new THREE.Vector3(0, -0.85, 0.8), new THREE.Vector3(-1.45, -0.75, -6.2)],
      0x7a00ff,
      0.3
    );
    scene.add(shadowLine);

    const attackCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(1.2, 1.25, -8),
      new THREE.Vector3(1.8, 1.9, -4.5),
      new THREE.Vector3(0.15, 0.2, -0.5)
    );
    const attackLine = createFlowLine(attackCurve.getPoints(40), 0xff3b3b, 0.35);
    attackLine.visible = false;
    scene.add(attackLine);

    const highlightGeometry = new THREE.EdgesGeometry(new THREE.CapsuleGeometry(0.7, 1.6, 4, 8));
    const enemyHighlight = new THREE.LineSegments(
      highlightGeometry,
      new THREE.LineBasicMaterial({
        color: 0xff3b3b,
        transparent: true,
        opacity: 0.2,
      })
    );
    enemyHighlight.position.set(0, 1.05, -8.15);
    scene.add(enemyHighlight);

    scene.add(corridor);

    const clock = new THREE.Clock();

    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      const activeViewerState = viewerStateRef.current;

      gate.rotation.x += 0.004;
      gate.rotation.y += 0.012;
      gate.position.y = 1.1 + Math.sin(elapsedTime * 0.8) * 0.08;
      gateHalo.rotation.z -= 0.004;

      camera.position.z = 4 + Math.sin(elapsedTime * 0.5) * 0.5;
      camera.position.x = Math.sin(elapsedTime * 0.3) * 0.3;
      camera.lookAt(0, 1, 0);

      scene.fog.density = activeViewerState.realmId === 1 ? 0.15 : 0.05;
      fillLight.color.set(activeViewerState.realmId === 1 ? 0x7c3aed : 0xf5c542);
      fillLight.intensity = activeViewerState.realmId === 1 ? 20 : 16;

      threatZone.visible = activeViewerState.trialId === 1;
      threatZone.material.opacity =
        0.12 +
        activeViewerState.threatLevel / HUD_SCALE.threatOpacityDivisor +
        Math.max(0, Math.sin(elapsedTime * 4)) * 0.08;

      shadowZone.visible = activeViewerState.crownId === 1;
      shadowZone.scale.setScalar(1 + Math.sin(elapsedTime * 1.4) * 0.04);
      shadowZone.material.opacity = 0.14 + activeViewerState.shadowAdvantage / 260;

      intentPulse.scale.setScalar(
        1 +
          Math.sin(elapsedTime * 3) * 0.1 +
          activeViewerState.threatLevel / HUD_SCALE.sceneIntentDivisor
      );
      intentPulse.material.opacity = clamp(
        0.35 +
          Math.sin(elapsedTime * 4) * 0.12 +
          (activeViewerState.enemyAboutToStrike ? 0.18 : 0),
        0.2,
        0.9
      );
      intentPulse.material.color.set(activeViewerState.intentColor);

      openingLine.material.opacity =
        0.32 +
        activeViewerState.opportunityLevel / HUD_SCALE.opportunityOpacityDivisor +
        Math.max(0, Math.sin(elapsedTime * 3.4)) * 0.08;
      shadowLine.material.opacity = shadowZone.visible
        ? 0.42 + activeViewerState.shadowAdvantage / HUD_SCALE.shadowOpacityDivisor
        : 0.12;

      attackLine.visible =
        activeViewerState.trialId === 1 || activeViewerState.threatLevel >= 45;
      attackLine.material.opacity =
        0.2 +
        activeViewerState.threatLevel / HUD_SCALE.attackOpacityDivisor +
        (activeViewerState.enemyAboutToStrike ? 0.18 : 0);

      enemyHighlight.material.opacity = clamp(
        0.12 +
          activeViewerState.threatLevel / HUD_SCALE.highlightOpacityDivisor +
          Math.max(0, Math.sin(elapsedTime * 5)) * 0.08,
        0.1,
        0.78
      );

      renderer.render(scene, camera);
      gl.endFrameEXP();
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    cleanupRef.current = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }

        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <GLView style={styles.viewer} onContextCreate={onContextCreate} />
      <HydraEyesHUDOverlay
        loadingRemote={loadingRemote}
        pulseValue={pulseValue}
        viewerState={viewerState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#05060a',
  },
  viewer: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  bottomRow: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  centerOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  panel: {
    backgroundColor: PANEL_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 242, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  topLeftPanel: {
    flex: 1,
    maxWidth: '62%',
  },
  topRightPanel: {
    minWidth: 132,
    alignItems: 'flex-end',
  },
  bottomPanel: {
    flex: 1,
  },
  bottomRightPanel: {
    alignItems: 'flex-end',
  },
  panelLabel: {
    color: HUD_COLORS.text,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  realmName: {
    color: '#E5FFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 3,
  },
  trialName: {
    color: '#B1FFF8',
    fontSize: 12,
    lineHeight: 18,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 3,
  },
  metricNote: {
    color: '#C2F9FF',
    fontSize: 11,
    lineHeight: 16,
  },
  syncText: {
    color: '#82FFF7',
    fontSize: 10,
    marginTop: 8,
  },
  loader: {
    marginTop: 10,
  },
  centerPulseGlow: {
    shadowColor: '#AACCFF',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  intentPulseOuter: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intentPulseInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1.5,
  },
  intentTitle: {
    marginTop: 14,
    color: HUD_COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  intentStatus: {
    color: '#D7FAFF',
    fontSize: 12,
    marginTop: 4,
  },
  rightAligned: {
    textAlign: 'right',
  },
});
