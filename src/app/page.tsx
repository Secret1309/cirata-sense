"use client";

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header />

      {/* HERO SECTION:
          Layer 1 (z-0): Plant Background Image + White Right-Side Fade
          Layer 2 (z-10): Animated Colorful Snaking Ribbons (Right Text Area + Left/Upper Plant Area)
          Layer 3 (z-20): Invisible Compartment Aligned Top-Right on Laptop (2-Line Title & 5-Line Description) + Dedicated Centered Mobile Layout
      */}
      <section className="relative isolate w-full min-h-0 lg:min-h-[85vh] flex items-start justify-center lg:justify-end overflow-hidden bg-white border-b border-gray-200">
        {/* LAYER 1 (BOTTOM): Crisp High-Res Waduk Cirata Map Background */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-[position:18%_center] lg:bg-left bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/hero_waduk_cirata_map.png')",
          }}
        />
        {/* Smooth Editorial Gradient Overlay (Keeps Waduk Cirata on Left Clear & Visible, Fades Smoothly on Right for Text) */}
        <div className="absolute inset-0 z-0 bg-white/50 sm:bg-white/42 lg:bg-transparent lg:bg-[linear-gradient(to_right,rgba(255,255,255,0)_0%,rgba(255,255,255,0.02)_46%,rgba(255,255,255,0.78)_68%,rgba(255,255,255,0.95)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-16 z-0 bg-gradient-to-t from-white to-transparent" />

        {/* LAYER 2 (MIDDLE): Full-Canvas Snaking Ribbons */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 w-full h-full overflow-hidden"
        >
          <svg
            viewBox="0 0 1600 900"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full object-cover opacity-55 lg:opacity-100"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Gradient 1: Royal Blue -> Gold -> Teal -> Deep Emerald */}
              <linearGradient id="gcRibbonGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1d4ed8">
                  <animate
                    attributeName="stop-color"
                    values="#1d4ed8;#047857;#eab308;#1d4ed8"
                    dur="7s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="35%" stopColor="#eab308">
                  <animate
                    attributeName="stop-color"
                    values="#eab308;#1d4ed8;#0d9488;#eab308"
                    dur="7s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="70%" stopColor="#0d9488">
                  <animate
                    attributeName="stop-color"
                    values="#0d9488;#eab308;#1d4ed8;#0d9488"
                    dur="7s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#047857">
                  <animate
                    attributeName="stop-color"
                    values="#047857;#0d9488;#047857;#047857"
                    dur="7s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>

              {/* Gradient 2: Deep Emerald -> Gold -> Royal Blue -> Teal */}
              <linearGradient id="gcRibbonGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#047857">
                  <animate
                    attributeName="stop-color"
                    values="#047857;#2563eb;#d97706;#047857"
                    dur="9s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="45%" stopColor="#f59e0b">
                  <animate
                    attributeName="stop-color"
                    values="#f59e0b;#0d9488;#1d4ed8;#f59e0b"
                    dur="9s"
                    repeatCount="indefinite"
                  />
                </stop>
                <stop offset="100%" stopColor="#1d4ed8">
                  <animate
                    attributeName="stop-color"
                    values="#1d4ed8;#eab308;#047857;#1d4ed8"
                    dur="9s"
                    repeatCount="indefinite"
                  />
                </stop>
              </linearGradient>
            </defs>

            {/* Subtle Full Track Guide 1 */}
            <path
              d="M -80 180 C 220 -30, 480 340, 820 170 C 1140 10, 1010 520, 1340 470 C 1560 440, 1410 770, 1680 860"
              stroke="url(#gcRibbonGrad1)"
              strokeWidth="68"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.14"
            />

            {/* Subtle Full Track Guide 2 */}
            <path
              d="M 1520 -60 C 1220 120, 1520 350, 1140 430 C 780 510, 620 250, 310 470 C 110 610, 220 820, -80 870"
              stroke="url(#gcRibbonGrad2)"
              strokeWidth="62"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.14"
            />

            {/* Animated Ribbon 1 */}
            <path
              d="M -80 180 C 220 -30, 480 340, 820 170 C 1140 10, 1010 520, 1340 470 C 1560 440, 1410 770, 1680 860"
              stroke="url(#gcRibbonGrad1)"
              strokeWidth="68"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="gc-snake-ribbon-main"
            />

            {/* Animated Ribbon 2 */}
            <path
              d="M 1520 -60 C 1220 120, 1520 350, 1140 430 C 780 510, 620 250, 310 470 C 110 610, 220 820, -80 870"
              stroke="url(#gcRibbonGrad2)"
              strokeWidth="62"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="gc-snake-ribbon-cross"
            />
          </svg>
        </div>

        {/* LAYER 3 (TOP): Centered Responsive Mobile Layout (< lg) | Top-Right Invisible Compartment on Laptop (lg:) */}
        <div className="relative z-20 w-full max-w-[1480px] mx-auto px-4 sm:px-8 lg:px-14 pt-7 pb-10 sm:pt-9 sm:pb-12 lg:pt-10 lg:pb-16 flex flex-col items-center text-center lg:items-end lg:text-right">
          {/* Invisible bounding wrapper */}
          <div className="w-full max-w-xl lg:max-w-[780px] flex flex-col items-center lg:items-end space-y-4">
            {/* Competition Pill Badge */}
            <span className="inline-block max-w-full rounded-full bg-emerald-50/95 border border-emerald-300 px-3.5 py-1.5 sm:px-4 text-[10px] sm:text-xs lg:text-sm font-bold text-emerald-900 tracking-wide shadow-2xs">
              EUREKA! ITB 2026 | INDUSTRIAL CASE COMPETITION • PLN NUSANTARA POWER
            </span>

            {/* Title: Strictly 2 Lines on Laptop, Balanced Responsive Wrapping on Mobile */}
            <h2
              className="text-[28px] sm:text-4xl lg:text-[44px] xl:text-[48px] font-black tracking-tight text-gray-900 leading-[1.14] lg:leading-[1.12]"
              style={{
                paintOrder: 'stroke fill',
                WebkitTextStroke: '1.1px #000000',
                textShadow: '0 2px 12px rgba(255, 255, 255, 0.9)',
              }}
            >
              <span className="block lg:whitespace-nowrap">
                CIRATA-SENSE &amp;{' '}
                <span
                  className="text-emerald-600"
                  style={{
                    paintOrder: 'stroke fill',
                    WebkitTextStroke: '1.3px #000000',
                  }}
                >
                  HYDRA-CIRATA
                </span>
              </span>
              <span className="block lg:whitespace-nowrap">
                Decision Support System
              </span>
            </h2>

            {/* Description: Strictly 5 Lines on Laptop */}
            <p
              className="text-sm sm:text-base lg:text-[18.5px] xl:text-[19.5px] text-gray-800 font-semibold leading-relaxed max-w-md sm:max-w-lg lg:max-w-[640px]"
              style={{
                paintOrder: 'stroke fill',
                WebkitTextStroke: '0.55px #000000',
                textShadow: '0 1px 10px rgba(255, 255, 255, 0.92)',
              }}
            >
              <span className="lg:block lg:whitespace-nowrap">
                Platform ketahanan operasional PLTA Cirata (6.200 ha) berbasis
              </span>{' '}
              <span className="lg:block lg:whitespace-nowrap">
                <strong className="text-gray-950 font-extrabold">Dekomposisi Vektor Gaya Hidrodinamika (θ = 35°)</strong> dan
              </span>{' '}
              <span className="lg:block lg:whitespace-nowrap">
                <strong className="text-gray-950 font-extrabold">Proteksi Metalurgi Sling IWRC SS304</strong> untuk mereduksi beban
              </span>{' '}
              <span className="lg:block lg:whitespace-nowrap">
                tarik <strong className="text-emerald-600 font-extrabold" style={{ paintOrder: 'stroke fill', WebkitTextStroke: '0.75px #000000' }}>&gt;42% (SF ≥ 1,68)</strong>, menggiring eceng gondok{' '}
                <strong
                  className="text-emerald-600 font-extrabold"
                  style={{
                    paintOrder: 'stroke fill',
                    WebkitTextStroke: '0.75px #000000',
                  }}
                >
                  81,9% Pasif
                </strong>
                ,
              </span>{' '}
              <span className="lg:block lg:whitespace-nowrap">
                serta mengonversi panen{' '}
                <strong
                  className="text-emerald-600 font-extrabold"
                  style={{
                    paintOrder: 'stroke fill',
                    WebkitTextStroke: '0.75px #000000',
                  }}
                >
                  16,0 ha/hari
                </strong>{' '}
                menjadi pakan{' '}
                <strong
                  className="text-amber-500 font-extrabold"
                  style={{
                    paintOrder: 'stroke fill',
                    WebkitTextStroke: '0.75px #000000',
                  }}
                >
                  100.000 KJA
                </strong>
                .
              </span>
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="relative z-30 w-full max-w-md sm:max-w-xl pt-2 flex flex-col items-center lg:items-end gap-3">
              <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/simulation"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 py-3.5 sm:py-4 px-5 text-base font-bold text-white shadow-md transition-all"
                >
                  Mulai Simulasi DSS
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/empowerment"
                  className="flex w-full items-center justify-center rounded-xl border-2 border-emerald-700 bg-white/95 hover:bg-emerald-50 py-3.5 sm:py-4 px-5 text-base font-bold text-emerald-800 shadow-sm transition-all"
                >
                  Kalkulator Pakan KJA
                </Link>
              </div>

              <div className="grid w-full grid-cols-3 gap-2.5">
                <Link
                  href="/about"
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white/95 hover:bg-gray-100 py-2.5 px-3 text-xs sm:text-sm font-semibold text-gray-800 transition-colors"
                >
                  Metodologi
                </Link>
                <Link
                  href="/documentation"
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white/95 hover:bg-gray-100 py-2.5 px-3 text-xs sm:text-sm font-semibold text-gray-800 transition-colors"
                >
                  Dokumentasi
                </Link>
                <Link
                  href="/team"
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-white/95 hover:bg-gray-100 py-2.5 px-3 text-xs sm:text-sm font-semibold text-gray-800 transition-colors"
                >
                  Pengembang
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16 space-y-16">
        {/* Benchmark KPI Strip (4 Modul Perhitungan Terintegrasi CIRATA-SENSE) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
              Tegangan Tarik Sling (IWRC SS304)
            </span>
            <div className="text-3xl font-extrabold font-mono text-gray-900">
              313–330 <span className="text-sm font-normal text-gray-500">kN (SF ≥ 1,68)</span>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              Reduksi &gt;42% vs Frontal 620 kN • Batas Aktual 555 kN (Nominal 577 kN)
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-2">
              Efisiensi Defleksi ke Collection Bay
            </span>
            <div className="text-3xl font-extrabold font-mono text-gray-900">
              81,9% <span className="text-sm font-normal text-gray-500">(θ = 35°)</span>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              Gaya Tangensial (F_T = F_D cos 35°) Menggiring Gulma sepanjang 1,4 km
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block mb-2">
              Neraca Laju Tutupan Eceng Gondok
            </span>
            <div className="text-3xl font-extrabold font-mono text-gray-900">
              -3,1 <span className="text-sm font-normal text-gray-500">ha/hari</span>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              Panen DSS 16,0 ha/hr vs Tumbuh Alami +12,90 ha/hr (A₀ = 430 ha)
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block mb-2">
              Proteksi Downtime &amp; Sirkular KJA
            </span>
            <div className="text-3xl font-extrabold font-mono text-gray-900">
              Rp409,8 <span className="text-sm font-normal text-gray-500">Jt/hr/unit</span>
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              Rp17.074.290,072/jam/unit + 48 Ton Pakan Pelet/hr (100.000 KJA)
            </p>
          </div>
        </section>

        {/* Visual Architecture Showcase */}
        <section className="space-y-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 block mb-1">
              Arsitektur Rekayasa Fisika, Metalurgi, Oseanografi &amp; Digital Twin
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Ekosistem Ketahanan Terpadu HYDRA-CIRATA &amp; CIRATA-SENSE DSS
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-700 font-bold">ARSITEKTUR INFRASTRUKTUR HYDRA-CIRATA</span>
                  <h4 className="text-base font-bold text-gray-900">Deflection Boom 1,4 km (θ = 35°) + Sling IWRC SS304 + Damper</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  SF ≥ 1,68 Validated
                </span>
              </div>
              <div className="p-4 flex-1 flex items-center justify-center bg-white">
                <img
                  src="/assets/fig_hydra_architecture.svg"
                  alt="Arsitektur Infrastruktur HYDRA-CIRATA dan CIRATA-SENSE DSS"
                  className="w-full h-auto rounded-lg object-contain border border-gray-200 bg-white"
                />
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm flex flex-col">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <div>
                  <span className="text-xs font-mono text-amber-700 font-bold">MEKANISME SIRKULARITAS WADUK CIRATA</span>
                  <h4 className="text-base font-bold text-gray-900">Penggiringan Pasif, Collection Bay &amp; Pelet Fermentasi 100.000 KJA</h4>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  PP 22/2021 Kelas IV
                </span>
              </div>
              <div className="p-4 flex-1 flex items-center justify-center bg-white">
                <img
                  src="/assets/fig_cirata_circularity.svg"
                  alt="Mekanisme Integrasi 4 Modul CIRATA-SENSE"
                  className="w-full h-auto rounded-lg object-contain border border-gray-200 bg-white"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars Grid (Exact 4 Integrated Modules from User Prompt) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 block mb-2">MODUL 01 • OSEANOGRAFI</span>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Dinamika Spasio-Temporal &amp; Kuota Panen</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Menggunakan model pertumbuhan logistik-ekstraksi harian (<span className="text-emerald-700 font-mono font-semibold">dA/dt = r·A(t) - H(t)</span>) dengan luas awal <span className="text-gray-900 font-mono font-semibold">A₀ = 430 ha</span> dan <span className="text-gray-900 font-mono font-semibold">r = 0,03/hari (+12,90 ha/hari)</span>. Mengalkulasi kuota panen berdasarkan kecepatan drift permukaan (<span className="text-emerald-700 font-mono font-semibold">v_drift = 0,85v_inflow + 0,03v_wind</span>).
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 text-xs text-emerald-700 font-mono font-semibold">
              Target Panen: H ≥ 15,0–16,0 ha/hari
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-teal-700 block mb-2">MODUL 02 • FISIKA</span>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Dekomposisi Vektor Gaya Trash Boom</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Pada bentangan PE-PU <span className="text-teal-700 font-mono font-semibold">1,4 km</span> saat High-Flow (<span className="text-gray-900 font-mono font-semibold">243,27 m³/s</span>), orientasi frontal 90° memicu beban <span className="text-rose-600 font-mono font-semibold">~620 kN (&gt;577 kN)</span>. Sudut miring <span className="text-teal-700 font-mono font-semibold">θ = 35°</span> + damper (<span className="text-gray-900 font-mono font-semibold">η = 0,88</span>) memangkas tegangan ke <span className="text-emerald-700 font-mono font-semibold">313–330 kN</span> dan membelokkan <span className="text-teal-700 font-mono font-semibold">81,9%</span> arus ke tepi.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 text-xs text-teal-700 font-mono font-semibold">
              Reduksi Beban Tarik &gt; 42%
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-amber-700 block mb-2">MODUL 03 • METALURGI</span>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Indeks Kesehatan Sling IWRC SS304</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mengakomodasi degradasi kekuatan tarik aktual (<span className="text-amber-700 font-mono font-semibold">T_aktual</span>) sling Ø20 mm dari nominal <span className="text-gray-900 font-mono font-semibold">577 kN</span> akibat <em>crevice corrosion</em> &amp; <em>corrosion fatigue</em> pada <span className="text-gray-900 font-mono font-semibold">DO 2 mg/L</span> dan <span className="text-gray-900 font-mono font-semibold">H₂S 0,005 mg/L</span> melalui proteksi Anoda Korban (Zn-Al) + Selubung Polimer HDPE/PU.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 text-xs text-amber-700 font-mono font-semibold">
              Safety Factor Terjaga: SF ≥ 1,68
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-800 block mb-2">MODUL 04 • SIRKULAR &amp; EKONOMI</span>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Valuasi Pakan KJA &amp; Baku Mutu Air</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Mengonversi biomassa di <em>Collection Bay</em> menjadi <span className="text-emerald-800 font-mono font-semibold">48 Ton/hari</span> bahan baku pelet ikan fermentasi untuk <span className="text-gray-900 font-mono font-semibold">100.000 petak KJA</span>, menyerap nutrien (<span className="text-gray-900 font-mono font-semibold">Total N 1 mg/L; P 0,24 mg/L</span>), memulihkan <span className="text-emerald-700 font-mono font-semibold">DO &gt;2,0 mg/L</span> (PP 22/2021 Kelas IV), dan mencegah kerugian downtime.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 text-xs text-emerald-800 font-mono font-semibold">
              Avoided Loss: Rp17,07 Jt/jam/unit
            </div>
          </div>
        </section>
      </main>

      {/* Clean White Footer */}
      <footer className="py-8 px-6 text-gray-600 text-xs border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <img src="/assets/Logo_ITB.png" alt="ITB" className="h-8 w-auto object-contain" />
            <img src="/assets/Logo_UPI.png" alt="UPI" className="h-8 w-auto object-contain" />
            <img src="/assets/logo_eureka_itb_2026.svg" alt="Eureka! ITB 2026" className="h-8 w-auto object-contain" />
            <img src="/assets/logo_pln_np.svg" alt="PLN Nusantara Power" className="h-8 w-auto object-contain" />
            <span className="font-bold text-gray-800">
              TIM PHYSICS FOR SPIRIT - ITB &amp; UPI
            </span>
          </div>
          <p className="text-gray-500">
            &copy; 2026 CIRATA-SENSE v2.6 Decision Support System • EUREKA! ITB 2026 Industrial Case Competition (PT PLN Nusantara Power).
          </p>
        </div>
      </footer>
    </div>
  );
}
