import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const AuthPage3DVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. 3D Floating Cooperative Shield Medallion
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 4);
    shieldShape.quadraticCurveTo(3.5, 3.8, 3.5, 0.5);
    shieldShape.quadraticCurveTo(3.5, -3, 0, -4.5);
    shieldShape.quadraticCurveTo(-3.5, -3, -3.5, 0.5);
    shieldShape.quadraticCurveTo(-3.5, 3.8, 0, 4);

    const extrudeSettings = {
      depth: 0.6,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 2,
      bevelSize: 0.25,
      bevelThickness: 0.3,
    };

    const shieldGeo = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    shieldGeo.center();

    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x0c3b2e,
      roughness: 0.3,
      metalness: 0.7,
      emissive: 0x062119,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    mainGroup.add(shieldMesh);

    // 2. Gold Inner Border Ring
    const goldRimGeo = new THREE.TorusGeometry(3.2, 0.18, 16, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x3d2910,
    });
    const goldRim = new THREE.Mesh(goldRimGeo, goldMat);
    goldRim.position.z = 0.55;
    mainGroup.add(goldRim);

    // 3. Central Cooperative "स" Emblem
    const emblemGeo = new THREE.TorusGeometry(1.6, 0.28, 16, 32, Math.PI * 1.6);
    const emblem = new THREE.Mesh(emblemGeo, goldMat);
    emblem.position.z = 0.65;
    mainGroup.add(emblem);

    const emblemDotGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const emblemDot = new THREE.Mesh(emblemDotGeo, goldMat);
    emblemDot.position.set(0, 0.45, 0.65);
    mainGroup.add(emblemDot);

    // 4. Two Rotating 3D Particle Rings (Orbital Halos)
    const particleCount = 200;
    const ring1Geo = new THREE.BufferGeometry();
    const ring1Pos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 6.8 + Math.sin(i * 0.5) * 0.6;
      ring1Pos[i * 3] = Math.cos(angle) * radius;
      ring1Pos[i * 3 + 1] = Math.sin(angle) * radius;
      ring1Pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    ring1Geo.setAttribute('position', new THREE.BufferAttribute(ring1Pos, 3));
    const ring1Mat = new THREE.PointsMaterial({
      color: 0xd4a373,
      size: 0.22,
      transparent: true,
      opacity: 0.75,
    });
    const ring1 = new THREE.Points(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.BufferGeometry();
    const ring2Pos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 7.8 + Math.cos(i * 0.4) * 0.7;
      ring2Pos[i * 3] = Math.cos(angle) * radius;
      ring2Pos[i * 3 + 1] = Math.sin(angle) * radius;
      ring2Pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    ring2Geo.setAttribute('position', new THREE.BufferAttribute(ring2Pos, 3));
    const ring2Mat = new THREE.PointsMaterial({
      color: 0x52b788,
      size: 0.2,
      transparent: true,
      opacity: 0.65,
    });
    const ring2 = new THREE.Points(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 4;
    mainGroup.add(ring2);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffd700, 3.5, 30);
    pointLight1.position.set(6, 8, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x52b788, 2.5, 30);
    pointLight2.position.set(-6, -6, 8);
    scene.add(pointLight2);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;

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
      const elapsed = clock.getElapsedTime();

      // Smooth floating motion
      mainGroup.position.y = Math.sin(elapsed * 1.5) * 0.35;
      mainGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.25 + mouseX * 0.4;
      mainGroup.rotation.x = Math.cos(elapsed * 0.9) * 0.15 + mouseY * 0.2;

      // Rotate particle halos
      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;

      renderer.render(scene, camera);
    };

    animate();

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

  return <div ref={containerRef} className="w-full h-full min-h-[420px] flex items-center justify-center cursor-grab" />;
};
