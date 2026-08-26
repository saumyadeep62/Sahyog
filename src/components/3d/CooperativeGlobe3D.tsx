import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CooperativeGlobe3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 380;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 220;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all globe elements
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Core Sphere with subtle emerald wireframe & inner glow
    const sphereGeo = new THREE.SphereGeometry(65, 32, 32);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x0c3b2e,
      emissive: 0x062119,
      specular: 0xd4a373,
      shininess: 40,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    // 2. Outer Holographic Wireframe Cage
    const wireGeo = new THREE.SphereGeometry(67, 24, 24);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x52b788,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const wireSphere = new THREE.Mesh(wireGeo, wireMat);
    globeGroup.add(wireSphere);

    // 3. Floating 3D Star / Particle Ring
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 75 + Math.random() * 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      // Golden & emerald alternating colors
      if (i % 2 === 0) {
        particleColors[i * 3] = 0.83; // R (Gold: D4A373)
        particleColors[i * 3 + 1] = 0.64; // G
        particleColors[i * 3 + 2] = 0.45; // B
      } else {
        particleColors[i * 3] = 0.25; // Emerald
        particleColors[i * 3 + 1] = 0.85;
        particleColors[i * 3 + 2] = 0.55;
      }
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // 4. Cooperative Hub Pins (India Coordinates mapped to Sphere)
    const hubs = [
      { name: 'Mumbai', lat: 19.07, lng: 72.87, color: 0xe0a96d },
      { name: 'Delhi', lat: 28.61, lng: 77.20, color: 0x52b788 },
      { name: 'Bengaluru', lat: 12.97, lng: 77.59, color: 0xe0a96d },
      { name: 'Pune', lat: 18.52, lng: 73.85, color: 0x52b788 },
      { name: 'Kolkata', lat: 22.57, lng: 88.36, color: 0xe0a96d },
    ];

    const hubObjects: THREE.Mesh[] = [];

    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      );
    };

    hubs.forEach((hub) => {
      const pos = latLngToVector3(hub.lat, hub.lng, 66);
      const pinGeo = new THREE.SphereGeometry(2.4, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: hub.color });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.copy(pos);
      globeGroup.add(pinMesh);
      hubObjects.push(pinMesh);

      // Glowing ripple ring
      const ringGeo = new THREE.RingGeometry(2.8, 4.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: hub.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ring);
    });

    // 5. 3D Connecting Arcs between Mumbai & other cooperatives
    const createArc = (startVec: THREE.Vector3, endVec: THREE.Vector3, color: number) => {
      const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
      const distance = startVec.distanceTo(endVec);
      mid.normalize().multiplyScalar(66 + distance * 0.35);

      const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
      const points = curve.getPoints(30);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.65,
        linewidth: 2,
      });
      return new THREE.Line(arcGeo, arcMat);
    };

    const mumbaiPos = latLngToVector3(19.07, 72.87, 66);
    hubs.slice(1).forEach((hub) => {
      const targetPos = latLngToVector3(hub.lat, hub.lng, 66);
      const arc = createArc(mumbaiPos, targetPos, 0xd4a373);
      globeGroup.add(arc);
    });

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xd4a373, 2);
    dirLight1.position.set(100, 150, 100);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x52b788, 1.5);
    dirLight2.position.set(-100, -100, -50);
    scene.add(dirLight2);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0.3;
    let targetRotationY = 2.4;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth idle rotation + mouse influence
      targetRotationY += 0.005;
      globeGroup.rotation.y += (targetRotationY + mouseX * 0.5 - globeGroup.rotation.y) * 0.05;
      globeGroup.rotation.x += (targetRotationX + mouseY * 0.3 - globeGroup.rotation.x) * 0.05;

      // Particle pulsing
      particles.rotation.y -= 0.002;
      particles.rotation.x = Math.sin(elapsedTime * 0.5) * 0.05;

      // Pulsing hub pins
      const pulseScale = 1 + Math.sin(elapsedTime * 4) * 0.25;
      hubObjects.forEach((h) => h.scale.set(pulseScale, pulseScale, pulseScale));

      renderer.render(scene, camera);
    };

    animate();

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[260px] sm:h-[380px] flex items-center justify-center touch-pan-y">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-pan-y" />

      {/* 3D HUD Floating Badge Overlay */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#0C3B2E]/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-emerald-500/30 text-white shadow-xl pointer-events-none text-xs space-y-0.5">
        <div className="flex items-center gap-1.5 font-bold text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Live 3D Solidarity Mesh</span>
        </div>
        <p className="text-[9px] sm:text-[10px] text-stone-300">42 Federations • 14,280 Nodes</p>
      </div>

      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-[#0C3B2E]/90 backdrop-blur-md px-2.5 sm:px-3 py-1 rounded-xl border border-[#D4A373]/30 text-[#D4A373] shadow-xl pointer-events-none text-[10px] sm:text-[11px] font-bold">
        ✦ 3D Cooperative Globe
      </div>
    </div>
  );
};
