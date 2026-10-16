"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Plus, RotateCcw } from "lucide-react";

interface HeroSceneProps {
  onCapsuleClick?: () => void;
}

interface DynamicCapsule {
  mesh: THREE.Group;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  baseTiltZ: number;       // Signature leftward angle matching reference
  tiltWobbleSpeed: number; // Aerodynamic sway
  wobblePhase: number;
  isCoral: boolean;
  spawnDelay: number;
  initialVx: number;
  initialVy: number;
  initialVz: number;
}

export default function HeroScene({ onCapsuleClick }: HeroSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [capsuleCount, setCapsuleCount] = useState(12);

  const dropNewCapsuleRef = useRef<(() => void) | null>(null);
  const resetSimulationRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. CLEAN THREE.JS SCENE, CAMERA, RENDERER ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      36,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    // Positioned so the bottle sits naturally over the rock platform in the background
    camera.position.set(0.08, 0.40, 6.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Transparent so the rich botanical background image shows through
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // --- 2. STUDIO LIGHTING MATCHING BACKGROUND ENVIRONMENT ---
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 1.2);
    scene.add(ambientLight);

    // Warm Key Spotlight from top-right (matches the warm studio backlights)
    const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.8);
    keyLight.position.set(3.8, 5.5, 4.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Mint/Emerald Rim Light from left (illuminates glass edge and capsules)
    const emeraldRim = new THREE.PointLight(0x34d399, 14, 10);
    emeraldRim.position.set(-3.2, 2.5, -1.5);
    scene.add(emeraldRim);

    // Soft Fill Light from below
    const softFill = new THREE.PointLight(0x10b981, 5, 8);
    softFill.position.set(0.2, -1.0, 1.5);
    scene.add(softFill);

    // --- 3. ROOT GROUP ---
    const mainGroup = new THREE.Group();
    mainGroup.position.set(0.16, -0.12, 0);
    scene.add(mainGroup);

    // --- 4. PHOTOREALISTIC AMBER GLASS APOTHECARY BOTTLE TILTED 15° LEFT ---
    // User request: "Instead of being tilted 15° to the right, tilt it 15° to the left."
    const bottleGroup = new THREE.Group();
    const bottleBaseX = 0.22;
    const bottleBaseY = -0.45;
    bottleGroup.position.set(bottleBaseX, bottleBaseY, 0);
    bottleGroup.rotation.z = 0.26; // 15° tilt to the left
    bottleGroup.rotation.x = 0.08;
    mainGroup.add(bottleGroup);

    // Amber Glass Material (Luminous, transparent, premium)
    const amberGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc46210,
      emissive: 0x3d1702,
      emissiveIntensity: 0.12,
      roughness: 0.05,
      metalness: 0.04,
      transmission: 0.85,
      ior: 1.52,
      thickness: 1.2,
      specularIntensity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const bottleRadius = 0.65;
    const bottleHeight = 1.45;

    // Cylindrical Body
    const bodyGeometry = new THREE.CylinderGeometry(bottleRadius, bottleRadius, bottleHeight, 64, 1, false);
    const bottleBody = new THREE.Mesh(bodyGeometry, amberGlassMaterial);
    bottleBody.castShadow = true;
    bottleGroup.add(bottleBody);

    // Curved Shoulder
    const shoulderGeometry = new THREE.CylinderGeometry(0.4, bottleRadius, 0.3, 64);
    const bottleShoulder = new THREE.Mesh(shoulderGeometry, amberGlassMaterial);
    bottleShoulder.position.y = bottleHeight / 2 + 0.15;
    bottleShoulder.castShadow = true;
    bottleGroup.add(bottleShoulder);

    // Open Neck with Threaded Rim Lip (Mouth where capsules emerge!)
    const neckGeometry = new THREE.CylinderGeometry(0.38, 0.4, 0.28, 64, 1, true);
    const bottleNeck = new THREE.Mesh(neckGeometry, amberGlassMaterial);
    bottleNeck.position.y = bottleHeight / 2 + 0.44;
    bottleNeck.castShadow = true;
    bottleGroup.add(bottleNeck);

    const rimLipGeometry = new THREE.TorusGeometry(0.39, 0.024, 16, 64);
    const rimLip = new THREE.Mesh(rimLipGeometry, amberGlassMaterial);
    rimLip.rotation.x = Math.PI / 2;
    rimLip.position.y = bottleHeight / 2 + 0.58;
    bottleGroup.add(rimLip);

    // Clean Minimalist White Paper Label
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 1024;
    labelCanvas.height = 720;
    const ctx = labelCanvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, labelCanvas.width, labelCanvas.height);

      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, labelCanvas.width - 40, labelCanvas.height - 40);

      ctx.fillStyle = "#0f172a";
      ctx.font = "bold 38px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("PHARMACY STORE", 72, 98);

      ctx.fillStyle = "#0e7a53";
      ctx.font = "bold 20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("CLINICAL LABS • BIO-REGIMEN", 72, 134);

      ctx.fillStyle = "#020617";
      ctx.font = "900 64px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("FORMULA NO. 042", 72, 230);

      ctx.fillStyle = "#64748b";
      ctx.font = "26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      ctx.fillText("Targeted Neuro & Cellular Restoration", 72, 275);
    }
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.35,
      metalness: 0.02,
    });
    const labelGeometry = new THREE.CylinderGeometry(
      bottleRadius + 0.003,
      bottleRadius + 0.003,
      1.05,
      64,
      1,
      true,
      -Math.PI * 0.46,
      Math.PI * 0.92
    );
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    labelMesh.position.y = -0.05;
    bottleGroup.add(labelMesh);

    // Golden-Amber Sphere Pills Settled Inside the Base
    const settledPillsGroup = new THREE.Group();
    settledPillsGroup.position.set(0, -bottleHeight / 2 + 0.18, 0);
    bottleGroup.add(settledPillsGroup);

    const amberSphereMat = new THREE.MeshPhysicalMaterial({
      color: 0xdf8226,
      roughness: 0.15,
      clearcoat: 0.9,
    });
    for (let i = 0; i < 11; i++) {
      const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.088, 16, 16),
        amberSphereMat
      );
      sphereMesh.position.set(
        (Math.random() - 0.5) * 0.5,
        Math.random() * 0.22,
        (Math.random() - 0.5) * 0.5
      );
      settledPillsGroup.add(sphereMesh);
    }

    // --- 5. DUAL-TONE CAPSULES WITH REALISTIC GRAVITY & EMERGENCE ---
    const capRadius = 0.072;
    const capHalfLength = 0.11;

    // Emerald Mint & Clinical White
    const mintGelMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });
    const whiteGelMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.14,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08,
    });

    // Coral Salmon Rose & Clinical White
    const coralGelMat = new THREE.MeshPhysicalMaterial({
      color: 0xfb7185,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
    });

    const seamMat = new THREE.MeshStandardMaterial({
      color: 0x0a583c,
      roughness: 0.3,
    });

    const createDualToneCapsule = (isCoral: boolean) => {
      const cap = new THREE.Group();
      const topMat = isCoral ? coralGelMat : mintGelMat;

      // Top Dome + Cyl
      const topDome = new THREE.Mesh(
        new THREE.SphereGeometry(capRadius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        topMat
      );
      topDome.position.y = capHalfLength;
      topDome.castShadow = true;
      cap.add(topDome);

      const topCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(capRadius, capRadius, capHalfLength, 24),
        topMat
      );
      topCyl.position.y = capHalfLength / 2;
      topCyl.castShadow = true;
      cap.add(topCyl);

      // Bottom Dome + Cyl
      const botDome = new THREE.Mesh(
        new THREE.SphereGeometry(capRadius, 24, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2),
        whiteGelMat
      );
      botDome.position.y = -capHalfLength;
      botDome.castShadow = true;
      cap.add(botDome);

      const botCyl = new THREE.Mesh(
        new THREE.CylinderGeometry(capRadius, capRadius, capHalfLength, 24),
        whiteGelMat
      );
      botCyl.position.y = -capHalfLength / 2;
      botCyl.castShadow = true;
      cap.add(botCyl);

      // Center Seam
      const seam = new THREE.Mesh(
        new THREE.CylinderGeometry(capRadius * 1.025, capRadius * 1.025, 0.015, 24),
        seamMat
      );
      cap.add(seam);

      return cap;
    };

    // Small White Tablet/Disc Pill
    const createTabletPill = () => {
      const tab = new THREE.Group();
      const tabGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.045, 32);
      const tabMesh = new THREE.Mesh(tabGeo, whiteGelMat);
      tabMesh.rotation.x = Math.PI / 2;
      tab.add(tabMesh);
      return tab;
    };

    // Calculate Bottle Mouth Origin Position (Tilted 15° left: rotation.z = +0.26)
    const mouthLocalY = bottleHeight / 2 + 0.6;
    const mouthTilt = 0.26;
    const mouthOriginX = bottleBaseX - Math.sin(mouthTilt) * mouthLocalY; // ~ -0.06
    const mouthOriginY = bottleBaseY + Math.cos(mouthTilt) * mouthLocalY; // ~ 0.81
    const mouthOriginZ = 0;

    const capsulesRoot = new THREE.Group();
    mainGroup.add(capsulesRoot);

    const capsulesData: DynamicCapsule[] = [];
    const totalCapsules = 12;

    // Leftward angles matching the reference image
    const referenceTiltAngles = [
      0.35, 0.45, 0.55, 0.28, -0.20, -0.35,
      -0.45, -0.55, -0.40, -0.30, 0.38, -0.25
    ];

    // Natural ballistic fountain trajectories: Emerge from mouth, fan left and up, fall naturally
    const trajectoryProfiles = [
      { vx: -0.55, vy: 2.10, vz:  0.15 },
      { vx: -0.75, vy: 1.80, vz:  0.22 },
      { vx: -0.35, vy: 2.35, vz: -0.08 },
      { vx: -0.65, vy: 2.50, vz:  0.12 },
      { vx: -0.25, vy: 2.80, vz:  0.18 },
      { vx:  0.05, vy: 2.70, vz: -0.10 },
      { vx:  0.22, vy: 2.85, vz:  0.06 },
      { vx:  0.38, vy: 2.45, vz: -0.14 },
      { vx:  0.48, vy: 2.05, vz:  0.16 },
      { vx:  0.12, vy: 1.75, vz:  0.05 },
      { vx:  0.55, vy: 1.50, vz:  0.22 },
      { vx: -0.18, vy: 2.30, vz: -0.10 },
    ];

    for (let i = 0; i < totalCapsules; i++) {
      const isCoral = i % 3 === 1;
      const mesh = createDualToneCapsule(isCoral);
      capsulesRoot.add(mesh);

      mesh.position.set(mouthOriginX, mouthOriginY, mouthOriginZ);
      const baseTilt = referenceTiltAngles[i % referenceTiltAngles.length];
      mesh.rotation.z = baseTilt;

      const prof = trajectoryProfiles[i % trajectoryProfiles.length];

      capsulesData.push({
        mesh,
        pos: new THREE.Vector3(mouthOriginX, mouthOriginY, mouthOriginZ),
        vel: new THREE.Vector3(prof.vx, prof.vy, prof.vz),
        rot: mesh.rotation.clone(),
        baseTiltZ: baseTilt,
        tiltWobbleSpeed: 1.2 + Math.random() * 0.6,
        wobblePhase: Math.random() * Math.PI * 2,
        isCoral,
        spawnDelay: i * 0.24,
        initialVx: prof.vx,
        initialVy: prof.vy,
        initialVz: prof.vz,
      });
    }

    // Add floating white tablet pill near the neck
    const tablet1 = createTabletPill();
    tablet1.position.set(mouthOriginX - 0.05, mouthOriginY + 0.15, 0.25);
    capsulesRoot.add(tablet1);

    setCapsuleCount(totalCapsules + 1);

    // --- 6. NATURAL PHYSICS & INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 1.0;
      mouseY = y * 0.8;
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Click triggers immediate new capsule emergence
    container.addEventListener("click", () => {
      if (dropNewCapsuleRef.current) dropNewCapsuleRef.current();
    });

    dropNewCapsuleRef.current = () => {
      let lowestIdx = 0;
      let lowestY = 999;
      capsulesData.forEach((c, idx) => {
        if (c.pos.y < lowestY) {
          lowestY = c.pos.y;
          lowestIdx = idx;
        }
      });

      const cap = capsulesData[lowestIdx];
      cap.pos.set(
        mouthOriginX + (Math.random() - 0.5) * 0.05,
        mouthOriginY,
        mouthOriginZ + (Math.random() - 0.5) * 0.05
      );
      cap.vel.set(
        -0.45 - Math.random() * 0.35,
        2.3 + Math.random() * 0.4,
        (Math.random() - 0.5) * 0.25
      );
      if (onCapsuleClick) onCapsuleClick();
    };

    resetSimulationRef.current = () => {
      capsulesData.forEach((c) => {
        c.pos.set(mouthOriginX, mouthOriginY, mouthOriginZ);
        c.vel.set(c.initialVx, c.initialVy, c.initialVz);
      });
    };

    // Responsive camera adjustment
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      if (w < 768) {
        camera.position.set(0, 0.4, 6.8);
        mainGroup.position.x = 0;
      } else {
        camera.position.set(0.08, 0.40, 6.0);
        mainGroup.position.x = 0.16;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // --- 7. ANIMATION LOOP WITH NATURAL GRAVITY & PHYSICS ---
    const clock = new THREE.Clock();
    const gravity = -1.95; // Real natural downward acceleration in slow-motion
    const fixedDt = 0.016;

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth studio camera parallax with heavy inertia
      const targetRotY = mouseX * 0.14;
      const targetRotX = mouseY * 0.09;
      mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.04;
      mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.04;

      // Gentle natural hovering poise for the bottle
      bottleGroup.position.y = bottleBaseY + Math.sin(elapsedTime * 1.5) * 0.022;

      // Realistic Physics Update for each emerging capsule
      capsulesData.forEach((cap, i) => {
        if (elapsedTime < cap.spawnDelay) {
          cap.mesh.visible = false;
          return;
        }
        cap.mesh.visible = true;

        // Apply natural gravity ($y'' = -g$)
        cap.vel.y += gravity * fixedDt;

        // Subtle leftward airflow carrying capsules toward the headline
        cap.vel.x += -0.035 * fixedDt;

        // Realistic air damping
        cap.vel.multiplyScalar(0.995);

        // Position integration
        cap.pos.x += cap.vel.x * fixedDt;
        cap.pos.y += cap.vel.y * fixedDt;
        cap.pos.z += cap.vel.z * fixedDt;

        // Natural aerodynamic orientation: keeps leftward angle with subtle breathing sway
        const naturalWobble = Math.sin(elapsedTime * cap.tiltWobbleSpeed + cap.wobblePhase) * 0.05;
        const targetRotZ = cap.baseTiltZ + naturalWobble;

        cap.rot.z += (targetRotZ - cap.rot.z) * 0.08;
        cap.rot.x += (Math.sin(elapsedTime * 1.1 + i) * 0.15 - cap.rot.x) * 0.05;
        cap.rot.y += (Math.cos(elapsedTime * 0.9 + i) * 0.18 - cap.rot.y) * 0.05;

        // Smooth natural recycling when falling below view
        if (cap.pos.y < -1.8) {
          cap.pos.set(
            mouthOriginX + (Math.random() - 0.5) * 0.05,
            mouthOriginY,
            mouthOriginZ + (Math.random() - 0.5) * 0.05
          );
          cap.vel.set(
            cap.initialVx * (0.9 + Math.random() * 0.2),
            cap.initialVy * (0.9 + Math.random() * 0.2),
            cap.initialVz * (0.9 + Math.random() * 0.2)
          );
        }

        cap.mesh.position.copy(cap.pos);
        cap.mesh.rotation.copy(cap.rot);
      });

      // Floating tablet gentle motion
      tablet1.position.y = (mouthOriginY + 0.15) + Math.sin(elapsedTime * 1.6) * 0.025;
      tablet1.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    const animId = requestAnimationFrame(animate);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", handleMouseMove);

      renderer.dispose();
      bodyGeometry.dispose();
      shoulderGeometry.dispose();
      neckGeometry.dispose();
      rimLipGeometry.dispose();
      amberGlassMaterial.dispose();
      labelGeometry.dispose();
      labelMaterial.dispose();
      amberSphereMat.dispose();
      mintGelMat.dispose();
      coralGelMat.dispose();
      whiteGelMat.dispose();
      seamMat.dispose();

      capsulesData.forEach((c) => {
        c.mesh.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
          }
        });
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {/* Three.js Canvas Container */}
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-pointer flex items-center justify-center"
        title="Click to emerge a new capsule from the bottle"
      />

      {/* Minimalist Controls */}
      <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 pointer-events-auto">
        <div className="glass-panel py-1 px-3.5 rounded-full border border-white/10 flex items-center gap-3 text-xs text-zinc-300 shadow-2xl backdrop-blur-lg">
          <button
            onClick={() => dropNewCapsuleRef.current && dropNewCapsuleRef.current()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all text-[11px] font-semibold active:scale-95"
            title="Emerge a new capsule from the bottle"
          >
            <Plus className="w-3 h-3 text-emerald-400" />
            <span>Dispense Capsule</span>
          </button>

          <button
            onClick={() => resetSimulationRef.current && resetSimulationRef.current()}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 transition-all text-[11px] active:scale-95"
            title="Reset natural fountain emergence"
          >
            <RotateCcw className="w-3 h-3 text-zinc-400" />
            <span>Reset</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-zinc-400 border-l border-white/10 pl-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Natural Gravity • 15° Left Tilt</span>
          </div>
        </div>
      </div>
    </div>
  );
}
