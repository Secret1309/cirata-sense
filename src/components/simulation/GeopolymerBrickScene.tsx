"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Environment,
  PerspectiveCamera,
  ContactShadows,
  Edges,
} from "@react-three/drei";
import * as THREE from "three";
import { useSimulationStore } from "@/lib/store";

const SUBSTANCE_COLORS = [
  { color: "#334155", name: "Inti Baja IWRC SS304 Ø20 mm (Nominal 577 kN)" },
  { color: "#10b981", name: "Anoda Korban Paduan Zn-Al (Proteksi Katodik)" },
  { color: "#06b6d4", name: "Selubung Polimer HDPE/PU (Isolasi Celah H₂S/DO)" },
  { color: "#f59e0b", name: "Matriks Pelet Fermentasi Eceng Gondok (48 Ton/hr)" },
  { color: "#a855f7", name: "Serapan Nutrien N (1,0 mg/L) & P (0,24 mg/L)" },
  { color: "#38bdf8", name: "Viscoelastic Mooring Damper (η = 0,88)" },
];

function InteriorPelletParticles() {
  const particles = useMemo(() => {
    const RADIUS = 0.78;
    const HEIGHT = 2.15;
    const result: {
      pos: [number, number, number];
      size: number;
      colorIdx: number;
    }[] = [];

    const count = 260;
    for (let i = 0; i < count; i++) {
      const r = Math.sqrt(Math.random()) * (RADIUS - 0.08);
      const theta = Math.random() * Math.PI * 2;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = (Math.random() - 0.5) * (HEIGHT - 0.14);
      const size = 0.035 + Math.random() * 0.045;
      const colorIdx = Math.floor(Math.random() * SUBSTANCE_COLORS.length);
      result.push({ pos: [x, y, z], size, colorIdx });
    }
    return result;
  }, []);

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[p.size, 10, 10]} />
          <meshStandardMaterial
            color={SUBSTANCE_COLORS[p.colorIdx].color}
            roughness={0.55}
            metalness={0.25}
          />
        </mesh>
      ))}
    </group>
  );
}

