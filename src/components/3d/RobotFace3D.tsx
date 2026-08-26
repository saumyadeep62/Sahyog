import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RobotFace3DProps {
  size?: number;
  isListening?: boolean;
  isSpeaking?: boolean;
}

export const RobotFace3D: React.FC<RobotFace3DProps> = ({
  size = 56,
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
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 5.0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for whole robot head to allow tilt & mouse tracking
    const robotHead = new THREE.Group();
    scene.add(robotHead);

    // 3. Robot Head Chassis (Rounded Cyber Helmet)
    const headGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0c3b2e,
      roughness: 0.25,
      metalness: 0.85,
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    robotHead.add(headMesh);

    // 4. Cybernetic Faceplate / Visor
    const visorGeo = new THREE.BoxGeometry(1.5, 0.9, 0.7);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x051a14,
      roughness: 0.1,
      metalness: 0.95,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.1, 0.8);
    robotHead.add(visorMesh);

    // 5. Glowing LED Eyes (Left & Right)
    const eyeGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 16);
    eyeGeo.rotateX(Math.PI / 2);

    const eyeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Vibrant Cyan LED
    });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.42, 0.22, 1.16);
    robotHead.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.42, 0.22, 1.16);
    robotHead.add(rightEye);

    // Eye pupils / reflections
    const pupilGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.42, 0.22, 1.2);
    robotHead.add(leftPupil);

    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.42, 0.22, 1.2);
    robotHead.add(rightPupil);

    // 6. Audio-Reactive Mouth Wave Bars (5 LED Bars)
    const mouthBars: THREE.Mesh[] = [];
    const barMat = new THREE.MeshBasicMaterial({ color: 0xd4a373 }); // Warm Gold LED

    for (let i = 0; i < 5; i++) {
      const barGeo = new THREE.BoxGeometry(0.09, 0.14, 0.04);
      const bar = new THREE.Mesh(barGeo, barMat);
      bar.position.set((i - 2) * 0.18, -0.22, 1.16);
      robotHead.add(bar);
      mouthBars.push(bar);
    }

    // 7. Golden Ears / Side Communicator Pods
    const earGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.3, 16);
    earGeo.rotateZ(Math.PI / 2);
    const earMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      metalness: 0.9,
      roughness: 0.1,
    });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-1.3, 0.1, 0);
    robotHead.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(1.3, 0.1, 0);
    robotHead.add(rightEar);

    // 8. Top Antenna with Glowing Cooperative Beacon
    const antennaStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 16);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, metalness: 0.9 });
    const antenna = new THREE.Mesh(antennaStemGeo, antennaMat);
    antenna.position.set(0, 1.45, 0);
    robotHead.add(antenna);

    const beaconGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // Emerald green signal beacon
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 1.8, 0);
    robotHead.add(beacon);

    // 9. Floating Orbital Ring around Head
    const haloGeo = new THREE.TorusGeometry(1.65, 0.03, 16, 48);
    haloGeo.rotateX(Math.PI / 2.5);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      emissive: 0xd4a373,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.7,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    robotHead.add(halo);

    // 10. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
    mainLight.position.set(3, 4, 5);
    scene.add(mainLight);

    const rimLight = new THREE.PointLight(0xd4a373, 2.5, 8);
    rimLight.position.set(-3, -2, 2);
    scene.add(rimLight);

    // 11. Mouse tracking handler
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      targetRotY = x * 0.45;
      targetRotX = -y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 12. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const { isListening: listening, isSpeaking: speaking } = stateRef.current;

      // Gentle floating sine oscillation
      robotHead.position.y = Math.sin(elapsed * 2.2) * 0.12;

      // Smooth mouse follow rotation
      robotHead.rotation.y += (targetRotY - robotHead.rotation.y) * 0.08;
      robotHead.rotation.x += (targetRotX - robotHead.rotation.x) * 0.08;

      // Rotating halo ring
      halo.rotation.z = elapsed * 0.8;

      // Eye blinking physics (every 4 seconds)
      const blinkCycle = elapsed % 4.0;
      if (blinkCycle < 0.15) {
        leftEye.scale.y = 0.1;
        rightEye.scale.y = 0.1;
        leftPupil.visible = false;
        rightPupil.visible = false;
      } else {
        leftEye.scale.y = 1.0;
        rightEye.scale.y = 1.0;
        leftPupil.visible = true;
        rightPupil.visible = true;
      }

      // Mouth Equalizer Audio Activity Animation
      mouthBars.forEach((bar, idx) => {
        if (speaking) {
          const barScale = 1.0 + Math.sin(elapsed * 12 + idx * 1.5) * 1.8;
          bar.scale.y = Math.max(0.4, barScale);
          barMat.color.setHex(0x10b981); // Emerald when speaking
        } else if (listening) {
          const barScale = 1.0 + Math.sin(elapsed * 16 + idx * 2.0) * 1.5;
          bar.scale.y = Math.max(0.4, barScale);
          barMat.color.setHex(0xef4444); // Red when listening
        } else {
          bar.scale.y = 1.0;
          barMat.color.setHex(0xd4a373); // Gold idle
        }
      });

      // Beacon status pulse
      if (listening) {
        beaconMat.color.setHex(0xef4444);
        eyeMat.color.setHex(0xf87171);
      } else if (speaking) {
        beaconMat.color.setHex(0x10b981);
        eyeMat.color.setHex(0x34d399);
      } else {
        beaconMat.color.setHex(0x10b981);
        eyeMat.color.setHex(0x38bdf8);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      headGeo.dispose();
      headMat.dispose();
      visorGeo.dispose();
      visorMat.dispose();
      eyeGeo.dispose();
      eyeMat.dispose();
      earGeo.dispose();
      earMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return <div ref={mountRef} className="flex items-center justify-center pointer-events-none" />;
};
