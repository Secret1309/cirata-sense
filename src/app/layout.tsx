import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "CIRATA-SENSE v2.6 DSS | HYDRA-CIRATA Integrated Decision Support System - EUREKA! ITB 2026",
  description:
    "Decision Support System (DSS) untuk PLTA Cirata Operational Resilience: Dekomposisi Vektor Gaya Hidrodinamika Trash Boom (θ = 35°), Proteksi Metalurgi Sling IWRC SS304, Optimasi Kuota Panen Oseanografi, & Sirkularitas Pakan 100.000 KJA - Tim Physics for Spirit | EUREKA! ITB 2026 (PT PLN Nusantara Power)",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/assets/logo_cirata_sense.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/assets/logo_cirata_sense.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-gray-50 text-gray-900 antialiased selection:bg-emerald-600 selection:text-white`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
