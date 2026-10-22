"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import * as THREE from "three";
import { useSimulationStore } from "@/lib/store";

// Exact Geodetic & Elevation Constants from DEMNAS + GLOBathy Fusion (EPSG:32748)
export const TOPOBATHY_METADATA = {
  crs: "EPSG:32748 (WGS 84 / UTM Zone 48S)",
  pixelWidth: 2680,
  pixelHeight: 2284,
  spatialResM: 8.3,
  utmXMin: 745328.43,
  utmXMax: 767561.02,
  utmYMin: 9245468.38,
  utmYMax: 9264415.86,
  spanKmX: 22.23,
  spanKmY: 18.95,
  minElevM: 77.13,
  maxElevM: 703.87,
  maxDepthM: 87.81,
  normalWaterLevelM: 220.0,
};

type ColorSchemeMode = "NATURAL" | "HYPSOMETRIC" | "WIREFRAME";

interface TerrainGridData {
  width: number;
  height: number;
  elevations: Float32Array;
  depths: Float32Array;
}

function gridToWorld(row: number, col: number, w = 360, h = 306): [number, number] {
  const x = (col / w - 0.5) * TOPOBATHY_METADATA.spanKmX;
  const z = (row / h - 0.5) * TOPOBATHY_METADATA.spanKmY;
  return [x, z];
}

