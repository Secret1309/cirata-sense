"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Slider } from '@/components/ui/slider';
import { calculateKudValorization } from '@/lib/simulation/communityRecipe';
import { PROTOTYPE_BUDGET_ITEMS } from '@/lib/simulation/constants';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EmpowermentPage() {
  const [spentPelletKg, setSpentPelletKg] = useState<number>(48000); // 48.000 kg (48 Ton/hari pada H = 16 ha/hari)
  const [sulfurGrade, setSulfurGrade] = useState<'STANDARD' | 'HIGH_SULFUR'>('STANDARD');
  const [applicationTarget, setApplicationTarget] = useState<'SAWIT_PLASMA' | 'HORTIKULTURA'>('SAWIT_PLASMA');
  const [pksClusterCount, setPksClusterCount] = useState<number>(30); // 30 hari (1 bulan siklus pakan)

  const totalSpentKg = spentPelletKg * pksClusterCount;
  const kud = calculateKudValorization(totalSpentKg, sulfurGrade, applicationTarget);

  const applyPreset = (
    kgPerDay: number,
    grade: 'STANDARD' | 'HIGH_SULFUR',
    target: 'SAWIT_PLASMA' | 'HORTIKULTURA',
    days: number
  ) => {
    setSpentPelletKg(kgPerDay);
    setSulfurGrade(grade);
    setApplicationTarget(target);
    setPksClusterCount(days);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header />

      {/* Clean Green Banner like reference */}
      <div className="bg-emerald-800 px-6 py-14 text-white">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-semibold text-emerald-100 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Kembali ke Beranda
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-emerald-100 text-xs font-bold mb-3 uppercase tracking-wider">
              Modul 4 • Valuasi Sirkularitas Pakan 100.000 Petak KJA &amp; Kualitas Air
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight text-white">
              Kalkulator Sirkularitas Pelet Pakan KJA &amp; Pemulihan Mutu Air Waduk Cirata
            </h1>
            <p className="text-emerald-50 text-sm md:text-base leading-relaxed">
              Mengonversi biomassa eceng gondok yang tergiring pasif (<strong>81,9% gaya tangensial arus</strong>) ke <em>Collection Bay</em> menjadi <strong>bahan baku pelet ikan fermentasi</strong> untuk menyuplai <strong>100.000 petak Keramba Jaring Apung (KJA)</strong>, menyerap nutrien eutrofikasi (<code className="text-amber-200 font-semibold">Total N 1,0 mg/L &amp; Total P 0,24 mg/L</code>), serta memulihkan <code className="text-white font-semibold">DO &gt; 2,0 mg/L</code> sesuai <strong>PP No. 22 Tahun 2021 Kelas IV</strong>.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Interactive Controls */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Parameter Collection Bay &amp; KJA</h2>
              <p className="text-xs text-gray-500 mt-0.5">{kud.hubLocationName}</p>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyPreset(45000, 'STANDARD', 'SAWIT_PLASMA', 1)}
                className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-gray-50 hover:border-emerald-600 text-gray-800 transition-all cursor-pointer"
              >
                Kuota Minimum
                <span className="block text-[10px] text-gray-500 font-mono">15 ha (45 T/hr)</span>
              </button>
              <button
                onClick={() => applyPreset(48000, 'STANDARD', 'SAWIT_PLASMA', 30)}
                className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-emerald-600 bg-emerald-50 text-emerald-800 transition-all cursor-pointer"
              >
                DSS Optimal (Bulan)
                <span className="block text-[10px] text-emerald-700 font-mono">16 ha (48 T/hr)</span>
              </button>
              <button
                onClick={() => applyPreset(60000, 'HIGH_SULFUR', 'SAWIT_PLASMA', 60)}
                className="px-2.5 py-2 rounded-lg text-xs font-semibold border border-amber-500 bg-amber-50 text-amber-800 transition-all cursor-pointer"
              >
                Akselerasi 60 Hari
                <span className="block text-[10px] text-amber-700 font-mono">20 ha (60 T/hr)</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Slider 1: Kapasitas Konversi Pelet Harian di Collection Bay */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-700">Output Pelet Fermentasi / Hari</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {(spentPelletKg / 1000).toFixed(1)} Ton/Hari (Panen {(spentPelletKg / 3000).toFixed(1)} ha/hr)
                  </span>
                </div>
                <Slider
                  value={[spentPelletKg]}
                  min={15000}
                  max={75000}
                  step={1500}
                  onValueChange={(v) => setSpentPelletKg(v[0])}
                />
              </div>

              {/* Slider 2: Durasi Siklus Operasional (Hari) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-700">Durasi Siklus Distribusi Pakan</span>
                  <span className="font-mono font-bold text-emerald-700">{pksClusterCount} Hari Operasi</span>
                </div>
                <Slider
                  value={[pksClusterCount]}
                  min={1}
                  max={60}
                  step={1}
                  onValueChange={(v) => setPksClusterCount(v[0])}
                />
              </div>

              {/* Pilihan Formulasi Nutrisi Pelet */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-700 block">Formulasi Bio-Fermentasi Pelet KJA</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSulfurGrade('STANDARD')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                      sulfurGrade === 'STANDARD'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    Standard Pellet
                    <span className="block text-[10px] font-mono text-gray-500">32,5% Protein • N 1,0 mg/L</span>
                  </button>
                  <button
                    onClick={() => setSulfurGrade('HIGH_SULFUR')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                      sulfurGrade === 'HIGH_SULFUR'
                        ? 'bg-amber-50 border-amber-600 text-amber-900'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    High-Protein Probiotic
                    <span className="block text-[10px] font-mono text-gray-500">35,8% Protein • N+P Recovery</span>
                  </button>
                </div>
              </div>

              {/* Pilihan Target Budidaya Ikan KJA */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-gray-700 block">Target Komoditas Perikanan KJA Cirata</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setApplicationTarget('SAWIT_PLASMA')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                      applicationTarget === 'SAWIT_PLASMA'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    Ikan Mas &amp; Nila KJA
                    <span className="block text-[10px] font-mono text-gray-500">100.000 Petak KJA Utama</span>
                  </button>
                  <button
                    onClick={() => setApplicationTarget('HORTIKULTURA')}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left cursor-pointer ${
                      applicationTarget === 'HORTIKULTURA'
                        ? 'bg-teal-50 border-teal-600 text-teal-900'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    Patin &amp; Polikultur
                    <span className="block text-[10px] font-mono text-gray-500">Substitusi Pakan Intensif</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Water Quality Safety Validation Box */}
            <div className="p-4 rounded-xl border bg-emerald-50/70 border-emerald-200 text-gray-800 space-y-2">
              <div className="text-xs space-y-1.5">
                <div className="font-bold text-gray-900 flex items-center gap-2">
                  Status Baku Mutu Air:
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px]">
                    {kud.safetyStatus} (PP 22/2021 KELAS IV)
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed text-[11px]">{kud.safetyMessage}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200 text-[10px] font-mono">
                {Object.entries(kud.labTestResults).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between bg-white px-2 py-1 rounded border border-emerald-100">
                    <span className="text-gray-500">{key}:</span>
                    <span className="text-emerald-700 font-semibold">
                      {val.actual} {val.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Output Recipe & KJA Benefits */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top 4 Output Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-2">
                  Total Produksi Pelet Fermentasi KJA
                </span>
                <div className="text-3xl font-extrabold font-mono text-gray-900">
                  {(kud.bioSulfurTotalKg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}{' '}
                  <span className="text-base font-normal text-gray-500">Ton</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Setara <strong className="text-amber-700">{kud.bioSulfurSacks50Kg.toLocaleString('id-ID')} Karung (@50 kg)</strong> pakan ikan sirkular siap distribusi.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
                  Cakupan Petak KJA &amp; Area Bersih
                </span>
                <div className="text-3xl font-extrabold font-mono text-gray-900">
                  {kud.treesFertilizedCount.toLocaleString('id-ID')}{' '}
                  <span className="text-base font-normal text-gray-500">Petak KJA</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Hasil ekstraksi <strong className="text-emerald-700">{kud.plantationAreaHectares.toLocaleString('id-ID')} Ha</strong> tutupan eceng gondok di <em>Collection Bay</em>.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-2">
                  Penghematan Belanja Pakan Warga KJA
                </span>
                <div className="text-3xl font-extrabold font-mono text-gray-900">
                  Rp {(kud.farmerCostSavingsIDR / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}{' '}
                  <span className="text-base font-normal text-gray-500">Juta</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Hemat <strong className="text-teal-700">{kud.farmerSavingsPct}%</strong> dibanding pakan apung komersial (Rp4.500 vs Rp9.500/kg).
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                  Proteksi Downtime PLTA Cirata
                </span>
                <div className="text-3xl font-extrabold font-mono text-gray-900">
                  Rp 409,8{' '}
                  <span className="text-base font-normal text-gray-500">Juta/Hari/Unit</span>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  Mencegah kerugian <strong className="text-emerald-800">Rp17.074.290,072/jam/unit</strong> akibat jebolnya trash boom.
                </p>
              </div>
            </div>

            {/* Neraca Kuantitas Kemasan & Kualitas Ekologi */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Parameter Sirkularitas Nutrien (N &amp; P) &amp; Efisiensi Hidrodinamika
                </h3>
                <Link
                  href="/simulation"
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  Lihat di Simulator DSS <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 block mb-1">Total Area Panen Gulma</span>
                  <span className="text-lg font-bold font-mono text-gray-900 block">
                    {kud.bladeReplacementSacks25Kg.toLocaleString('id-ID')} Hektar
                  </span>
                  <span className="text-emerald-700 font-mono font-semibold">Konversi 3,0 Ton Pelet / Ha</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 block mb-1">Protein &amp; Defleksi Arus</span>
                  <span className="text-lg font-bold font-mono text-amber-700 block">
                    {kud.sulfurContentPct}% Prot • {kud.carbonContentPct}% F_T
                  </span>
                  <span className="text-gray-500">Sudut Boom θ = 35° (1,4 km)</span>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <span className="text-gray-500 block mb-1">Pemulihan Kualitas Air</span>
                  <span className="text-lg font-bold font-mono text-emerald-700 block">
                    DO &gt; 2,65 mg/L
                  </span>
                  <span className="text-gray-500">Serapan N 1,0 &amp; P 0,24 mg/L</span>
                </div>
              </div>

              {/* SOP Steps */}
              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-gray-800">
                  SOP Integrasi Collection Bay &amp; Hilirisasi Pakan 100.000 Petak KJA:
                </div>
                <div className="space-y-2">
                  {kud.valorizationSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rincian Investasi Sistem Terpadu HYDRA-CIRATA */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold block">
                    Alokasi CAPEX Infrastruktur Terpadu HYDRA-CIRATA
                  </span>
                  <h3 className="text-base font-bold text-gray-900">
                    Integrasi Deflection Boom 1,4 km, Proteksi Sling IWRC SS304 &amp; Pabrik Pelet KJA
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold">
                  Payback ~2,1 Tahun
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="py-2.5 px-3">Modul Rekayasa</th>
                      <th className="py-2.5 px-3">Komponen &amp; Spesifikasi Teknis</th>
                      <th className="py-2.5 px-3 text-right">Alokasi Biaya (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {PROTOTYPE_BUDGET_ITEMS.map((row) => (
                      <tr key={row.no} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-semibold text-emerald-800">{row.component}</td>
                        <td className="py-2.5 px-3 text-gray-600">
                          <span className="font-semibold text-gray-900">{row.item}</span> : {row.spec}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-gray-900">
                          Rp {row.costIDR.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-emerald-200 bg-emerald-50/60 font-bold text-gray-900">
                      <td colSpan={2} className="py-3 px-3">
                        TOTAL INVESTASI INFRASTRUKTUR TERINTEGRASI (HYDRA-CIRATA &amp; CIRATA-SENSE™)
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-800">Rp 2.850.000.000</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
