"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Environment,
  PerspectiveCamera,
  ContactShadows,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { useSimulationStore } from "@/lib/store";

type SceneViewMode = "HYDRA_SLING" | "CORRODED_SLING" | "KJA_PELLET";

const LEGEND_ITEMS = [
  { color: "#cbd5e1", name: "Inti Baja IWRC & 6×36 Untai Heliks SS304 (Ø20 mm, Nominal 577 kN)" },
  { color: "#06b6d4", name: "Selubung Polimer Ekstrusi HDPE/PU (Isolasi Celah terhadap H₂S & DO Rendah)" },
  { color: "#10b981", name: "Cincin Anoda Korban Paduan Zn-Al (Proteksi Katodik Galvanik Aktif)" },
  { color: "#3b82f6", name: "Unit Viscoelastic Mooring Damper (η = 0,88 Peredam Kejut Hidrodinamika)" },
  { color: "#ea580c", name: "Zona Pitting & Crevice Corrosion FeS/Cr₂O₃ (Tanpa Proteksi: T_aktual Turun)" },
  { color: "#d97706", name: "Granul Pelet Pakan Ikan Fermentasi Eceng Gondok (48 Ton/hr • 100.000 KJA)" },
];

/**
 * Generates 3D helical wire rope strands (6 outer strands around 1 central IWRC core)
 */
