"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DocumentationPage() {
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

        {/* Page Header */}
        <div className="space-y-4 border-b border-gray-200 pb-8">
          <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            Dokumentasi Data Pendukung Resmi • EUREKA! ITB 2026
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Basis Data &amp; Arsitektur <span className="text-emerald-700">CIRATA-SENSE™ v2.6</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-4xl">
            Dokumentasi lengkap parameter infrastruktur eksisting PLTA Cirata, kondisi hidrologi historis (Agustus 2025–Juli 2026), serta tabel pengujian kualitas air Waduk Cirata sesuai Lampiran VI PP No. 22 Tahun 2021 Kelas IV.
          </p>
        </div>

        {/* Section 1: 4 Mesin Komputasi CIRATA-SENSE */}
        <section className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              1. Arsitektur 4 Modul Perhitungan Terintegrasi CIRATA-SENSE™ DSS
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Sinergi pemodelan oseanografi, mekanika fluida, rekayasa korosi metalurgi, dan ekonomi sirkular KJA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
              <span className="text-emerald-700 font-mono font-bold">MODUL 01: Spatio-Temporal &amp; Harvest Quota (Oseanografi)</span>
              <p className="text-gray-600">
                Memodelkan neraca pertumbuhan harian eceng gondok (<code className="text-emerald-700 font-semibold">dA/dt = r·A(t) - H(t)</code>) dari baseline <code className="text-gray-900 font-semibold">430 ha</code> (<code className="text-gray-900 font-semibold">+12,90 ha/hari</code>) serta menentukan kuota dispatch ekskavator di <em>Collection Bay</em> (<code className="text-emerald-700 font-semibold">H ≥ 15,0–16,0 ha/hari</code>).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
              <span className="text-teal-700 font-mono font-bold">MODUL 02: Hydrodynamic Force Decomposition (Fisika)</span>
              <p className="text-gray-600">
                Menghitung dekomposisi gaya hambat pada trash boom <code className="text-teal-700 font-semibold">1,4 km (PE-PU)</code> untuk debit Low (<code className="font-semibold">72,18 m³/s</code>), Moderate (<code className="font-semibold">150,80 m³/s</code>), dan High (<code className="font-semibold">243,27 m³/s</code>). Sudut <code className="text-teal-700 font-semibold">θ = 35°</code> + damper (<code className="font-semibold">η = 0,88</code>) mereduksi beban ke <code className="text-gray-900 font-semibold">313–330 kN (&gt;42%)</code>.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
              <span className="text-amber-700 font-mono font-bold">MODUL 03: IWRC SS304 Sling Metallurgical Health (Metalurgi)</span>
              <p className="text-gray-600">
                Mengukur penurunan kekuatan tarik aktual sling Ø20 mm dari nominal <code className="text-amber-700 font-semibold">577 kN</code> akibat <em>crevice corrosion</em> &amp; <em>corrosion fatigue</em> pada <code className="font-semibold">DO 2 mg/L</code> dan <code className="font-semibold">H₂S 0,005 mg/L</code>, menjaga <code className="text-gray-900 font-semibold">SF ≥ 1,68</code> dengan Anoda Korban Zn-Al + Selubung HDPE/PU.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
              <span className="text-emerald-800 font-mono font-bold">MODUL 04: KJA Feed Circularity &amp; Avoided Downtime (Ekonomi)</span>
              <p className="text-gray-600">
                Mengonversi biomassa terpanen menjadi <code className="text-emerald-800 font-semibold">48 Ton/hari</code> pelet ikan fermentasi untuk <code className="text-gray-900 font-semibold">100.000 petak KJA</code>, menyerap Total N (<code className="font-semibold">1 mg/L</code>) &amp; Total P (<code className="font-semibold">0,24 mg/L</code>), serta mengamankan PLTA dari kerugian downtime <code className="text-gray-900 font-semibold">Rp17.074.290,072/jam/unit</code>.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Tabel Supporting Data Resmi dari Case Document */}
        <section className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              2. Operational, Ecological &amp; Hydrological Baseline (Industrial Case PDF)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Seluruh parameter dalam simulasi CIRATA-SENSE™ mengacu 100% pada dokumen resmi kompetisi
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase text-emerald-800">
                <tr>
                  <th className="px-4 py-2.5">Kategori</th>
                  <th className="px-4 py-2.5">Parameter</th>
                  <th className="px-4 py-2.5">Nilai Resmi Case</th>
                  <th className="px-4 py-2.5">Satuan / Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-900">Operational Baseline</td>
                  <td className="px-4 py-2">Kerugian akibat downtime</td>
                  <td className="px-4 py-2 font-mono font-bold text-rose-600">Rp17.074.290,072</td>
                  <td className="px-4 py-2 font-mono">Rp/jam/unit (Rp409,78 Jt/hari/unit)</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-900">Infrastructure Baseline</td>
                  <td className="px-4 py-2">Panjang &amp; Material existing trash boom</td>
                  <td className="px-4 py-2 font-mono font-bold text-gray-900">1,4 km (PE filled with PU)</td>
                  <td className="px-4 py-2">Polyethylene filled with Polyurethane</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-900">Metallurgical Baseline</td>
                  <td className="px-4 py-2">Material, Diameter &amp; Tensile Strength Sling</td>
                  <td className="px-4 py-2 font-mono font-bold text-teal-700">IWRC SS304 • Ø20 mm • 577 kN</td>
                  <td className="px-4 py-2">Metode eksisting: Excavator-based removal</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-900">Ecological Baseline</td>
                  <td className="px-4 py-2">Luas Waduk, Tutupan Gulma, Growth Rate &amp; KJA</td>
                  <td className="px-4 py-2 font-mono font-bold text-emerald-700">6.200 ha • 430 ha • 0,03/hari • 100.000 KJA</td>
                  <td className="px-4 py-2">Pertambahan alami: +12,90 ha/hari</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-semibold text-gray-900">Hydrological (Ags 25–Jul 26)</td>
                  <td className="px-4 py-2">Low / Moderate / High-flow Total Inflow</td>
                  <td className="px-4 py-2 font-mono font-bold text-amber-700">72,18 / 150,80 / 243,27 m³/s</td>
                  <td className="px-4 py-2">0–33rd / 33rd–66th / 66th–100th percentile</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Tabel Lengkap Kualitas Air (Additional Supporting Data PDF) */}
        <section className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              3. Baseline Kualitas Air Waduk Cirata (Lampiran VI PP No. 22 Tahun 2021 Kelas IV)
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Data hasil pengujian laboratorium resmi (Additional Supporting Data - ICC.pdf)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="border-b border-gray-200 bg-gray-50 text-[11px] uppercase text-emerald-800">
                <tr>
                  <th className="px-3 py-2">Parameter</th>
                  <th className="px-3 py-2">Baku Mutu Kelas IV</th>
                  <th className="px-3 py-2">Hasil Pengujian</th>
                  <th className="px-3 py-2">Metode Uji</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                <tr><td className="px-3 py-1.5 font-sans font-semibold">Suhu</td><td>deviasi 3</td><td>29 °C</td><td>SM 24th Ed. 2550.B, 2023</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold">Padatan Terlarut Total (TDS)</td><td>2.000 mg/L</td><td>152 mg/L</td><td>IKM / LAB / 48 (Potensiometri)</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold">Padatan Tersuspensi Total (TSS)</td><td>400 mg/L</td><td>6 mg/L</td><td>SM 24th Ed. 2540.D, 2023</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold">Warna</td><td>-</td><td>3 Pt-Co</td><td>SNI 6989.80-2011</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold">pH</td><td>6–9</td><td>7,1</td><td>SNI 06-6989.11-2004</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold">BOD &amp; COD</td><td>12 &amp; 80 mg/L</td><td>5 &amp; 10 mg/L</td><td>IKM/LAB/37 &amp; SNI 6989.2-2019</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold text-emerald-800">Oksigen Terlarut (DO)</td><td>&gt; 1 mg/L</td><td className="font-bold text-emerald-700">2 mg/L</td><td>SM 24th Ed. 4500-OH, 2023</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold">Sulfat (SO₄²⁻) &amp; Klorida (Cl⁻)</td><td>400 &amp; 600 mg/L</td><td>29 &amp; 11 mg/L</td><td>SNI 6989.20-2019 &amp; 06-6989.19</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold text-amber-800">Nitrat, Nitrit, Amoniak, Total N</td><td>NO₃-N ≤ 20</td><td className="font-bold text-amber-700">0,4 | 0,05 | 0,4 | Total N = 1</td><td>SM 24th Ed. 4500, 2023</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold text-amber-800">Total Fosfat (P) &amp; Fluorida (F⁻)</td><td>-</td><td className="font-bold text-amber-700">P = 0,24 | F⁻ = 0,3 mg/L</td><td>SM 24th Ed. 4500-P.E, 2023</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold text-rose-700">Sulfida (H₂S) &amp; Sianida (CN⁻)</td><td>-</td><td className="font-bold text-rose-600">H₂S = 0,005 | CN⁻ &lt; 0,005</td><td>SM 24th Ed. 4500-S²⁻.D, 2023</td></tr>
                <tr><td className="px-3 py-1.5 font-sans font-semibold">Logam Terlarut (Ba, B, Hg, As, Se, Fe)</td><td>Hg 0,005 | As 0,1</td><td>Hg &lt;0,0007 | As &lt;0,0195 | Fe &lt;0,1</td><td>SM APHA 24th Ed. 3120 B, 2023</td></tr>
              </tbody>
            </table>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              href="/simulation"
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              Kembali ke Simulator CIRATA-SENSE™ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
