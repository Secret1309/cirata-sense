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
      <div className="flex w-64 flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-xl backdrop-blur-md">
        <div className="mb-2 text-sm font-bold text-emerald-400">
          Memuat Digital Twin 3D BioTrap-SIM™...
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full bg-emerald-500"
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

function StraightPipe({
  from,
  to,
  radius = 0.08,
  color = "#475569",
}: {
  from: [number, number, number];
  to: [number, number, number];
  radius?: number;
  color?: string;
}) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const midX = (from[0] + to[0]) / 2;
  const midY = (from[1] + to[1]) / 2;
  const midZ = (from[2] + to[2]) / 2;
  const dir = new THREE.Vector3(dx, dy, dz).normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(up, dir);

  return (
    <mesh position={[midX, midY, midZ]} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial color={color} metalness={0.75} roughness={0.25} />
    </mesh>
  );
}

function FlowIndicator({
  from,
  to,
  count = 5,
  speed = 0.4,
  dotColor = "#10b981",
  emissiveColor = "#059669",
}: {
  from: [number, number, number];
  to: [number, number, number];
  count?: number;
  speed?: number;
  dotColor?: string;
  emissiveColor?: string;
}) {
  const dotsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!dotsRef.current) return;
    const t = clock.getElapsedTime();
    dotsRef.current.children.forEach((dot, i) => {
      const phase = (t * speed + i / count) % 1;
      dot.position.set(
        from[0] + (to[0] - from[0]) * phase,
        from[1] + (to[1] - from[1]) * phase + 0.12,
        from[2] + (to[2] - from[2]) * phase
      );
      const mat = (dot as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 1.2 + 0.8 * Math.sin(t * 8 + i * 2.5);
      }
    });
  });

  const dots = useMemo(() => Array.from({ length: count }), [count]);

  return (
    <group ref={dotsRef}>
      {dots.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color={dotColor}
            emissive={emissiveColor}
            emissiveIntensity={1.6}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SteamParticles({ position }: { position: [number, number, number] }) {
  const pyrolysisTemp = useSimulationStore((s) => s.pyrolysisTemp);
  const particlesRef = useRef<THREE.Group>(null);
  const count = pyrolysisTemp >= 900 ? 20 : 12;

  const MAX_PARTICLES = 20;
  const offsets = useMemo(
    () =>
      Array.from({ length: MAX_PARTICLES }, (_, i) => ({
        phase: i / MAX_PARTICLES,
        driftX: (Math.random() - 0.5) * 1.6,
        driftZ: (Math.random() - 0.5) * 1.6,
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!particlesRef.current) return;
    const t = clock.getElapsedTime();
    particlesRef.current.children.forEach((p, i) => {
      const o = offsets[i];
      const phase = (t * 0.28 + o.phase) % 1;
      const rise = phase * 2.8;
      const drift = Math.sin(t * 0.7 + o.driftX * 3) * 0.45 * phase;
      const driftZ = Math.cos(t * 0.6 + o.driftZ * 3) * 0.3 * phase;

      p.position.set(
        position[0] + drift,
        position[1] + rise,
        position[2] + driftZ
      );

      const scale = 0.12 + phase * 0.38;
      p.scale.set(scale, scale, scale);

      const mat = (p as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.opacity = i < count ? Math.max(0, (1 - phase) * 0.5) : 0;
      }
    });
  });

  return (
    <group ref={particlesRef}>
      {offsets.map((_, i) => (
        <mesh key={i} position={position}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial
            color="#cbd5e1"
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SpinningMotor({
  position,
  speed = 2.2,
}: {
  position: [number, number, number];
  speed?: number;
}) {
  const motorRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!motorRef.current) return;
    motorRef.current.rotation.x = clock.getElapsedTime() * speed;
  });

  return (
    <group position={position} rotation={[0, 0, Math.PI / 2]}>
      <group ref={motorRef}>
        <mesh>
          <cylinderGeometry args={[0.38, 0.38, 1.1, 28]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.4, 0.4, 0.08, 28]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.06, 28]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.06, 28]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
      </group>
    </group>
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
      <div className="pointer-events-none select-none flex flex-col items-start rounded-xl border border-slate-700/80 bg-slate-950/90 p-2.5 shadow-2xl backdrop-blur-md min-w-[165px]">
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
  colorClass = "bg-emerald-950/90 text-emerald-300 border-emerald-500/40",
}: {
  position: [number, number, number];
  text: string;
  colorClass?: string;
}) {
  const showLabels = React.useContext(LabelContext);
  if (!showLabels) return null;
  return (
    <Html position={position} distanceFactor={12} center>
      <div
        className={`rounded-md border px-2 py-0.5 font-mono text-[8px] font-bold whitespace-nowrap pointer-events-none shadow-md ${colorClass}`}
      >
        {text}
      </div>
    </Html>
  );
}

// 1. Unit Pirolisis & Aktivasi Uap TKKS (950°C)
function PyrolysisKilnUnit() {
  const { pyrolysisTemp, massBalanceResult } = useSimulationStore();
  const isOptimalHeat = pyrolysisTemp >= 900;

  return (
    <group position={[-7.2, 0, 0]}>
      {/* Main Pyrolysis Reactor Cylinder */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 3.8, 32]} />
        <meshStandardMaterial
          color="#334155"
          emissive={isOptimalHeat ? "#f59e0b" : "#0ea5e9"}
          emissiveIntensity={isOptimalHeat ? 0.28 : 0.1}
          metalness={0.75}
          roughness={0.28}
        />
      </mesh>
      {/* Thermal Heating Jacket Rings */}
      {[-0.8, 0, 0.8].map((yOff, idx) => (
        <mesh key={idx} position={[0, 2.0 + yOff, 0]}>
          <cylinderGeometry args={[1.12, 1.12, 0.22, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#d97706"
            emissiveIntensity={0.65}
            metalness={0.6}
          />
        </mesh>
      ))}
      {/* Top Cone & Exhaust Chimney */}
      <mesh position={[0, 4.3, 0]}>
        <coneGeometry args={[1.05, 0.8, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
      <mesh position={[0, 5.0, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.0, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.7} />
      </mesh>
      <SteamParticles position={[0, 5.6, 0]} />

      {/* TKKS Biomass Hopper */}
      <mesh position={[-1.1, 3.1, 0.6]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.55, 1.1, 16]} />
        <meshStandardMaterial color="#b45309" roughness={0.6} />
      </mesh>
      <SmallLabel
        position={[-1.2, 4.1, 0.6]}
        text={`INFLOW Q: ${massBalanceResult.tbsCapacityTonPerHour.toFixed(2)} m³/s`}
        colorClass="bg-amber-950/90 text-amber-300 border-amber-500/40"
      />

      <DataLabel
        position={[0, 6.8, 0]}
        title="1. ZONA INFLOW & DRIFT (430 HA)"
        badge={`v_drift ${massBalanceResult.vDriftMs} m/s`}
        badgeColor="bg-amber-500/20 text-amber-300 border-amber-500/40"
        data={[
          `Tumbuh Alami: +12,90 ha/hari`,
          `Kuota Panen DSS: ${massBalanceResult.biocharDoseGpl.toFixed(1)} ha/hari`,
          `Neraca Laju: ${massBalanceResult.netCoverageRateHaDay} ha/hari`,
        ]}
      />
    </group>
  );
}

// 2. Anaerobic Biodigester POME (In-Situ DIET Catalysis)
function AnaerobicDigesterUnit() {
  const { biocharDose, codInlet, massBalanceResult } = useSimulationStore();
  const agitatorRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!agitatorRef.current) return;
    agitatorRef.current.rotation.y =
      clock.getElapsedTime() * (biocharDose >= 1.5 ? 3.5 : 1.2);
  });

  return (
    <group position={[-2.4, 0, 0]}>
      {/* Main Mesophilic Digester Vessel */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <cylinderGeometry args={[1.65, 1.65, 3.4, 36]} />
        <meshStandardMaterial color="#1e293b" metalness={0.75} roughness={0.3} />
      </mesh>
      {/* Green Biogas Dome Cover */}
      <mesh position={[0, 3.4, 0]}>
        <sphereGeometry
          args={[1.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color="#059669"
          emissive="#10b981"
          emissiveIntensity={0.22}
          roughness={0.35}
          metalness={0.3}
        />
      </mesh>

      {/* Top Agitator Shaft */}
      <group position={[0, 5.1, 0]} ref={agitatorRef}>
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 0.5, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.1, 0.1, 0.14]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </group>

      {/* Micro-Biochar Dosing Hopper */}
      <mesh position={[0, 4.1, 1.45]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.45, 0.9, 16]} />
        <meshStandardMaterial color="#10b981" metalness={0.5} />
      </mesh>
      <SmallLabel
        position={[0, 4.9, 1.45]}
        text={`DEFLEKSI BOOM (θ): ${codInlet.toFixed(0)}° (1,4 km)`}
        colorClass="bg-emerald-950/90 text-emerald-300 border-emerald-500/40"
      />

      <DataLabel
        position={[0, 6.8, 0]}
        title="2. DEFLECTION BOOM (PE-PU)"
        badge={`F_T ${massBalanceResult.tangentialDeflectionPct}%`}
        data={[
          `Beban Frontal 90°: ${massBalanceResult.frontalLoadKn} kN`,
          `Tegangan Normal: ${massBalanceResult.normalTensionKn} kN`,
          `Reduksi Beban: -${massBalanceResult.loadReductionPct}%`,
        ]}
      />
    </group>
  );
}

// 3. Modular Lead-Lag H2S Scrubber Skid (Twin Parallel Columns + Auto-Valve)
function LeadLagScrubberSkid() {
  const { isColumnALead, h2sInlet, massBalanceResult } = useSimulationStore();
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pulseRef.current) return;
    const s = 1 + 0.12 * Math.sin(clock.getElapsedTime() * 5);
    pulseRef.current.scale.set(s, s, s);
  });

  const colAColor = isColumnALead ? "#10b981" : "#f59e0b";
  const colBColor = isColumnALead ? "#06b6d4" : "#10b981";

  return (
    <group position={[2.6, 0, 0]}>
      {/* Skid Base Platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.3, 3.6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
      </mesh>

      {/* COLUMN A (VESSEL-01, Front z = +1.05) */}
      <group position={[0, 0, 1.05]}>
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.68, 0.68, 3.8, 28]} />
          <meshStandardMaterial
            color="#334155"
            emissive={colAColor}
            emissiveIntensity={isColumnALead ? 0.35 : 0.25}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Saturation Ring Band */}
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.35, 28]} />
          <meshStandardMaterial
            color={colAColor}
            emissive={colAColor}
            emissiveIntensity={0.8}
          />
        </mesh>
        <SmallLabel
          position={[0, 4.5, 0]}
          text={
            isColumnALead
              ? `KOLOM A: LEAD (${massBalanceResult.colASaturationPct}%)`
              : "KOLOM A: PANEN BIOSULFUR™"
          }
          colorClass={
            isColumnALead
              ? "bg-emerald-950/95 text-emerald-300 border-emerald-500/60"
              : "bg-amber-950/95 text-amber-300 border-amber-500/60"
          }
        />
      </group>

      {/* COLUMN B (VESSEL-02, Back z = -1.05) */}
      <group position={[0, 0, -1.05]}>
        <mesh position={[0, 2.2, 0]} castShadow>
          <cylinderGeometry args={[0.68, 0.68, 3.8, 28]} />
          <meshStandardMaterial
            color="#334155"
            emissive={colBColor}
            emissiveIntensity={!isColumnALead ? 0.4 : 0.15}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.35, 28]} />
          <meshStandardMaterial
            color={colBColor}
            emissive={colBColor}
            emissiveIntensity={0.7}
          />
        </mesh>
        <SmallLabel
          position={[0, 4.5, 0]}
          text={
            !isColumnALead
              ? `KOLOM B: LEAD FRESH (${massBalanceResult.colBSaturationPct}%)`
              : `KOLOM B: LAG STANDBY (${massBalanceResult.colBSaturationPct}%)`
          }
          colorClass={
            !isColumnALead
              ? "bg-emerald-950/95 text-emerald-300 border-emerald-500/60"
              : "bg-cyan-950/95 text-cyan-300 border-cyan-500/60"
          }
        />
      </group>

      {/* Manifold Pipes & Central Auto-Valve Controller */}
      <StraightPipe from={[0, 3.6, -1.05]} to={[0, 3.6, 1.05]} radius={0.07} color="#06b6d4" />
      <StraightPipe from={[0, 1.0, -1.05]} to={[0, 1.0, 1.05]} radius={0.07} color="#10b981" />

      {/* Central Auto-Valve Actuator Sphere */}
      <mesh ref={pulseRef} position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.32, 20, 20]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.9}
        />
      </mesh>

      <DataLabel
        position={[0, 6.8, 0]}
        title="3. SLING IWRC SS304 & DAMPER"
        badge={`SF = ${massBalanceResult.safetyFactor.toFixed(2)}`}
        badgeColor="bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
        data={[
          `Kapasitas Aktual: ${massBalanceResult.actualBreakingStrengthKn} kN (Nom 577)`,
          `Proteksi: ${isColumnALead ? "Anoda Zn-Al + HDPE/PU" : "Tanpa Proteksi"}`,
          `Viscoelastic Damper: η = ${massBalanceResult.fiRatio}`,
        ]}
      />
    </group>
  );
}