function TopobathyTerrainMesh({
  gridData,
  zExaggeration,
  colorMode,
  showWaterSurface,
  showLabels,
}: {
  gridData: TerrainGridData;
  zExaggeration: number;
  colorMode: ColorSchemeMode;
  showWaterSurface: boolean;
  showLabels: boolean;
}) {
  const { tbsCapacity: inflowQ, codInlet: thetaDeg, massBalanceResult } =
    useSimulationStore();

  const { minElevM, maxElevM, maxDepthM, normalWaterLevelM, spanKmX, spanKmY } =
    TOPOBATHY_METADATA;

  // Convert elevation in meters to 3D Y coordinate (1 unit = 1 km horizontally, exaggerated by zExaggeration vertically)
  const elevToY = (elevM: number) =>
    ((elevM - normalWaterLevelM) / 1000.0) * zExaggeration;

  const geometry = useMemo(() => {
    const { width, height, elevations, depths } = gridData;
    const geom = new THREE.PlaneGeometry(
      spanKmX,
      spanKmY,
      width - 1,
      height - 1
    );
    geom.rotateX(-Math.PI / 2);

    const posAttr = geom.attributes.position;
    const count = posAttr.count;
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const elev = elevations[i];
      const depth = depths[i];
      const y = elevToY(elev);
      posAttr.setY(i, y);

      if (colorMode === "HYPSOMETRIC") {
        // Hypsometric + Bathymetric scientific colormap
        if (depth > 0.4) {
          const dFrac = Math.min(1, depth / maxDepthM);
          // Shallow cyan (#38bdf8) -> mid blue (#0284c7) -> deep palung navy-teal (#1e3a8a)
          color.setHSL(0.56 + dFrac * 0.08, 0.85, 0.62 - dFrac * 0.36);
        } else {
          const hFrac = Math.max(
            0,
            Math.min(1, (elev - normalWaterLevelM) / (maxElevM - normalWaterLevelM))
          );
          // Lowland green -> yellow-ochre -> mountain ridge brown
          color.setHSL(0.34 - hFrac * 0.27, 0.72, 0.42 + hFrac * 0.12);
        }
      } else {
        // NATURAL Topobathymetric colors
        if (depth > 0.35) {
          const dFrac = Math.min(1, depth / maxDepthM);
          // Waduk Cirata bathymetry: littoral turquoise to deep basin teal-blue
          color.setRGB(
            0.05 * (1 - dFrac) + 0.02 * dFrac,
            0.68 * (1 - dFrac) + 0.28 * dFrac,
            0.82 * (1 - dFrac) + 0.55 * dFrac
          );
        } else if (elev >= 215 && elev <= 224) {
          // Gaussian-smoothed shoreline transition zone (~ +220m)
          color.set("#bbf7d0");
        } else {
          const hFrac = Math.max(
            0,
            Math.min(1, (elev - 220) / (maxElevM - 220))
          );
          if (hFrac < 0.25) {
            color.set("#4ade80").lerp(new THREE.Color("#16a34a"), hFrac / 0.25);
          } else if (hFrac < 0.6) {
            color
              .set("#16a34a")
              .lerp(new THREE.Color("#15803d"), (hFrac - 0.25) / 0.35);
          } else {
            color
              .set("#15803d")
              .lerp(new THREE.Color("#a16207"), (hFrac - 0.6) / 0.4);
          }
        }
      }

      // Subtle contour line bands every 50m on land and 15m in bathymetry
      const contourMod = depth > 0.5 ? depth % 15 : elev % 50;
      if (contourMod < 1.2) {
        color.multiplyScalar(0.88);
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geom.computeVertexNormals();
    return geom;
  }, [gridData, zExaggeration, colorMode]);

  // Exact landmark positions on the UTM grid
  const [damX, damZ] = gridToWorld(75, 208);
  const [deepX, deepZ] = gridToWorld(139, 107);
  const [kjaX, kjaZ] = gridToWorld(149, 140);
  const [inflowX, inflowZ] = gridToWorld(238, 125);

  const boomRad = (thetaDeg * Math.PI) / 180;

  return (
    <group>
      {/* 1. MERGED DEMNAS + GLOBATHY 3D TERRAIN MESH */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.68}
          metalness={0.08}
          wireframe={colorMode === "WIREFRAME"}
        />
      </mesh>

      {/* 2. SEMI-TRANSPARENT WATER SURFACE AT ELEVATION +220M DPL (Can be toggled off to inspect bare GLOBathy canyon) */}
      {showWaterSurface && (
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[spanKmX * 0.92, spanKmY * 0.92]} />
          <meshPhysicalMaterial
            color="#0ea5e9"
            transparent
            opacity={0.42}
            roughness={0.15}
            metalness={0.1}
            clearcoat={0.9}
          />
        </mesh>
      )}

      {/* 3. HYDRA-CIRATA 1,4 KM DEFLECTION TRASH BOOM AT DAM INTAKE SECTOR */}
      <group
        position={[damX, 0.08, damZ]}
        rotation={[0, -boomRad + Math.PI / 4, 0]}
      >
        <mesh>
          <boxGeometry args={[1.45, 0.14, 0.14]} />
          <meshStandardMaterial color="#ea580c" emissive="#f97316" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.72, 0.06, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </group>

      {/* 4. 3D GEOSPATIAL CALLOUT PINS */}
      {showLabels && (
        <>
          {/* Pin 1: Bendungan PLTA Cirata & Deflection Boom 1,4 km */}
          <Html
            position={[damX, 0.95, damZ]}
            center
            distanceFactor={18}
            zIndexRange={[100, 0]}
          >
            <div className="pointer-events-none select-none rounded-xl border border-emerald-300 bg-white/95 px-2.5 py-1.5 shadow-md backdrop-blur-md min-w-[180px]">
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-0.5">
                <span className="font-mono text-[9px] font-extrabold text-emerald-800 uppercase">
                  1. DAM PLTA &amp; BOOM 1,4 KM
                </span>
                <span className="rounded bg-emerald-50 border border-emerald-200 px-1 font-mono text-[8px] font-bold text-emerald-700">
                  θ = {thetaDeg}°
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[8.5px] font-semibold text-gray-700">
                Elevasi Muka Air: +220,0 m dpl
              </div>
              <div className="font-mono text-[8.5px] font-semibold text-teal-700">
                T_sling: {massBalanceResult.normalTensionKn} kN (SF ={" "}
                {massBalanceResult.safetyFactor})
              </div>
            </div>
          </Html>

          {/* Pin 2: Palung Terdalam GLOBathy (87,81 m) */}
          <Html
            position={[
              deepX,
              elevToY(TOPOBATHY_METADATA.normalWaterLevelM - 86.8) + 0.65,
              deepZ,
            ]}
            center
            distanceFactor={18}
            zIndexRange={[100, 0]}
          >
            <div className="pointer-events-none select-none rounded-xl border border-sky-300 bg-white/95 px-2.5 py-1.5 shadow-md backdrop-blur-md min-w-[175px]">
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-0.5">
                <span className="font-mono text-[9px] font-extrabold text-sky-800 uppercase">
                  2. PALUNG GLOBATHY TERDALAM
                </span>
                <span className="rounded bg-sky-50 border border-sky-200 px-1 font-mono text-[8px] font-bold text-sky-700">
                  -87,81 m
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[8.5px] font-semibold text-gray-700">
                Elevasi Dasar: +132,19 m dpl
              </div>
              <div className="font-mono text-[8.5px] font-semibold text-amber-700">
                Zona Akumulasi H₂S (0,005 mg/L) &amp; DO 2 mg/L
              </div>
            </div>
          </Html>

          {/* Pin 3: Sentra 100.000 Petak KJA & Eceng Gondok 430 Ha */}
          <Html
            position={[kjaX, 0.75, kjaZ]}
            center
            distanceFactor={18}
            zIndexRange={[100, 0]}
          >
            <div className="pointer-events-none select-none rounded-xl border border-amber-300 bg-white/95 px-2.5 py-1.5 shadow-md backdrop-blur-md min-w-[175px]">
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-0.5">
                <span className="font-mono text-[9px] font-extrabold text-amber-800 uppercase">
                  3. ZONA 100.000 KJA &amp; GULMA
                </span>
                <span className="rounded bg-amber-50 border border-amber-200 px-1 font-mono text-[8px] font-bold text-amber-700">
                  430 ha
                </span>
              </div>
              <div className="mt-0.5 font-mono text-[8.5px] font-semibold text-gray-700">
                Panen DSS: {massBalanceResult.biocharDoseGpl.toFixed(1)} ha/hr →{" "}
                {massBalanceResult.pelletDailyTon} Ton Pelet
              </div>
            </div>
          </Html>

          {/* Pin 4: Inflow Hulu Sungai Citarum */}
          <Html
            position={[inflowX, 0.85, inflowZ]}
            center
            distanceFactor={18}
            zIndexRange={[100, 0]}
          >
            <div className="pointer-events-none select-none rounded-xl border border-teal-300 bg-white/95 px-2.5 py-1 shadow-md backdrop-blur-md whitespace-nowrap">
              <span className="font-mono text-[8.5px] font-bold text-teal-800">
                🌊 INFLOW HULU CITARUM: Q = {inflowQ.toFixed(2)} m³/s (v_drift ={" "}
                {massBalanceResult.vDriftMs} m/s)
              </span>
            </div>
          </Html>
        </>
      )}
    </group>
  );
}

