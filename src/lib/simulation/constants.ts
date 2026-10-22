// ============================================================
// CIRATA-SENSE™ v2.6 DSS - Simulation Constants & Scientific Database
// EUREKA! ITB 2026: Industrial Case Competition (Collaborating with PT PLN Nusantara Power)
// Subtema: "Engineering Resilience: Optimalisasi Infrastruktur Pendukung untuk Efisiensi Sistem Industri Berkelanjutan"
// TIM PHYSICS FOR SPIRIT - ITB & UPI
// 1. Muhammad Ilham Saripul Milah (Ketua Tim | Teknik Metalurgi - FTTM ITB)
// 2. Shizuka Maula Everlin (Anggota Tim | Pendidikan Fisika - FPMIPA UPI)
// 3. Dzaky Zahy Rabbani (Anggota Tim | Oseanografi - FITB ITB)
// ============================================================

export const POME_MODES = {
  STANDARD_DIET: "HYDRA-CIRATA Optimal (Defleksi θ = 35° + Proteksi Zn-Al & Viscoelastic Damper)",
  HIGH_SHOCK_POME: "Kondisi Eksisting Reaktif (Frontal θ = 90° Tanpa Proteksi Korosi Celah / Damper)",
} as const;

export type PomeMode = (typeof POME_MODES)[keyof typeof POME_MODES];

export interface PomeProfile {
  inflowDefault: number; // m³/s (High-flow 243.27, Moderate 150.80, Low 72.18)
  thetaDefault: number; // derajat (35° HYDRA-CIRATA vs 90° Eksisting)
  harvestDefault: number; // ha/hari (16.0 ha/hari vs 8.0 ha/hari reaktif)
  metalModeDefault: "hydra" | "existing";
  serviceMonthsDefault: number; // bulan operasi (default 18 bulan)
  qualityGrade: "optimal" | "shock-resilient";
  productName: string;
  chemicalProfile: string;
  biocharCatalysisImpact: string;
}

export const DEFAULT_POME_PROFILES: Record<PomeMode, PomeProfile> = {
  [POME_MODES.STANDARD_DIET]: {
    inflowDefault: 243.27,
    thetaDefault: 35,
    harvestDefault: 16.0,
    metalModeDefault: "hydra",
    serviceMonthsDefault: 18,
    qualityGrade: "optimal",
    productName: "Resiliensi Hidrodinamika Boom (SF ≥ 1,68) & Pelet Pakan Sirkular 100.000 KJA",
    chemicalProfile:
      "Waduk Cirata (luas 6.200 ha) mengalami tutupan eceng gondok 430 ha dengan laju tumbuh eksponensial r = 0,03/hari (+12,90 ha/hari) akibat eutrofikasi limbah 100.000 petak KJA (Total N 1,0 mg/L; Total P 0,24 mg/L). Kondisi perairan memiliki DO 2,0 mg/L dan Sulfida (H₂S) 0,005 mg/L yang memicu crevice corrosion & corrosion fatigue pada sling IWRC SS304 (Ø20 mm, batas nominal 577 kN).",
    biocharCatalysisImpact:
      "Orientasi miring HYDRA-CIRATA (θ = 35°) dengan Viscoelastic Damper (η = 0,88) mereduksi tegangan normal sling menjadi ~313–330 kN (reduksi >42%) saat High-Flow (243,27 m³/s) dan memanfaatkan 81,9% gaya tangensial arus untuk menggiring gulma secara pasif ke Collection Bay tepi. Proteksi katodik Anoda Korban Zn-Al + Selubung Polimer HDPE/PU menjaga kekuatan aktual 555 kN (SF = 1,76 → Aman).",
  },
  [POME_MODES.HIGH_SHOCK_POME]: {
    inflowDefault: 243.27,
    thetaDefault: 90,
    harvestDefault: 8.0,
    metalModeDefault: "existing",
    serviceMonthsDefault: 18,
    qualityGrade: "shock-resilient",
    productName: "Peringatan Kritis: Overload Tegangan Frontal (>620 kN) & Net Accumulation Gulma",
    chemicalProfile:
      "Pada konfigurasi penahan pasif eksisting (θ = 90° frontal sepanjang 1,4 km) saat puncak musim penghujan (High-Flow 243,27 m³/s), akumulasi biomassa raksasa menghasilkan beban tarik frontal ~620 kN yang melampaui kapasitas nominal sling IWRC SS304 (577 kN).",
    biocharCatalysisImpact:
      "Tanpa proteksi anoda korban dan selubung polimer, penetrasi air ber-DO rendah (2 mg/L) dan H₂S (0,005 mg/L) ke sela-sela kawat IWRC SS304 menurunkan kekuatan aktual ke 485 kN sehingga Safety Factor anjlok ke 0,78 (< 1,0 → Jebol), mengancam operasi turbin PLTA Cirata dengan kerugian downtime Rp17.074.290,072/jam/unit.",
  },
};