function BioTrapPelletMesh({
  showCrossSection,
  showLabels,
  isBioSulfurMode,
}: {
  showCrossSection: boolean;
  showLabels: boolean;
  isBioSulfurMode: boolean;
}) {
  const RADIUS = 0.8;
  const HEIGHT = 2.2;

  const shellColor = isBioSulfurMode ? "#451a03" : "#1e293b";
  const accentRingColor = isBioSulfurMode ? "#f59e0b" : "#10b981";

  return (
    <group>
      {/* SOLID PELLET VIEW (When Cross-Section is OFF) */}
      <group visible={!showCrossSection}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, 40]} />
          <meshPhysicalMaterial
            color={shellColor}
            roughness={0.75}
            metalness={0.18}
            clearcoat={0.15}
            clearcoatRoughness={0.6}
          />
        </mesh>
        {/* Top & Bottom Honeycomb Pore Rings */}
        {[-0.45, 0, 0.45].map((r, idx) => (
          <mesh
            key={idx}
            position={[0, HEIGHT / 2 + 0.01, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[Math.abs(r) + 0.08, Math.abs(r) + 0.13, 32]} />
            <meshBasicMaterial color={accentRingColor} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* CROSS-SECTION MICROSTRUCTURE VIEW (When Cross-Section is ON) */}
      <group visible={showCrossSection}>
        <mesh>
          <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, 24]} />
          <meshBasicMaterial visible={false} />
          <Edges threshold={12} color={accentRingColor} lineWidth={1.2} />
        </mesh>

        <mesh>
          <cylinderGeometry args={[RADIUS, RADIUS, HEIGHT, 32]} />
          <meshPhysicalMaterial
            color={shellColor}
            transparent
            opacity={0.15}
            roughness={0.85}
            metalness={0.1}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        <InteriorPelletParticles />
      </group>

      {/* DIMENSION CALLOUTS */}
      {showLabels && !showCrossSection && (
        <>
          <Html
            position={[0, -HEIGHT / 2 - 0.3, 0]}
            center
            distanceFactor={6}
            zIndexRange={[100, 0]}
          >
            <div className="pointer-events-none select-none rounded bg-slate-900/90 border border-emerald-500/40 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-300 whitespace-nowrap">
              ← Diameter Silinder Ø 5,0 mm (Anti-Channeling) →
            </div>
          </Html>
          <Html
            position={[RADIUS + 0.45, 0, 0]}
            center
            distanceFactor={6}
            zIndexRange={[100, 0]}
          >
            <div className="pointer-events-none select-none rounded bg-slate-900/90 border border-cyan-500/40 px-2 py-0.5 font-mono text-[9px] font-bold text-cyan-300 whitespace-nowrap">
              Panjang: 12,0 mm | BET: 1.105 m²/g
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

function PelletRotator({
  autoRotate,
  showCrossSection,
  showLabels,
  isBioSulfurMode,
}: {
  autoRotate: boolean;
  showCrossSection: boolean;
  showLabels: boolean;
  isBioSulfurMode: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current || !autoRotate) return;
    groupRef.current.rotation.y += delta * 0.35;
    groupRef.current.rotation.x = Math.sin(_.clock.getElapsedTime() * 0.5) * 0.15;
  });

  return (
    <group ref={groupRef}>
      <BioTrapPelletMesh
        showCrossSection={showCrossSection}
        showLabels={showLabels}
        isBioSulfurMode={isBioSulfurMode}
      />
    </group>
  );
}

export function GeopolymerBrickScene() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [showCrossSection, setShowCrossSection] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [isBioSulfurMode, setIsBioSulfurMode] = useState(false);

  const { massBalanceResult, pyrolysisTemp } = useSimulationStore();

  return (
    <div className="relative h-full min-h-[540px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/30">
      {/* Top-Left Interactive Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setAutoRotate((v) => !v)}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-md transition border cursor-pointer text-left ${
            autoRotate
              ? "bg-emerald-600/90 text-white border-emerald-400/50"
              : "bg-slate-900/90 text-slate-300 border-slate-700"
          }`}
        >
          {autoRotate ? "🔄 Auto-Rotate: ON" : "🔄 Auto-Rotate: OFF"}
        </button>
        <button
          onClick={() => setShowCrossSection((v) => !v)}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-md transition border cursor-pointer text-left ${
            showCrossSection
              ? "bg-amber-600/90 text-white border-amber-400/50"
              : "bg-slate-900/90 text-slate-300 border-slate-700"
          }`}
        >
          {showCrossSection
            ? "🔬 Cross-Section Pori Honeycomb: ON"
            : "🔬 Cross-Section Pori Honeycomb: OFF"}
        </button>
        <button
          onClick={() => setIsBioSulfurMode((v) => !v)}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-md transition border cursor-pointer text-left ${
            isBioSulfurMode
              ? "bg-amber-500/25 text-amber-300 border-amber-500/50"
              : "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
          }`}
        >
          {isBioSulfurMode
            ? "🌱 Fase: Pupuk Sirkular BioSulfur™ (Pasca-Adsorpsi)"
            : "💎 Fase: Pelet Adsorben BioTrap-TKKS™ (Fresh 950°C)"}
        </button>
        <button
          onClick={() => setShowLabels((v) => !v)}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-md backdrop-blur-md transition border cursor-pointer text-left ${
            showLabels
              ? "bg-slate-800/90 text-slate-200 border-slate-600"
              : "bg-slate-900/90 text-slate-400 border-slate-700"
          }`}
        >
          {showLabels ? "🏷️ Label Dimensi: ON" : "🏷️ Label Dimensi: OFF"}
        </button>
      </div>

      {/* Left Static Material Spec Card */}
      <div className="absolute top-48 left-4 z-10 hidden md:block pointer-events-none">
        <div className="w-64 rounded-2xl border border-slate-700/80 bg-slate-950/90 p-3.5 shadow-2xl backdrop-blur-md pointer-events-auto">
          <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-xs font-bold text-white">
              {isBioSulfurMode ? "🌱 Granul BioSulfur™" : "💎 Pelet BioTrap-TKKS™"}
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
              Non-B3 Verified
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Luas BET ({pyrolysisTemp}°C)</span>
              <span className="font-mono font-bold text-emerald-400">
                {massBalanceResult.betSurfaceAreaM2g.toLocaleString("id-ID")} m²/g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Volume Mesopori</span>
              <span className="font-mono font-bold text-cyan-400">
                0,180 cm³/g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Situs Basa (pH_PZC)</span>
              <span className="font-mono font-bold text-white">
                {massBalanceResult.phPzc} (K &amp; Ca)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kadar Sulfur Terikat</span>
              <span className="font-mono font-bold text-amber-400">
                4 – 8% (S⁰ / SO₄²⁻)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kapasitas KTK Tanah</span>
              <span className="font-mono font-bold text-emerald-300">
                &gt; 56 meq/100g
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Output Harian PKS</span>
              <span className="font-mono font-bold text-white">
                {isBioSulfurMode
                  ? `${massBalanceResult.fertilizerDailyTon.toFixed(2)} Ton/hari`
                  : `${massBalanceResult.pelletDailyTon.toFixed(2)} Ton/hari`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Center Cross-Section Banner */}
      {showCrossSection && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 hidden lg:block">
          <div className="rounded-xl border border-emerald-500/40 bg-slate-950/90 px-4 py-1.5 text-xs font-bold text-emerald-300 shadow-xl backdrop-blur-md whitespace-nowrap">
            🔬 Penampang Mikrostruktur Honeycomb (5–8 µm) &amp; Matriks Kemisorpsi H₂S
          </div>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} gl={{ localClippingEnabled: true }}>
        <PerspectiveCamera makeDefault position={[2.8, 1.6, 3.2]} fov={36} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <pointLight position={[-3, 3, 2]} intensity={0.6} color="#10b981" />
        <pointLight position={[3, -2, -2]} intensity={0.5} color="#06b6d4" />

        <Environment preset="studio" />

        <React.Suspense fallback={null}>
          <PelletRotator
            autoRotate={autoRotate}
            showCrossSection={showCrossSection}
            showLabels={showLabels}
            isBioSulfurMode={isBioSulfurMode}
          />
          <ContactShadows
            position={[0, -1.45, 0]}
            opacity={0.5}
            scale={10}
            blur={2.5}
            far={4}
          />
        </React.Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2.2}
          maxDistance={9}
        />
      </Canvas>

      {/* Bottom-Right Legend */}
      <div className="absolute bottom-4 right-4 z-10 rounded-2xl border border-slate-700/80 bg-slate-950/90 p-3.5 text-xs text-slate-200 shadow-2xl backdrop-blur-md max-w-xs">
        <div className="mb-2 font-bold text-white text-[11px] border-b border-slate-800 pb-1">
          Komposisi Fasa Internal Pelet (FE-SEM &amp; EDX)
        </div>
        <div className="space-y-1.5 text-[10px]">
          {SUBSTANCE_COLORS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-slate-300">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top-Right Badge */}
      <div className="absolute top-4 right-4 z-10 hidden sm:block rounded-xl border border-slate-700 bg-slate-950/90 px-4 py-2 shadow-lg backdrop-blur-md">
        <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400">
          3D Material &amp; Circular Digital Twin
        </div>
        <div className="text-sm font-bold text-white">
          Sling IWRC SS304 Terproteksi &amp; Pelet KJA
        </div>
        <div className="text-[10px] text-slate-400">
          Anoda Zn-Al + HDPE/PU (SF ≥ 1,68) • Pakan 100.000 KJA
        </div>
      </div>
    </div>
  );
}

export { GeopolymerBrickScene as BioTrapPelletScene };