// 4. CHP Gas Engine 1.20 MW & BioSulfur Fertilizer Packaging Unit
function PowerAndBioSulfurUnit() {
  const { massBalanceResult } = useSimulationStore();

  return (
    <group position={[7.4, 0, 0]}>
      {/* CHP Gas Engine Generator House */}
      <mesh position={[0, 1.35, -0.5]} castShadow>
        <boxGeometry args={[2.6, 2.4, 2.0]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.25} />
      </mesh>
      {/* Spinning Turbine Generator on Top */}
      <SpinningMotor position={[0, 2.85, -0.5]} speed={3.2} />

      {/* BioSulfur™ Granulator & 50kg Bagging Station (Front z = +1.2) */}
      <mesh position={[0, 1.1, 1.25]} castShadow>
        <cylinderGeometry args={[0.65, 0.55, 2.0, 24]} />
        <meshStandardMaterial
          color="#d97706"
          emissive="#b45309"
          emissiveIntensity={0.25}
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      <SmallLabel
        position={[0, 2.5, 1.25]}
        text={`PELET PAKAN KJA: ${massBalanceResult.pelletDailyTon.toFixed(1)} T/hari`}
        colorClass="bg-amber-950/95 text-amber-300 border-amber-500/50"
      />

      <DataLabel
        position={[0, 6.2, 0]}
        title="4. COLLECTION BAY & 100.000 KJA"
        badge={`Rp${massBalanceResult.powerMW.toFixed(1)} Jt/d`}
        badgeColor="bg-amber-500/20 text-amber-300 border-amber-500/40"
        data={[
          `KJA Terlayani: 100.000 Petak`,
          `Kualitas Air DO: ${massBalanceResult.projectedDoMgl} mg/L (>1 mg/L)`,
          `Avoided Loss: Rp17,07 Jt/jam/unit`,
        ]}
      />
    </group>
  );
}

