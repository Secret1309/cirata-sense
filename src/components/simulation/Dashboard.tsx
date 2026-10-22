"use client";

import { useState, useEffect, useRef } from "react";
import { useSimulationStore } from "@/lib/store";
import { POME_EQA_COMPARISON, PROTOTYPE_BUDGET_ITEMS } from "@/lib/simulation/constants";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ReferenceLine,
  ComposedChart,
} from "recharts";
import { ReactorScene } from "./ReactorScene";
import { GeopolymerBrickScene } from "./GeopolymerBrickScene";
import { ResearchTab } from "./ResearchTab";

const formatRp = (value: number): string => {
  if (Math.abs(value) >= 1e12) return `Rp ${(value / 1e12).toFixed(2)} T`;
  if (Math.abs(value) >= 1e9) return `Rp ${(value / 1e9).toFixed(2)} M`;
  if (Math.abs(value) >= 1e6) return `Rp ${(value / 1e6).toFixed(1)} Jt`;
  return `Rp ${value.toLocaleString("id-ID")}`;
};

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<
    "command" | "visual" | "brick" | "results" | "economy" | "research"
  >("command");

  const {
    massBalanceResult: mb,
    economicResults: econ,
    isColumnALead,
    toggleLeadLag,
    tbsCapacity: inflowQ,
    codInlet: thetaDeg,
    biocharDose: harvestHaDay,
  } = useSimulationStore();

  const boomCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Interactive 2D Vector Force Decomposition Canvas (Exact logic from CIRATA-SENSE.html)
  useEffect(() => {
    if (activeTab !== "command" || !boomCanvasRef.current) return;
    const canvas = boomCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background sungai/waduk
    ctx.fillStyle = "#0a192f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Garis arus air (Inflow dari kiri ke kanan)
    ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
    ctx.lineWidth = 1.5;
    for (let y = 35; y < 200; y += 32) {
      ctx.beginPath();
      ctx.moveTo(15, y);
      ctx.lineTo(395, y);
      ctx.stroke();
      // Panah arus
      ctx.fillStyle = "rgba(56, 189, 248, 0.45)";
      ctx.beginPath();
      ctx.moveTo(120, y);
      ctx.lineTo(112, y - 4);
      ctx.lineTo(112, y + 4);
      ctx.fill();
    }

    // Collection Bay di tepi atas kanan
    ctx.fillStyle = "rgba(34, 197, 94, 0.18)";
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.fillRect(285, 8, 130, 36);
    ctx.strokeRect(285, 8, 130, 36);
    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("COLLECTION BAY (TEPI)", 293, 30);

    // Gambar Trash Boom sesuai sudut thetaDeg
    const startX = 160;
    const startY = 195;
    const boomLen = 155;
    const rad = (thetaDeg * Math.PI) / 180;
    const endX = startX + boomLen * Math.cos(rad);
    const endY = startY - boomLen * Math.sin(rad);

    ctx.strokeStyle = mb.normalTensionKn > mb.actualBreakingStrengthKn ? "#ef4444" : "#5bc0be";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Titik Mooring & Damper
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(startX, startY, 6, 0, Math.PI * 2);
    ctx.arc(endX, endY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Vektor Gaya di titik tengah boom
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;

    // Vektor Tangensial (Menggiring gulma ke Collection Bay)
    const ftLen = 65 * Math.cos(rad);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(midX + ftLen * Math.cos(rad), midY - ftLen * Math.sin(rad));
    ctx.stroke();

    // Vektor Normal (Membebani Sling)
    const fnLen = 55 * Math.sin(rad);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(midX + fnLen * Math.sin(rad), midY + fnLen * Math.cos(rad));
    ctx.stroke();

    // Keterangan Teks
    ctx.fillStyle = "#f8fafc";
    ctx.font = "11px sans-serif";
    ctx.fillText(`Inflow Q = ${inflowQ.toFixed(2)} m³/s (v_drift = ${mb.vDriftMs} m/s)`, 18, 24);
    ctx.fillStyle = "#22c55e";
    ctx.fillText(`F_tangensial (${mb.tangentialDeflectionPct.toFixed(1)}%) → Giring Gulma`, 18, 218);
    ctx.fillStyle = "#ef4444";
    ctx.fillText(`T_sling = ${mb.normalTensionKn.toFixed(1)} / ${mb.actualBreakingStrengthKn} kN`, 242, 218);
  }, [activeTab, thetaDeg, inflowQ, mb.normalTensionKn, mb.actualBreakingStrengthKn, mb.tangentialDeflectionPct, mb.vDriftMs]);

  const PIE_COLORS = ["#15803d", "#0d9488", "#d97706", "#4f46e5"];

  const tkksAllocationPie = [
    { name: "Pelet Pakan Ikan Fermentasi (100.000 KJA)", value: mb.pelletDailyTon },
    { name: "Bio-Kompos & Mulsa Organik Tepi", value: +(mb.pelletDailyTon * 0.35).toFixed(1) },
    { name: "Serapan Nutrien N & P Terangkat", value: +(mb.fertilizerDailyTon * 10).toFixed(1) },
  ];

  const lcaComparisonData = [
    { stage: "Frontal Eksisting (θ=90°, Tanpa Damper)", co2PerTonCpo: 620.0, fill: "#e11d48" },
    { stage: "Batas Tarik Nominal IWRC SS304", co2PerTonCpo: 577.0, fill: "#d97706" },
    { stage: "HYDRA-CIRATA (θ=35° + Damper η=0,88)", co2PerTonCpo: mb.normalTensionKn, fill: "#15803d" },
  ];

  const tabs = [
    { id: "command", label: "Command Center DSS" },
    { id: "visual", label: "Visualisasi 3D Waduk & Boom" },
    { id: "brick", label: "Visualisasi 3D Sling & Pelet" },
    { id: "results", label: "Analisis 4 Modul & Sensitivitas" },
    { id: "economy", label: "Valuasi Ekonomi & KJA" },
    { id: "research", label: "Mode Penelitian" },
  ] as const;

  return (
    <div className="custom-scroller flex h-full flex-1 flex-col overflow-y-auto bg-gray-100 text-gray-900">
      {/* TOP TAB NAVIGATION BAR */}
      <div className="border-b border-gray-200 bg-white px-4 lg:px-6 sticky top-0 z-20">
        <div className="flex overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-3.5 text-xs sm:text-sm font-semibold transition-colors lg:px-6 cursor-pointer ${
                  isActive
                    ? "border-emerald-700 text-emerald-800"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* TOP 4 KPI METRICS BAR (Matches CIRATA-SENSE.html 100%) */}
      <div className="px-6 pt-6">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* KPI 1: Tegangan Tarik Sling (IWRC SS304) */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 border-l-emerald-600">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Tegangan Tarik Sling (IWRC SS304)
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2
                className={`text-3xl font-extrabold font-mono ${
                  mb.safetyFactor >= 1.4
                    ? "text-gray-900"
                    : mb.safetyFactor >= 1.0
                    ? "text-amber-600"
                    : "text-rose-600"
                }`}
              >
                {mb.normalTensionKn.toFixed(1).replace(".", ",")}
              </h2>
              <span className="text-xs font-mono text-gray-500">
                kN (Ø20 mm)
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span
                className={`font-semibold px-2 py-0.5 rounded border ${
                  mb.safetyFactor >= 1.4
                    ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                    : mb.safetyFactor >= 1.0
                    ? "text-amber-800 bg-amber-50 border-amber-200"
                    : "text-rose-800 bg-rose-50 border-rose-200"
                }`}
              >
                {mb.safetyFactor >= 1.4
                  ? `AMAN (SF = ${mb.safetyFactor.toFixed(2).replace(".", ",")})`
                  : mb.safetyFactor >= 1.0
                  ? `WASPADA (SF = ${mb.safetyFactor.toFixed(2).replace(".", ",")})`
                  : `JEBOL! (SF = ${mb.safetyFactor.toFixed(2).replace(".", ",")})`}
              </span>
              <span className="text-gray-500 font-mono">
                Aktual: {mb.actualBreakingStrengthKn} kN
              </span>
            </div>
          </div>

          {/* KPI 2: Efisiensi Defleksi ke Collection Bay */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 border-l-teal-600">
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              Efisiensi Defleksi ke Collection Bay
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-extrabold font-mono text-gray-900">
                {mb.tangentialDeflectionPct.toFixed(1).replace(".", ",")}%
              </h2>
              <span className="text-xs font-mono text-gray-500">
                (θ = {thetaDeg}°)
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                {thetaDeg <= 45 ? "Konveyor Arus Aktif" : "Penahanan Frontal"}
              </span>
              <span className="text-gray-500 font-mono">
                Reduksi: -{mb.loadReductionPct}%
              </span>
            </div>
          </div>

          {/* KPI 3: Neraca Laju Tutupan Eceng Gondok */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 border-l-amber-500">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
              Neraca Laju Tutupan Eceng Gondok
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2
                className={`text-3xl font-extrabold font-mono ${
                  mb.netCoverageRateHaDay < 0 ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {mb.netCoverageRateHaDay > 0 ? "+" : ""}
                {mb.netCoverageRateHaDay.toFixed(1).replace(".", ",")}
              </h2>
              <span className="text-xs font-mono text-gray-500">
                ha/hari
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                Panen {harvestHaDay.toFixed(1).replace(".", ",")} vs +12,9 ha/hr
              </span>
              <span className="text-gray-500 font-mono">
                A₀ = 430 ha
              </span>
            </div>
          </div>

          {/* KPI 4: Proteksi Downtime & Sirkular KJA */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 border-l-emerald-700">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Proteksi Downtime &amp; Sirkular KJA
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h2 className="text-3xl font-extrabold font-mono text-gray-900">
                Rp409,8
              </h2>
              <span className="text-xs font-mono text-gray-500">
                Jt/hari/unit
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                +{mb.pelletDailyTon.toFixed(0)} Ton Pelet KJA/hr
              </span>
              <span className="text-gray-500 font-mono">
                100.000 KJA
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* TAB CONTENT WORKSPACE */}
      <div className="flex-1 p-6 space-y-6">
        {/* =========================================================
            TAB 1: COMMAND CENTER DSS (4 MODUL TERINTEGRASI)
           ========================================================= */}
        {activeTab === "command" && (
          <div className="space-y-6">
            {/* ROW 1: 2 VISUALISASI UTAMA DARI CIRATA-SENSE.html + GRAFIK RECHARTS */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Visualisasi 1: Dekomposisi Vektor Gaya Hydrodynamic Deflection Boom (Canvas Interaktif) */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      1. Dekomposisi Vektor Gaya Hydrodynamic Deflection Boom
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Modul Fisika &amp; Metalurgi: Bentangan 1,4 km (PE-PU) • Sling IWRC SS304 Ø20 mm (Nominal 577 kN)
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                    θ = {thetaDeg}° | η = {mb.fiRatio}
                  </span>
                </div>
                <div className="flex items-center justify-center rounded-xl bg-[#0a192f] p-2 border border-slate-800 overflow-hidden">
                  <canvas
                    ref={boomCanvasRef}
                    width={430}
                    height={230}
                    className="max-w-full h-auto rounded"
                  />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 block text-[10px]">Beban Frontal (90°)</span>
                    <strong className="text-rose-600">{mb.frontalLoadKn} kN</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 block text-[10px]">Tegangan Normal Sling</span>
                    <strong className="text-emerald-700">{mb.normalTensionKn} kN (-{mb.loadReductionPct}%)</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="text-gray-500 block text-[10px]">Kecepatan Drift (v_drift)</span>
                    <strong className="text-teal-700">{mb.vDriftMs} m/s</strong>
                  </div>
                </div>
              </div>

              {/* Visualisasi 2: Proyeksi Reduksi Tutupan Eceng Gondok 60 Hari (Modul Oseanografi) */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      2. Proyeksi Reduksi Tutupan Eceng Gondok (60 Hari)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Modul Oseanografi: dA/dt = r·A(t) - H(t) | Luas Awal A₀ = 430 ha, r = 0,03/hari (+12,90 ha/hari)
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded">
                    Hari 60: {mb.areaDay60DssHa} ha
                  </span>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mb.tfmKineticSeries}>
                      <defs>
                        <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#15803d" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#15803d" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="dayLabel" stroke="#6b7280" fontSize={10} />
                      <YAxis
                        domain={[0, 650]}
                        stroke="#6b7280"
                        fontSize={10}
                        label={{
                          value: "Luas Tutupan (Hektar)",
                          angle: -90,
                          position: "insideLeft",
                          fill: "#6b7280",
                          fontSize: 10,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#d1d5db",
                          borderRadius: "0.75rem",
                          fontSize: "12px",
                          color: "#111827",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Line
                        type="monotone"
                        dataKey="controlYield"
                        name="Eksisting Reaktif (Panen 8,0 ha/hr → Meluas)"
                        stroke="#e11d48"
                        strokeWidth={2.2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="catalyzedYield"
                        name={`DSS CIRATA-SENSE (Panen ${harvestHaDay.toFixed(1)} ha/hr → Terkendali)`}
                        stroke="#15803d"
                        strokeWidth={2.5}
                        fill="url(#emeraldGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ROW 2: REKOMENDASI OPERASIONAL REAL-TIME DSS CIRATA-SENSE (Sesuai CIRATA-SENSE.html) */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    3. Rekomendasi Operasional Real-Time DSS CIRATA-SENSE (Otomasi 4 Modul)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Integrasi Mekanika Hidrodinamika, Kesehatan Metalurgi Sling IWRC SS304, Jadwal Dispatch Ekskavator &amp; Sirkularitas KJA
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full font-mono text-xs font-bold border ${
                    mb.safetyFactor < 1.0 || harvestHaDay <= 12.9
                      ? "bg-rose-50 text-rose-800 border-rose-300"
                      : mb.safetyFactor < 1.4
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-emerald-50 text-emerald-800 border-emerald-300"
                  }`}
                >
                  {mb.safetyFactor < 1.0 || harvestHaDay <= 12.9
                    ? "STATUS: CRITICAL OVERLOAD / ACCUMULATION ALERT"
                    : mb.safetyFactor < 1.4
                    ? "STATUS: HIGH LOAD CAUTION"
                    : "STATUS: OPTIMAL ENGINEERING RESILIENCE"}
                </span>
              </div>

              <div className="rounded-xl border-l-4 border-l-teal-600 bg-teal-50/40 p-4 text-xs leading-relaxed text-gray-800 space-y-2">
                <div className="font-bold text-gray-900 text-sm">
                  Keputusan Operasional Terpadu (Otomasi DSS):
                </div>
                <ul className="list-disc list-inside space-y-2">
                  <li>
                    <strong>Status Mekanika &amp; Metalurgi Sling (Modul 2 &amp; 3):</strong> Pada debit{" "}
                    <strong className="text-emerald-800 font-mono">
                      {inflowQ.toFixed(2).replace(".", ",")} m³/s
                    </strong>{" "}
                    dan sudut{" "}
                    <strong className="text-teal-800 font-mono">{thetaDeg}°</strong>, beban tarik sling tercatat{" "}
                    <strong className="font-mono">
                      {mb.normalTensionKn.toFixed(1).replace(".", ",")} kN
                    </strong>{" "}
                    dari kapasitas aktual{" "}
                    <strong className="font-mono">{mb.actualBreakingStrengthKn} kN</strong> (Nominal 577 kN,{" "}
                    <em>Safety Factor</em> ={" "}
                    <strong className="font-mono">
                      {mb.safetyFactor.toFixed(2).replace(".", ",")}
                    </strong>
                    ).{" "}
                    {isColumnALead
                      ? "Proteksi anoda korban Zn-Al & selubung polimer HDPE/PU aktif mencegah crevice corrosion dan corrosion fatigue akibat DO 2,0 mg/L & H₂S 0,005 mg/L."
                      : "⚠️ Peringatan: Tanpa proteksi katodik/damper, sling mengalami degradasi kekuatan akibat korosi celah dan berisiko putus!"}
                  </li>
                  <li>
                    <strong>Jadwal Dispatch Ekskavator di Collection Bay (Modul 1):</strong> Kuota pengerukan disetel{" "}
                    <strong className="text-emerald-800 font-mono">
                      {harvestHaDay.toFixed(1).replace(".", ",")} ha/hari
                    </strong>{" "}
                    ({harvestHaDay > 12.9 ? "Melampaui" : "Di bawah"} laju tumbuh alami{" "}
                    <strong className="font-mono">12,90 ha/hari</strong> berdasarkan kecepatan transpor permukaan{" "}
                    <strong className="font-mono">v_drift = {mb.vDriftMs} m/s</strong>). Sebanyak{" "}
                    <strong className="text-teal-800 font-mono">
                      {mb.tangentialDeflectionPct.toFixed(1).replace(".", ",")}%
                    </strong>{" "}
                    gaya arus dimanfaatkan untuk menggiring gulma otomatis ke <em>Collection Bay</em> tepi.
                  </li>
                  <li>
                    <strong>Sirkularitas Ekologi KJA &amp; Baku Mutu Air (Modul 4):</strong> Konversi hasil panen menghasilkan{" "}
                    <strong className="text-amber-800 font-mono">
                      {mb.pelletDailyTon.toFixed(0)} ton/hari
                    </strong>{" "}
                    bahan baku pelet fermentasi untuk menyuplai{" "}
                    <strong className="font-mono">100.000 petak KJA</strong>, menyerap nutrien{" "}
                    <strong className="font-mono">Total N (1,0 mg/L) &amp; Total P (0,24 mg/L)</strong>, memulihkan DO perairan ke{" "}
                    <strong className="text-emerald-800 font-mono">
                      {mb.projectedDoMgl.toFixed(2).replace(".", ",")} mg/L
                    </strong>{" "}
                    (memenuhi PP No. 22 Tahun 2021 Kelas IV &gt;1 mg/L), serta mengamankan pembangkitan dari risiko kerugian downtime{" "}
                    <strong className="font-mono">Rp17.074.290,072/jam/unit</strong>.
                  </li>
                </ul>
              </div>
            </div>

            {/* ROW 3: DIGITAL TWIN TELEMETRI METALURGI SLING & KOMPARASI SKENARIO DEBIT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Digital Twin Kesehatan Metalurgi Sling IWRC SS304 */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    4. Indeks Kesehatan Metalurgi Sling IWRC SS304
                  </h3>
                  <button
                    onClick={toggleLeadLag}
                    className="text-[11px] font-mono font-semibold bg-teal-700 hover:bg-teal-800 text-white px-3 py-1 rounded-lg transition cursor-pointer"
                  >
                    Ubah Mode Proteksi
                  </button>
                </div>
                <div className="space-y-3 text-xs">
                  <div
                    className={`p-3.5 rounded-xl border ${
                      isColumnALead
                        ? "bg-emerald-50/70 border-emerald-500"
                        : "bg-rose-50/70 border-rose-400"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-bold text-gray-900">
                        {isColumnALead
                          ? "PROTEKSI HYDRA-CIRATA (Zn-Al + HDPE/PU + Damper)"
                          : "KONDISI EKSISTING (Tanpa Proteksi Korosi Celah)"}
                      </span>
                      <span className="font-mono font-bold text-emerald-800">
                        T_aktual: {mb.actualBreakingStrengthKn} kN
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          mb.safetyFactor >= 1.4
                            ? "bg-emerald-600"
                            : mb.safetyFactor >= 1.0
                            ? "bg-amber-500"
                            : "bg-rose-600"
                        }`}
                        style={{ width: `${mb.colASaturationPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between font-mono text-[11px] text-gray-600">
                      <span>Rasio Beban/Kapasitas: {mb.colASaturationPct}%</span>
                      <span>Degradasi Korosi: -{mb.corrosionLossPct}% dari 577 kN</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    {mb.valveStatusMessage}
                  </p>
                </div>
              </div>

              {/* Grafik Komparasi Beban Tarik pada 3 Skenario Persentil Debit */}
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                      5. Profil Beban Sling vs Skenario Debit (Ags 2025–Jul 2026)
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      Low (72,18 m³/s) • Moderate (150,80 m³/s) • High-Flow (243,27 m³/s)
                    </p>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mb.h2sTelemetrySeries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="hourLabel" stroke="#6b7280" fontSize={10} />
                      <YAxis domain={[0, 700]} stroke="#6b7280" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#d1d5db",
                          borderRadius: "0.75rem",
                          fontSize: "11px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
                      <Line
                        type="monotone"
                        dataKey="inletPpm"
                        name="Tegangan Frontal 90° (kN)"
                        stroke="#e11d48"
                        strokeWidth={2}
                        strokeDasharray="4 4"
                      />
                      <Line
                        type="monotone"
                        dataKey="safeLimitPpm"
                        name="Kapasitas Aktual Sling (kN)"
                        stroke="#d97706"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="outletPpm"
                        name={`Tegangan Normal θ=${thetaDeg}° (kN)`}
                        stroke="#0d9488"
                        fill="#ccfbf1"
                        strokeWidth={2.5}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 2: 3D RESERVOIR, DEFLECTION BOOM & COLLECTION BAY
           ========================================================= */}
        {activeTab === "visual" && (
          <div className="h-[600px] w-full">
            <ReactorScene />
          </div>
        )}

        {/* =========================================================
            TAB 3: 3D IWRC SS304 SLING PROTECTION & KJA FEED PELLET
           ========================================================= */}
        {activeTab === "brick" && (
          <div className="h-[600px] w-full">
            <GeopolymerBrickScene />
          </div>
        )}

        {/* =========================================================
            TAB 4: ANALISIS 4 MODUL TERINTEGRASI & SENSITIVITAS SUDUT
           ========================================================= */}
        {activeTab === "results" && (
          <div className="space-y-6">
            {/* Mathematical Equations Banner for the 4 Modules */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Persamaan Matematis 4 Modul Perhitungan Terintegrasi CIRATA-SENSE™
                </h3>
                <span className="rounded-lg bg-white border border-emerald-200 px-3 py-1 font-mono text-xs font-semibold text-emerald-800">
                  A₀ = 430 ha • L_boom = 1,4 km • T_nom = 577 kN • 100.000 KJA
                </span>
              </div>
              <div className="rounded-xl bg-white border border-gray-200 p-4 font-mono text-xs sm:text-sm text-emerald-800 font-semibold text-center overflow-x-auto">
                (1) dA/dt = r·A(t) - H(t) &nbsp;|&nbsp; (2) T_normal = η · T_frontal · sin(θ) &nbsp;|&nbsp; (3) T_aktual(t) = T_nom · [1 - k(DO, H₂S)·t] &nbsp;|&nbsp; (4) SF = T_aktual / T_normal
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="rounded-xl bg-white border border-gray-200 p-3 text-center">
                  <div className="text-gray-500 text-[10px]">Kuota Panen DSS (H)</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">
                    {harvestHaDay.toFixed(1)} ha/hari
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-3 text-center">
                  <div className="text-gray-500 text-[10px]">Sudut Defleksi (θ)</div>
                  <div className="text-base font-bold text-teal-700 mt-0.5">
                    {thetaDeg}° (F_T {mb.tangentialDeflectionPct}%)
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-3 text-center">
                  <div className="text-gray-500 text-[10px]">Safety Factor Sling</div>
                  <div className="text-base font-bold text-amber-700 mt-0.5">
                    SF = {mb.safetyFactor.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-3 text-center">
                  <div className="text-gray-500 text-[10px]">Proyeksi Oksigen (DO)</div>
                  <div className="text-base font-bold text-gray-900 mt-0.5">
                    {mb.projectedDoMgl.toFixed(2)} mg/L
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid: Biomass Allocation & Angle Sensitivity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 5 Cols: Distribusi Konversi Biomassa Eceng Gondok */}
              <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Distribusi Hilirisasi Biomassa Collection Bay (Ton/hari)
                </h3>
                <p className="mb-4 text-xs text-gray-500">
                  Kuota Panen: {harvestHaDay.toFixed(1)} ha/hari → {mb.pelletDailyTon} Ton Pelet KJA/hari
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tkksAllocationPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={88}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, value }) => `${value} T`}
                      >
                        {tkksAllocationPie.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#d1d5db",
                          color: "#111827",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right 7 Cols: Sensitivity Curve Deflection Angle θ vs Sling Tension & Tangential Efficiency */}
              <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Kurva Sensitivitas Sudut Defleksi (θ) vs Tegangan Sling (kN) &amp; Gaya Tangensial (%)
                </h3>
                <p className="mb-4 text-xs text-gray-500">
                  Orientasi HYDRA-CIRATA θ = 35° menurunkan tegangan ke ~313–330 kN dan membelokkan 81,9% arus
                </p>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mb.sensitivityData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="biocharDose" stroke="#6b7280" fontSize={11} unit="°" />
                      <YAxis yAxisId="left" stroke="#15803d" fontSize={11} />
                      <YAxis yAxisId="right" orientation="right" stroke="#d97706" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#d1d5db",
                          borderRadius: "0.75rem",
                          color: "#111827",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <ReferenceLine
                        yAxisId="left"
                        x={35}
                        stroke="#0d9488"
                        strokeDasharray="4 4"
                        label={{
                          value: "HYDRA θ = 35°",
                          fill: "#0d9488",
                          fontSize: 11,
                        }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="methaneYield"
                        name="Tegangan Normal Sling T_normal (kN)"
                        stroke="#15803d"
                        strokeWidth={3}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="powerMW"
                        name="Efisiensi Tangensial F_T (%)"
                        stroke="#d97706"
                        strokeWidth={2.5}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Water Quality Comparison Table (PP No. 22 Tahun 2021 Kelas IV) */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-gray-900">
                Tabel Evaluasi Parameter Kualitas Air Waduk Cirata vs Baku Mutu PP No. 22 Tahun 2021 (Kelas IV)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase text-emerald-800">
                    <tr>
                      <th className="px-4 py-3">Parameter Uji</th>
                      <th className="px-4 py-3">Hasil Pengujian (Baseline)</th>
                      <th className="px-4 py-3">Baku Mutu Kelas IV</th>
                      <th className="px-4 py-3">Implikasi Korosi / Ekologi &amp; Mitigasi CIRATA-SENSE™</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {POME_EQA_COMPARISON.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-semibold text-gray-900">
                          {row.parameter}
                        </td>
                        <td className="px-4 py-2.5 font-mono font-bold text-rose-600">
                          {row.pomeAvg}
                        </td>
                        <td className="px-4 py-2.5 font-mono font-semibold text-emerald-700">
                          {row.eqaLimit}
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: VALUASI EKONOMI, PROTEKSI DOWNTIME & SIRKULAR KJA
           ========================================================= */}
        {activeTab === "economy" && (
          <div className="space-y-6">
            {/* Top 4 Financial Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 border-l-emerald-600">
                <p className="text-xs font-semibold text-emerald-700">
                  Avoided Downtime Loss (Per Jam/Unit)
                </p>
                <p className="mt-1 font-mono text-2xl font-extrabold text-gray-900">
                  Rp 17,07 Jt
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Rp17.074.290,072/jam/unit (Rp409,8 Jt/hari)
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 border-l-teal-600">
                <p className="text-xs font-semibold text-teal-700">
                  Net Present Value (WACC 10%)
                </p>
                <p className="mt-1 font-mono text-2xl font-extrabold text-gray-900">
                  {formatRp(econ.metrics.npvIDR)}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  IRR {econ.metrics.irrPct}% • Payback ~{econ.metrics.paybackYears} Tahun
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 border-l-amber-500">
                <p className="text-xs font-semibold text-amber-700">Substitusi Pakan Sirkular KJA</p>
                <p className="mt-1 font-mono text-2xl font-extrabold text-gray-900">
                  {mb.pelletDailyTon.toFixed(0)} Ton/Hari
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Menyuplai 100.000 Petak KJA Waduk Cirata
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm border-l-4 border-l-emerald-700">
                <p className="text-xs font-semibold text-emerald-800">
                  Total CAPEX Integrasi HYDRA-CIRATA
                </p>
                <p className="mt-1 font-mono text-2xl font-extrabold text-gray-900">
                  {formatRp(econ.coLocationHubCapexIDR)}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  Hemat 62,5% OPEX Alat Berat Ekskavator
                </p>
              </div>
            </div>

            {/* 5-Year Financial Projection & Sling Tension Reduction Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 7 Cols: 5-Year Financial Projection */}
              <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Proyeksi Nilai Manfaat &amp; Arus Kas 5 Tahun (Miliar Rupiah)
                    </h3>
                    <p className="text-xs text-gray-500">
                      Akumulasi penghematan OPEX ekskavator, pencegahan kerugian downtime, dan hilirisasi pelet KJA
                    </p>
                  </div>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={econ.metrics.fiveYearProjections}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="label" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#d1d5db",
                          borderRadius: "0.75rem",
                          color: "#111827",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
                      <Bar
                        dataKey="revenueMiliar"
                        name="Total Benefit & Revenue (Miliar Rp)"
                        fill="#15803d"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="opexMiliar"
                        name="OPEX Operasional (Miliar Rp)"
                        fill="#0f766e"
                        radius={[6, 6, 0, 0]}
                      />
                      <Line
                        type="monotone"
                        dataKey="cumulativeCashFlowMiliar"
                        name="Cumulative Net Benefit (Miliar Rp)"
                        stroke="#d97706"
                        strokeWidth={3}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 5 Cols: Perbandingan Beban Tarik Sling (kN) */}
              <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-1 text-sm font-bold text-gray-900">
                  Komparasi Beban Tarik Sling IWRC SS304 saat High-Flow
                </h3>
                <p className="mb-3 text-xs text-gray-500">
                  Reduksi tegangan tarik <strong className="text-emerald-700">-{mb.loadReductionPct}%</strong> menjaga sling tetap aman di bawah batas 577 kN
                </p>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lcaComparisonData} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" domain={[0, 680]} stroke="#6b7280" fontSize={11} />
                      <YAxis
                        type="category"
                        dataKey="stage"
                        width={145}
                        stroke="#374151"
                        fontSize={10}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderColor: "#d1d5db",
                          color: "#111827",
                        }}
                      />
                      <Bar dataKey="co2PerTonCpo" name="Tegangan Sling (kN)" radius={[0, 8, 8, 0]}>
                        {lcaComparisonData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Rincian CAPEX & Komponen Infrastruktur HYDRA-CIRATA */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Rincian Alokasi Investasi Infrastruktur Terpadu HYDRA-CIRATA &amp; Sentra Pelet KJA
                  </h3>
                  <p className="text-xs text-gray-500">
                    Integrasi rekayasa mekanika hidrodinamika, proteksi katodik sling IWRC SS304, Collection Bay, dan pabrik pelet KJA
                  </p>
                </div>
                <span className="rounded-xl bg-emerald-700 px-3.5 py-1.5 font-mono text-xs font-extrabold text-white shadow-sm">
                  TOTAL CAPEX SISTEM: Rp2.850.000.000
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-700">
                  <thead className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase text-emerald-800">
                    <tr>
                      <th className="px-4 py-2.5">No</th>
                      <th className="px-4 py-2.5">Modul / Komponen</th>
                      <th className="px-4 py-2.5">Infrastruktur &amp; Perangkat</th>
                      <th className="px-4 py-2.5">Spesifikasi Teknis &amp; Fungsi</th>
                      <th className="px-4 py-2.5 text-right">Alokasi CAPEX</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {PROTOTYPE_BUDGET_ITEMS.map((b) => (
                      <tr key={b.no} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-mono text-gray-500">{b.no}</td>
                        <td className="px-4 py-2 font-semibold text-gray-900">{b.component}</td>
                        <td className="px-4 py-2 font-medium text-emerald-700">{b.item}</td>
                        <td className="px-4 py-2 text-gray-600">{b.spec}</td>
                        <td className="px-4 py-2 text-right font-mono font-bold text-gray-900">
                          Rp{b.costIDR.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 6: RESEARCH MODE
           ========================================================= */}
        {activeTab === "research" && <ResearchTab />}
      </div>
    </div>
  );
}
