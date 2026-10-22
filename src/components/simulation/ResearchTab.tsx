"use client";

import { useState } from "react";
import { runBioTrapSimulation } from "@/lib/simulation/massBalance";
import { calculateBioTrapEconomics } from "@/lib/simulation/economics";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

export function ResearchTab() {
  const [indepVar, setIndepVar] = useState<"biocharDose" | "tbsCapacity" | "h2sInlet">("biocharDose");
  const [startVal, setStartVal] = useState<number>(6.0);
  const [endVal, setEndVal] = useState<number>(24.0);
  const [stepVal, setStepVal] = useState<number>(2.0);

  const [fixedTbs, setFixedTbs] = useState<number>(243.27); // Debit Inflow Q (m³/s)
  const [fixedBiochar, setFixedBiochar] = useState<number>(16.0); // Kuota Panen H (ha/hari)
  const [fixedFi, setFixedFi] = useState<number>(0.88); // Damper η
  const [fixedCod, setFixedCod] = useState<number>(35); // Sudut Defleksi θ (°)
  const [fixedH2s, setFixedH2s] = useState<number>(18); // Usia Sling t (bulan)

  const [results, setResults] = useState<any[]>([]);

  const handleVarChange = (v: "biocharDose" | "tbsCapacity" | "h2sInlet") => {
    setIndepVar(v);
    if (v === "biocharDose") {
      // Kuota Panen Harian H (ha/hari)
      setStartVal(6.0);
      setEndVal(24.0);
      setStepVal(2.0);
    } else if (v === "tbsCapacity") {
      // Debit Inflow Waduk Q (m³/s)
      setStartVal(70);
      setEndVal(250);
      setStepVal(20);
    } else {
      // Sudut Defleksi Boom θ (°)
      setStartVal(25);
      setEndVal(90);
      setStepVal(5);
    }
  };

  const runExperiment = () => {
    const newResults = [];
    const safeStep = stepVal > 0 ? stepVal : 2.0;

    for (let v = startVal; v <= endVal + 1e-6; v += safeStep) {
      const val = +v.toFixed(2);
      const curHarvest = indepVar === "biocharDose" ? val : fixedBiochar;
      const curInflow = indepVar === "tbsCapacity" ? val : fixedTbs;
      const curTheta = indepVar === "h2sInlet" ? val : fixedCod;

      const mb = runBioTrapSimulation({
        tbsCapacity: curInflow,
        codInlet: curTheta,
        biocharDose: curHarvest,
        fiRatio: fixedFi,
        h2sInlet: 620,
        pyrolysisTemp: fixedH2s,
        isColumnALead: true,
        pksScaleCount: 8,
      });

      const econ = calculateBioTrapEconomics(mb);

      newResults.push({
        xValue: val,
        methaneYield: mb.safetyFactor, // Safety Factor Sling
        desirability: mb.projectedDoMgl, // Proyeksi DO (mg/L)
        powerMW: mb.tangentialDeflectionPct, // Efisiensi Tangensial (%)
        h2sOutlet: mb.normalTensionKn, // Tegangan Tarik Normal Sling (kN)
        carbonReduction: mb.areaDay60DssHa, // Tutupan Hari ke-60 (ha)
        npvMiliar: +(econ.metrics.npvIDR / 1e9).toFixed(2),
        pelletTonDay: mb.pelletDailyTon,
        bioSulfurTonDay: mb.netCoverageRateHaDay,
      });
    }
    setResults(newResults);
  };

  const downloadCSV = () => {
    if (results.length === 0) return;
    const headers = [
      "Variabel_X",
      "Safety_Factor_SF",
      "Tegangan_Sling_kN",
      "Efisiensi_Tangensial_Pct",
      "Proyeksi_DO_mgL",
      "Tutupan_Hari60_ha",
      "Pelet_KJA_Ton_hari",
      "NPV_Miliar_Rp",
    ];
    const rows = results.map((r) => [
      r.xValue,
      r.methaneYield,
      r.h2sOutlet,
      r.powerMW,
      r.desirability,
      r.carbonReduction,
      r.pelletTonDay,
      r.npvMiliar,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `eksperimen_cirata_sense_${indepVar}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const xLabel =
    indepVar === "biocharDose"
      ? "Kuota Panen Harian H (ha/hari)"
      : indepVar === "tbsCapacity"
      ? "Debit Inflow Waduk Q (m³/s)"
      : "Sudut Defleksi Trash Boom θ (°)";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Mode Penelitian &amp; Eksperimen Parametrik 4 Modul CIRATA-SENSE™
            </h2>
            <p className="text-xs text-gray-500">
              Simulasi multi-skenario untuk uji sensitivitas kuota panen (H), debit inflow (Q), dan sudut defleksi boom (θ)
            </p>
          </div>
          <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-semibold text-emerald-800">
            HYDRA-CIRATA • EUREKA! ITB 2026
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left: Variable Sweep Config */}
          <div className="space-y-4 border-b border-gray-100 pb-4 md:border-b-0 md:border-r md:pb-0 md:pr-6">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-700">
                Variabel Independen (Sumbu X)
              </label>
              <select
                value={indepVar}
                onChange={(e) => handleVarChange(e.target.value as any)}
                className="w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs text-gray-900"
              >
                <option value="biocharDose">
                  Kuota Panen Harian DSS / H (5,0 - 25,0 ha/hari)
                </option>
                <option value="tbsCapacity">
                  Debit Inflow Waduk Cirata / Q (72,18 - 243,27 m³/s)
                </option>
                <option value="h2sInlet">
                  Sudut Defleksi Trash Boom / θ (25° - 90°)
                </option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-[11px] text-gray-500">
                  Nilai Awal
                </label>
                <input
                  type="number"
                  step="any"
                  value={startVal}
                  onChange={(e) => setStartVal(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 bg-white p-2 font-mono text-xs text-gray-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-gray-500">
                  Nilai Akhir
                </label>
                <input
                  type="number"
                  step="any"
                  value={endVal}
                  onChange={(e) => setEndVal(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 bg-white p-2 font-mono text-xs text-gray-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-gray-500">
                  Interval (Step)
                </label>
                <input
                  type="number"
                  step="any"
                  value={stepVal}
                  onChange={(e) => setStepVal(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 bg-white p-2 font-mono text-xs text-gray-900"
                />
              </div>
            </div>

            <button
              onClick={runExperiment}
              className="flex w-full items-center justify-center rounded-xl bg-emerald-700 hover:bg-emerald-800 px-4 py-3 text-xs font-bold text-white shadow-sm transition cursor-pointer"
            >
              Jalankan Pengambilan Data Eksperimen
            </button>
          </div>

          {/* Right: Control Variables */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Variabel Kontrol (Tetap)
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="mb-1 block text-[11px] text-gray-500">
                  Efisiensi Damper (η)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={fixedFi}
                  onChange={(e) => setFixedFi(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 bg-white p-2 font-mono text-gray-900"
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-gray-500">
                  Usia Sling t (Bulan)
                </label>
                <input
                  type="number"
                  step="1"
                  value={fixedH2s}
                  onChange={(e) => setFixedH2s(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-300 bg-white p-2 font-mono text-gray-900"
                />
              </div>
              {indepVar !== "tbsCapacity" && (
                <div>
                  <label className="mb-1 block text-[11px] text-gray-500">
                    Debit Inflow Q (m³/s)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={fixedTbs}
                    onChange={(e) => setFixedTbs(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 bg-white p-2 font-mono text-gray-900"
                  />
                </div>
              )}
              {indepVar !== "biocharDose" && (
                <div>
                  <label className="mb-1 block text-[11px] text-gray-500">
                    Kuota Panen H (ha/hari)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={fixedBiochar}
                    onChange={(e) => setFixedBiochar(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 bg-white p-2 font-mono text-gray-900"
                  />
                </div>
              )}
              {indepVar !== "h2sInlet" && (
                <div>
                  <label className="mb-1 block text-[11px] text-gray-500">
                    Sudut Defleksi θ (°)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={fixedCod}
                    onChange={(e) => setFixedCod(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-300 bg-white p-2 font-mono text-gray-900"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Graph 1: Safety Factor & DO */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-800">
                1. Respon Safety Factor Sling (SF) &amp; Pemulihan DO (mg/L) vs {xLabel}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="xValue" stroke="#6b7280" fontSize={11} />
                    <YAxis stroke="#6b7280" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#d1d5db",
                        color: "#111827",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="methaneYield"
                      stroke="#15803d"
                      name="Safety Factor Sling (SF)"
                      strokeWidth={3}
                    />
                    <Line
                      type="monotone"
                      dataKey="desirability"
                      stroke="#0d9488"
                      name="Oksigen Terlarut DO (mg/L)"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Graph 2: Sling Tension & Day-60 Weed Coverage */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-800">
                2. Tegangan Sling T_normal (kN) &amp; Tutupan Hari ke-60 (ha) vs {xLabel}
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={results}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="xValue" stroke="#6b7280" fontSize={11} />
                    <YAxis yAxisId="left" stroke="#d97706" fontSize={11} />
                    <YAxis yAxisId="right" orientation="right" stroke="#15803d" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#d1d5db",
                        color: "#111827",
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="h2sOutlet"
                      stroke="#d97706"
                      name="Tegangan Sling T_normal (kN)"
                      strokeWidth={3}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="carbonReduction"
                      stroke="#15803d"
                      name="Tutupan Hari ke-60 (ha)"
                      strokeWidth={2.5}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm overflow-hidden">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">
                Tabel Hasil Pengambilan Data Parametrik CIRATA-SENSE™
              </h3>
              <button
                onClick={downloadCSV}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2 text-xs font-bold text-white transition cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Export Tabel ke CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-700">
                <thead className="border-b border-gray-200 bg-gray-50 font-mono text-[11px] uppercase text-emerald-800">
                  <tr>
                    <th className="px-4 py-2.5">{xLabel}</th>
                    <th className="px-4 py-2.5">Safety Factor (SF)</th>
                    <th className="px-4 py-2.5">Tegangan Sling (kN)</th>
                    <th className="px-4 py-2.5">Gaya Tangensial (%)</th>
                    <th className="px-4 py-2.5">Proyeksi DO (mg/L)</th>
                    <th className="px-4 py-2.5">Tutupan Hari-60 (ha)</th>
                    <th className="px-4 py-2.5">Pelet KJA (Ton/hr)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-mono">
                  {results.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-bold text-gray-900">{r.xValue}</td>
                      <td className="px-4 py-2 text-emerald-700 font-semibold">{r.methaneYield}</td>
                      <td className="px-4 py-2 text-teal-700">{r.h2sOutlet} kN</td>
                      <td className="px-4 py-2 text-amber-700">{r.powerMW}%</td>
                      <td className="px-4 py-2 text-gray-700">{r.desirability} mg/L</td>
                      <td className="px-4 py-2 text-emerald-800">{r.carbonReduction} ha</td>
                      <td className="px-4 py-2 font-bold text-gray-900">{r.pelletTonDay} Ton</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
