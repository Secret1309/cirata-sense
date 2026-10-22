"use client";

import { useState } from "react";
import { useSimulationStore } from "@/lib/store";
import { POME_MODES } from "@/lib/simulation/constants";
import { Play, Download } from "lucide-react";
import { exportSimulationData, exportEconomicReport } from "@/lib/export";

export function ControlPanel() {
  const {
    pomeMode,
    tbsCapacity, // 1. Debit Inflow Waduk Q (m³/s)
    codInlet,    // 2. Sudut Defleksi Trash Boom θ (°)
    biocharDose, // 4. Kuota Panen Harian DSS H (ha/hari)
    pyrolysisTemp, // Usia Layanan Sling t (bulan)
    isColumnALead, // 3. Rekayasa Metalurgi & Damper (true = HYDRA, false = Eksisting)
    isSimulating,
    setPomeMode,
    setParams,
    toggleLeadLag,
    resetOptimal,
    runSimulation,
    massBalanceResult,
    economicResults,
  } = useSimulationStore();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <div className="border-b border-gray-200 bg-white p-3 lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-bold text-gray-800"
        >
          <span>
            {isOpen
              ? "Sembunyikan Parameter Input & Skenario"
              : "Atur Parameter Input & Skenario CIRATA-SENSE"}
          </span>
          <Play
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-90" : ""
            }`}
          />
        </button>
      </div>

      {/* Left Sidebar Panel */}
      <aside
        className={`${
          isOpen ? "flex" : "hidden"
        } custom-scroller h-full w-full flex-col gap-5 overflow-y-auto border-r border-gray-200 bg-white p-5 shadow-sm lg:flex lg:w-[390px] xl:w-[410px] shrink-0`}
      >
        {/* Panel 1: Parameter Input & Skenario (Sesuai CIRATA-SENSE.html) */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              1. Parameter Input &amp; Skenario
            </h2>
            <span className="rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-800">
              Real-Time Sim
            </span>
          </div>

          {/* Preset Skenario Sistem */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Profil Skenario Operasional Waduk Cirata
            </label>
            <select
              value={pomeMode}
              onChange={(e) => setPomeMode(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
            >
              {Object.values(POME_MODES).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Slider 1: Debit Inflow Waduk (Q) */}
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-gray-700">
                1. Debit Inflow Waduk (Q)
              </span>
              <span className="font-mono font-bold text-emerald-700">
                {tbsCapacity.toFixed(2).replace(".", ",")} m³/s
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="280"
              step="0.01"
              value={tbsCapacity}
              onChange={(e) =>
                setParams({ tbsCapacity: parseFloat(e.target.value) })
              }
              className="h-2 w-full cursor-pointer rounded-lg bg-gray-200 accent-emerald-700"
            />
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setParams({ tbsCapacity: 72.18 })}
                className={`rounded border px-2 py-1 font-mono text-[10px] font-semibold transition cursor-pointer ${
                  Math.abs(tbsCapacity - 72.18) < 1
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Low (72,18)
              </button>
              <button
                type="button"
                onClick={() => setParams({ tbsCapacity: 150.8 })}
                className={`rounded border px-2 py-1 font-mono text-[10px] font-semibold transition cursor-pointer ${
                  Math.abs(tbsCapacity - 150.8) < 1
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Mod (150,80)
              </button>
              <button
                type="button"
                onClick={() => setParams({ tbsCapacity: 243.27 })}
                className={`rounded border px-2 py-1 font-mono text-[10px] font-semibold transition cursor-pointer ${
                  Math.abs(tbsCapacity - 243.27) < 1
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                High (243,27)
              </button>
            </div>
            <div className="mt-1 font-mono text-[10px] text-gray-400">
              Data Historis Ags 2025–Jul 2026 (Persentil Debit)
            </div>
          </div>

          {/* Slider 2: Sudut Defleksi Trash Boom (θ) */}
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-gray-700">
                2. Sudut Defleksi Trash Boom (θ)
              </span>
              <span className="font-mono font-bold text-teal-700">
                {codInlet.toFixed(0)}° (F_T {massBalanceResult.tangentialDeflectionPct.toFixed(1).replace(".", ",")}%)
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="90"
              step="1"
              value={codInlet}
              onChange={(e) =>
                setParams({ codInlet: parseFloat(e.target.value) })
              }
              className="h-2 w-full cursor-pointer rounded-lg bg-gray-200 accent-emerald-700"
            />
            <div className="mt-1.5 grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setParams({ codInlet: 35 })}
                className={`col-span-2 rounded border px-2 py-1 font-mono text-[10px] font-semibold transition cursor-pointer ${
                  codInlet === 35
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                HYDRA-CIRATA (35° Defleksi)
              </button>
              <button
                type="button"
                onClick={() => setParams({ codInlet: 90 })}
                className={`rounded border px-2 py-1 font-mono text-[10px] font-semibold transition cursor-pointer ${
                  codInlet === 90
                    ? "border-rose-500 bg-rose-50 text-rose-800"
                    : "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                Eksisting (90°)
              </button>
            </div>
            <div className="mt-1 font-mono text-[10px] text-gray-400">
              Panjang Boom: 1,4 km (PE-PU) | Sling IWRC SS304 Ø20 mm
            </div>
          </div>

          {/* Select 3: Rekayasa Metalurgi & Damper Sling */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              3. Rekayasa Metalurgi &amp; Damper Sling
            </label>
            <select
              value={isColumnALead ? "hydra" : "existing"}
              onChange={(e) =>
                setParams({ isColumnALead: e.target.value === "hydra" })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs text-gray-800 focus:border-emerald-600 focus:outline-none"
            >
              <option value="hydra">
                Proteksi Anoda Korban Zn-Al + Selubung Polimer + Viscoelastic Damper
              </option>
              <option value="existing">
                Kondisi Eksisting (Tanpa Proteksi Korosi Celah / Tanpa Damper)
              </option>
            </select>
            <div className="mt-1 font-mono text-[10px] text-gray-400">
              Mengatasi Crevice Corrosion &amp; Corrosion Fatigue (DO 2 mg/L; H₂S 0,005 mg/L)
            </div>
          </div>

          {/* Slider 4: Kuota Panen Harian DSS (H) */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-semibold text-emerald-900">
                4. Kuota Panen Harian DSS (H)
              </span>
              <span className="font-mono font-bold text-emerald-700">
                {biocharDose.toFixed(1).replace(".", ",")} ha/hari
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              step="0.5"
              value={biocharDose}
              onChange={(e) =>
                setParams({ biocharDose: parseFloat(e.target.value) })
              }
              className="h-2 w-full cursor-pointer rounded-lg bg-emerald-200 accent-emerald-700"
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-emerald-700">
              <span>5,0 ha/hr (Reaktif)</span>
              <span>Tumbuh: +12,9 ha/hr</span>
              <span>Target ≥ 15–16 ha/hr</span>
            </div>
            <div className="mt-0.5 font-mono text-[10px] text-gray-500">
              Baseline Tutupan: 430 ha | Laju Tumbuh Alami: 0,03/hari (+12,90 ha/hari)
            </div>
          </div>

          {/* Slider 5: Usia Layanan Sling IWRC SS304 (t) */}
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="font-medium text-gray-700">
                5. Usia Paparan Korosi Sling (t)
              </span>
              <span className="font-mono font-bold text-amber-700">
                {pyrolysisTemp} Bulan (T_aktual: {massBalanceResult.actualBreakingStrengthKn} kN)
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="36"
              step="1"
              value={pyrolysisTemp}
              onChange={(e) =>
                setParams({ pyrolysisTemp: parseFloat(e.target.value) })
              }
              className="h-2 w-full cursor-pointer rounded-lg bg-gray-200 accent-emerald-700"
            />
            <div className="mt-0.5 flex justify-between font-mono text-[10px] text-gray-400">
              <span>1 Bulan (577 kN)</span>
              <span>Evaluasi: 18 Bulan</span>
              <span>36 Bulan</span>
            </div>
          </div>

          {/* Smart Decision Advisor Box */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">
                OTOMASI KEPUTUSAN DSS
              </span>
              <span className="font-mono text-[11px] text-gray-500">
                Safety Factor:{" "}
                <strong
                  className={
                    massBalanceResult.safetyFactor >= 1.4
                      ? "text-emerald-700"
                      : massBalanceResult.safetyFactor >= 1.0
                      ? "text-amber-700"
                      : "text-rose-600"
                  }
                >
                  {massBalanceResult.safetyFactor.toFixed(2).replace(".", ",")}
                </strong>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-gray-600">
              <strong
                className={
                  massBalanceResult.advisorStatus === "OPTIMAL"
                    ? "text-emerald-700"
                    : massBalanceResult.advisorStatus === "UNDER_DOSING"
                    ? "text-amber-700"
                    : "text-rose-600"
                }
              >
                {massBalanceResult.advisorTitle}:
              </strong>{" "}
              {massBalanceResult.advisorMessage}
            </p>
          </div>
        </div>

        {/* Panel 2: Baseline Kualitas Air (PP 22/2021 Kelas IV - Sesuai Tabel di CIRATA-SENSE.html) */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              2. Baseline Kualitas Air (PP 22/2021 Kelas IV)
            </h3>
            <span className="font-mono text-[10px] font-semibold text-teal-700">
              Lampiran VI
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-gray-200 text-emerald-800 font-semibold">
                  <th className="py-1.5 pr-2">Parameter</th>
                  <th className="py-1.5 px-1">Baku Mutu</th>
                  <th className="py-1.5 px-1">Baseline</th>
                  <th className="py-1.5 pl-1 text-right">Proyeksi DSS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono">
                <tr>
                  <td className="py-1.5 pr-2 font-sans font-medium text-gray-700">DO (Oksigen)</td>
                  <td className="py-1.5 px-1 text-gray-500">&gt; 1 mg/L</td>
                  <td className="py-1.5 px-1 text-gray-800">2,0 mg/L</td>
                  <td
                    className={`py-1.5 pl-1 text-right font-bold ${
                      massBalanceResult.projectedDoMgl >= 2.0
                        ? "text-emerald-700"
                        : "text-amber-600"
                    }`}
                  >
                    {massBalanceResult.projectedDoMgl.toFixed(2).replace(".", ",")} mg/L
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 font-sans font-medium text-gray-700">Sulfida (H₂S)</td>
                  <td className="py-1.5 px-1 text-gray-500">-</td>
                  <td className="py-1.5 px-1 text-gray-800">0,005 mg/L</td>
                  <td className="py-1.5 pl-1 text-right font-semibold text-teal-700">
                    {massBalanceResult.projectedH2sMgl <= 0.002 ? "< 0,002 mg/L" : "0,005 mg/L"}
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 font-sans font-medium text-gray-700">Total N &amp; P</td>
                  <td className="py-1.5 px-1 text-gray-500">-</td>
                  <td className="py-1.5 px-1 text-gray-800">1,0 &amp; 0,24</td>
                  <td className="py-1.5 pl-1 text-right font-sans font-semibold text-emerald-700">
                    Daur Ulang KJA
                  </td>
                </tr>
                <tr>
                  <td className="py-1.5 pr-2 font-sans font-medium text-gray-700">pH &amp; TDS</td>
                  <td className="py-1.5 px-1 text-gray-500">6–9 | 2000</td>
                  <td className="py-1.5 px-1 text-gray-800">7,1 | 152</td>
                  <td className="py-1.5 pl-1 text-right font-semibold text-gray-800">
                    7,1 | 148 (Aman)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons & Export */}
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={resetOptimal}
              className="flex items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-800 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition cursor-pointer"
            >
              Set HYDRA Optimal
            </button>
            <button
              onClick={toggleLeadLag}
              className="flex items-center justify-center rounded-xl bg-teal-700 hover:bg-teal-800 px-3 py-2.5 text-xs font-bold text-white shadow-sm transition cursor-pointer"
            >
              Toggle Proteksi Sling
            </button>
          </div>

          <button
            onClick={() => {
              runSimulation();
              setIsOpen(false);
            }}
            disabled={isSimulating}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50 cursor-pointer"
          >
            {isSimulating
              ? "Menghitung 4 Modul Terintegrasi CIRATA-SENSE..."
              : "Sinkronisasi & Validasi 4 Modul DSS"}
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => exportSimulationData(massBalanceResult)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-emerald-700" />
              Export Teknis (.xls)
            </button>
            <button
              onClick={() => exportEconomicReport(economicResults)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3 py-2 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-teal-700" />
              Export Ekonomi (.xls)
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