export const BIOTRAP_CONSTANTS = {
  // 1. Modul 1 — Dinamika Spasio-Temporal & Optimasi Kuota Panen (Oseanografi)
  RESERVOIR_AREA_HA: 6200, // Luas Waduk Cirata: 6.200 ha
  INITIAL_WEED_AREA_HA: 430, // Estimated aquatic weed coverage: 430 ha
  DAILY_GROWTH_RATE: 0.03, // Estimated daily growth rate: 0,03 /hari
  NATURAL_GROWTH_HA_PER_DAY: 12.9, // Pertambahan alami: 430 * 0,03 = 12,90 ha/hari
  MIN_TARGET_HARVEST_HA_DAY: 15.0, // H_target >= 15,0 ha/hari
  OPTIMAL_HARVEST_HA_DAY: 16.0, // Kuota panen optimal DSS: 16,0 ha/hari (-3,1 ha/hari net)
  REACTIVE_HARVEST_HA_DAY: 8.0, // Panen reaktif eksisting (~8,0 ha/hari -> +4,9 ha/hari net)

  // 2. Modul 2 — Dekomposisi Vektor Gaya Hidrodinamika Trash Boom (Fisika)
  FLOW_LOW_M3S: 72.18, // Low-flow (0-33rd percentile): 72,18 m³/s
  FLOW_MOD_M3S: 150.80, // Moderate-flow (33rd-66th percentile): 150,80 m³/s
  FLOW_HIGH_M3S: 243.27, // High-flow (66th-100th percentile): 243,27 m³/s
  BOOM_LENGTH_KM: 1.4, // Panjang existing trash boom: 1,4 km (1.400 m)
  BOOM_MATERIAL: "Polyethylene (PE) filled with Polyurethane (PU)",
  FRONTAL_LOAD_HIGH_FLOW_KN: 620.0, // Beban frontal θ=90° saat High-flow ≈ 620 kN (> 577 kN)
  HYDRA_DEFLECTION_DEG: 35, // Orientasi HYDRA-CIRATA θ = 35°
  DAMPER_EFFICIENCY_ETA: 0.88, // Viscoelastic damper η = 0,88
  TANGENTIAL_DEFLECTION_PCT: 81.9, // F_T = F_D cos 35° ≈ 81,9%

  // 3. Modul 3 — Indeks Kesehatan Metalurgi Sling IWRC SS304 (Metalurgi)
  SLING_MATERIAL: "IWRC SS304",
  SLING_DIAMETER_MM: 20, // Diameter sling: 20 mm
  SLING_NOMINAL_STRENGTH_KN: 577, // Tensile strength sling nominal: 577 kN
  SLING_PROTECTED_STRENGTH_KN: 555, // Aktual dengan Anoda Zn-Al + Selubung HDPE/PU (18 bln)
  SLING_UNPROTECTED_STRENGTH_KN: 485, // Aktual tanpa proteksi akibat Crevice Corrosion & Fatigue
  DEGRADATION_RATE_PROTECTED: 0.0021, // k_degradasi terproteksi per bulan
  DEGRADATION_RATE_UNPROTECTED: 0.00886, // k_degradasi tanpa proteksi per bulan

  // 4. Modul 4 — Valuasi Sirkularitas Pakan KJA, Kualitas Air & Ekonomi
  KJA_TOTAL_PLOTS: 100_000, // Jumlah KJA: 100.000 petak
  DOWNTIME_LOSS_PER_HOUR_UNIT_IDR: 17_074_290.072, // Rp17.074.290,072 /jam/unit
  AVOIDED_LOSS_DAILY_UNIT_IDR: 409_782_961.73, // 24 jam * Rp17.074.290,072 ≈ Rp409,8 Juta/hari/unit
  PELLET_CONVERSION_TON_PER_HA: 3.0, // 1 ha panen eceng gondok -> 3 ton pelet ikan fermentasi
  BASELINE_DO_MGL: 2.0, // Oksigen Terlarut (DO) baseline: 2 mg/L (Baku mutu Kelas IV > 1 mg/L)
  BASELINE_H2S_MGL: 0.005, // Sulfida (H₂S) baseline: 0,005 mg/L
  BASELINE_TOTAL_N_MGL: 1.0, // Total N baseline: 1 mg/L
  BASELINE_TOTAL_P_MGL: 0.24, // Total Fosfat (P) baseline: 0,24 mg/L
  BASELINE_PH: 7.1, // pH baseline: 7,1 (Baku mutu 6-9)
  BASELINE_TDS_MGL: 152, // TDS baseline: 152 mg/L (Baku mutu 2.000 mg/L)
  BASELINE_TSS_MGL: 6, // TSS baseline: 6 mg/L (Baku mutu 400 mg/L)
  BASELINE_BOD_MGL: 5, // BOD baseline: 5 mg/L (Baku mutu 12 mg/L)
  BASELINE_COD_MGL: 10, // COD baseline: 10 mg/L (Baku mutu 80 mg/L)
  BASELINE_TEMP_C: 29, // Suhu baseline: 29°C

  // Financial & Investment Constants for HYDRA-CIRATA Integration
  SKID_CAPEX_RAZOR_IDR: 420_000_000, // Rp420 Juta / paket Retrofitting Mooring, Damper & Anoda Zn-Al
  COLOCATION_HUB_CAPEX_IDR: 2_850_000_000, // Rp2,85 Miliar Total Initial CAPEX Collection Bay & Rumah Pelet KJA
  PELLET_PRICE_BLADE_PER_KG: 4_500, // Rp4.500/kg Pelet Fermentasi Eceng Gondok (Hemat 52% vs Pakan Komersial Rp9.500/kg)
  COAL_CARBON_PRICE_PER_KG: 9_500, // Harga pakan ikan apung komersial Rp9.500/kg
  BIOSULFUR_PRICE_PER_KG: 4_500, // Harga jual pakan sirkular KJA Rp4.500/kg
  B3_OPEX_SAVINGS_PER_PKS_YEAR: 2_450_000_000, // Penghematan OPEX alat berat ekskavator & pencegahan jebol per tahun
  PROTOTYPE_BUDGET_GDI_IDR: 17_000_000,
  WACC_DISCOUNT_RATE: 0.1,
  REF_NPV_SOM_IDR: 24_680_000_000, // Rp24,68 Miliar NPV
  REF_IRR_PCT: 41.5, // 41,5% IRR
  REF_PAYBACK_YEARS: 2.1, // 2,1 Tahun Payback
};

