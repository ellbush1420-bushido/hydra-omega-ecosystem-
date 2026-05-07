import React, { useCallback, useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

const BASE_FLICKER_INTENSITY = 1.15;
const PRIMARY_FLICKER_SPEED = 7.5;
const PRIMARY_FLICKER_AMPLITUDE = 0.24;
const SECONDARY_FLICKER_SPEED = 13.5;
const SECONDARY_FLICKER_AMPLITUDE = 0.12;
const LIGHT_DRIFT_SPEED = 0.8;
const LIGHT_DRIFT_RANGE = 0.18;
const PORTAL_PULSE_BASE = 1.2;
const PORTAL_PULSE_SPEED = 3.2;
const PORTAL_PULSE_AMPLITUDE = 0.18;
const PORTAL_SCALE_SPEED = 2.1;
const PORTAL_SCALE_VARIATION = 0.015;

function disposeScene(scene) {
  if (!scene) {
    return;
  }

  scene.traverse((child) => {
    child.geometry?.dispose?.();

    if (Array.isArray(child.material)) {
      child.material.forEach((material) => material?.dispose?.());
      return;
    }

    child.material?.dispose?.();
  });
}

export default function RealmCanvas() {
  const animationFrameRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      disposeScene(sceneRef.current);
      rendererRef.current?.dispose?.();
    };
  }, []);

  const init = useCallback((gl) => {
    if (cancelledRef.current) {
      return;
    }

    const width = gl.drawingBufferWidth || 1;
    const height = gl.drawingBufferHeight || 1;

    const renderer = new Renderer({ gl, width, height, pixelRatio: 1 });
    renderer.setSize(width, height);
    renderer.setClearColor(0x05070d);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.1);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 5.5);
    camera.lookAt(0, 1.25, -7);

    const ambientLight = new THREE.AmbientLight(0x8ca0ff, 0.28);
    scene.add(ambientLight);

    const flickerLight = new THREE.PointLight(0x4f8cff, 1.35, 22, 2);
    flickerLight.position.set(0, 1.8, -5.5);
    scene.add(flickerLight);

    const corridorMaterial = new THREE.MeshStandardMaterial({
      color: 0x06070a,
      metalness: 0.9,
      roughness: 0.22,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x0e1320,
      emissive: 0x153268,
      emissiveIntensity: 0.85,
      metalness: 0.7,
      roughness: 0.35,
    });

    const portalMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d1420,
      emissive: 0x2f6dff,
      emissiveIntensity: 1.35,
      transparent: true,
      opacity: 0.82,
      metalness: 0.15,
      roughness: 0.18,
    });

    const corridorSegments = [
      { geometry: new THREE.BoxGeometry(4.4, 0.16, 16), position: [0, -1.15, -4.5] },
      { geometry: new THREE.BoxGeometry(4.4, 0.16, 16), position: [0, 2.35, -4.5] },
      { geometry: new THREE.BoxGeometry(0.16, 3.5, 16), position: [-2.12, 0.6, -4.5] },
      { geometry: new THREE.BoxGeometry(0.16, 3.5, 16), position: [2.12, 0.6, -4.5] },
      { geometry: new THREE.BoxGeometry(4.4, 3.5, 0.16), position: [0, 0.6, -12.4] },
    ];

    corridorSegments.forEach(({ geometry, position }) => {
      const mesh = new THREE.Mesh(geometry, corridorMaterial);
      mesh.position.set(...position);
      scene.add(mesh);
    });

    const guideLine = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 7), accentMaterial);
    guideLine.position.set(0, -1.06, -5.7);
    scene.add(guideLine);

    const gateFrame = new THREE.Group();
    const gatePieces = [
      { geometry: new THREE.BoxGeometry(0.25, 3.1, 0.25), position: [-1.2, 0.55, -8.8] },
      { geometry: new THREE.BoxGeometry(0.25, 3.1, 0.25), position: [1.2, 0.55, -8.8] },
      { geometry: new THREE.BoxGeometry(2.65, 0.25, 0.25), position: [0, 2.05, -8.8] },
    ];

    gatePieces.forEach(({ geometry, position }) => {
      const mesh = new THREE.Mesh(geometry, corridorMaterial);
      mesh.position.set(...position);
      gateFrame.add(mesh);
    });

    const portal = new THREE.Mesh(new THREE.PlaneGeometry(2.05, 2.7), portalMaterial);
    portal.position.set(0, 0.55, -8.68);
    gateFrame.add(portal);
    scene.add(gateFrame);

    const clock = new THREE.Clock();

    const loop = () => {
      if (cancelledRef.current) {
        return;
      }

      const elapsed = clock.getElapsedTime();
      flickerLight.intensity =
        BASE_FLICKER_INTENSITY +
        Math.sin(elapsed * PRIMARY_FLICKER_SPEED) * PRIMARY_FLICKER_AMPLITUDE +
        Math.cos(elapsed * SECONDARY_FLICKER_SPEED) * SECONDARY_FLICKER_AMPLITUDE;
      flickerLight.position.x = Math.sin(elapsed * LIGHT_DRIFT_SPEED) * LIGHT_DRIFT_RANGE;
      portal.material.emissiveIntensity =
        PORTAL_PULSE_BASE +
        Math.sin(elapsed * PORTAL_PULSE_SPEED) * PORTAL_PULSE_AMPLITUDE;
      portal.scale.setScalar(1 + Math.sin(elapsed * PORTAL_SCALE_SPEED) * PORTAL_SCALE_VARIATION);

      renderer.render(scene, camera);
      gl.endFrameEXP?.();

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();
  }, []);

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.canvas, styles.webFallback]}>
        <Text style={styles.webTitle}>3D Realm Viewer loads on native Expo targets.</Text>
        <Text style={styles.webCopy}>
          Open the app in Expo Go or a simulator to step into the Obsidian Gate corridor.
        </Text>
      </View>
    );
  }

  return <GLView style={styles.canvas} onContextCreate={init} />;
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    minHeight: 320,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#05070d',
  },
  webFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  webTitle: {
    color: '#dbe4ff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  webCopy: {
    color: '#7c8aa5',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
});
