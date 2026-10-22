"use client";

import React from 'react';
import { Header } from '@/components/layout/Header';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TeamMember {
  name: string;
  role: string;
  major: string;
  faculty: string;
  university: string;
  bio: string;
  image: string;
  badge: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Muhammad Ilham Saripul Milah',
    role: 'Ketua Tim / Lead Metallurgical & Mechanical Systems Engineer',
    major: 'Teknik Metalurgi',
    faculty: 'Fakultas Teknik Pertambangan dan Perminyakan (FTTM) ITB',
    university: 'Institut Teknologi Bandung',
    bio: 'Bertanggung jawab atas analisis degradasi kekuatan tarik sling IWRC SS304 Ø20 mm (577 kN) akibat crevice corrosion dan corrosion fatigue pada perairan ber-DO rendah (2 mg/L) & H₂S (0,005 mg/L), perancangan proteksi katodik Anoda Korban (Zn-Al) + Selubung Polimer HDPE/PU, serta dekomposisi vektor gaya trash boom HYDRA-CIRATA.',
    image: '/assets/pp_ilham_team.jpg',
    badge: 'IWRC SS304 Metallurgy & Boom Mechanics',
  },
  {
    name: 'Shizuka Maula Everlin',
    role: 'Anggota Tim / Applied Physics & Hydrodynamic Damping Specialist',
    major: 'Pendidikan Fisika',
    faculty: 'Fakultas Pendidikan Matematika dan Ilmu Pengetahuan Alam (FPMIPA) UPI',
    university: 'Universitas Pendidikan Indonesia',
    bio: 'Bertanggung jawab atas pemodelan mekanika interaksi fluida-struktur (Fluid-Structure Interaction) pada bentangan trash boom 1,4 km bersudut defleksi θ = 35°, rekayasa konstanta redaman kejut viscoelastic damper (η = 0,88) guna mereduksi beban tarik normal sling hingga >42% (≈ 330 kN < 577 kN), kalibrasi telemetri sensor load cell pada sistem peringatan dini CIRATA-SENSE, serta analisis kesetimbangan oksigen terlarut (DO > 2 mg/L) sesuai Baku Mutu Kelas IV PP No. 22 Tahun 2021.',
    image: '/assets/pp_shizuka_team.jpg',
    badge: 'Fluid-Structure Mechanics & Sensor Instrumentation',
  },
  {
    name: 'Dzaky Zahy Rabbani',
    role: 'Anggota Tim / Oceanographic Modeler & Full-Stack DSS Architect',
    major: 'Oseanografi',
    faculty: 'Fakultas Ilmu dan Teknologi Kebumian (FITB) ITB',
    university: 'Institut Teknologi Bandung',
    bio: 'Bertanggung jawab atas pemodelan dinamika spasio-temporal pertumbuhan eceng gondok (A₀ = 430 ha, r = 0,03/hari) dan transpor arus-angin permukaan (v_drift) pada skenario debit historis Waduk Cirata (72,18–243,27 m³/s), valuasi sirkularitas pelet 100.000 petak KJA, serta arsitektur komputasi CIRATA-SENSE v2.6 DSS.',
    image: '/assets/pp_dzaky.jpg',
    badge: 'Hydrodynamic Drift & Circular KJA DSS',
  },
];

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12 space-y-12">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
        </Link>

        {/* Competition & Institution Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-700">
            EUREKA! ITB 2026 | INDUSTRIAL CASE COMPETITION • PT PLN NUSANTARA POWER
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Profil <span className="text-emerald-700">TIM PHYSICS FOR SPIRIT</span>
          </h1>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Sinergi lintas disiplin ilmu antara <strong>Rekayasa Korosi Metalurgi (FTTM ITB)</strong>, <strong>Fisika Terapan &amp; Mekanika Redaman Hidrodinamika (FPMIPA UPI)</strong>, serta <strong>Pemodelan Oseanografi &amp; Sistem Komputasi Sirkular (FITB ITB)</strong> untuk menjawab tantangan ketahanan operasional PLTA Cirata pada <strong>Industrial Case Competition Eureka! ITB 2026</strong>.
          </p>
        </div>

        {/* Core Student Team Cards (3 Members - Shizuka in Center) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-72 w-full bg-white overflow-hidden border-b border-gray-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-4 right-4 max-w-[88%] px-3 py-1 rounded-full bg-white/95 border border-gray-200 text-[11px] font-mono font-semibold text-emerald-800 shadow-sm truncate">
                  {member.badge}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                    {member.role}
                  </span>
                  <h3 className="text-xl font-extrabold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-xs font-semibold text-amber-700 mb-3">
                    {member.major} • {member.faculty}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>{member.university}</span>
                  <span className="font-mono font-bold text-emerald-700">PHYSICS FOR SPIRIT</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