// Tabel Baseline Kualitas Air Waduk Cirata (PP No. 22 Tahun 2021 Kelas IV - Additional Supporting Data PDF)
export const POME_EQA_COMPARISON = [
  {
    parameter: "Oksigen Terlarut / DO (mg/L)",
    pomeAvg: "2,0 mg/L (Suhu 29°C)",
    eqaLimit: "> 1 mg/L (Kelas IV)",
    status: "Memicu aerasi diferensial (Crevice Corrosion) di bawah tutupan gulma; dipulihkan ke >2,65 mg/L",
  },
  {
    parameter: "Sulfida / H₂S Terlarut (mg/L)",
    pomeAvg: "0,005 mg/L",
    eqaLimit: "Nihil / Terkendali",
    status: "Katalis perengkahan Corrosion Fatigue pada sling IWRC SS304; direduksi <0,002 mg/L",
  },
  {
    parameter: "Total Nitrogen (N) & Fosfat (P)",
    pomeAvg: "N = 1,0 mg/L | P = 0,24 mg/L (NH₃-N 0,4; NO₃-N 0,4)",
    eqaLimit: "NO₃-N ≤ 20 mg/L",
    status: "Nutrien pemicu ledakan eceng gondok (+12,9 ha/hari); diserap & didaur ulang menjadi pelet 100.000 KJA",
  },
  {
    parameter: "pH, TDS, TSS, BOD & COD",
    pomeAvg: "pH 7,1 | TDS 152 | TSS 6 | BOD 5 | COD 10 mg/L",
    eqaLimit: "pH 6–9 | TDS 2.000 | TSS 400 | BOD 12 | COD 80",
    status: "Seluruh parameter fisik-kimia & logam berat (Hg <0,0007; As <0,0195; Pb/Cd aman) patuh PP 22/2021 Kelas IV",
  },
];

