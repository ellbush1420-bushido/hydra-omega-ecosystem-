import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

import { usePlayer } from '../hooks/usePlayer';
import { useHydraEyes } from '../hooks/useHydraEyes';
import {
  buildHydraEyesWorldState,
  formatHydraEyesLabel,
  getHydraEyesMode,
  listHydraEyesModes,
} from '../lib/hydraEyesWorld';

function addBeacon(group, color, position, scale = 1) {
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.18 * scale, 18, 18),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.2,
    })
  );
  beacon.position.set(position[0], position[1], position[2]);
  group.add(beacon);
}

function addRibbon(group, color, points) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((point) => new THREE.Vector3(point[0], point[1], point[2]))
  );
  const ribbon = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 40, 0.03, 8, false),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.75,
    })
  );
  group.add(ribbon);
}

function createModeGeometry(group, mode) {
  if (mode.id === 'tactical') {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 2.3, 48),
      new THREE.MeshBasicMaterial({
        color: mode.pulseColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, 0.02, -10);
    group.add(ring);

    addRibbon(group, mode.pulseColor, [
      [-2.2, 0.2, -6],
      [-0.8, 1.4, -9],
      [0.4, 1.1, -12],
      [2.1, 0.2, -16],
    ]);
  }

  if (mode.id === 'realm') {
    addRibbon(group, mode.pulseColor, [
      [-1.8, 0.3, -4],
      [-0.9, 1.1, -9],
      [0.4, 1.8, -14],
      [1.9, 2.2, -20],
    ]);
    addBeacon(group, mode.pulseColor, [0, 2.1, -20], 1.4);
  }

  if (mode.id === 'social') {
    addBeacon(group, mode.pulseColor, [-1.8, 1.8, -8], 0.9);
    addBeacon(group, mode.fill, [0, 2.6, -13], 1);
    addBeacon(group, mode.halo, [1.8, 1.8, -18], 0.9);
    addRibbon(group, mode.pulseColor, [
      [-1.8, 1.8, -8],
      [-0.5, 2.5, -11],
      [0.7, 2.2, -15],
      [1.8, 1.8, -18],
    ]);
  }

  if (mode.id === 'pattern') {
    addRibbon(group, mode.pulseColor, [
      [-2.2, 0.4, -6],
      [-1.1, 2.4, -10],
      [0.8, 0.8, -14],
      [2.2, 2.2, -18],
    ]);
    addRibbon(group, mode.fill, [
      [2.2, 0.4, -6],
      [1.1, 2.4, -10],
      [-0.8, 0.8, -14],
      [-2.2, 2.2, -18],
    ]);
    addBeacon(group, mode.halo, [0, 2.3, -12], 1.2);
  }
}

function MetricCard({ label, value, color }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );
}

