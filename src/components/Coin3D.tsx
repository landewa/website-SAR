import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Play, Pause, RotateCcw, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { translations } from '../i18n/translations';
import { Language } from '../types';

interface Coin3DProps {
  lang: Language;
  className?: string;
}

export const Coin3D: React.FC<Coin3DProps> = ({ lang, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].coinControls;

  // Interactive UI dock state
  const [isPaused, setIsPaused] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1.0);
  const [enableTilt, setEnableTilt] = useState(true);
  const [isDockOpen, setIsDockOpen] = useState(false);
  const [hasWebGLError, setHasWebGLError] = useState(false);

  // Mutable refs for animation loop
  const stateRef = useRef({
    isPaused: false,
    rotationSpeed: 1.0,
    enableTilt: true,
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
    baseRotation: 0,
  });

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current.isPaused = isPaused;
    stateRef.current.rotationSpeed = rotationSpeed;
    stateRef.current.enableTilt = enableTilt;
  }, [isPaused, rotationSpeed, enableTilt]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGLError(true);
        return;
      }
    } catch {
      setHasWebGLError(true);
      return;
    }

    let animationFrameId: number;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig (Key, Fill, Rim)
    const warmKeyLight = new THREE.DirectionalLight(0xffeedd, 2.8);
    warmKeyLight.position.set(4, 5, 4);
    warmKeyLight.castShadow = true;
    scene.add(warmKeyLight);

    const coolFillLight = new THREE.HemisphereLight(0x1e293b, 0x070b14, 1.2);
    scene.add(coolFillLight);

    const goldRimLight = new THREE.DirectionalLight(0xf59e0b, 2.2);
    goldRimLight.position.set(-4, -2, -3);
    scene.add(goldRimLight);

    const frontSpecularLight = new THREE.PointLight(0xfffbeb, 1.5, 10);
    frontSpecularLight.position.set(0, 2, 4);
    scene.add(frontSpecularLight);

    // 5. Composite 3D Coin Model Group
    const coinGroup = new THREE.Group();
    scene.add(coinGroup);

    // Materials
    const goldRimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.95,
      roughness: 0.22,
      envMapIntensity: 1.4,
    });

    const goldCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.92,
      roughness: 0.28,
      envMapIntensity: 1.2,
    });

    // Texture Loader for Official SAR Token Coin (Direct genuine file)
    const textureLoader = new THREE.TextureLoader();
    const emblemTexture = textureLoader.load(
      '/token-sar.png',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;
      }
    );

    const frontFaceMaterial = new THREE.MeshStandardMaterial({
      map: emblemTexture,
      metalness: 0.85,
      roughness: 0.25,
      envMapIntensity: 1.3,
    });

    const backFaceMaterial = frontFaceMaterial.clone();

    // Part 1: Outer Coin Beveled Rim
    const rimRadius = 1.4;
    const rimThickness = 0.22;
    const rimGeo = new THREE.CylinderGeometry(rimRadius, rimRadius, rimThickness, 64, 1, false);
    const rimMesh = new THREE.Mesh(rimGeo, goldRimMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.castShadow = true;
    rimMesh.receiveShadow = true;
    coinGroup.add(rimMesh);

    // Part 2: Outer Raised Protective Bezel Rings (Front & Back)
    const bezelGeo = new THREE.TorusGeometry(rimRadius - 0.05, 0.045, 16, 64);
    const frontBezel = new THREE.Mesh(bezelGeo, goldRimMaterial);
    frontBezel.position.z = rimThickness / 2;
    coinGroup.add(frontBezel);

    const backBezel = new THREE.Mesh(bezelGeo, goldRimMaterial);
    backBezel.position.z = -rimThickness / 2;
    coinGroup.add(backBezel);

    // Part 3: Inner Recessed Coin Core
    const coreGeo = new THREE.CylinderGeometry(rimRadius - 0.06, rimRadius - 0.06, rimThickness * 0.92, 64);
    const coreMesh = new THREE.Mesh(coreGeo, goldCoreMaterial);
    coreMesh.rotation.x = Math.PI / 2;
    coinGroup.add(coreMesh);

    // Part 4: Front Emblem Disc (High-relief Texture)
    const discGeo = new THREE.CircleGeometry(rimRadius - 0.08, 64);
    const frontDisc = new THREE.Mesh(discGeo, frontFaceMaterial);
    frontDisc.position.z = rimThickness / 2 + 0.005;
    coinGroup.add(frontDisc);

    // Part 5: Back Emblem Disc (Inverted)
    const backDisc = new THREE.Mesh(discGeo, backFaceMaterial);
    backDisc.position.z = -(rimThickness / 2 + 0.005);
    backDisc.rotation.y = Math.PI;
    coinGroup.add(backDisc);

    // Part 6: Grounding Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(canvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = -1.75;
    shadowMesh.rotation.x = -Math.PI / 2;
    scene.add(shadowMesh);

    // 6. Interaction Event Handlers
    const handlePointerMove = (e: PointerEvent) => {
      if (!stateRef.current.enableTilt) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.targetTiltY = x * 0.45;
      stateRef.current.targetTiltX = -y * 0.35;
    };

    const handlePointerLeave = () => {
      stateRef.current.targetTiltX = 0;
      stateRef.current.targetTiltY = 0;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 7. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // 8. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Continuous vertical spin
      if (!stateRef.current.isPaused) {
        stateRef.current.baseRotation += delta * 1.1 * stateRef.current.rotationSpeed;
      }

      // Smooth exponential damping for tilt
      stateRef.current.currentTiltX = THREE.MathUtils.damp(
        stateRef.current.currentTiltX,
        stateRef.current.targetTiltX,
        6,
        delta
      );
      stateRef.current.currentTiltY = THREE.MathUtils.damp(
        stateRef.current.currentTiltY,
        stateRef.current.targetTiltY,
        6,
        delta
      );

      // Apply rotations
      coinGroup.rotation.y = stateRef.current.baseRotation + stateRef.current.currentTiltY;
      coinGroup.rotation.x = stateRef.current.currentTiltX;
      // Subtle organic float
      coinGroup.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      renderer.dispose();
      emblemTexture.dispose();
      shadowTexture.dispose();
      rimGeo.dispose();
      coreGeo.dispose();
      bezelGeo.dispose();
      discGeo.dispose();
      shadowGeo.dispose();
      goldRimMaterial.dispose();
      goldCoreMaterial.dispose();
      frontFaceMaterial.dispose();
      backFaceMaterial.dispose();
      shadowMat.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // WebGL Error Fallback
  if (hasWebGLError) {
    return (
      <div className="relative w-full aspect-square max-w-[420px] mx-auto flex items-center justify-center p-6">
        <div className="w-64 h-64 rounded-full border-2 border-amber-500/40 p-3 bg-gradient-to-b from-amber-500/10 to-transparent flex items-center justify-center shadow-2xl shadow-amber-500/10">
          <img
            src="/token-sar.png"
            alt="Official SAADA Reserve SAR Token Coin"
            className="w-full h-full object-contain rounded-full shadow-inner"
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-square max-w-[460px] mx-auto flex flex-col items-center justify-center select-none ${className}`}>
      {/* Glow Halo Backdrop */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-amber-500/12 blur-3xl" />
        <div className="w-48 h-48 rounded-full bg-amber-400/8 blur-xl" />
      </div>

      {/* Three.js Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
        aria-label="Interactive 3D SAADA Reserve SAR Coin"
      />

      {/* Ergonomic Collapsible Bottom Control Dock */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsDockOpen(!isDockOpen)}
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-400 hover:text-amber-400 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-t-md transition-colors"
          title={isDockOpen ? t.hideControls : t.showControls}
        >
          <Sliders className="w-3 h-3 text-amber-500" />
          <span>{isDockOpen ? t.hideControls : t.showControls}</span>
          {isDockOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </button>

        {/* Collapsible Dock Drawer */}
        {isDockOpen && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#090D1A]/95 border border-slate-800/90 rounded-b-xl rounded-t-none shadow-2xl text-xs text-slate-300">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-amber-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isPaused ? t.play : t.pause}</span>
            </button>

            {/* Tilt Toggle */}
            <button
              onClick={() => setEnableTilt(!enableTilt)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                enableTilt
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.tilt}
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
              <span className="text-[11px] text-slate-500">{t.speed}:</span>
              {[0.5, 1.0, 1.8].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setRotationSpeed(speed)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-mono ${
                    rotationSpeed === speed
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Reset View */}
            <button
              onClick={() => {
                stateRef.current.baseRotation = 0;
                stateRef.current.targetTiltX = 0;
                stateRef.current.targetTiltY = 0;
              }}
              className="p-1 rounded text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
              title={t.reset}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
