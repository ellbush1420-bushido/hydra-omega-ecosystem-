import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { usePlayer } from '../hooks/usePlayer';

export default function RealmViewerScreen() {
  const { state } = usePlayer();
  const frameRef = useRef(null);
  const cleanupRef = useRef(() => {});
  const [status, setStatus] = useState('Opening the Obsidian Gate…');
  const hud = useMemo(() => {
    const realmName = state.tigerRank?.startsWith('white_tiger')
      ? 'Obsidian Gate'
      : state.tigerRank?.startsWith('black_tiger')
        ? 'Shadow Arena'
        : state.faction?.shortName
          ? `${state.faction.shortName} Crown`
          : 'Unclaimed Threshold';
    const threatScore = Math.min(
      100,
      28 +
        state.level * 6 +
        state.scenarioHistory.length * 7 +
        (state.tigerRank?.startsWith('white_tiger') ? 20 : 0)
    );
    const opportunityCount = Math.max(
      0,
      Math.min(
        3,
        (state.faction ? 1 : 0) +
          Math.min(1, state.codexUnlocks.length) +
          Math.min(1, Math.floor(state.level / 4)) +
          (state.tigerRank ? 1 : 0)
      )
    );
    const shadowAdvantage = Math.min(
      100,
      18 +
        state.codexUnlocks.length * 12 +
        state.level * 4 +
        (state.tigerRank?.startsWith('white_tiger') ? 26 : state.tigerRank ? 14 : 0)
    );

    return {
      realmName,
      threatScore,
      threatLabel: threatScore > 70 ? 'High' : threatScore > 40 ? 'Med' : 'Low',
      opportunityCount,
      shadowAdvantage,
    };
  }, [state]);
  const threatVignetteOpacity = 0.12 + hud.threatScore / 250;

  useEffect(() => {
    setStatus(`Hydra Eyes locked on ${hud.realmName}`);
  }, [hud.realmName]);

  const onContextCreate = useCallback((gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05060a);
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.04);

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 100);
    camera.position.set(0, 2.6, 8);
    camera.lookAt(0, 1.8, -8);

    const renderer = new Renderer({ gl });
    renderer.setClearColor(0x05060a);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambientLight = new THREE.AmbientLight(0x4c3f69, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xded7ff, 1.8);
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

    const fillLight = new THREE.PointLight(0x7c3aed, 18, 16, 2);
    fillLight.position.set(0, 2.4, -10);
    scene.add(fillLight);

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
    scene.add(floor);

    const corridor = new THREE.Group();
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
      corridor.add(leftPillar);

      const rightPillar = leftPillar.clone();
      rightPillar.position.x = 2.6;
      corridor.add(rightPillar);

      const lintel = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.45, 0.8), wallMaterial);
      lintel.position.set(0, 3.45, depth);
      lintel.castShadow = true;
      lintel.receiveShadow = true;
      corridor.add(lintel);
    }

    const gate = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.05, 0.28, 120, 16),
      new THREE.MeshStandardMaterial({
        color: 0x9370db,
        emissive: 0x24113d,
        emissiveIntensity: 0.9,
        roughness: 0.35,
        metalness: 0.8,
      })
    );
    gate.position.set(0, 2.1, -20);
    gate.castShadow = true;
    gate.receiveShadow = true;
    corridor.add(gate);

    const gateHalo = new THREE.Mesh(
      new THREE.RingGeometry(1.55, 2.1, 64),
      new THREE.MeshBasicMaterial({
        color: 0x7c3aed,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22,
      })
    );
    gateHalo.position.set(0, 2.1, -20.35);
    corridor.add(gateHalo);

    const threatZones = [
      { width: 2.4, height: 3.6, position: [0, 0.03, -4.5], rotation: 0 },
      { width: 1.8, height: 2.8, position: [1.25, 0.03, -9], rotation: -0.3 },
    ].map(({ width: planeWidth, height: planeHeight, position, rotation }) => {
      const zone = new THREE.Mesh(
        new THREE.PlaneGeometry(planeWidth, planeHeight),
        new THREE.MeshBasicMaterial({
          color: 0xff3355,
          transparent: true,
          opacity: 0.24,
          depthWrite: false,
        })
      );
      zone.rotation.x = -Math.PI / 2;
      zone.rotation.z = rotation;
      zone.position.set(...position);
      corridor.add(zone);
      return zone;
    });

    const shadowZones = [
      { width: 2.1, height: 2.1, position: [-1.55, 0.028, -2.4] },
      { width: 2.5, height: 2.2, position: [-0.95, 0.028, -12.5] },
    ].map(({ width: planeWidth, height: planeHeight, position }) => {
      const zone = new THREE.Mesh(
        new THREE.PlaneGeometry(planeWidth, planeHeight),
        new THREE.MeshBasicMaterial({
          color: 0x5500aa,
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
        })
      );
      zone.rotation.x = -Math.PI / 2;
      zone.position.set(...position);
      corridor.add(zone);
      return zone;
    });

    const opportunityPaths = [
      [
        new THREE.Vector3(0, 0.08, 6.2),
        new THREE.Vector3(-1.25, 0.08, 1.4),
        new THREE.Vector3(-1.8, 0.08, -5.8),
        new THREE.Vector3(-0.6, 0.08, -11),
      ],
      [
        new THREE.Vector3(0.2, 0.08, 6.2),
        new THREE.Vector3(1.1, 0.08, 1.8),
        new THREE.Vector3(1.7, 0.08, -6.4),
        new THREE.Vector3(0.4, 0.08, -14),
      ],
    ].map((points) => {
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({
          color: 0x5eead4,
          transparent: true,
          opacity: 0.52,
        })
      );
      corridor.add(line);
      return line;
    });

    const intentPulse = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0xff8fab,
        transparent: true,
        opacity: 0.85,
      })
    );
    intentPulse.position.set(0, 2.2, -16.8);
    corridor.add(intentPulse);

    scene.add(corridor);
    setStatus(`Hydra Eyes locked on ${hud.realmName}`);

    const clock = new THREE.Clock();

    const render = () => {
      const elapsed = clock.getElapsedTime();
      gate.rotation.x += 0.005;
      gate.rotation.y += 0.012;
      gateHalo.rotation.z -= 0.003;
      camera.position.x = Math.sin(elapsed * 0.35) * 0.45;
      camera.lookAt(0, 2, -18);
      gateHalo.material.opacity = 0.18 + (Math.sin(elapsed * 1.6) + 1) * 0.06;
      threatZones.forEach((zone, index) => {
        zone.material.opacity = 0.16 + (Math.sin(elapsed * (1.6 + index * 0.25)) + 1) * 0.06;
      });
      shadowZones.forEach((zone, index) => {
        zone.material.opacity = 0.12 + (Math.sin(elapsed * (2.2 + index * 0.35)) + 1) * 0.045;
      });
      opportunityPaths.forEach((line, index) => {
        line.material.opacity = 0.34 + (Math.sin(elapsed * (1.4 + index * 0.2)) + 1) * 0.08;
      });
      const intentScale = 0.9 + (Math.sin(elapsed * 3.2) + 1) * 0.14;
      intentPulse.scale.setScalar(intentScale);
      intentPulse.material.opacity = 0.62 + (Math.sin(elapsed * 3.2) + 1) * 0.12;

      renderer.render(scene, camera);
      gl.endFrameEXP();
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    cleanupRef.current = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      corridor.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      floor.geometry.dispose();
      floor.material.dispose();
      renderer.dispose();
    };
  }, [hud.realmName]);

  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.eyeLabel}>👁 HYDRA EYES — REALM EYE</Text>
        <Text style={styles.title}>3D Realm Viewer</Text>
        <Text style={styles.subtitle}>
          Hydra Eyes now maps danger, shadow advantage, and openings across the Obsidian Gate.
        </Text>
      </View>

      <View style={styles.viewerShell}>
        <GLView style={styles.viewer} onContextCreate={onContextCreate} />

        <View style={styles.hudLayer} pointerEvents="none">
          <View style={styles.topBar}>
            <Text style={styles.topBarLabel}>{hud.realmName}</Text>
            <Text style={styles.topBarValue}>Hydra Eyes: ON</Text>
          </View>

          <View style={styles.rightRail}>
            <HudStat label="Threat level" value={hud.threatLabel} accent="#fb7185" />
            <HudStat label="Opportunity count" value={`${hud.opportunityCount}/3`} accent="#67e8f9" />
            <HudStat
              label="Shadow advantage"
              value={`${hud.shadowAdvantage}%`}
              accent="#a78bfa"
            />
          </View>

          <View style={[styles.vignette, styles.vignetteTop, { opacity: threatVignetteOpacity }]} />
          <View style={[styles.vignette, styles.vignetteBottom, { opacity: threatVignetteOpacity }]} />
          <View style={[styles.vignetteSide, styles.vignetteLeft, { opacity: threatVignetteOpacity }]} />
          <View style={[styles.vignetteSide, styles.vignetteRight, { opacity: threatVignetteOpacity }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.caption}>
          Threat planes, shadow zones, and safe-path tracers now ride above the corridor floor.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function HudStat({ label, value, accent }) {
  return (
    <View style={styles.hudCard}>
      <Text style={styles.hudLabel}>{label}</Text>
      <Text style={[styles.hudValue, { color: accent }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#05060a' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 },
  eyeLabel: {
    color: '#4b5563',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: { color: '#e5e7eb', fontSize: 26, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#6b7280', fontSize: 13, lineHeight: 19 },
  viewerShell: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2937',
    position: 'relative',
  },
  viewer: {
    flex: 1,
  },
  hudLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: {
    marginTop: 16,
    marginHorizontal: 16,
    alignSelf: 'stretch',
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 6, 10, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(103, 232, 249, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  topBarLabel: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  topBarValue: {
    color: '#67e8f9',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  rightRail: {
    alignSelf: 'flex-end',
    marginRight: 16,
    marginBottom: 18,
    width: 156,
    gap: 8,
    zIndex: 1,
  },
  hudCard: {
    backgroundColor: 'rgba(5, 6, 10, 0.72)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  hudLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  hudValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  vignette: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#020308',
  },
  vignetteTop: {
    top: 0,
  },
  vignetteBottom: {
    bottom: 0,
  },
  vignetteSide: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 36,
    backgroundColor: '#020308',
  },
  vignetteLeft: {
    left: 0,
  },
  vignetteRight: {
    right: 0,
  },
  footer: { padding: 16 },
  status: { color: '#a78bfa', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  caption: { color: '#6b7280', fontSize: 12, lineHeight: 18 },
});
