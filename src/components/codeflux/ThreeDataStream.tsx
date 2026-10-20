import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Move3d, RotateCcw, Eye, Layers } from 'lucide-react';

export const ThreeDataStream: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'stream' | 'helix' | 'bars'>('stream');
  const [isRotating, setIsRotating] = useState<boolean>(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060914, 0.015);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 5, 28);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x06b6d4, 2.5);
    keyLight.position.set(15, 20, 15);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 2.0);
    rimLight.position.set(-15, -10, -10);
    scene.add(rimLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Mode 1: Data Streamline Sorting (Matching the user's uploaded "DATA SORTING" reference image)
    const particleCount = 1200;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const originalX = new Float32Array(particleCount);

    const tealColor = new THREE.Color(0x14b8a6);
    const cyanColor = new THREE.Color(0x06b6d4);
    const purpleColor = new THREE.Color(0x8b5cf6);
    const whiteColor = new THREE.Color(0xffffff);

    // Initialize particles flowing from dispersed left to convergent sorted lanes on the right
    for (let i = 0; i < particleCount; i++) {
      const progress = Math.random(); // 0 (left/unsorted) to 1 (right/sorted)
      const x = (progress - 0.5) * 36;
      originalX[i] = x;

      // When x < 0 (unsorted): high dispersion in Y and Z
      // When x > 0 (sorted): convergence into 5 discrete horizontal lanes
      const laneIndex = Math.floor(Math.random() * 5);
      const laneY = (laneIndex - 2) * 2.2;
      const dispersion = Math.max(0, 1 - progress);

      const y = laneY * progress + (Math.random() - 0.5) * 12 * dispersion;
      const z = (Math.random() - 0.5) * 8 * dispersion;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      speeds[i] = 0.08 + Math.random() * 0.12;

      // Color mapping: unordered multi-hues on left, strictly color-sorted by lane on right
      let c = new THREE.Color();
      if (progress < 0.4) {
        c.lerpColors(cyanColor, purpleColor, Math.random());
      } else {
        const laneColors = [
          new THREE.Color(0x10b981), // Emerald
          new THREE.Color(0x06b6d4), // Cyan
          new THREE.Color(0x3b82f6), // Blue
          new THREE.Color(0x8b5cf6), // Violet
          new THREE.Color(0xf59e0b), // Amber
        ];
        c = laneColors[laneIndex];
      }

      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    rootGroup.add(particleSystem);

    // Streamline Curve Trails
    const curveLinesGroup = new THREE.Group();
    const lineCount = 30;
    for (let l = 0; l < lineCount; l++) {
      const laneIdx = l % 5;
      const targetY = (laneIdx - 2) * 2.2;
      const startY = (Math.random() - 0.5) * 12;
      const startZ = (Math.random() - 0.5) * 8;

      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-18, startY, startZ),
        new THREE.Vector3(-6, startY * 0.5, startZ * 0.5),
        new THREE.Vector3(4, targetY, 0),
        new THREE.Vector3(18, targetY, 0)
      );

      const points = curve.getPoints(50);
      const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: laneIdx % 2 === 0 ? 0x06b6d4 : 0x8b5cf6,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeom, lineMat);
      curveLinesGroup.add(line);
    }
    rootGroup.add(curveLinesGroup);

    // 3D Sorting Bar Histogram Mesh (Composite Group)
    const barsGroup = new THREE.Group();
    const barCount = 18;
    const barMeshes: THREE.Mesh[] = [];

    for (let b = 0; b < barCount; b++) {
      const heightVal = 1.5 + (b / barCount) * 8.5;
      const barGeom = new THREE.BoxGeometry(0.85, heightVal, 0.85);
      const barMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.5 + (b / barCount) * 0.35, 0.8, 0.55),
        metalness: 0.7,
        roughness: 0.2,
        emissive: new THREE.Color().setHSL(0.5 + (b / barCount) * 0.35, 0.8, 0.15),
      });

      const barMesh = new THREE.Mesh(barGeom, barMat);
      barMesh.position.set((b - barCount / 2) * 1.3, heightVal / 2 - 4, 0);
      barsGroup.add(barMesh);
      barMeshes.push(barMesh);
    }
    barsGroup.visible = false;
    rootGroup.add(barsGroup);

    // Mouse Drag & Damped Orbit Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
      targetRotX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotX));
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouseX;
      const deltaY = e.touches[0].clientY - prevMouseY;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.008;
    };
    domElement.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Exponential damping on user camera rotation
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * (1 - Math.exp(-8 * delta));
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * (1 - Math.exp(-8 * delta));

      if (isRotating && !isDragging) {
        targetRotY += 0.003;
      }

      // Animate Particles Flow along X
      const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += speeds[i];
        if (posArray[i * 3] > 18) {
          posArray[i * 3] = -18;
          // Re-scatter Y and Z on reset
          const laneIndex = Math.floor(Math.random() * 5);
          const laneY = (laneIndex - 2) * 2.2;
          posArray[i * 3 + 1] = (Math.random() - 0.5) * 12;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 8;
        } else {
          // Progressively converge towards target lane as X advances towards +18
          const progress = (posArray[i * 3] + 18) / 36;
          const laneIndex = i % 5;
          const targetY = (laneIndex - 2) * 2.2;
          posArray[i * 3 + 1] = THREE.MathUtils.lerp(posArray[i * 3 + 1], targetY, 0.04);
          posArray[i * 3 + 2] = THREE.MathUtils.lerp(posArray[i * 3 + 2], 0, 0.04);
        }
      }
      posAttr.needsUpdate = true;

      // Animate Bars undulating subtly if visible
      if (barsGroup.visible) {
        barMeshes.forEach((mesh, idx) => {
          mesh.rotation.y = Math.sin(elapsedTime * 1.5 + idx * 0.3) * 0.1;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);

      renderer.dispose();
      particlesGeometry.dispose();
      particleMaterial.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, [viewMode, isRotating]);

  return (
    <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-white/10 bg-[#050713] shadow-2xl backdrop-blur-xl group">
      {/* 3D Canvas mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Glassmorphic HUD overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300 shadow-lg">
          <Move3d className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <span>3D Data Sorting Space</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-1" />
        </div>
      </div>

      {/* Controls Dock */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 backdrop-blur-md border border-white/10 p-3 rounded-xl">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className="hidden sm:inline text-slate-400">Interaction:</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-cyan-300">
            Drag to Rotate
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-indigo-300">
            Scroll to Navigate
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all border ${
              isRotating
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            {isRotating ? 'Auto-Orbit: ON' : 'Auto-Orbit: OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
