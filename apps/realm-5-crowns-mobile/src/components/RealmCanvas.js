import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { GLView } from 'expo-gl';

export default function RealmCanvas() {
  const animationFrameRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const onContextCreate = async (gl) => {
    const { Renderer } = require('expo-three');
    const THREE = require('three');
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4);

    const light = new THREE.PointLight(0x4a6aff, 2, 10);
    light.position.set(0, 2, 0);
    scene.add(light);

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.1, 20),
      new THREE.MeshStandardMaterial({
        color: 0x050505,
        metalness: 0.8,
        roughness: 0.1,
      })
    );
    floor.position.y = -1;
    scene.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.9,
      roughness: 0.2,
    });

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4, 20), wallMat);
    leftWall.position.set(-3, 1, 0);
    scene.add(leftWall);

    const rightWall = leftWall.clone();
    rightWall.position.x = 3;
    scene.add(rightWall);

    scene.fog = new THREE.FogExp2(0x050505, 0.15);

    const clock = new THREE.Clock();

    const renderLoop = () => {
      light.intensity = 1.5 + Math.sin(clock.elapsedTime * 3) * 0.3;
      renderer.render(scene, camera);
      gl.endFrameEXP();
      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.fallback}>
        <Text style={styles.title}>Obsidian Gate</Text>
        <Text style={styles.description}>
          The Realm viewer is available in the native Expo app. On web, the Obsidian Gate stays
          shrouded in shadow.
        </Text>
      </View>
    );
  }

  return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />;
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    color: '#e5e7eb',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },
  description: {
    color: '#9ca3af',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 320,
  },
});
