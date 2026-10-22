"use client";

import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useProgress,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useSimulationStore } from "@/lib/store";

const LabelContext = React.createContext(true);

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center zIndexRange={[100, 0]}>
      <div className="flex w-64 flex-col items-center justify-center rounded-xl border border-cyan-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-2 text-sm font-bold text-cyan-400">
          Memuat Digital Twin 3D Waduk Cirata...
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full bg-cyan-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
        <div className="mt-1 font-mono text-xs text-slate-300">
          {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
}

function DataLabel({
  position,
  title,
  badge,
  badgeColor = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  data,
}: {
  position: [number, number, number];
  title: string;
  badge?: string;
  badgeColor?: string;
  data?: string[];
}) {
  const showLabels = React.useContext(LabelContext);
  if (!showLabels) return null;
  return (
    <Html position={position} center distanceFactor={16} zIndexRange={[100, 0]}>
      <div className="pointer-events-none select-none flex flex-col items-start rounded-xl border border-slate-700/80 bg-slate-950/90 p-2.5 shadow-2xl backdrop-blur-md min-w-[175px]">
        <div className="mb-1 flex w-full items-center justify-between gap-2 border-b border-slate-800 pb-1">
          <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">
            {title}
          </span>
          {badge && (
            <span
              className={`rounded border px-1.5 py-0.2 font-mono text-[8px] font-bold ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>
        {data &&
          data.map((line, idx) => (
            <div
              key={idx}
              className="font-mono text-[9px] text-slate-300 whitespace-nowrap mt-0.5"
            >
              {line}
            </div>
          ))}
      </div>
    </Html>
  );
}

function SmallLabel({
  position,
  text,
  colorClass = "bg-cyan-950/90 text-cyan-300 border-cyan-500/40",
}: {
  position: [number, number, number];
  text: string;
  colorClass?: string;
}) {
  const showLabels = React.useContext(LabelContext);
  if (!showLabels) return null;
  return (
    <Html position={position} distanceFactor={13} center>
      <div
        className={`rounded-md border px-2 py-0.5 font-mono text-[8px] font-bold whitespace-nowrap pointer-events-none shadow-md ${colorClass}`}
      >
        {text}
      </div>
    </Html>
  );
}

// 1. Permukaan Air Waduk Cirata (6.200 ha) & Tanggul Tepi
function ReservoirWaterAndBanks() {
  const waterRef = useRef<THREE.Mesh>(null);
  const { tbsCapacity: inflowQ } = useSimulationStore();

  useFrame(({ clock }) => {
    if (!waterRef.current) return;
    waterRef.current.position.y = Math.sin(clock.getElapsedTime() * 1.5) * 0.03;
  });

  return (
    <group>
      {/* Dasar & Badan Air Waduk Cirata */}
      <mesh
        ref={waterRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[28, 16]} />
        <meshPhysicalMaterial
          color="#0c4a6e"
          emissive="#082f49"
          emissiveIntensity={0.35}
          roughness={0.18}
          metalness={0.15}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Grid Referensi Spasial Hidrodinamika */}
      <gridHelper
        args={[28, 28, "#0284c7", "#0f172a"]}
        position={[0, 0.08, 0]}
      />

      {/* Tanggul Utara (Lokasi Collection Bay & Pabrik Pelet KJA) */}
      <mesh position={[0, 0.45, -7.2]} receiveShadow castShadow>
        <boxGeometry args={[28, 0.9, 1.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.92, -7.2]} receiveShadow>
        <boxGeometry args={[28, 0.08, 1.6]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>

      {/* Tanggul Selatan */}
      <mesh position={[0, 0.45, 7.2]} receiveShadow castShadow>
        <boxGeometry args={[28, 0.9, 1.8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Garis Arus Inflow (Streamlines) */}
      {[-4.5, -2.2, 0, 2.2, 4.5].map((zPos, idx) => (
        <mesh
          key={idx}
          position={[-4, 0.1, zPos]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.025, 0.025, 16, 8]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} />
        </mesh>
      ))}

      <SmallLabel
        position={[-9.5, 1.1, 0]}
        text={`INFLOW WADUK Q = ${inflowQ.toFixed(2)} m³/s →`}
        colorClass="bg-sky-950/95 text-sky-300 border-sky-500/50"
      />
    </group>
  );
}

// 2. Klaster Keramba Jaring Apung (100.000 Petak KJA Waduk Cirata)
function FloatingKjaCluster() {
  const kjaGroupRef = useRef<THREE.Group>(null);
  const { massBalanceResult } = useSimulationStore();

  useFrame(({ clock }) => {
    if (!kjaGroupRef.current) return;
    kjaGroupRef.current.position.y = Math.sin(clock.getElapsedTime() * 2.0) * 0.04;
  });

  const cageCoords = useMemo(() => {
    const coords: [number, number][] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        coords.push([-8.5 + c * 1.15, 2.5 + r * 1.15]);
      }
    }
    return coords;
  }, []);

  return (
    <group ref={kjaGroupRef}>
      {cageCoords.map(([x, z], i) => (
        <group key={i} position={[x, 0.18, z]}>
          {/* Bingkai Apung Petak KJA */}
          <mesh castShadow>
            <boxGeometry args={[0.95, 0.12, 0.95]} />
            <meshStandardMaterial color="#0284c7" metalness={0.3} roughness={0.5} />
          </mesh>
          {/* Jaring Keramba Dalam */}
          <mesh position={[0, 0.02, 0]}>
            <boxGeometry args={[0.78, 0.14, 0.78]} />
            <meshStandardMaterial color="#0f172a" roughness={0.9} />
          </mesh>
          {/* Pelampung Sudut */}
          {[
            [-0.42, -0.42],
            [0.42, -0.42],
            [-0.42, 0.42],
            [0.42, 0.42],
          ].map(([fx, fz], j) => (
            <mesh key={j} position={[fx, 0.06, fz]}>
              <cylinderGeometry args={[0.08, 0.08, 0.14, 12]} />
              <meshStandardMaterial color="#f59e0b" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Rumah Jaga KJA */}
      <mesh position={[-8.8, 0.55, 4.8]} castShadow>
        <boxGeometry args={[1.1, 0.75, 1.1]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[-8.8, 1.1, 4.8]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.95, 0.55, 4]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>

      <DataLabel
        position={[-6.8, 2.8, 3.8]}
        title="1. KLASTER 100.000 PETAK KJA"
        badge={`DO ${massBalanceResult.projectedDoMgl} mg/L`}
        badgeColor="bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
        data={[
          `Suplai Pakan Sirkular: ${massBalanceResult.pelletDailyTon} Ton/hari`,
          `Total N: 1,0 mg/L | Total P: 0,24 mg/L`,
          `Status Air: Patuh PP 22/2021 Kelas IV`,
        ]}
      />
    </group>
  );
}

// 3. Hydrodynamic Deflection Trash Boom (1,4 km PE-PU + Sling IWRC SS304 + Viscoelastic Damper)
function HydrodynamicDeflectionBoom() {
  const {
    codInlet: thetaDeg,
    isColumnALead: isHydra,
    massBalanceResult,
  } = useSimulationStore();

  // Sudut rotasi boom:
  // Jika θ = 90° (Eksisting Frontal), boom melintang tegak lurus arus (sepanjang sumbu Z dari +4.5 ke -4.5).
  // Jika θ = 35° (HYDRA-CIRATA), boom miring mengarahkan arus & eceng gondok ke Collection Bay di tepi Utara-Timur (X positif, Z negatif).
  const rad = (thetaDeg * Math.PI) / 180;
  const boomLength = 10.5;
  const centerX = 0.5;
  const centerZ = -0.5;

  // Vektor arah boom dari Hulu-Selatan ke Hilir-Utara (Collection Bay)
  const dirX = Math.cos(rad);
  const dirZ = -Math.sin(rad);

  const startX = centerX - (boomLength / 2) * dirX;
  const startZ = centerZ - (boomLength / 2) * dirZ;
  const endX = centerX + (boomLength / 2) * dirX;
  const endZ = centerZ + (boomLength / 2) * dirZ;

  const isOverloaded = massBalanceResult.safetyFactor < 1.0;
  const boomColor = isOverloaded
    ? "#ef4444"
    : isHydra
    ? "#10b981"
    : "#f59e0b";

  const floatSegments = useMemo(() => Array.from({ length: 14 }), []);

  return (
    <group>
      {/* Kabel Baja Utama Sling IWRC SS304 Ø20 mm */}
      <mesh
        position={[centerX, 0.28, centerZ]}
        rotation={[0, Math.atan2(-dirZ, dirX), Math.PI / 2]}
      >
        <cylinderGeometry args={[0.06, 0.06, boomLength + 0.8, 16]} />
        <meshStandardMaterial
          color={isOverloaded ? "#ef4444" : "#94a3b8"}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Segmen Ponton Apung Trash Boom (PE filled with PU) */}
      {floatSegments.map((_, i) => {
        const frac = (i + 0.5) / floatSegments.length - 0.5;
        const px = centerX + frac * boomLength * dirX;
        const pz = centerZ + frac * boomLength * dirZ;
        const isAnodeNode = i % 3 === 1;

        return (
          <group
            key={i}
            position={[px, 0.24, pz]}
            rotation={[0, Math.atan2(-dirZ, dirX), 0]}
          >
            {/* Tabung Ponton PE-PU */}
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.58, 20]} />
              <meshStandardMaterial
                color={boomColor}
                emissive={boomColor}
                emissiveIntensity={0.22}
                roughness={0.35}
                metalness={0.2}
              />
            </mesh>
            {/* Skirt Penahan Bawah Air (HDPE Skirt) */}
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.56, 0.35, 0.06]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
            {/* Anoda Korban Zn-Al pada Sling (jika mode HYDRA aktif) */}
            {isHydra && isAnodeNode && (
              <mesh position={[0.34, 0.05, 0]}>
                <sphereGeometry args={[0.1, 14, 14]} />
                <meshStandardMaterial
                  color="#38bdf8"
                  emissive="#0284c7"
                  emissiveIntensity={0.8}
                  metalness={0.8}
                />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Mooring Anchor Block & Viscoelastic Damper Hulu (Selatan) */}
      <group position={[startX, 0.35, startZ]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.5, 0.9, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
        </mesh>
        {isHydra && (
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.4, 20]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#0891b2"
              emissiveIntensity={0.6}
            />
          </mesh>
        )}
        <SmallLabel
          position={[0, 1.3, 0]}
          text={
            isHydra
              ? `VISCOELASTIC DAMPER (η = 0,88)`
              : `MOORING KAKU EKSISTING`
          }
          colorClass="bg-amber-950/95 text-amber-300 border-amber-500/60"
        />
      </group>

      {/* Mooring Anchor Block Hilir (Dekat Collection Bay) */}
      <group position={[endX, 0.35, endZ]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.42, 0.5, 0.9, 24]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Label Telemetri Utama Boom & Sling */}
      <DataLabel
        position={[centerX, 3.6, centerZ]}
        title={`2. TRASH BOOM 1,4 KM (θ = ${thetaDeg}°)`}
        badge={
          isOverloaded
            ? `JEBOL! SF ${massBalanceResult.safetyFactor}`
            : `AMAN • SF ${massBalanceResult.safetyFactor}`
        }
        badgeColor={
          isOverloaded
            ? "bg-rose-500/30 text-rose-300 border-rose-500/60"
            : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
        }
        data={[
          `T_normal Sling: ${massBalanceResult.normalTensionKn} kN (Reduksi -${massBalanceResult.loadReductionPct}%)`,
          `Kapasitas Aktual IWRC SS304: ${massBalanceResult.actualBreakingStrengthKn} kN (Nom 577)`,
          `Gaya Tangensial F_T: ${massBalanceResult.tangentialDeflectionPct}% Giring Gulma`,
        ]}
      />
    </group>
  );
}

// 4. Animasi Pergerakan Hamparan Eceng Gondok (430 ha -> Collection Bay)
function DriftingHyacinthMats() {
  const matsRef = useRef<THREE.Group>(null);
  const {
    codInlet: thetaDeg,
    tbsCapacity: inflowQ,
    massBalanceResult,
  } = useSimulationStore();

  const rad = (thetaDeg * Math.PI) / 180;
  const boomLength = 10.5;
  const centerX = 0.5;
  const centerZ = -0.5;
  const dirX = Math.cos(rad);
  const dirZ = -Math.sin(rad);

  const matSeeds = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        phaseOffset: i / 28,
        zSpread: ((i % 7) - 3) * 0.95,
        scale: 0.25 + (i % 3) * 0.08,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!matsRef.current) return;
    const speed = 0.12 + (inflowQ / 243.27) * 0.16;
    const t = clock.getElapsedTime() * speed;

    matsRef.current.children.forEach((mat, i) => {
      const seed = matSeeds[i];
      const p = (t + seed.phaseOffset) % 1;

      if (p < 0.5) {
        // Fase 1: Terbawa arus inflow dari Barat menuju Trash Boom
        const frac = p / 0.5;
        const targetAlongBoom = (seed.zSpread / 3.5) * (boomLength * 0.42);
        const bx = centerX + targetAlongBoom * dirX;
        const bz = centerZ + targetAlongBoom * dirZ;
        const startX = -11.5;
        const startZ = bz;

        mat.position.set(
          startX + (bx - 0.45 - startX) * frac,
          0.18,
          startZ
        );
      } else {
        // Fase 2: Terdefleksi sepanjang kemiringan Trash Boom menuju Collection Bay (jika θ < 80°)
        const slideFrac = (p - 0.5) / 0.5;
        const startAlong = (seed.zSpread / 3.5) * (boomLength * 0.42);
        const endAlong =
          thetaDeg <= 75 ? boomLength * 0.48 : startAlong + 0.3;
        const curAlong = startAlong + (endAlong - startAlong) * slideFrac;

        mat.position.set(
          centerX + curAlong * dirX - 0.42,
          0.18,
          centerZ + curAlong * dirZ
        );
      }
    });
  });

  return (
    <group ref={matsRef}>
      {matSeeds.map((s, i) => (
        <mesh key={i} scale={[s.scale * 1.4, 0.12, s.scale]} castShadow>
          <cylinderGeometry args={[1, 0.85, 1, 7]} />
          <meshStandardMaterial
            color="#16a34a"
            emissive="#15803d"
            emissiveIntensity={0.25}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}

// 5. Collection Bay Tepi, Ekskavator & Unit Pabrik Pelet Fermentasi KJA (Utara-Timur)
function CollectionBayAndPelletPlant() {
  const { massBalanceResult } = useSimulationStore();
  const armRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!armRef.current) return;
    armRef.current.rotation.z =
      Math.sin(clock.getElapsedTime() * 1.8) * 0.25 - 0.2;
  });

  return (
    <group position={[5.2, 0, -5.8]}>
      {/* Dermaga Beton Collection Bay */}
      <mesh position={[0, 0.55, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.6, 0.9, 2.6]} />
        <meshStandardMaterial color="#334155" roughness={0.6} />
      </mesh>

      {/* Kolam Penampungan Eceng Gondok Tepi (Collection Bay Basin) */}
      <mesh position={[-1.2, 0.22, 1.55]}>
        <boxGeometry args={[2.4, 0.25, 1.2]} />
        <meshStandardMaterial
          color="#15803d"
          emissive="#166534"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Conveyor Ramp Pengerukan */}
      <mesh
        position={[-0.5, 0.75, 0.8]}
        rotation={[0.45, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.9, 0.14, 2.2]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.6} />
      </mesh>

      {/* Armada Ekskavator Pengeruk Terjadwal di Collection Bay */}
      <group position={[-1.5, 1.15, -0.2]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.55, 0.8]} />
          <meshStandardMaterial color="#eab308" metalness={0.4} />
        </mesh>
        <group position={[0.2, 0.2, 0.3]} ref={armRef}>
          <mesh position={[0, 0.55, 0.35]} rotation={[0.6, 0, 0]}>
            <boxGeometry args={[0.16, 1.2, 0.16]} />
            <meshStandardMaterial color="#ca8a04" />
          </mesh>
        </group>
      </group>

      {/* Silo Bio-Fermentasi & Ekstruder Pelet Pakan KJA */}
      <mesh position={[1.1, 1.75, -0.2]} castShadow>
        <cylinderGeometry args={[0.65, 0.65, 2.1, 24]} />
        <meshStandardMaterial
          color="#0d9488"
          emissive="#0f766e"
          emissiveIntensity={0.25}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[2.1, 1.45, -0.2]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.5, 24]} />
        <meshStandardMaterial color="#d97706" metalness={0.5} />
      </mesh>

      <SmallLabel
        position={[-1.0, 2.2, 1.2]}
        text={`COLLECTION BAY: PANEN ${massBalanceResult.biocharDoseGpl.toFixed(1)} HA/HARI`}
        colorClass="bg-emerald-950/95 text-emerald-300 border-emerald-500/60"
      />

      <DataLabel
        position={[0.8, 3.8, -0.2]}
        title="3. COLLECTION BAY & PABRIK PELET"
        badge={`${massBalanceResult.pelletDailyTon} Ton/hr`}
        badgeColor="bg-amber-500/20 text-amber-300 border-amber-500/40"
        data={[
          `Neraca Gulma: ${massBalanceResult.netCoverageRateHaDay} ha/hari (Terkendali)`,
          `Distribusi: ${massBalanceResult.fertilizerDailySacks50Kg} Karung @50kg/hari`,
          `Substitusi Pakan: 100.000 Petak KJA`,
        ]}
      />
    </group>
  );
}

// 6. Dam & Powerhouse Intake Turbin PLTA Cirata (Sisi Timur X = +10.5)
function PltaCirataDamIntake() {
  const { massBalanceResult } = useSimulationStore();

  return (
    <group position={[10.8, 0, 1.2]}>
      {/* Dinding Bendungan Utama & Trash Rack Intake PLTA Cirata */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 3.2, 9.5]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Kisi-kisi Intake Turbin (Bebas Sampah Eceng Gondok) */}
      {[-3.0, -1.0, 1.0, 3.0].map((zOff, i) => (
        <group key={i} position={[-1.12, 0.9, zOff]}>
          <mesh>
            <boxGeometry args={[0.12, 1.4, 1.3]} />
            <meshStandardMaterial
              color="#0284c7"
              emissive="#0369a1"
              emissiveIntensity={0.45}
              metalness={0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Gardu Induk / Transformer Switchyard di Atas Dam */}
      <mesh position={[0.2, 3.55, -1.5]} castShadow>
        <boxGeometry args={[1.4, 0.8, 3.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>

      <DataLabel
        position={[0, 5.1, 0]}
        title="4. INTAKE TURBIN PLTA CIRATA"
        badge="ZERO DOWNTIME"
        badgeColor="bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
        data={[
          `Proteksi Loss: Rp17.074.290,072/jam/unit`,
          `Avoided Loss 24h: Rp${massBalanceResult.powerMW.toFixed(1)} Jt/hari/unit`,
          `Status Intake: 100% Bersih dari Gulma`,
        ]}
      />
    </group>
  );
}

function ReservoirDigitalTwinScene({ autoRotate }: { autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current || !autoRotate) return;
    groupRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={groupRef}>
      <ReservoirWaterAndBanks />
      <FloatingKjaCluster />
      <HydrodynamicDeflectionBoom />
      <DriftingHyacinthMats />
      <CollectionBayAndPelletPlant />
      <PltaCirataDamIntake />
    </group>
  );
}

export function ReactorScene() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const {
    isColumnALead,
    toggleLeadLag,
    codInlet: thetaDeg,
    setParams,
    massBalanceResult,
  } = useSimulationStore();

  return (
    <div className="relative h-full min-h-[540px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-sky-950/60 to-emerald-950/40">
      {/* Top-Left Interactive Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
        <button
          onClick={() => setAutoRotate((v) => !v)}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md transition border cursor-pointer ${
            autoRotate
              ? "bg-emerald-600/90 text-white border-emerald-400/50"
              : "bg-slate-900/90 text-slate-300 border-slate-700"
          }`}
        >
          {autoRotate ? "🔄 Putar Otomatis: ON" : "🔄 Putar Otomatis: OFF"}
        </button>
        <button
          onClick={() => setShowLabels((v) => !v)}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-lg backdrop-blur-md transition border cursor-pointer ${
            showLabels
              ? "bg-slate-800/90 text-emerald-300 border-emerald-500/40"
              : "bg-slate-900/90 text-slate-400 border-slate-700"
          }`}
        >
          {showLabels ? "🏷️ Telemetri 3D: ON" : "🏷️ Telemetri 3D: OFF"}
        </button>
        <button
          onClick={() => setParams({ codInlet: thetaDeg === 35 ? 90 : 35 })}
          className="rounded-xl bg-teal-600/90 hover:bg-teal-500 px-3 py-1.5 text-xs font-bold text-white border border-teal-400/50 shadow-lg backdrop-blur-md transition cursor-pointer"
        >
          📐 Ubah Sudut Boom ({thetaDeg === 35 ? "θ = 35° → 90° Frontal" : "θ = 90° → 35° HYDRA"})
        </button>
        <button
          onClick={toggleLeadLag}
          className="rounded-xl bg-cyan-600/90 hover:bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white border border-cyan-400/50 shadow-lg backdrop-blur-md transition cursor-pointer"
        >
          🛡️ Proteksi Sling ({isColumnALead ? "HYDRA Zn-Al + Damper" : "Eksisting Tanpa Proteksi"})
        </button>
      </div>

      {/* Top-Right Digital Twin Status Badge */}
      <div className="absolute top-4 right-4 z-10 hidden sm:block rounded-xl border border-emerald-500/30 bg-slate-950/85 px-4 py-2.5 backdrop-blur-md shadow-xl">
        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
          3D Digital Twin Waduk Cirata (6.200 ha)
        </div>
        <div className="text-xs font-bold text-white">
          Deflection Boom 1,4 km (θ = {thetaDeg}°) • Collection Bay • 100.000 KJA
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-slate-400">
          T_sling:{" "}
          <strong className="text-cyan-400">
            {massBalanceResult.normalTensionKn} kN (SF = {massBalanceResult.safetyFactor})
          </strong>{" "}
          | Pelet KJA:{" "}
          <strong className="text-amber-400">
            {massBalanceResult.pelletDailyTon} Ton/hari
          </strong>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 11, 18], fov: 42 }}>
        <PerspectiveCamera makeDefault position={[0, 11.5, 19]} />
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[10, 18, 10]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-6, 6, 4]} intensity={0.8} color="#38bdf8" />
        <pointLight position={[5, 6, -4]} intensity={0.8} color="#10b981" />

        <Environment preset="city" />

        <React.Suspense fallback={<Loader />}>
          <LabelContext.Provider value={showLabels}>
            <ReservoirDigitalTwinScene autoRotate={autoRotate} />
          </LabelContext.Provider>
        </React.Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 7}
          maxPolarAngle={Math.PI / 2.15}
          maxDistance={34}
          minDistance={8}
        />
      </Canvas>

      {/* Bottom-Right Legend */}
      <div className="absolute bottom-4 right-4 z-10 rounded-xl border border-slate-700/80 bg-slate-950/90 p-3 text-xs text-slate-200 shadow-xl backdrop-blur-md">
        <div className="mb-1.5 font-bold text-white text-[11px]">
          Legenda Hidrodinamika &amp; Sirkularitas Waduk Cirata
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Deflection Trash Boom 1,4 km (PE-PU) &amp; Aliran Eceng Gondok</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span>Anoda Korban Zn-Al &amp; Viscoelastic Damper (η = 0,88)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Collection Bay Tepi, Ekskavator &amp; Pabrik Pelet 48 Ton/hari</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            <span>Klaster 100.000 Petak KJA &amp; Intake Turbin PLTA Cirata</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 font-mono text-[10px] text-slate-400 backdrop-blur-sm pointer-events-none">
        Klik Kiri: Putar 3D • Klik Kanan: Geser • Scroll: Zoom
      </div>
    </div>
  );
}