function EquipmentGroup({ autoRotate }: { autoRotate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { isColumnALead } = useSimulationStore();

  useFrame((_, delta) => {
    if (!groupRef.current || !autoRotate) return;
    groupRef.current.rotation.y += delta * 0.12;
  });

  const activeZ = isColumnALead ? 1.05 : -1.05;

  return (
    <group ref={groupRef}>
      <PyrolysisKilnUnit />
      <AnaerobicDigesterUnit />
      <LeadLagScrubberSkid />
      <PowerAndBioSulfurUnit />

      {/* Inter-unit Process Pipes */}
      {/* 1 -> 2: Micro-biochar injection line */}
      <StraightPipe from={[-6.1, 1.2, 0]} to={[-4.0, 1.2, 0]} color="#10b981" />
      <FlowIndicator
        from={[-6.1, 1.2, 0]}
        to={[-4.0, 1.2, 0]}
        count={4}
        speed={0.38}
        dotColor="#10b981"
        emissiveColor="#059669"
      />

      {/* 2 -> 3: Raw Biogas (H2S 1,500-4,000 ppm) into active Lead Column */}
      <StraightPipe
        from={[-0.8, 1.5, 0]}
        to={[2.0, 1.5, activeZ]}
        color="#f43f5e"
      />
      <FlowIndicator
        from={[-0.8, 1.5, 0]}
        to={[2.0, 1.5, activeZ]}
        count={5}
        speed={0.45}
        dotColor="#f43f5e"
        emissiveColor="#e11d48"
      />

      {/* 3 -> 4: Purified Biomethane (<50 ppm H2S) to 1.2 MW Gas Engine */}
      <StraightPipe
        from={[3.2, 1.5, -activeZ]}
        to={[6.1, 1.5, -0.5]}
        color="#06b6d4"
      />
      <FlowIndicator
        from={[3.2, 1.5, -activeZ]}
        to={[6.1, 1.5, -0.5]}
        count={5}
        speed={0.5}
        dotColor="#06b6d4"
        emissiveColor="#0891b2"
      />

      {/* 3 -> 4: Harvested Spent Pellet to BioSulfur Granulator */}
      <StraightPipe
        from={[3.2, 0.6, 1.05]}
        to={[6.7, 0.6, 1.25]}
        color="#f59e0b"
      />
      <FlowIndicator
        from={[3.2, 0.6, 1.05]}
        to={[6.7, 0.6, 1.25]}
        count={3}
        speed={0.25}
        dotColor="#f59e0b"
        emissiveColor="#d97706"
      />
    </group>
  );
}

function StaticFloor() {
  return (
    <group>
      <mesh
        position={[0, -0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[34, 24]} />
        <meshStandardMaterial color="#0b1120" roughness={0.8} metalness={0.2} />
      </mesh>
      <gridHelper
        args={[32, 32, "#10b981", "#1e293b"]}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}

export function ReactorScene() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const { isColumnALead, toggleLeadLag, massBalanceResult } =
    useSimulationStore();

  return (
    <div className="relative h-full min-h-[540px] w-full overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40">
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
          {autoRotate ? "🔄 Auto-Rotate: ON" : "🔄 Auto-Rotate: OFF"}
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
          onClick={toggleLeadLag}
          className="rounded-xl bg-cyan-600/90 hover:bg-cyan-500 px-3 py-1.5 text-xs font-bold text-white border border-cyan-400/50 shadow-lg backdrop-blur-md transition cursor-pointer"
        >
          ⚡ Switch Katup Lead-Lag ({isColumnALead ? "Kolom A → B" : "Kolom B → A"})
        </button>
      </div>

      {/* Top-Right Digital Twin Status Badge */}
      <div className="absolute top-4 right-4 z-10 hidden sm:block rounded-xl border border-emerald-500/30 bg-slate-950/85 px-4 py-2.5 backdrop-blur-md shadow-xl">
        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400">
          3D Digital Twin HYDRA-CIRATA
        </div>
        <div className="text-xs font-bold text-white">
          Deflection Boom 1,4 km • Sling IWRC SS304 • Collection Bay KJA
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-slate-400">
          T_sling: <strong className="text-cyan-400">{massBalanceResult.normalTensionKn} kN (SF {massBalanceResult.safetyFactor})</strong> | Pelet:{" "}
          <strong className="text-amber-400">{massBalanceResult.pelletDailyTon} T/hr</strong>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 6, 19], fov: 40 }}>
        <PerspectiveCamera makeDefault position={[0, 6.5, 21]} />
        <ambientLight intensity={0.85} />
        <directionalLight
          position={[8, 14, 8]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-7, 5, 3]} intensity={0.8} color="#f59e0b" />
        <pointLight position={[3, 5, 3]} intensity={0.8} color="#10b981" />

        <Environment preset="city" />

        <React.Suspense fallback={<Loader />}>
          <LabelContext.Provider value={showLabels}>
            <StaticFloor />
            <EquipmentGroup autoRotate={autoRotate} />
          </LabelContext.Provider>
        </React.Suspense>

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          maxDistance={34}
          minDistance={8}
        />
      </Canvas>

      {/* Bottom-Right Legend */}
      <div className="absolute bottom-4 right-4 z-10 rounded-xl border border-slate-700/80 bg-slate-950/90 p-3 text-xs text-slate-200 shadow-xl backdrop-blur-md">
        <div className="mb-1.5 font-bold text-white text-[11px]">
          Aliran Fluida &amp; Sirkularitas 3D
        </div>
        <div className="space-y-1 text-[10px]">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span>Injeksi Mikro-Biochar DIET (2.0 g/L)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Biogas Mentah Asam (1.500–4.000 ppm H₂S)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            <span>Biometana Murni (&lt;50 ppm H₂S → Genset 1,2 MW)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Panen Pelet Jenuh → Pupuk Sirkular BioSulfur™</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 font-mono text-[10px] text-slate-400 backdrop-blur-sm pointer-events-none">
        Klik Kiri: Putar 3D • Klik Kanan: Geser • Scroll: Zoom
      </div>
    </div>
  );
}