function AutoRotateGroup({
  autoRotate,
  children,
}: {
  autoRotate: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current || !autoRotate) return;
    ref.current.rotation.y += delta * 0.12;
  });
  return <group ref={ref}>{children}</group>;
}

export function CirataTopobathyScene() {
  const [gridData, setGridData] = useState<TerrainGridData | null>(null);
  const [zExaggeration, setZExaggeration] = useState<number>(3.5);
  const [colorMode, setColorMode] = useState<ColorSchemeMode>("NATURAL");
  const [showWaterSurface, setShowWaterSurface] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Load packed 16-bit DEMNAS + GLOBathy texture on mount
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/assets/cirata_topobathy_packed.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, img.width, img.height);
      const count = img.width * img.height;
      const elevations = new Float32Array(count);
      const depths = new Float32Array(count);

      const { minElevM, maxElevM, maxDepthM } = TOPOBATHY_METADATA;

      for (let i = 0; i < count; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        const u16 = (r << 8) | g;
        elevations[i] = minElevM + (u16 / 65535.0) * (maxElevM - minElevM);
        depths[i] = (b / 255.0) * maxDepthM;
      }

      setGridData({
        width: img.width,
        height: img.height,
        elevations,
        depths,
      });
    };
  }, []);

  return (
    <div className="relative h-full min-h-[600px] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-sky-50/70 to-emerald-50/60 shadow-sm">
      {/* Top-Left Interactive Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-xl">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setColorMode("NATURAL")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition border cursor-pointer ${
              colorMode === "NATURAL"
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-white/95 text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            🗺️ Topobathymetri Alami (DEMNAS - GLOBathy)
          </button>
          <button
            onClick={() => setColorMode("HYPSOMETRIC")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition border cursor-pointer ${
              colorMode === "HYPSOMETRIC"
                ? "bg-sky-600 text-white border-sky-500"
                : "bg-white/95 text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            🌈 Peta Hypsometric &amp; Batimetri
          </button>
          <button
            onClick={() => setColorMode("WIREFRAME")}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition border cursor-pointer ${
              colorMode === "WIREFRAME"
                ? "bg-teal-600 text-white border-teal-500"
                : "bg-white/95 text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            🕸️ Grid Mesh UTM (EPSG:32748)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setShowWaterSurface((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition border cursor-pointer ${
              showWaterSurface
                ? "bg-sky-50 text-sky-800 border-sky-300"
                : "bg-amber-50 text-amber-800 border-amber-300"
            }`}
          >
            {showWaterSurface
              ? "💧 Muka Air (+220m): ON (Klik untuk Kuras & Lihat Palung)"
              : "🏜️ Muka Air: OFF (Inspeksi Palung Batimetri GLOBathy)"}
          </button>
          <button
            onClick={() =>
              setZExaggeration((z) => (z === 2.0 ? 3.5 : z === 3.5 ? 5.5 : 2.0))
            }
            className="rounded-xl bg-white/95 hover:bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-300 shadow-sm transition cursor-pointer"
          >
            ⛰️ Skala Vertikal (Z): {zExaggeration.toFixed(1)}×
          </button>
          <button
            onClick={() => setShowLabels((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition border cursor-pointer ${
              showLabels
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-white/95 text-gray-600 border-gray-300"
            }`}
          >
            {showLabels ? "🏷️ Pin Geospasial: ON" : "🏷️ Pin Geospasial: OFF"}
          </button>
          <button
            onClick={() => setAutoRotate((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm transition border cursor-pointer ${
              autoRotate
                ? "bg-emerald-600 text-white border-emerald-500"
                : "bg-white/95 text-gray-700 border-gray-300"
            }`}
          >
            {autoRotate ? "🔄 Putar: ON" : "🔄 Putar: OFF"}
          </button>
        </div>
      </div>

      {/* Left Geodetic & Elevation Metadata Reference Card (Step 5 Output) */}
      <div className="absolute top-32 left-4 z-10 hidden lg:block pointer-events-none">
        <div className="w-80 rounded-2xl border border-gray-200 bg-white/95 p-3.5 shadow-lg backdrop-blur-md pointer-events-auto">
          <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-1.5">
            <span className="text-xs font-bold text-gray-900">
              📐 Parameter Topobathymetric DEM
            </span>
            <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[9px] font-bold text-emerald-800">
              EPSG:32748 (UTM 48S)
            </span>
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Persamaan Fusi</span>
              <span className="font-mono font-bold text-emerald-700">
                DEMNAS - GLOBathy (Cubic)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dimensi Piksel Asli</span>
              <span className="font-mono font-bold text-gray-900">
                2.680 × 2.284 px (Res 8,30 m)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Bentang Spasial UTM</span>
              <span className="font-mono font-bold text-gray-900">
                22,23 km (B–T) × 18,95 km (S–U)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Elevasi Minimum (Min)</span>
              <span className="font-mono font-bold text-sky-700">
                +77,13 m dpl (0 uint16)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Elevasi Maksimum (Max)</span>
              <span className="font-mono font-bold text-amber-700">
                +703,87 m dpl (65535 uint16)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Kedalaman Maks GLOBathy</span>
              <span className="font-mono font-bold text-teal-700">
                87,81 m (Palung Waduk)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Smoothing Garis Pantai</span>
              <span className="font-mono font-bold text-gray-800">
                Gaussian σ=2,5 (~Elev +220m)
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
            <a
              href="/assets/cirata_heightmap_16bit.png"
              download="cirata_heightmap_16bit.png"
              className="w-full text-center rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 font-mono text-[10px] font-bold text-emerald-800 transition"
            >
              ⬇️ Unduh cirata_heightmap_16bit.png (16-Bit)
            </a>
          </div>
        </div>
      </div>

      {/* Top-Right Badge */}
      <div className="absolute top-4 right-4 z-10 hidden sm:block rounded-xl border border-gray-200 bg-white/95 px-4 py-2.5 shadow-md backdrop-blur-md">
        <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          Fusi Geospasial DEMNAS + GLOBathy 30m
        </div>
        <div className="text-xs font-bold text-gray-900">
          3D Topobathymetric DEM Waduk Cirata (6.200 Ha)
        </div>
        <div className="font-mono text-[10px] text-gray-600">
          Min: <strong className="text-sky-700">77,13 m</strong> • Max:{" "}
          <strong className="text-amber-700">703,87 m</strong> • Depth:{" "}
          <strong className="text-teal-700">87,81 m</strong>
        </div>
      </div>

      {/* Loading Indicator */}
      {!gridData && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-xs">
          <div className="rounded-2xl border border-emerald-200 bg-white px-6 py-4 shadow-lg text-center">
            <div className="text-sm font-bold text-emerald-800">
              Memuat Heightmap 16-Bit DEMNAS + GLOBathy...
            </div>
            <div className="text-xs text-gray-500 font-mono mt-1">
              2.680 × 2.284 px • EPSG:32748 (UTM Zone 48S)
            </div>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas (Pure Light Sky Background) */}
      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={["#f8fafc"]} />
        <PerspectiveCamera makeDefault position={[0, 14.5, 19.5]} fov={40} />
        <ambientLight intensity={1.05} />
        <directionalLight
          position={[12, 22, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-10, 12, -8]} intensity={0.5} color="#bae6fd" />

        <Environment preset="city" />

        {gridData && (
          <AutoRotateGroup autoRotate={autoRotate}>
            <TopobathyTerrainMesh
              gridData={gridData}
              zExaggeration={zExaggeration}
              colorMode={colorMode}
              showWaterSurface={showWaterSurface}
              showLabels={showLabels}
            />
          </AutoRotateGroup>
        )}

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={6}
          maxDistance={38}
        />
      </Canvas>

      {/* Bottom-Right Elevation & Bathymetry Colorbar Legend */}
      <div className="absolute bottom-4 right-4 z-10 rounded-xl border border-gray-200 bg-white/95 p-3 text-xs text-gray-700 shadow-md backdrop-blur-md">
        <div className="mb-1.5 font-bold text-gray-900 text-[11px]">
          Skala Elevasi Topobathymetri (Elevasi_Final = DEMNAS - GLOBathy)
        </div>
        <div className="space-y-1 text-[10px] font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-700" />
            <span>Perbukitan Hulu &amp; Tanggul (+400 s.d. +703,87 m dpl)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            <span>Daratan &amp; Transisi Pantai Gaussian (+220 s.d. +400 m dpl)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
            <span>Zona Dangkal &amp; Teluk Collection Bay (Kedalaman 1–25 m)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
            <span>Palung Batimetri GLOBathy Terdalam (Kedalaman s.d. 87,81 m)</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 rounded-lg border border-gray-200 bg-white/95 px-2.5 py-1.5 font-mono text-[10px] font-semibold text-gray-600 shadow-sm backdrop-blur-sm pointer-events-none">
        Klik Kiri: Putar 3D • Klik Kanan: Geser • Scroll: Zoom
      </div>
    </div>
  );
}
