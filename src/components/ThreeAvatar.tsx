import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { Rotate3d, ZoomIn, Sun, Move, RefreshCw, Play, Volume2, Compass, PlayCircle } from "lucide-react";

interface ThreeAvatarProps {
  isDarkMode: boolean;
  userSilhouette: any;
}

export default function ThreeAvatar({ isDarkMode, userSilhouette }: ThreeAvatarProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [animation, setAnimation] = useState<'idle' | 'walk' | 'run'>('idle');
  const [lighting, setLighting] = useState<number>(1.2);
  const [mannequinColor, setMannequinColor] = useState<string>("#8A92A6");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // References for live modification in render loop
  const animRef = useRef<'idle' | 'walk' | 'run'>('idle');
  const lightRef = useRef<number>(1.2);
  const colorRef = useRef<string>("#8A92A6");

  useEffect(() => {
    animRef.current = animation;
  }, [animation]);

  useEffect(() => {
    lightRef.current = lighting;
  }, [lighting]);

  useEffect(() => {
    colorRef.current = mannequinColor;
  }, [mannequinColor]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Simulate avatar model loading delay
    const timer = setTimeout(() => setIsLoading(false), 800);

    const container = mountRef.current;
    const width = container.clientWidth || 500;
    const height = 450;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkMode ? 0x070708 : 0xf4f5f7);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 3.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 4, 3);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0x6366f1, isDarkMode ? 0x1f2937 : 0xd1d5db);
    gridHelper.position.y = -1;
    scene.add(gridHelper);

    // 5. Stylized Mannequin model creation (Hierarchical Bone Joints)
    const group = new THREE.Group();
    scene.add(group);

    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(mannequinColor),
      roughness: 0.2,
      metalness: 0.3,
      flatShading: true
    });

    // Parts geometry
    const headGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const head = new THREE.Mesh(headGeo, bodyMaterial);
    head.position.y = 0.85;
    group.add(head);

    const neckGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.12, 12);
    const neck = new THREE.Mesh(neckGeo, bodyMaterial);
    neck.position.y = 0.72;
    group.add(neck);

    const chestGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.45, 12);
    const chest = new THREE.Mesh(chestGeo, bodyMaterial);
    chest.position.y = 0.45;
    group.add(chest);

    const waistGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.25, 12);
    const waist = new THREE.Mesh(waistGeo, bodyMaterial);
    waist.position.y = 0.12;
    group.add(waist);

    // Left & Right Shoulder joints + Arms
    const shoulderGeo = new THREE.SphereGeometry(0.07, 8, 8);
    const armGeo = new THREE.CylinderGeometry(0.05, 0.04, 0.38, 10);

    const lShoulder = new THREE.Mesh(shoulderGeo, bodyMaterial);
    lShoulder.position.set(-0.3, 0.58, 0);
    const lArm = new THREE.Mesh(armGeo, bodyMaterial);
    lArm.position.y = -0.22;
    lShoulder.add(lArm);
    group.add(lShoulder);

    const rShoulder = new THREE.Mesh(shoulderGeo, bodyMaterial);
    rShoulder.position.set(0.3, 0.58, 0);
    const rArm = new THREE.Mesh(armGeo, bodyMaterial);
    rArm.position.y = -0.22;
    rShoulder.add(rArm);
    group.add(rShoulder);

    // Left & Right Hips + Legs
    const hipJointGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.5, 10);

    const lHip = new THREE.Mesh(hipJointGeo, bodyMaterial);
    lHip.position.set(-0.15, -0.05, 0);
    const lLeg = new THREE.Mesh(legGeo, bodyMaterial);
    lLeg.position.y = -0.28;
    lHip.add(lLeg);
    group.add(lHip);

    const rHip = new THREE.Mesh(hipJointGeo, bodyMaterial);
    rHip.position.set(0.15, -0.05, 0);
    const rLeg = new THREE.Mesh(legGeo, bodyMaterial);
    rLeg.position.y = -0.28;
    rHip.add(rLeg);
    group.add(rHip);

    // Adjust entire group height
    group.position.y = 0.1;

    // 6. User interaction logic (Drag to rotate model and zoom)
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = () => { isDragging = true; };
    const handleMouseMove = (e: MouseEvent) => {
      const deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
      };

      if (isDragging) {
        group.rotation.y += deltaMove.x * 0.015;
      }

      previousMousePosition = { x: e.offsetX, y: e.offsetY };
    };
    const handleMouseUp = () => { isDragging = false; };

    // Zoom via wheel
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z += e.deltaY * 0.005;
      camera.position.z = Math.max(1.5, Math.min(camera.position.z, 6));
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("wheel", handleWheel);

    // Render / Animation Loop
    let clock = new THREE.Clock();
    let reqId: number;

    const animateLoop = () => {
      const time = clock.getElapsedTime();

      // Dynamic color update
      bodyMaterial.color.set(colorRef.current);

      // Dynamic light intensity
      dirLight.intensity = lightRef.current;

      // Skeletal movement depending on chosen poses
      const currAnim = animRef.current;

      if (currAnim === 'idle') {
        // Breathing
        group.position.y = 0.1 + Math.sin(time * 1.5) * 0.02;
        lShoulder.rotation.z = Math.sin(time * 1.5) * 0.05;
        rShoulder.rotation.z = -Math.sin(time * 1.5) * 0.05;
        lHip.rotation.x = Math.sin(time * 0.8) * 0.03;
        rHip.rotation.x = -Math.sin(time * 0.8) * 0.03;
      } else if (currAnim === 'walk') {
        // Walking joints
        const speed = 4;
        group.position.y = 0.1 + Math.abs(Math.sin(time * speed)) * 0.03;
        lShoulder.rotation.x = Math.sin(time * speed) * 0.4;
        rShoulder.rotation.x = -Math.sin(time * speed) * 0.4;
        lHip.rotation.x = -Math.sin(time * speed) * 0.35;
        rHip.rotation.x = Math.sin(time * speed) * 0.35;
        lShoulder.rotation.z = 0.1;
        rShoulder.rotation.z = -0.1;
      } else if (currAnim === 'run') {
        // Fast Running joints
        const speed = 7.5;
        group.position.y = 0.1 + Math.abs(Math.sin(time * speed)) * 0.08;
        lShoulder.rotation.x = Math.sin(time * speed) * 0.7;
        rShoulder.rotation.x = -Math.sin(time * speed) * 0.7;
        lHip.rotation.x = -Math.sin(time * speed) * 0.6;
        rHip.rotation.x = Math.sin(time * speed) * 0.6;
        lShoulder.rotation.z = 0.2;
        rShoulder.rotation.z = -0.2;
      }

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animateLoop);
    };

    animateLoop();

    // Clean up
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(reqId);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("wheel", handleWheel);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isDarkMode]);

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* 3D Stage Container */}
      <div className={`relative rounded-[32px] overflow-hidden flex flex-col items-center justify-center min-h-[480px] lg:col-span-8 border ${
        isDarkMode ? "glass-panel text-white border-white/15" : "bg-neutral-900/10 border-black/10 shadow-2xl"
      }`}>
        
        {/* Hologram loading screen */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="h-10 w-10 text-indigo-500 animate-spin" />
            <p className="text-xs tracking-widest font-mono text-zinc-400">CONNECTING 3D MANNEQUIN PIPELINE...</p>
          </div>
        )}

        {/* 3D Canvas Mount */}
        <div ref={mountRef} className="w-full h-[450px] cursor-grab active:cursor-grabbing" />

        {/* Dynamic Canvas HUD controls */}
        <div className="absolute bottom-6 left-6 flex gap-2">
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-[10px] font-mono tracking-widest text-zinc-300 flex items-center gap-2">
            <Rotate3d className="h-3.5 w-3.5 text-rose-500 animate-pulse" /> Drag canvas to rotate
          </div>
          <div className="px-4 py-2 rounded-2xl bg-black/60 border border-white/10 text-[10px] font-mono tracking-widest text-zinc-300 flex items-center gap-2">
            <ZoomIn className="h-3.5 w-3.5 text-indigo-500" /> Scroll to zoom
          </div>
        </div>

        <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/60 border border-white/10 rounded-2xl px-4 py-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
          <p className="text-[9px] font-mono font-bold text-white uppercase tracking-wider">WebGL Standard Live</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="space-y-1">
          <span className="text-[9px] font-mono tracking-widest text-indigo-500 uppercase">3D CAD CONTROLLER</span>
          <h3 className="text-xl font-bold tracking-tight text-white">Mannequin Mechanics</h3>
          <p className="text-xs text-zinc-400">Trigger standard poses, adjust color palettes, or modify studio-rig lighting instantly.</p>
        </div>

        {/* Pose / Animation Controls */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? "glass-panel text-white" : "bg-neutral-50 border-black/5"}`}>
          <label className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-3">Mannequin Animations</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'idle', label: "Idle pose" },
              { id: 'walk', label: "Walk Cycle" },
              { id: 'run', label: "Run sprint" }
            ].map((pose) => (
              <button
                key={pose.id}
                onClick={() => setAnimation(pose.id as any)}
                className={`py-2 rounded-xl text-xs font-semibold font-mono border transition-all cursor-pointer ${
                  animation === pose.id
                    ? "bg-gradient-to-r from-rose-500 to-indigo-600 text-white border-transparent shadow-md"
                    : isDarkMode ? "bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10" : "bg-white border-black/10 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {pose.label}
              </button>
            ))}
          </div>
        </div>

        {/* Palette Control */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? "glass-panel text-white" : "bg-neutral-50 border-black/5"}`}>
          <label className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase block mb-3">Mesh Color Palette</label>
          <div className="flex gap-3">
            {[
              { value: "#8A92A6", name: "Cosmic Gray" },
              { value: "#FBC02D", name: "Amber Yellow" },
              { value: "#EC4899", name: "Rose Silk" },
              { value: "#20C997", name: "Mint Foam" },
              { value: "#0D6EFD", name: "Royal Blue" }
            ].map((col) => (
              <button
                key={col.value}
                onClick={() => setMannequinColor(col.value)}
                style={{ backgroundColor: col.value }}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-105 cursor-pointer ${
                  mannequinColor === col.value ? "border-indigo-500 scale-95" : "border-white/20"
                }`}
                title={col.name}
              />
            ))}
          </div>
        </div>

        {/* Lighting Control */}
        <div className={`p-5 rounded-2xl border ${isDarkMode ? "glass-panel text-white" : "bg-neutral-50 border-black/5"}`}>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">Studio Light Intensity</label>
            <span className="text-[10px] font-mono text-zinc-300">{lighting}x</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={lighting}
            onChange={(e) => setLighting(parseFloat(e.target.value))}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
