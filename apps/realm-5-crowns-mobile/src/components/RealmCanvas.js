import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function disposeObject(root) {
  root.traverse((object) => {
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
}

export default function RealmCanvas({ threat = 0, opportunity = 0, shadow = 0, style }) {
  const frameRef = useRef(null);
  const cleanupRef = useRef(() => {});
  const metricsRef = useRef({ threat: clamp(threat), opportunity: clamp(opportunity), shadow: clamp(shadow) });

  useEffect(() => {
    metricsRef.current = {
      threat: clamp(threat),
      opportunity: clamp(opportunity),
      shadow: clamp(shadow),
    };
  }, [opportunity, shadow, threat]);

  const onContextCreate = useCallback((gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x050505, 0.15);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 4);

    const ambientLight = new THREE.AmbientLight(0x10131c, 1.4);
    scene.add(ambientLight);

    const light = new THREE.PointLight(0x4a6aff, 2, 10);
    light.position.set(0, 2, 0);
    scene.add(light);

    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      metalness: 0.8,
      roughness: 0.1,
    });
    const floor = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 20), floorMat);
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

    const gateway = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.8, 0.18, 120, 24),
      new THREE.MeshStandardMaterial({
        color: 0x172033,
        emissive: 0x13244a,
        emissiveIntensity: 1.4,
        metalness: 0.6,
        roughness: 0.22,
      })
    );
    gateway.position.set(0, 1.1, -6.2);
    scene.add(gateway);

    const warden = new THREE.Mesh(
      new THREE.CylinderGeometry(0.35, 0.45, 2.3, 18),
      new THREE.MeshStandardMaterial({
        color: 0x0a0f16,
        emissive: 0x06131a,
        emissiveIntensity: 0.75,
        metalness: 0.25,
        roughness: 0.65,
      })
    );
    warden.position.set(0, 0.15, -2.2);
    scene.add(warden);

    const threatMat = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.25,
    });
    const threatZone = new THREE.Mesh(new THREE.PlaneGeometry(2, 3), threatMat);
    threatZone.rotation.x = -Math.PI / 2;
    threatZone.position.set(0, -0.94, -3);
    scene.add(threatZone);

    const opportunityMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const opportunityGuide = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 5.5), opportunityMat);
    opportunityGuide.rotation.x = -Math.PI / 2;
    opportunityGuide.position.set(1.25, -0.95, -1.5);
    scene.add(opportunityGuide);

    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x5500aa,
      transparent: true,
      opacity: 0.2,
    });
    const shadowZone = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shadowMat);
    shadowZone.rotation.x = -Math.PI / 2;
    shadowZone.position.set(-1.5, -0.94, -1);
    scene.add(shadowZone);

    const intentGeo = new THREE.RingGeometry(0.2, 0.3, 32);
    const intentMat = new THREE.MeshBasicMaterial({
      color: 0xaaccff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const intentPulse = new THREE.Mesh(intentGeo, intentMat);
    intentPulse.position.set(0, 1.5, -2);
    scene.add(intentPulse);

    const clock = new THREE.Clock();

    const renderLoop = () => {
      const t = clock.getElapsedTime();
      const currentThreat = metricsRef.current.threat / 100;
      const currentOpportunity = metricsRef.current.opportunity / 100;
      const currentShadow = metricsRef.current.shadow / 100;
      const perception = (currentThreat + currentOpportunity + currentShadow) / 3;

      camera.position.z = 4 + Math.sin(t * 0.5) * (0.35 + currentThreat * 0.25);
      camera.position.x = Math.sin(t * 0.3) * (0.22 + currentShadow * 0.18);
      camera.lookAt(0, 1, -2.2);

      light.intensity = 1.35 + Math.sin(t * 3) * 0.22 + currentOpportunity * 0.65;
      gateway.rotation.x += 0.004;
      gateway.rotation.y += 0.01 + currentOpportunity * 0.004;
      warden.rotation.y = Math.sin(t * 0.6) * 0.12;
      warden.position.y = 0.15 + Math.sin(t * 1.6) * 0.05;

      threatZone.visible = currentThreat > 0.04;
      threatZone.scale.set(0.85 + currentThreat * 0.8, 1 + currentThreat * 0.25, 1);
      threatMat.opacity = 0.08 + currentThreat * 0.3 + Math.sin(t * 3.2) * 0.02;

      opportunityGuide.visible = currentOpportunity > 0.04;
      opportunityGuide.scale.set(1 + currentOpportunity * 0.45, 0.7 + currentOpportunity * 0.45, 1);
      opportunityMat.opacity = 0.08 + currentOpportunity * 0.3 + Math.sin(t * 2.4) * 0.02;

      shadowZone.visible = currentShadow > 0.04;
      shadowZone.scale.set(0.75 + currentShadow * 0.7, 0.75 + currentShadow * 0.45, 1);
      shadowMat.opacity = 0.08 + currentShadow * 0.24 + Math.sin(t * 2) * 0.03;

      const scale = 1 + Math.sin(t * (3.2 + perception)) * (0.08 + perception * 0.08);
      intentPulse.scale.set(scale, scale, scale);
      intentMat.opacity = 0.26 + Math.sin(t * (3.2 + perception)) * 0.18 + currentOpportunity * 0.16;

      renderer.render(scene, camera);
      gl.endFrameEXP();
      frameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    cleanupRef.current = () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      disposeObject(scene);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  return <GLView style={[styles.canvas, style]} onContextCreate={onContextCreate} />;
}

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
  },
});
