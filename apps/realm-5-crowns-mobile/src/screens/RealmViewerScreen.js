import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

export default function RealmViewerScreen() {
  const frameRef = useRef(null);
  const cleanupRef = useRef(() => {});
  const [status, setStatus] = useState('Opening the Obsidian Gate…');

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

    scene.add(corridor);
    setStatus('Realm projection stable');

    const render = () => {
      gate.rotation.x += 0.005;
      gate.rotation.y += 0.012;
      gateHalo.rotation.z -= 0.003;
      camera.position.x = Math.sin(Date.now() * 0.00035) * 0.45;
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
  }, []);

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
          Real-time shadows, soft fog, and an awakened gate rendered in Expo GL.
        </Text>
      </View>

      <GLView style={styles.viewer} onContextCreate={onContextCreate} />

      <View style={styles.footer}>
        <Text style={styles.status}>{status}</Text>
        <Text style={styles.caption}>
          The corridor geometry casts and receives shadows to keep the realm alive.
        </Text>
      </View>
    </SafeAreaView>
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
  viewer: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  footer: { padding: 16 },
  status: { color: '#a78bfa', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  caption: { color: '#6b7280', fontSize: 12, lineHeight: 18 },
});
