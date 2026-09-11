import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AvatarViewer({ isSpeaking, audioAmplitude }) {
  const mountRef = useRef(null);
  const jawMeshRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 3.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    directionalLight.position.set(2, 4, 3);
    scene.add(directionalLight);

    const headGroup = new THREE.Group();
    
    const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    headGeometry.scale(1, 1.3, 1);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 });
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    headGroup.add(headMesh);

    const jawGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.3);
    const jawMaterial = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 });
    const jawMesh = new THREE.Mesh(jawGeometry, jawMaterial);
    jawMesh.position.set(0, -0.4, 0.6);
    headGroup.add(jawMesh);
    jawMeshRef.current = jawMesh;

    scene.add(headGroup);

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isSpeaking) {
        const targetScaleY = 1 + (Math.sin(Date.now() * 0.02) * 0.4 + 0.6) * (audioAmplitude || 0.5);
        jawMeshRef.current.scale.y = THREE.MathUtils.lerp(jawMeshRef.current.scale.y, targetScaleY, 0.2);
      } else {
        jawMeshRef.current.scale.y = THREE.MathUtils.lerp(jawMeshRef.current.scale.y, 1, 0.1);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [isSpeaking, audioAmplitude]);

  return <div ref={mountRef} className="w-full h-full rounded-xl overflow-hidden shadow-2xl" />;
}