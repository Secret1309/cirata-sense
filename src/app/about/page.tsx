"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-12 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
        </Link>

        {/* Hero Header */}
        <div className="space-y-4 border-b border-gray-200 pb-8">
          <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Metodologi Ilmiah 4 Modul Terintegrasi • EUREKA! ITB 2026
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Rekayasa <span className="text-emerald-700">HYDRA-CIRATA</span> &amp; Arsitektur{' '}
            <span className="text-amber-700">CIRATA-SENSE™ DSS</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-4xl">
            Inovasi ketahanan infrastruktur (<em>Engineering Resilience</em>) PLTA Cirata yang mengintegrasikan <strong>Dekomposisi Vektor Gaya Hidrodinamika Trash Boom (θ = 35°)</strong>, <strong>Proteksi Metalurgi Sling IWRC SS304</strong>, <strong>Pemodelan Spasio-Temporal Oseanografi</strong>, serta <strong>Sirkularitas Pakan Fermentasi 100.000 Petak KJA</strong>.
          </p>
        </div>

        {/* Section 1: Problem Identification Waduk Cirata */}
        <section className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold">
              01
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Identifikasi Akar Masalah: Eutrofikasi, Beban Hidrodinamika &amp; Korosi Celah Sling
              </h2>
              <p className="text-xs text-gray-500">
                Analisis berbasis data riil Waduk Cirata (6.200 ha), data historis debit Ags 2025–Jul 2026, dan uji kualitas air PP No. 22/2021 Kelas IV
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <p>
              Operasional PLTA Cirata menghadapi ancaman ganda: ledakan populasi eceng gondok seluas <strong className="text-amber-700">430 ha</strong> dengan laju pertumbuhan harian <strong className="text-amber-700">r = 0,03/hari (+12,90 ha/hari)</strong> yang dipicu oleh limpasan nutrien dari <strong className="text-emerald-700">100.000 petak KJA</strong> (Total N <strong>1,0 mg/L</strong>; Total Fosfat P <strong>0,24 mg/L</strong>), serta kerentanan jebolnya infrastruktur penahan pasif (<em>trash boom</em> PE-PU sepanjang <strong>1,4 km</strong>).
            </p>
            <p>
              Pada fase puncak musim penghujan (<em>High-Flow</em> <strong>243,27 m³/s</strong>), orientasi trash boom eksisting yang dipasang frontal (<strong>θ = 90°</strong>) menahan akumulasi biomassa dan arus secara tegak lurus sehingga tegangan tarik menembus <strong className="text-red-600">≈ 620 kN</strong> (melampaui kapasitas nominal sling <strong>IWRC SS304 Ø20 mm sebesar 577 kN</strong>). Lebih parah lagi, kondisi perairan dengan <strong>DO rendah (2,0 mg/L)</strong> dan <strong>Sulfida H₂S (0,005 mg/L)</strong> memicu <em>crevice corrosion</em> dan <em>corrosion fatigue</em> yang menurunkan kekuatan aktual sling ke <strong>485 kN (SF = 0,78 &lt; 1,0 → Putus)</strong>.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-500 block">Risiko Kerugian Downtime PLTA</span>
                <span className="text-base font-bold font-mono text-amber-700">Rp17.074.290,072</span>
                <span className="text-xs text-red-600 block font-medium">Per jam / unit (Rp409,8 Jt/hari/unit)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-500 block">Pertambahan Alami Eceng Gondok</span>
                <span className="text-base font-bold font-mono text-emerald-700">+12,90 ha/hari</span>
                <span className="text-xs text-emerald-700 block font-medium">A₀ = 430 ha • r = 0,03/hari</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200">
                <span className="text-xs text-gray-500 block">Kapasitas Sling IWRC SS304 Ø20 mm</span>
                <span className="text-base font-bold font-mono text-teal-700">577 kN Nominal</span>
                <span className="text-xs text-gray-600 block font-medium">Degradasi ke 485 kN tanpa proteksi</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: 4 Modul Perhitungan Terintegrasi CIRATA-SENSE */}
        <section className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold">
              02
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                Formulasi Matematis 4 Modul Perhitungan Terintegrasi CIRATA-SENSE™
              </h2>
              <p className="text-xs text-gray-500">
                Fondasi komputasi lintas disiplin (Oseanografi, Fisika Hidrodinamika, Teknik Metalurgi, &amp; Ekonomi Sirkular)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Modul 1 */}
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <span className="text-xs font-mono text-emerald-700 font-bold uppercase">
                Modul 1 — Dinamika Spasio-Temporal &amp; Kuota Panen (Oseanografi)
              </span>
              <div className="p-3.5 rounded-lg bg-white border border-gray-200 font-mono text-xs text-emerald-800 font-semibold overflow-x-auto">
                dA/dt = r · A(t) - H(t) &nbsp;|&nbsp; v_drift = 0,85 · v_inflow + 0,03 · v_wind
              </div>
              <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Parameter Pertumbuhan:</strong> Luas awal <code className="text-emerald-700 font-semibold">A₀ = 430 ha</code> dan laju tumbuh <code className="text-emerald-700 font-semibold">r = 0,03/hari</code> menghasilkan pertambahan alami <code className="text-gray-900 font-bold">+12,90 ha/hari</code>.
                </li>
                <li>
                  <strong>Logika Keputusan DSS:</strong> Jika pengerukan <code className="text-rose-600 font-semibold">H(t) ≤ 12,9 ha/hari</code>, waduk mengalami <em>Net Accumulation</em> (merah). DSS menetapkan kuota panen minimum <code className="text-emerald-700 font-bold">H_target ≥ 15,0–16,0 ha/hari</code> (-3,1 ha/hari net).
                </li>
              </ul>
            </div>

            {/* Modul 2 */}
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <span className="text-xs font-mono text-teal-700 font-bold uppercase">
                Modul 2 — Dekomposisi Vektor Gaya Trash Boom (Fisika)
              </span>
              <div className="p-3.5 rounded-lg bg-white border border-gray-200 font-mono text-xs text-teal-800 font-semibold overflow-x-auto">
                F_D = ½·ρ·C_d·A_wet·v² + F_biomassa &nbsp;|&nbsp; T_normal = η · T_frontal · sin(θ)
              </div>
              <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Tiga Skenario Debit (Ags 2025–Jul 2026):</strong> <em>Low-flow</em> (<code className="font-semibold">72,18 m³/s</code>), <em>Moderate-flow</em> (<code className="font-semibold">150,80 m³/s</code>), dan <em>High-flow</em> (<code className="font-semibold">243,27 m³/s</code>).
                </li>
                <li>
                  <strong>Reduksi Tegangan &amp; Defleksi Pasif:</strong> Pada <code className="text-teal-700 font-semibold">θ = 35°</code> dan <em>viscoelastic damper</em> (<code className="text-teal-700 font-semibold">η = 0,88</code>), tegangan normal turun ke <code className="text-gray-900 font-bold">313–330 kN (Reduksi &gt;42%)</code>, sementara komponen tangensial <code className="text-emerald-700 font-bold">F_T = F_D cos 35° ≈ 81,9%</code> menggiring gulma ke <em>Collection Bay</em>.
                </li>
              </ul>
            </div>

            {/* Modul 3 */}
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <span className="text-xs font-mono text-amber-700 font-bold uppercase">
                Modul 3 — Indeks Kesehatan Metalurgi Sling IWRC SS304 (Metalurgi)
              </span>
              <div className="p-3.5 rounded-lg bg-white border border-gray-200 font-mono text-xs text-amber-800 font-semibold overflow-x-auto">
                T_aktual(t) = T_nominal · [1 - k_degradasi(DO, H₂S) · t] &nbsp;|&nbsp; SF = T_aktual / T_normal
              </div>
              <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Mitigasi Crevice Corrosion &amp; Fatigue:</strong> Mengatasi degradasi akibat air ber-DO rendah (<code className="font-semibold">2 mg/L</code>) dan <code className="font-semibold">H₂S (0,005 mg/L)</code> pada sela kawat baja tahan karat austenitik SS304.
                </li>
                <li>
                  <strong>Komparasi Safety Factor (SF):</strong> Tanpa proteksi <code className="text-rose-600 font-semibold">SF &lt; 1,0</code> saat banjir (putus); dengan <strong>Anoda Korban (Zn-Al) + Selubung Polimer HDPE/PU</strong> nilai <code className="text-emerald-700 font-bold">SF ≥ 1,68 (Aman)</code>.
                </li>
              </ul>
            </div>

            {/* Modul 4 */}
            <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <span className="text-xs font-mono text-emerald-800 font-bold uppercase">
                Modul 4 — Valuasi Sirkularitas Pakan KJA, Kualitas Air &amp; Ekonomi
              </span>
              <div className="p-3.5 rounded-lg bg-white border border-gray-200 font-mono text-xs text-emerald-900 font-semibold overflow-x-auto">
                P_pelet = 3,0 Ton/ha · H(t) &nbsp;|&nbsp; Avoided Loss = Rp17.074.290,072 /jam/unit
              </div>
              <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
                <li>
                  <strong>Substitusi Pakan 100.000 KJA:</strong> Panen 16 ha/hari di <em>Collection Bay</em> menghasilkan <code className="text-emerald-700 font-bold">48 Ton/hari</code> bahan baku pelet ikan fermentasi.
                </li>
                <li>
                  <strong>Pemulihan Mutu Air PP 22/2021 Kelas IV:</strong> Menyerap nutrien (<code className="font-semibold">Total N 1 mg/L &amp; Total P 0,24 mg/L</code>) dan memulihkan <code className="text-emerald-700 font-bold">DO &gt; 2,0 mg/L (2,65 mg/L)</code>.
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <p className="text-xs text-gray-500">
              Seluruh parameter ke-4 modul di atas dapat disimulasikan secara real-time pada halaman Simulator DSS.
            </p>
            <Link
              href="/simulation"
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0"
            >
              Buka Simulator CIRATA-SENSE™ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