function HelicalWireRopeSling({
  showCrossSection,
  showLabels,
  isCorroded,
}: {
  showCrossSection: boolean;
  showLabels: boolean;
  isCorroded: boolean;
}) {
  const LENGTH = 2.8;
  const CORE_RADIUS = 0.16;
  const STRAND_RADIUS = 0.115;
  const HELIX_PITCH_TURNS = 2.2;

  // Build 6 helical curves for the outer wire strands
  const strandGeometries = useMemo(() => {
    const geoms: THREE.TubeGeometry[] = [];
    const numStrands = 6;
    const segments = 90;

    for (let s = 0; s < numStrands; s++) {
      const phase = (s / numStrands) * Math.PI * 2;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = (t - 0.5) * LENGTH;
        const angle = phase + t * Math.PI * 2 * HELIX_PITCH_TURNS;

        // If corroded mode, flare out strands near y = 0 to simulate birdcaging / strand necking & rupture
        let radialFlare = CORE_RADIUS + STRAND_RADIUS * 0.92;
        if (isCorroded) {
          const distCenter = Math.abs(y);
          if (distCenter < 0.45 && (s === 0 || s === 2 || s === 4)) {
            radialFlare += (0.45 - distCenter) * 0.42;
          }
        }

        const x = Math.cos(angle) * radialFlare;
        const z = Math.sin(angle) * radialFlare;
        pts.push(new THREE.Vector3(x, y, z));
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      geoms.push(new THREE.TubeGeometry(curve, 80, STRAND_RADIUS, 16, false));
    }
    return geoms;
  }, [isCorroded]);

  // Crevice corrosion / sulfide pitting particles along strand crevices
  const corrosionPits = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; isSulfide: boolean }[] = [];
    for (let i = 0; i < 65; i++) {
      const y = (Math.random() - 0.5) * 2.1;
      const angle = Math.random() * Math.PI * 2;
      const r = 0.22 + Math.random() * 0.08;
      arr.push({
        pos: [Math.cos(angle) * r, y, Math.sin(angle) * r],
        scale: 0.028 + Math.random() * 0.04,
        isSulfide: i % 3 === 0,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {/* 1. CENTRAL IWRC CORE (Independent Wire Rope Core SS304) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[CORE_RADIUS, CORE_RADIUS, LENGTH + 0.1, 28]} />
        <meshStandardMaterial
          color={isCorroded ? "#78350f" : "#e2e8f0"}
          metalness={isCorroded ? 0.45 : 0.88}
          roughness={isCorroded ? 0.75 : 0.22}
        />
      </mesh>

      {/* 2. SIX HELICAL OUTER WIRE STRANDS (SS304) */}
      {strandGeometries.map((geom, idx) => (
        <mesh key={idx} geometry={geom} castShadow receiveShadow>
          <meshStandardMaterial
            color={isCorroded ? (idx % 2 === 0 ? "#9a3412" : "#64748b") : "#cbd5e1"}
            metalness={isCorroded ? 0.5 : 0.9}
            roughness={isCorroded ? 0.68 : 0.2}
          />
        </mesh>
      ))}

      {/* 3. CORROSION PITTING & SULFIDE ATTACK (Visible in Corroded Mode) */}
      {isCorroded && (
        <group>
          {corrosionPits.map((pit, idx) => (
            <mesh key={idx} position={pit.pos}>
              <dodecahedronGeometry args={[pit.scale, 0]} />
              <meshStandardMaterial
                color={pit.isSulfide ? "#1e293b" : "#ea580c"}
                roughness={0.9}
                metalness={0.15}
              />
            </mesh>
          ))}
          {/* Fracture Warning Halo at Center */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.52, 0.018, 16, 48]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
        </group>
      )}

      {/* 4. HYDRA-CIRATA PROTECTION SYSTEM (Visible in Protected Mode) */}
      {!isCorroded && (
        <group>
          {/* Outer Extruded HDPE/PU Polymer Jacket Sleeve */}
          {/* If showCrossSection is ON, render a cutaway half-cylinder + lower solid sleeve so interior strands are visible */}
          {showCrossSection ? (
            <group>
              {/* Lower solid jacket */}
              <mesh position={[0, -0.68, 0]}>
                <cylinderGeometry args={[0.36, 0.36, 1.25, 36]} />
                <meshPhysicalMaterial
                  color="#0891b2"
                  roughness={0.25}
                  metalness={0.1}
                  clearcoat={0.6}
                  transparent
                  opacity={0.85}
                />
              </mesh>
              {/* Upper cutaway translucent shell (180 deg) */}
              <mesh position={[0, 0.55, 0]}>
                <cylinderGeometry args={[0.365, 0.365, 1.25, 36, 1, false, 0, Math.PI]} />
                <meshPhysicalMaterial
                  color="#06b6d4"
                  roughness={0.2}
                  metalness={0.1}
                  transparent
                  opacity={0.42}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          ) : (
            <mesh>
              <cylinderGeometry args={[0.36, 0.36, LENGTH - 0.3, 40]} />
              <meshPhysicalMaterial
                color="#0891b2"
                roughness={0.25}
                metalness={0.12}
                clearcoat={0.7}
              />
            </mesh>
          )}

          {/* Clamp-On Sacrificial Anode Collar Ring (Zn-Al Alloy) */}
          <group position={[0, -0.1, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.46, 0.46, 0.42, 32]} />
              <meshStandardMaterial color="#10b981" metalness={0.65} roughness={0.3} />
            </mesh>
            {/* Anode Clamp Flanges & Bolts */}
            <RoundedBox args={[1.05, 0.38, 0.14]} position={[0, 0, 0]} radius={0.03}>
              <meshStandardMaterial color="#059669" metalness={0.7} roughness={0.3} />
            </RoundedBox>
            {/* Cathodic Protection Active Rings */}
            {[-0.24, 0.24].map((ry, i) => (
              <mesh key={i} position={[0, ry, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.48, 0.015, 12, 40]} />
                <meshBasicMaterial color="#34d399" />
              </mesh>
            ))}
          </group>

          {/* Top Viscoelastic Mooring Damper Sub-Assembly (η = 0,88) */}
          <group position={[0, LENGTH / 2 + 0.15, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.42, 0.34, 0.45, 28]} />
              <meshStandardMaterial color="#1d4ed8" metalness={0.55} roughness={0.35} />
            </mesh>
            <mesh position={[0, 0.3, 0]} rotation={[0, 0, 0]}>
              <torusGeometry args={[0.22, 0.06, 16, 32]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.2} />
            </mesh>
          </group>
        </group>
      )}

      {/* Bottom Swaged Socket End Termination */}
      <group position={[0, -LENGTH / 2 - 0.12, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.32, 0.26, 0.35, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>

      {/* 5. 3D ENGINEERING DIMENSION & METALLURGY CALLOUTS */}
      {showLabels && (
        <>
          <Html position={[0.62, 0.78, 0]} center distanceFactor={6} zIndexRange={[100, 0]}>
            <div className="pointer-events-none select-none rounded-lg bg-white/95 border border-gray-300 px-2.5 py-1 font-mono text-[9px] font-bold text-gray-900 shadow-md whitespace-nowrap">
              🔩 Inti 6×36 IWRC SS304 (Ø 20,0 mm) • T_nom = 577 kN
            </div>
          </Html>

          {!isCorroded ? (
            <>
              <Html position={[-0.68, 0.35, 0]} center distanceFactor={6} zIndexRange={[100, 0]}>
                <div className="pointer-events-none select-none rounded-lg bg-white/95 border border-sky-300 px-2.5 py-1 font-mono text-[9px] font-bold text-sky-800 shadow-md whitespace-nowrap">
                  🛡️ Selubung HDPE/PU (Isolasi Celah H₂S 0,005 mg/L)
                </div>
              </Html>
              <Html position={[0.68, -0.1, 0]} center distanceFactor={6} zIndexRange={[100, 0]}>
                <div className="pointer-events-none select-none rounded-lg bg-white/95 border border-emerald-300 px-2.5 py-1 font-mono text-[9px] font-bold text-emerald-800 shadow-md whitespace-nowrap">
                  ⚡ Anoda Korban Zn-Al • T_aktual = 555 kN (SF = 1,77)
                </div>
              </Html>
              <Html position={[0, LENGTH / 2 + 0.62, 0]} center distanceFactor={6} zIndexRange={[100, 0]}>
                <div className="pointer-events-none select-none rounded-lg bg-white/95 border border-blue-300 px-2.5 py-1 font-mono text-[9px] font-bold text-blue-800 shadow-md whitespace-nowrap">
                  🌊 Viscoelastic Damper (η = 0,88) • T_normal = 313,4 kN
                </div>
              </Html>
            </>
          ) : (
            <>
              <Html position={[0, 0.05, 0.55]} center distanceFactor={6} zIndexRange={[100, 0]}>
                <div className="pointer-events-none select-none rounded-lg bg-rose-50/95 border border-rose-400 px-2.5 py-1 font-mono text-[9px] font-bold text-rose-800 shadow-md whitespace-nowrap">
                  ⚠️ Crevice Corrosion &amp; Birdcaging (DO 2 mg/L + H₂S)
                </div>
              </Html>
              <Html position={[0, -0.65, 0]} center distanceFactor={6} zIndexRange={[100, 0]}>
                <div className="pointer-events-none select-none rounded-lg bg-amber-50/95 border border-amber-400 px-2.5 py-1 font-mono text-[9px] font-bold text-amber-900 shadow-md whitespace-nowrap">
                  T_aktual Turun ke 485 kN vs Beban 620 kN (SF = 0,78 PUTUS)
                </div>
              </Html>
            </>
          )}
        </>
      )}
    </group>
  );
}

/**
 * 3D Fermented Water Hyacinth Fish Feed Pellet Cluster for 100.000 KJA
 */
function FermentedKjaPelletCluster({
  showCrossSection,
  showLabels,
}: {
  showCrossSection: boolean;
  showLabels: boolean;
}) {
  const nutrientGranules = useMemo(() => {
    const arr: { pos: [number, number, number]; size: number; color: string }[] = [];
    const palette = ["#10b981", "#f59e0b", "#a855f7", "#06b6d4", "#84cc16"];
    for (let i = 0; i < 180; i++) {
      const r = Math.sqrt(Math.random()) * 0.62;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.95;
      arr.push({
        pos: [r * Math.cos(theta), y, r * Math.sin(theta)],
        size: 0.035 + Math.random() * 0.04,
        color: palette[i % palette.length],
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {/* Main Extruded Feed Pellet Cylinder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[
            0.72,
            0.72,
            2.15,
            36,
            1,
            false,
            0,
            showCrossSection ? Math.PI * 1.35 : Math.PI * 2,
          ]}
        />
        <meshStandardMaterial
          color="#78350f"
          roughness={0.78}
          metalness={0.12}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Internal Fermented Biomass & Probiotic Matrix */}
      {showCrossSection && (
        <group>
          <mesh>
            <cylinderGeometry args={[0.68, 0.68, 2.1, 32]} />
            <meshStandardMaterial
              color="#92400e"
              transparent
              opacity={0.28}
              roughness={0.85}
            />
          </mesh>
          {nutrientGranules.map((g, i) => (
            <mesh key={i} position={g.pos}>
              <sphereGeometry args={[g.size, 10, 10]} />
              <meshStandardMaterial color={g.color} roughness={0.5} />
            </mesh>
          ))}
        </group>
      )}

      {/* Companion Mini Pellets Floating Around */}
      {[
        { pos: [-1.15, -0.5, 0.4] as [number, number, number], rot: [0.4, 0.2, 0.6] as [number, number, number] },
        { pos: [1.1, 0.45, -0.3] as [number, number, number], rot: [-0.3, 0.5, -0.4] as [number, number, number] },
        { pos: [0.95, -0.75, 0.5] as [number, number, number], rot: [0.6, -0.2, 0.3] as [number, number, number] },
      ].map((p, idx) => (
        <mesh key={idx} position={p.pos} rotation={p.rot} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.7, 24]} />
          <meshStandardMaterial color="#854d0e" roughness={0.75} />
        </mesh>
      ))}

      {showLabels && (
        <>
          <Html position={[0, 1.32, 0]} center distanceFactor={6} zIndexRange={[100, 0]}>
            <div className="pointer-events-none select-none rounded-lg bg-white/95 border border-amber-300 px-2.5 py-1 font-mono text-[9px] font-bold text-amber-800 shadow-md whitespace-nowrap">
              🐟 Pelet Pakan Fermentasi Eceng Gondok (Ø 4,0 mm • Protein 32,5%)
            </div>
          </Html>
          <Html position={[0, -1.35, 0]} center distanceFactor={6} zIndexRange={[100, 0]}>
            <div className="pointer-events-none select-none rounded-lg bg-white/95 border border-emerald-300 px-2.5 py-1 font-mono text-[9px] font-bold text-emerald-800 shadow-md whitespace-nowrap">
              ♻️ Produksi 48 Ton/hari • Menyuplai 100.000 Petak KJA Waduk Cirata
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

function SceneRotator({
  autoRotate,
  showCrossSection,
  showLabels,
  viewMode,
}: {
  autoRotate: boolean;
  showCrossSection: boolean;
  showLabels: boolean;
  viewMode: SceneViewMode;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !autoRotate) return;
    groupRef.current.rotation.y += delta * 0.38;
    groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.08;
  });

  return (
    <group ref={groupRef}>
      {viewMode === "KJA_PELLET" ? (
        <FermentedKjaPelletCluster
          showCrossSection={showCrossSection}
          showLabels={showLabels}
        />
      ) : (
        <HelicalWireRopeSling
          showCrossSection={showCrossSection}
          showLabels={showLabels}
          isCorroded={viewMode === "CORRODED_SLING"}
        />
      )}
    </group>
  );
}

export function GeopolymerBrickScene() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [showCrossSection, setShowCrossSection] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [viewMode, setViewMode] = useState<SceneViewMode>("HYDRA_SLING");

  const { massBalanceResult } = useSimulationStore();

  return (
    <div className="relative h-full min-h-[540px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-sky-50/60 to-emerald-50/50 shadow-sm">
      {/* Top-Left Interactive Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setViewMode("HYDRA_SLING")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md transition border cursor-pointer ${
              viewMode === "HYDRA_SLING"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-white/95 text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            🛡️ Sling IWRC SS304 HYDRA (Terproteksi)
          </button>
          <button
            onClick={() => setViewMode("CORRODED_SLING")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md transition border cursor-pointer ${
              viewMode === "CORRODED_SLING"
                ? "bg-rose-600 text-white border-rose-500"
                : "bg-white/95 text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            ⚠️ Sling Eksisting (Korosi Celah / Putus)
          </button>
          <button
            onClick={() => setViewMode("KJA_PELLET")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md transition border cursor-pointer ${
              viewMode === "KJA_PELLET"
                ? "bg-amber-600 text-white border-amber-500"
                : "bg-white/95 text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            🐟 Pelet Fermentasi 100.000 KJA
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setAutoRotate((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md transition border cursor-pointer ${
              autoRotate
                ? "bg-teal-600 text-white border-teal-500"
                : "bg-white/95 text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {autoRotate ? "🔄 Auto-Rotate: ON" : "🔄 Auto-Rotate: OFF"}
          </button>
          <button
            onClick={() => setShowCrossSection((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md transition border cursor-pointer ${
              showCrossSection
                ? "bg-amber-600 text-white border-amber-500"
                : "bg-white/95 text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {showCrossSection
              ? "🔬 Cutaway Selubung HDPE/PU: ON"
              : "🔬 Cutaway Selubung HDPE/PU: OFF"}
          </button>
          <button
            onClick={() => setShowLabels((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur-md transition border cursor-pointer ${
              showLabels
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-white/95 text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {showLabels ? "🏷️ Label Teknik: ON" : "🏷️ Label Teknik: OFF"}
          </button>
        </div>
      </div>

      {/* Left Static Material Spec Card (Modul 3 Metalurgi & Modul 4 Sirkular) */}
      <div className="absolute top-32 left-4 z-10 hidden md:block pointer-events-none">
        <div className="w-72 rounded-2xl border border-gray-200 bg-white/95 p-3.5 shadow-lg backdrop-blur-md pointer-events-auto">
          <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-1.5">
            <span className="text-xs font-bold text-gray-900">
              {viewMode === "KJA_PELLET"
                ? "🐟 Pelet Sirkular 100.000 KJA"
                : viewMode === "CORRODED_SLING"
                ? "⚠️ Sling Eksisting (Tanpa Proteksi)"
                : "🛡️ Sling IWRC SS304 HYDRA-CIRATA"}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold border ${
                viewMode === "CORRODED_SLING"
                  ? "bg-rose-50 border-rose-300 text-rose-800"
                  : "bg-emerald-50 border-emerald-300 text-emerald-800"
              }`}
            >
              {viewMode === "CORRODED_SLING"
                ? "SF = 0,78 (PUTUS)"
                : `SF = ${massBalanceResult.safetyFactor.toFixed(2)} (AMAN)`}
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Spesifikasi Kabel</span>
              <span className="font-mono font-bold text-gray-900">
                IWRC SS304 Ø20 mm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Kekuatan Tarik Nominal</span>
              <span className="font-mono font-bold text-sky-700">
                577,0 kN
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Kekuatan Aktual (T_aktual)</span>
              <span
                className={`font-mono font-bold ${
                  viewMode === "CORRODED_SLING" ? "text-rose-700" : "text-emerald-700"
                }`}
              >
                {viewMode === "CORRODED_SLING"
                  ? "485,0 kN (Korosi Celah)"
                  : `${massBalanceResult.actualBreakingStrengthKn} kN (Anoda Zn-Al)`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tegangan Operasional</span>
              <span className="font-mono font-bold text-amber-700">
                {viewMode === "CORRODED_SLING"
                  ? `${massBalanceResult.frontalLoadKn} kN (θ = 90°)`
                  : `${massBalanceResult.normalTensionKn} kN (θ = 35°)`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Kondisi Air (PP 22/2021)</span>
              <span className="font-mono font-bold text-gray-800">
                DO 2,0 mg/L • H₂S 0,005 mg/L
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Output Pelet KJA</span>
              <span className="font-mono font-bold text-emerald-700">
                {massBalanceResult.fertilizerDailyTon.toFixed(1)} Ton/hari (100rb KJA)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} gl={{ localClippingEnabled: true }}>
        <color attach="background" args={["#f8fafc"]} />
        <PerspectiveCamera makeDefault position={[2.9, 1.3, 3.3]} fov={38} />
        <ambientLight intensity={1.0} />
        <directionalLight position={[5, 8, 5]} intensity={1.6} castShadow />
        <pointLight position={[-3, 3, 2]} intensity={0.65} color="#10b981" />
        <pointLight position={[3, -2, -2]} intensity={0.55} color="#06b6d4" />

        <Environment preset="studio" />

        <React.Suspense fallback={null}>
          <SceneRotator
            autoRotate={autoRotate}
            showCrossSection={showCrossSection}
            showLabels={showLabels}
            viewMode={viewMode}
          />
          <ContactShadows
            position={[0, -1.75, 0]}
            opacity={0.35}
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
      <div className="absolute bottom-4 right-4 z-10 rounded-2xl border border-gray-200 bg-white/95 p-3.5 text-xs text-gray-700 shadow-lg backdrop-blur-md max-w-xs">
        <div className="mb-2 font-bold text-gray-900 text-[11px] border-b border-gray-100 pb-1">
          Anatomi Metalurgi Sling IWRC SS304 &amp; Sirkular KJA
        </div>
        <div className="space-y-1.5 text-[10px]">
          {LEGEND_ITEMS.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="block h-2.5 w-2.5 shrink-0 rounded-full border border-gray-300"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-gray-700 font-medium">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top-Right Badge */}
      <div className="absolute top-4 right-4 z-10 hidden sm:block rounded-xl border border-gray-200 bg-white/95 px-4 py-2 shadow-md backdrop-blur-md">
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-teal-700">
          Modul 3 Metalurgi &amp; Modul 4 Sirkular KJA
        </div>
        <div className="text-sm font-bold text-gray-900">
          Sling IWRC SS304 Ø20 mm (577 kN) &amp; Pelet KJA
        </div>
        <div className="text-[10px] text-gray-600 font-medium">
          Anoda Korban Zn-Al + Selubung HDPE/PU (SF ≥ 1,68)
        </div>
      </div>
    </div>
  );
}

export { GeopolymerBrickScene as BioTrapPelletScene };
