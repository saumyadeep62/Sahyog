import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Chatbot3DAvatarProps {
  size?: number;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export const Chatbot3DAvatar: React.FC<Chatbot3DAvatarProps> = ({
  size = 48,
  isListening = false,
  isSpeaking = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ isListening, isSpeaking });

  useEffect(() => {
    stateRef.current = { isListening, isSpeaking };
  }, [isListening, isSpeaking]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Central Hologram Sphere
    const coreGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0c3b2e,
      emissive: 0x1d5c4b,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 4. Gold Outer Ring
    const ringGeo = new THREE.TorusGeometry(1.4, 0.05, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      emissive: 0xe0a96d,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh1.rotation.x = Math.PI / 3;
    scene.add(ringMesh1);

    const ringMesh2 = new THREE.Mesh(ringGeo, ringMat);
    ringMesh2.rotation.y = Math.PI / 3;
    scene.add(ringMesh2);

    // 5. Particle Halo (Orbiting energy particles)
    const particleCount = 48;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      const radius = 1.6 + Math.sin(i * 3) * 0.2;
      particlePositions[i * 3] = Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
      particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffd700,
      size: 0.09,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xd4a373, 2.5, 10);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0x10b981, 2.0, 10);
    backLight.position.set(-2, -2, -3);
    scene.add(backLight);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const { isListening: activeListening, isSpeaking: activeSpeaking } = stateRef.current;

      const speedMultiplier = activeListening ? 3.0 : activeSpeaking ? 2.2 : 1.0;

      // Core pulsation
      const pulseScale = activeListening
        ? 1.0 + Math.sin(elapsedTime * 8) * 0.15
        : activeSpeaking
        ? 1.0 + Math.sin(elapsedTime * 6) * 0.08
        : 1.0 + Math.sin(elapsedTime * 2) * 0.04;

      coreMesh.scale.set(pulseScale, pulseScale, pulseScale);
      coreMesh.rotation.y = elapsedTime * 0.5 * speedMultiplier;

      // Ring rotations
      ringMesh1.rotation.x = elapsedTime * 0.8 * speedMultiplier;
      ringMesh1.rotation.y = elapsedTime * 0.6 * speedMultiplier;

      ringMesh2.rotation.y = -elapsedTime * 0.7 * speedMultiplier;
      ringMesh2.rotation.z = elapsedTime * 0.5 * speedMultiplier;

      // Particle halo rotation
      particles.rotation.y = elapsedTime * 0.9 * speedMultiplier;
      particles.rotation.x = Math.sin(elapsedTime * 0.5) * 0.2;

      // Dynamic glow color
      if (activeListening) {
        coreMat.emissive.setHex(0xef4444); // Red pulse when listening
        particleMat.color.setHex(0xf87171);
      } else if (activeSpeaking) {
        coreMat.emissive.setHex(0x10b981); // Emerald pulse when speaking
        particleMat.color.setHex(0x34d399);
      } else {
        coreMat.emissive.setHex(0x1d5c4b); // Warm teal
        particleMat.color.setHex(0xffd700);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return <div ref={mountRef} className="flex items-center justify-center pointer-events-none" />;
};
