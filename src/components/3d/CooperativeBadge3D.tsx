import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const CooperativeBadge3D: React.FC<{ size?: number }> = ({ size = 160 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const badgeGroup = new THREE.Group();
    scene.add(badgeGroup);

    // 1. Octagonal / Cylindrical Coin Base with Gold Metallic Shader
    const coinGeo = new THREE.CylinderGeometry(4, 4, 0.6, 32);
    const coinMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      metalness: 0.85,
      roughness: 0.25,
    });
    const coin = new THREE.Mesh(coinGeo, coinMat);
    coin.rotation.x = Math.PI / 2;
    badgeGroup.add(coin);

    // 2. Inner Rim
    const rimGeo = new THREE.TorusGeometry(3.5, 0.25, 16, 32);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0x0c3b2e,
      metalness: 0.6,
      roughness: 0.3,
    });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    badgeGroup.add(rim);

    // 3. Central Cooperative Emblem Pillar (Deconstructed "स" symbol geometry)
    const emblemGeo = new THREE.TorusGeometry(1.8, 0.35, 16, 32, Math.PI * 1.5);
    const emblemMat = new THREE.MeshStandardMaterial({
      color: 0xffe4b5,
      metalness: 0.9,
      roughness: 0.15,
      emissive: 0x4a3b10,
    });
    const emblem = new THREE.Mesh(emblemGeo, emblemMat);
    emblem.position.z = 0.4;
    badgeGroup.add(emblem);

    const centerDotGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const centerDot = new THREE.Mesh(centerDotGeo, emblemMat);
    centerDot.position.set(0, 0.5, 0.4);
    badgeGroup.add(centerDot);

    // 4. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const light1 = new THREE.PointLight(0xfff4e0, 3, 20);
    light1.position.set(5, 5, 8);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x52b788, 2, 20);
    light2.position.set(-5, -5, 6);
    scene.add(light2);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Wobble & 3D float
      badgeGroup.rotation.y = Math.sin(elapsed * 1.2) * 0.4;
      badgeGroup.rotation.x = Math.cos(elapsed * 1.5) * 0.25;
      badgeGroup.position.y = Math.sin(elapsed * 2) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size]);

  return <div ref={containerRef} className="inline-block cursor-pointer" />;
};
