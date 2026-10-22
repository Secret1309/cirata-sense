"use client";

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:h-24 sm:px-6 lg:h-28 lg:px-8">
        {/* Left: Prominent Logos (Responsive on Mobile, 2-3x Larger on Desktop) + Brand Title with TM */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-5 lg:gap-8">
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-4 lg:gap-5">
            <img
              src="/assets/Logo_ITB.png"
              alt="Logo ITB"
              className="h-7 w-auto object-contain sm:h-13 lg:h-16"
            />
            <div className="h-6 w-[1px] bg-gray-300 sm:h-11" />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs font-black tracking-wider text-emerald-800 uppercase">
                EUREKA! ITB 2026
              </span>
              <span className="text-[9px] sm:text-[11px] font-semibold text-teal-700">
                PLN Nusantara Power • ICC
              </span>
            </div>
          </div>

          <div className="h-7 w-[1.5px] bg-gray-200 sm:h-10 sm:w-[2px]" />

          <Link href="/" className="group min-w-0 shrink-0">
            <h1
              className="whitespace-nowrap bg-clip-text text-lg font-black tracking-tight text-transparent transition-opacity group-hover:opacity-90 sm:text-3xl lg:text-5xl"
              style={{
                backgroundImage: 'linear-gradient(to right, #0f172a, #15803d, #0d9488)',
              }}
            >
              CIRATA-SENSE<sup className="ml-0.5 text-[10px] sm:text-lg lg:text-2xl font-extrabold align-super text-teal-700">™</sup>
            </h1>
          </Link>
        </div>

        {/* Right: Simple Hamburger Menu Only */}
        <div className="relative flex shrink-0 items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu Navigasi"
            className="rounded-xl border border-gray-200 bg-white p-2 sm:p-2.5 text-gray-700 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
          >
            {isMenuOpen ? <X className="h-6 w-6 sm:h-7 sm:w-7" /> : <Menu className="h-6 w-6 sm:h-7 sm:w-7" />}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-gray-200 bg-white py-2 shadow-xl">
              <Link
                href="/"
                className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/simulation"
                className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Simulasi DSS
              </Link>
              <Link
                href="/empowerment"
                className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Kalkulator Pakan KJA
              </Link>
              <Link
                href="/about"
                className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Metodologi 4 Modul
              </Link>
              <Link
                href="/documentation"
                className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Dokumentasi Case
              </Link>
              <Link
                href="/team"
                className="block px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Tim Pengembang
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