// Tabel Parameter Teknis & Infrastruktur Baseline (Industrial Case PDF)
export const PROTOTYPE_BUDGET_ITEMS = [
  {
    no: 1,
    component: "Rekayasa Hidrodinamika Boom",
    item: "Re-orientasi Diagonal θ = 35° (1,4 km)",
    spec: "Pemanfaatan 81,9% gaya tangensial arus untuk konveyor gulma pasif ke Collection Bay",
    costIDR: 850_000_000,
  },
  {
    no: 2,
    component: "Peredam Kejut Mekanik",
    item: "Viscoelastic Mooring Damper (η = 0,88)",
    spec: "Meredam beban impak gelombang & fluktuasi debit High-Flow 243,27 m³/s",
    costIDR: 420_000_000,
  },
  {
    no: 3,
    component: "Proteksi Metalurgi Sling",
    item: "Anoda Korban Zn-Al + Selubung HDPE/PU",
    spec: "Proteksi katodik & isolasi celah kawat IWRC SS304 Ø20 mm (Kapasitas nominal 577 kN)",
    costIDR: 310_000_000,
  },
  {
    no: 4,
    component: "Infrastruktur Pemanenan Tepi",
    item: "Collection Bay & Conveyor Ramp",
    spec: "Sentralisasi titik angkut ekskavator untuk mencapai kuota H ≥ 15–16 ha/hari",
    costIDR: 540_000_000,
  },
  {
    no: 5,
    component: "Hilirisasi Sirkular KJA",
    item: "Unit Pencacah, Fermentasi & Ekstruder Pelet",
    spec: "Konversi biomassa eceng gondok (48 Ton/hari) menjadi pakan substitusi 100.000 petak KJA",
    costIDR: 480_000_000,
  },
  {
    no: 6,
    component: "Telemetri IoT & Otomasi DSS",
    item: "Load Cell Sling, Sensor DO/H₂S & ADCP",
    spec: "Integrasi real-time ke dashboard CIRATA-SENSE™ v2.6 Decision Support System",
    costIDR: 250_000_000,
  },
];

// Konstanta Sirkularitas Pakan 100.000 Petak KJA (untuk Halaman Kalkulator KJA /empowerment)
export const KUD_COMMUNITY_CONSTANTS = {
  PELLET_PACK_WEIGHT_KG: 25,
  BIOSULFUR_SACK_WEIGHT_KG: 50, // Karung Pakan Pelet Fermentasi 50 kg
  BIOSULFUR_PRICE_PER_KG: 4_500, // Rp4.500/kg Pelet Fermentasi Eceng Gondok untuk pembudidaya KJA
  COMMERCIAL_ZA_FERTILIZER_PRICE_PER_KG: 9_500, // Harga pakan ikan apung komersial Rp9.500/kg
  TREES_PER_HECTARE_SAWIT: 100, // Ekuivalen blok klaster KJA (100 petak per klaster)
  BIOSULFUR_DOSE_KG_PER_TREE_YEAR: 15.0,

  // Baku Mutu Air PP No. 22 Tahun 2021 Lampiran VI Kelas IV (Additional Supporting Data - ICC.pdf)
  TCLP_AND_PAH_LIMITS: {
    DO: { limit: 1.0, actual: 2.0, unit: "mg/L (>1)", name: "Oksigen Terlarut (DO)" },
    H2S: { limit: 0.01, actual: 0.005, unit: "mg/L", name: "Sulfida Terlarut (H₂S)" },
    TotalN: { limit: 20.0, actual: 1.0, unit: "mg/L", name: "Total Nitrogen (N)" },
    TotalP: { limit: 1.0, actual: 0.24, unit: "mg/L", name: "Total Fosfat (P)" },
    Hg: { limit: 0.005, actual: 0.0007, unit: "mg/L (<0,0007)", name: "Merkuri Terlarut (Hg)" },
  },

  HUB_LOCATIONS: {
    STANDARD: {
      locationName: "Collection Bay & Sentra Pelet KJA Sektor Utara-Timur Waduk Cirata (Zona Prioritas Intake)",
      availableSpentPelletTons: 48.0,
      lastValidated: "2026-10-20",
      sulfurContentPct: 32.5, // % Protein Kasar + Serat Terfermentasi
      ktkValueMeq: 1.0, // Serapan Total N (mg/L)
      waterRetentionBoostPct: 52.6, // % Penghematan Biaya Pakan KJA
    },
    HIGH_SULFUR: {
      locationName: "Collection Bay & Sentra Pelet KJA Sektor Selatan-Barat Waduk Cirata (Klaster 100.000 Petak KJA)",
      availableSpentPelletTons: 60.0,
      lastValidated: "2026-10-21",
      sulfurContentPct: 35.8, // High-Protein Fermented Pellet Formula
      ktkValueMeq: 1.24, // Total N + P Nutrient Recovery Index
      waterRetentionBoostPct: 56.4,
    },
  },
};