export default function RealmViewerScreen() {
  const frameRef = useRef(null);
  const cleanupRef = useRef(() => {});
  const [activeMode, setActiveMode] = useState('realm');
  const [status, setStatus] = useState(getHydraEyesMode('realm').status);

  const { state } = usePlayer();
  const { eventLog, track } = useHydraEyes();
  const modes = useMemo(() => listHydraEyesModes(), []);
  const worldState = useMemo(
    () => buildHydraEyesWorldState(state, eventLog, activeMode),
    [activeMode, eventLog, state]
  );

  const handleModeSelect = useCallback(
    (modeId) => {
      if (modeId === activeMode) return;
      cleanupRef.current();
      setActiveMode(modeId);
    },
    [activeMode]
  );

  useEffect(() => {
    setStatus(worldState.mode.status);
  }, [worldState.mode.status]);

  useEffect(() => {
    const telemetry = {
      context: 'realm_viewer',
      element: activeMode,
      focal_point: worldState.focalPoint,
      threat_level: worldState.threatLevel,
      opportunity_level: worldState.opportunityLevel,
    };

    track('world_viewer_mode', {
      ...telemetry,
    });
  }, [
    activeMode,
    track,
    worldState.focalPoint,
    worldState.opportunityLevel,
    worldState.threatLevel,
  ]);

  const onContextCreate = useCallback(
    (gl) => {
      cleanupRef.current();

      const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(worldState.mode.background);
      scene.fog = new THREE.FogExp2(worldState.mode.background, worldState.mode.fogDensity);

      const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
      camera.position.set(0, 2.6, 8);
      camera.lookAt(0, 1.8, -8);

      const renderer = new Renderer({ gl });
      renderer.setClearColor(worldState.mode.background);
      renderer.setSize(width, height);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const ambientLight = new THREE.AmbientLight(worldState.mode.ambient, 1.2);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(worldState.mode.halo, 1.8);
      mainLight.position.set(6, 10, 4);
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

      const fillLight = new THREE.PointLight(worldState.mode.fill, 22, 18, 2);
      fillLight.position.set(0, 2.4, -10);
      scene.add(fillLight);

      const worldGroup = new THREE.Group();

      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(12, 36),
        new THREE.MeshStandardMaterial({
          color: 0x11131a,
          roughness: 0.92,
          metalness: 0.1,
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.z = -9;
      floor.receiveShadow = true;
      worldGroup.add(floor);

      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x171923,
        roughness: 0.88,
        metalness: 0.18,
      });

      for (let index = 0; index < 7; index += 1) {
        const depth = -index * 4;

        const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.6, 0.8), wallMaterial);
        leftPillar.position.set(-2.6, 1.8, depth);
        leftPillar.castShadow = true;
        leftPillar.receiveShadow = true;
        worldGroup.add(leftPillar);

        const rightPillar = leftPillar.clone();
        rightPillar.position.x = 2.6;
        worldGroup.add(rightPillar);

        const lintel = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.45, 0.8), wallMaterial);
        lintel.position.set(0, 3.45, depth);
        lintel.castShadow = true;
        lintel.receiveShadow = true;
        worldGroup.add(lintel);
      }

      const gate = new THREE.Mesh(
        new THREE.TorusKnotGeometry(1.05, 0.28, 120, 16),
        new THREE.MeshStandardMaterial({
          color: worldState.mode.halo,
          emissive: worldState.mode.fill,
          emissiveIntensity: 0.9,
          roughness: 0.35,
          metalness: 0.8,
        })
      );
      gate.position.set(0, 2.1, -20);
      gate.castShadow = true;
      gate.receiveShadow = true;
      worldGroup.add(gate);

      const gateHalo = new THREE.Mesh(
        new THREE.RingGeometry(1.55, 2.1, 64),
        new THREE.MeshBasicMaterial({
          color: worldState.mode.fill,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.22,
        })
      );
      gateHalo.position.set(0, 2.1, -20.35);
      worldGroup.add(gateHalo);

      addBeacon(worldGroup, worldState.mode.pulseColor, [-1.8, 0.9, -6], 0.8);
      addBeacon(worldGroup, worldState.mode.fill, [1.8, 0.9, -14], 0.8);
      createModeGeometry(worldGroup, worldState.mode);
      scene.add(worldGroup);

      const startTime = Date.now();
      const render = () => {
        const elapsed = Date.now() - startTime;
        gate.rotation.x += 0.005;
        gate.rotation.y += 0.012;
        gateHalo.rotation.z -= 0.003;
        worldGroup.rotation.y = Math.sin(elapsed * 0.0002) * 0.03;
        camera.position.x = Math.sin(elapsed * 0.00035) * 0.45;
        camera.lookAt(0, 2, -18);

        renderer.render(scene, camera);
        gl.endFrameEXP();
        frameRef.current = requestAnimationFrame(render);
      };

      render();

      cleanupRef.current = () => {
        if (frameRef.current) {
          cancelAnimationFrame(frameRef.current);
        }
        worldGroup.traverse((object) => {
          if (object.geometry) object.geometry.dispose();
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
    },
    [worldState.mode]
  );

  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.eyeLabel}>👁 HYDRA EYES — WORLD VIEWER</Text>
          <Text style={styles.title}>Hydra Eyes World Viewer</Text>
          <Text style={styles.subtitle}>
            The perception engine renders the realm, behavior lattice, and pattern mesh into one
            readable field.
          </Text>
        </View>

        <View style={styles.modeRow}>
          {modes.map((mode) => {
            const active = mode.id === activeMode;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[styles.modeChip, active && styles.modeChipActive]}
                onPress={() => handleModeSelect(mode.id)}
                activeOpacity={0.85}
              >
                <Text style={[styles.modeChipLabel, active && styles.modeChipLabelActive]}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.viewerShell}>
          <GLView key={activeMode} style={styles.viewer} onContextCreate={onContextCreate} />
        </View>

        <View style={styles.modeSummary}>
          <Text style={styles.sectionEyebrow}>{worldState.mode.label}</Text>
          <Text style={styles.sectionTitle}>{worldState.mode.title}</Text>
          <Text style={styles.sectionCopy}>{worldState.mode.description}</Text>
        </View>

        <View style={styles.metricsRow}>
          <MetricCard label="Threat" value={`${worldState.threatLevel}%`} color="#f97316" />
          <MetricCard label="Opportunity" value={`${worldState.opportunityLevel}%`} color="#34d399" />
          <MetricCard label="Anomalies" value={worldState.anomalyCount} color="#60a5fa" />
          <MetricCard label="Signals" value={worldState.totalSignals} color="#a78bfa" />
        </View>

        <View style={styles.detailSection}>
          {worldState.detailCards.map((detail) => (
            <View key={detail.label} style={styles.detailCard}>
              <Text style={styles.detailLabel}>{detail.label}</Text>
              <Text style={styles.detailValue}>{detail.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.intelCard}>
          <Text style={styles.sectionEyebrow}>Perception Stream</Text>
          {worldState.mode.overlays.map((overlay) => (
            <View key={overlay} style={styles.intelRow}>
              <Text style={styles.intelBullet}>•</Text>
              <Text style={styles.intelText}>{overlay}</Text>
            </View>
          ))}
          <View style={styles.intelRow}>
            <Text style={styles.intelBullet}>•</Text>
            <Text style={styles.intelText}>Focal point: {worldState.focalPoint}</Text>
          </View>
          <View style={styles.intelRow}>
            <Text style={styles.intelBullet}>•</Text>
            <Text style={styles.intelText}>Last trial: {worldState.lastTrial}</Text>
          </View>
        </View>

        <View style={styles.intelCard}>
          <Text style={styles.sectionEyebrow}>Recent Signals</Text>
          {eventLog.length === 0 ? (
            <Text style={styles.emptyText}>No world signals yet. Open arenas or codex paths to feed Hydra Eyes.</Text>
          ) : (
            eventLog.slice(0, 5).map((event) => (
              <View key={event.id} style={styles.eventRow}>
                <Text style={styles.eventType}>{formatHydraEyesLabel(event.event_type)}</Text>
                <Text style={styles.eventMeta}>{new Date(event.ts).toLocaleTimeString()}</Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.status}>{status}</Text>
          <Text style={styles.caption}>{worldState.mode.caption}</Text>
          {state.hydraRecommendation ? (
            <Text style={styles.recommendation}>{state.hydraRecommendation}</Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#05060a' },
  scroll: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 14 },
  eyeLabel: {
    color: '#4b5563',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: { color: '#e5e7eb', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#6b7280', fontSize: 13, lineHeight: 19 },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  modeChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0d0d14',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modeChipActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#160f29',
  },
  modeChipLabel: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700',
  },
  modeChipLabelActive: {
    color: '#c4b5fd',
  },
  viewerShell: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2937',
    marginBottom: 14,
  },
  viewer: {
    height: 320,
  },
  modeSummary: {
    backgroundColor: '#0d0d14',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 14,
    marginBottom: 12,
  },
  sectionEyebrow: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  sectionTitle: { color: '#e5e7eb', fontSize: 17, fontWeight: '700', marginBottom: 4 },
  sectionCopy: { color: '#9ca3af', fontSize: 13, lineHeight: 19 },
  metricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metricCard: {
    flexGrow: 1,
    minWidth: '47%',
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 12,
  },
  metricLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  detailSection: {
    gap: 8,
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 12,
  },
  detailLabel: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  detailValue: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '600',
  },
  intelCard: {
    backgroundColor: '#0d0d14',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 14,
    marginBottom: 12,
  },
  intelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 6,
  },
  intelBullet: {
    color: '#a78bfa',
    fontSize: 14,
    lineHeight: 18,
  },
  intelText: {
    flex: 1,
    color: '#d1d5db',
    fontSize: 12,
    lineHeight: 18,
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 12,
    lineHeight: 18,
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  eventType: {
    color: '#c4b5fd',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  eventMeta: {
    color: '#6b7280',
    fontSize: 11,
  },
  footer: { paddingBottom: 8 },
  status: { color: '#a78bfa', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  caption: { color: '#9ca3af', fontSize: 12, lineHeight: 18, marginBottom: 8 },
  recommendation: {
    color: '#d1d5db',
    fontSize: 12,
    lineHeight: 18,
    backgroundColor: '#0d0d14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a2e',
    padding: 12,
  },
});
