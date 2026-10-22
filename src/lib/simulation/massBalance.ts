import { BIOTRAP_CONSTANTS, PomeMode } from "./constants";

export interface KineticPoint {
  dayLabel: string;
  day: number;
  catalyzedYield: number; // Luas Tutupan DSS CIRATA-SENSE (ha)
  controlYield: number; // Luas Tutupan Eksisting Reaktif (ha)
}

export interface H2STelemetryPoint {
  hourLabel: string;
  outletPpm: number; // Tegangan Normal HYDRA-CIRATA T_normal (kN)
  safeLimitPpm: number; // Kapasitas Aktual Sling T_aktual (kN)
  inletPpm: number; // Tegangan Frontal Eksisting T_frontal (kN)
}

export interface MassBalanceResult {
  // === INPUT ECHO ===
  tbsCapacityTonPerHour: number; // Inflow Q (m³/s: 72.18, 150.80, 243.27)
  codInletGpl: number; // Sudut Defleksi Trash Boom θ (25° - 90°, default 35°)
  biocharDoseGpl: number; // Kuota Panen Harian H (ha/hari: 5.0 - 25.0, default 16.0)
  fiRatio: number; // Efisiensi Viscoelastic Damper η (0.88 pada HYDRA, 1.00 pada Eksisting)
  h2sInletPpm: number; // Beban Frontal T_frontal (kN)
  pyrolysisTempC: number; // Usia Pakai Sling t (bulan: 1 - 36, default 18)
  isColumnALead: boolean; // true = Proteksi HYDRA (Anoda Zn-Al + HDPE/PU + Damper), false = Eksisting Tanpa Proteksi
  pksScaleCount: number; // Jumlah Unit Turbin Terlindungi (1 - 8 unit PLTA Cirata, default 8)

  // === MODUL 1: DINAMIKA SPASIO-TEMPORAL & KUOTA PANEN (OSEANOGRAFI) ===
  initialAreaHa: number; // A0 = 430 ha
  naturalGrowthRateHaDay: number; // 12.90 ha/hari (r = 0.03/hari)
  netCoverageRateHaDay: number; // dA/dt = 12.90 - H (misal -3.1 ha/hari)
  vInflowMs: number; // m/s
  vWindMs: number; // m/s
  vDriftMs: number; // v_drift = 0.85 * v_inflow + 0.03 * v_wind (m/s)
  areaDay60DssHa: number; // Luas tutupan hari ke-60 dengan DSS (ha)
  areaDay60ReactiveHa: number; // Luas tutupan hari ke-60 reaktif (ha)

  // === MODUL 2: DEKOMPOSISI VEKTOR GAYA HIDRODINAMIKA TRASH BOOM (FISIKA) ===
  frontalLoadKn: number; // F_D / T_frontal pada θ = 90° (kN)
  normalTensionKn: number; // T_normal = η * T_frontal * sin(θ) (kN)
  tangentialDeflectionPct: number; // F_T = cos(θ) * 100 (%)
  loadReductionPct: number; // Reduksi beban tarik dibanding frontal (%)

  // === MODUL 3: INDEKS KESEHATAN METALURGI SLING IWRC SS304 (METALURGI) ===
  nominalStrengthKn: number; // 577 kN
  actualBreakingStrengthKn: number; // T_aktual(t) = 555 kN (Hydra) vs 485 kN (Existing)
  safetyFactor: number; // SF = T_aktual / T_normal
  corrosionLossPct: number; // % penurunan kapasitas dari nominal 577 kN

  // === MODUL 4: VALUASI SIRKULARITAS PAKAN KJA, KUALITAS AIR & EKONOMI ===
  projectedDoMgl: number; // Pemulihan DO (> 2.0 mg/L, misal 2.65 mg/L)
  projectedH2sMgl: number; // Reduksi H2S (< 0.002 mg/L vs 0.005 mg/L)
  nutrientNRemovalKgDay: number; // Estimasi serapan Total N (kg/hari)
  nutrientPRemovalKgDay: number; // Estimasi serapan Total P (kg/hari)
  avoidedDowntimeLossDailyUnitIDR: number; // Rp409.782.961,73 /hari/unit (24 jam * Rp17.074.290,072)

  // === COMPATIBILITY FIELDS FOR UI COMPONENTS (MAPPED TO 4 MODULES) ===
  methaneYieldLgVS: number; // Digunakan di UI untuk menampilkan Safety Factor (SF)
  yieldBoostPct: number; // Digunakan di UI untuk menampilkan Reduksi Beban Sling (%)
  desirabilityRSM: number; // Indeks Resiliensi Komposit (0 - 1.000)
  vsRemovalPct: number; // Efisiensi Penggiringan Tangensial ke Collection Bay (%)
  lagPhaseDays: number; // Neraca Laju Tutupan (dA/dt dalam ha/hari, misal -3.1)
  advisorStatus: "OPTIMAL" | "UNDER_DOSING" | "SUB_OPTIMAL";
  advisorTitle: string;
  advisorMessage: string;

  pomeDailyM3: number; // Total Volume Inflow Harian (Juta m³/hari) atau Debit Q (m³/s)
  pomeHourlyM3: number; // Kecepatan Drift Permukaan v_drift (m/s)
  microBiocharDailyKg: number; // Kuota Ekstraksi Biomassa Basah (Ton/hari)
  tkksDailyTon: number; // Luas Tutupan Awal A0 (430 ha)
  tkksHourlyTon: number; // Pertambahan Alami (+12.9 ha/hari)
  pelletDailyTon: number; // Produksi Bahan Pelet Ikan Fermentasi KJA (Ton/hari, misal 48 Ton/hari)
  pelletMonthlyTon: number; // Produksi Pelet Bulanan (Ton/bulan, misal 1.440 Ton/bulan)
  fertilizerDailyTon: number; // Serapan Nutrien Eutrofikasi N & P Terangkut (Ton/hari)
  fertilizerDailySacks50Kg: number; // Kemasan Pelet KJA Karung 50 kg/hari (misal 960 karung/hari)
  rawBiogasDailyNm3: number; // Kapasitas Pengerukan Ekskavator (m³/hari)
  cleanBiomethaneDailyNm3: number; // Petak KJA Terlayani Pakan Sirkular
  powerMW: number; // Proteksi Downtime Harian per Unit (Juta Rp/hari, misal 409.8)
  dailyElectricityKWh: number;

  annualPomeM3: number;
  annualTkksTon: number;
  annualPelletTon: number;
  annualFertilizerTon: number;
  annualBiomethaneNm3: number;

  h2sOutletPpm: number; // Tegangan Tarik Sling T_normal (kN)
  h2sEfficiencyPct: number; // Efisiensi Defleksi Tangensial F_T (%)
  betSurfaceAreaM2g: number; // Kapasitas Aktual Sling T_aktual (kN)
  phPzc: number; // Kadar DO Proyeksi (mg/L)
  colASaturationPct: number; // Rasio Beban Sling terhadap Kapasitas Aktual (%)
  colBSaturationPct: number; // Efisiensi Redaman Viscoelastic Damper (%)
  colAPressureDropMbar: number; // Kecepatan Arus v_inflow (m/s)
  colBPressureDropMbar: number; // Kecepatan Transpor v_drift (m/s)
  colATempC: number; // Suhu Air Waduk (29.0 °C)
  colBTempC: number; // pH Perairan (7.1)
  remainingServiceDays: number; // Estimasi Waktu Pembersihan Target Tutupan (Hari)
  nextRepeatOrderTon: number; // Produksi Pelet Fermentasi Harian (Ton/hari)
  valveStatusMessage: string;
  autoSwitchTriggered: boolean;

  singlePksCarbonTco2e: number;
  totalCarbonReductionTco2e: number;
  lcaCarbonIntensityReductionPct: number;
  treeEquivalentCount: number;

  // === CHART SERIES ===
  tfmKineticSeries: KineticPoint[];
  h2sTelemetrySeries: H2STelemetryPoint[];
  sensitivityData: {
    biocharDose: number; // Sudut Defleksi θ (derajat)
    methaneYield: number; // Tegangan Normal T_normal (kN)
    desirability: number; // Safety Factor (SF)
    powerMW: number; // Efisiensi Tangensial F_T (%)
    dailyAdditiveCostJuta: number; // Kapasitas Aktual Sling (kN)
  }[];
}

/**
 * Core Physics & Metallurgy Calculation Helper
 */
export function calculateRSM(harvestHaDay: number, thetaDeg: number, inflowQ: number, isHydra: boolean = true, serviceMonths: number = 18) {
  const thetaRad = (thetaDeg * Math.PI) / 180;
  // Beban frontal pada High-Flow (243.27 m³/s) dan θ=90° menembus ~620 kN (>577 kN nominal)
  const baseLoadHighFlow = 620.0;
  const flowFactor = 0.35 + 0.65 * Math.pow(inflowQ / 243.27, 1.35);
  const frontalLoadKn = baseLoadHighFlow * flowFactor;

  const dampingFactor = isHydra ? 0.88 : 1.00;
  const normalTensionKn = frontalLoadKn * Math.sin(thetaRad) * dampingFactor;
  const tangentialDeflectionPct = Math.cos(thetaRad) * 100;

  // Modul 3: T_aktual(t) = T_nominal * (1 - k_degradasi * t)
  // Pada t = 18 bulan: Hydra = 555 kN (SF = 1.69 pada 328.4 kN), Existing = 485 kN (putus saat banjir)
  const kDeg = isHydra ? 0.00212 : 0.00886;
  const actualBreakingStrengthKn = Math.max(
    320,
    577.0 * (1 - kDeg * serviceMonths)
  );

  const safetyFactor = actualBreakingStrengthKn / Math.max(1, normalTensionKn);
  const desirability = Math.max(0.25, Math.min(0.98, (safetyFactor / 2.2) * (harvestHaDay >= 15 ? 1.0 : 0.72)));

  return {
    frontalLoadKn,
    normalTensionKn,
    tangentialDeflectionPct,
    actualBreakingStrengthKn,
    safetyFactor,
    desirability,
  };
}

export const runBioTrapSimulation = (params: {
  pomeMode?: PomeMode;
  tbsCapacity: number; // Debit Inflow Q (m³/s): 60 - 280, default 243.27
  codInlet: number; // Sudut Defleksi Trash Boom θ (°): 25 - 90, default 35
  biocharDose: number; // Kuota Panen Harian H (ha/hari): 5 - 25, default 16.0
  fiRatio?: number; // Viscoelastic Damper η (0.88)
  h2sInlet?: number;
  pyrolysisTemp?: number; // Usia layanan sling t (bulan): default 18
  isColumnALead?: boolean; // true = HYDRA-CIRATA (Anoda Zn-Al + HDPE/PU + Damper), false = Eksisting
  pksScaleCount?: number; // Jumlah unit turbin PLTA Cirata (default 8)
}): MassBalanceResult => {
  const {
    tbsCapacity: inflowQ,
    codInlet: thetaDeg,
    biocharDose: harvestHaDay,
    pyrolysisTemp: serviceMonths = 18,
    isColumnALead: isHydra = true,
    pksScaleCount = 8,
  } = params;

  // 1. Modul 2 & 3: Fisika Hidrodinamika & Metalurgi Sling IWRC SS304
  const {
    frontalLoadKn,
    normalTensionKn,
    tangentialDeflectionPct,
    actualBreakingStrengthKn,
    safetyFactor,
    desirability,
  } = calculateRSM(harvestHaDay, thetaDeg, inflowQ, isHydra, serviceMonths);

  const loadReductionPct = +((1 - normalTensionKn / frontalLoadKn) * 100).toFixed(1);
  const corrosionLossPct = +(((577 - actualBreakingStrengthKn) / 577) * 100).toFixed(1);

  // 2. Modul 1: Dinamika Spasio-Temporal & Optimasi Kuota Panen (Oseanografi)
  const initialAreaHa = 430.0;
  const rGrowth = 0.03;
  const naturalGrowthRateHaDay = +(initialAreaHa * rGrowth).toFixed(2); // 12.90 ha/hari
  const netReductionRate = +(harvestHaDay - naturalGrowthRateHaDay).toFixed(2); // +3.1 ha/hari panen bersih -> -3.1 ha/hari tutupan
  const netCoverageRateHaDay = +(-netReductionRate).toFixed(2); // -3.1 ha/hari

  // Kecepatan Transpor Permukaan: v_drift = 0.85 * v_inflow + 0.03 * v_wind
  const vInflowMs = +(0.24 + 0.62 * (inflowQ / 243.27)).toFixed(2); // ~0.86 m/s saat High-Flow
  const vWindMs = 4.5; // m/s angin rata-rata muson Waduk Cirata
  const vDriftMs = +(0.85 * vInflowMs + 0.03 * vWindMs).toFixed(2);

  // 3. Modul 4: Valuasi Sirkularitas Pakan KJA, Kualitas Air, & Ekonomi
  // 1 ha panen eceng gondok menghasilkan ~3.0 ton pelet fermentasi siap guna untuk 100.000 petak KJA
  const pelletDailyTon = +(harvestHaDay * 3.0).toFixed(1); // 48.0 Ton/hari pada H = 16 ha/hari
  const pelletMonthlyTon = Math.round(pelletDailyTon * 30); // 1.440 Ton/bulan
  const fertilizerDailySacks50Kg = Math.round((pelletDailyTon * 1000) / 50); // 960 karung @50kg/hari

  // Estimasi biomassa basah yang diekstraksi di Collection Bay (~100 ton basah/ha)
  const wetBiomassDailyTon = Math.round(harvestHaDay * 100);
  // Serapan nutrien N (1.0 mg/L) & P (0.24 mg/L) melalui fitoremediasi & panen gulma
  const nutrientNRemovalKgDay = Math.round(harvestHaDay * 28.5);
  const nutrientPRemovalKgDay = Math.round(harvestHaDay * 6.8);
  const fertilizerDailyTon = +((nutrientNRemovalKgDay + nutrientPRemovalKgDay) / 1000).toFixed(2);

  // Pemulihan kadar DO perairan (> 2.0 mg/L sesuai PP 22/2021 Kelas IV > 1 mg/L)
  const projectedDoMgl =
    netReductionRate > 0
      ? +(Math.min(3.2, 2.0 + netReductionRate * 0.21)).toFixed(2) // 2.65 mg/L pada H=16.0
      : +(Math.max(1.15, 2.0 + netReductionRate * 0.12)).toFixed(2);
  const projectedH2sMgl = netReductionRate > 0 && isHydra ? 0.002 : 0.005;

  // Penghematan Risiko Downtime: Rp17.074.290,072 /jam/unit -> Rp409.782.961,73 /hari/unit (Rp409,8 Jt/hari/unit)
  const avoidedDowntimeLossDailyUnitIDR = BIOTRAP_CONSTANTS.DOWNTIME_LOSS_PER_HOUR_UNIT_IDR * 24;
  const avoidedLossDailyMillionIDR = +(avoidedDowntimeLossDailyUnitIDR / 1_000_000).toFixed(1); // 409.8 Jt/hr

  // 4. Simulasi Proyeksi 60 Hari Tutupan Eceng Gondok (A0 = 430 ha)
  const tfmKineticSeries: KineticPoint[] = [];
  let areaDss = initialAreaHa;
  let areaReactive = initialAreaHa;
  const maxCapHa = 650;

  for (let day = 0; day <= 60; day += 4) {
    tfmKineticSeries.push({
      dayLabel: `Hari ${day}`,
      day,
      catalyzedYield: +areaDss.toFixed(1),
      controlYield: +areaReactive.toFixed(1),
    });
    // Iterasi 4 hari ke depan
    for (let step = 0; step < 4; step++) {
      const rEffDss = harvestHaDay >= 15.0 ? 0.026 : 0.03;
      areaDss = Math.max(0, Math.min(maxCapHa, areaDss + areaDss * rEffDss - harvestHaDay));
      areaReactive = Math.max(0, Math.min(maxCapHa, areaReactive + areaReactive * 0.03 - 8.0));
    }
  }

  const areaDay60DssHa = tfmKineticSeries[tfmKineticSeries.length - 1].catalyzedYield;
  const areaDay60ReactiveHa = tfmKineticSeries[tfmKineticSeries.length - 1].controlYield;

  // 5. Profil Komparasi Beban Hidrodinamika pada 3 Skenario Debit Historis + Kondisi Aktual
  const flowScenarios = [
    { label: "Low (72,18 m³/s)", q: 72.18 },
    { label: "33rd Pct (110 m³/s)", q: 110.0 },
    { label: "Mod (150,80 m³/s)", q: 150.8 },
    { label: "66th Pct (195 m³/s)", q: 195.0 },
    { label: "High (243,27 m³/s)", q: 243.27 },
    { label: `Simulasi (${inflowQ.toFixed(0)} m³/s)`, q: inflowQ },
  ];

  const h2sTelemetrySeries: H2STelemetryPoint[] = flowScenarios.map((sc) => {
    const sim = calculateRSM(harvestHaDay, thetaDeg, sc.q, isHydra, serviceMonths);
    return {
      hourLabel: sc.label,
      outletPpm: +sim.normalTensionKn.toFixed(1), // T_normal (kN)
      safeLimitPpm: +sim.actualBreakingStrengthKn.toFixed(0), // Kapasitas Aktual Sling (kN)
      inletPpm: +sim.frontalLoadKn.toFixed(1), // Beban Frontal θ=90° (kN)
    };
  });

  // 6. Analisis Sensitivitas Sudut Defleksi θ (25° s.d. 90°)
  const anglePoints = [25, 30, 35, 45, 55, 65, 75, 85, 90];
  const sensitivityData = anglePoints.map((angle) => {
    const sim = calculateRSM(harvestHaDay, angle, inflowQ, isHydra, serviceMonths);
    return {
      biocharDose: angle, // Sudut θ (°)
      methaneYield: +sim.normalTensionKn.toFixed(1), // Tegangan Tarik Normal T_normal (kN)
      desirability: +sim.safetyFactor.toFixed(2), // Safety Factor (SF)
      powerMW: +sim.tangentialDeflectionPct.toFixed(1), // Gaya Tangensial Penggiring Gulma (%)
      dailyAdditiveCostJuta: +sim.actualBreakingStrengthKn.toFixed(0), // Kapasitas Aktual Sling (kN)
    };
  });

  // 7. Rekomendasi Keputusan Operasional DSS CIRATA-SENSE
  let advisorStatus: "OPTIMAL" | "UNDER_DOSING" | "SUB_OPTIMAL" = "OPTIMAL";
  let advisorTitle = `OPTIMAL ENGINEERING RESILIENCE (SF = ${safetyFactor.toFixed(2)})`;
  let advisorMessage = `Pada debit Q = ${inflowQ.toFixed(2)} m³/s dan sudut defleksi θ = ${thetaDeg}°, tegangan tarik sling tereduksi menjadi ${normalTensionKn.toFixed(1)} kN (di bawah kapasitas aktual ${actualBreakingStrengthKn.toFixed(0)} kN). Sebanyak ${tangentialDeflectionPct.toFixed(1)}% gaya arus menggiring eceng gondok otomatis ke Collection Bay tepi dengan kuota panen ${harvestHaDay.toFixed(1)} ha/hari (${netCoverageRateHaDay} ha/hari).`;

  if (safetyFactor < 1.0 || harvestHaDay <= 12.9) {
    advisorStatus = "SUB_OPTIMAL";
    advisorTitle = `CRITICAL ALERT: ${safetyFactor < 1.0 ? "SLING OVERLOAD / PUTUS!" : "NET ACCUMULATION (MERAH)"}`;
    advisorMessage =
      safetyFactor < 1.0
        ? `PERINGATAN JEBOL: Tegangan tarik sling mencapai ${normalTensionKn.toFixed(1)} kN melampaui kapasitas aktual ${actualBreakingStrengthKn.toFixed(0)} kN (SF = ${safetyFactor.toFixed(2)} < 1,0) akibat orientasi frontal dan korosi celah! Segera ubah orientasi ke θ = 35° dan aktifkan proteksi Anoda Zn-Al + Damper.`
        : `PERINGATAN AKUMULASI GULMA: Kapasitas panen H = ${harvestHaDay.toFixed(1)} ha/hari lebih rendah dari pertambahan alami +12,90 ha/hari. Waduk mengalami Net Accumulation (+${Math.abs(netCoverageRateHaDay).toFixed(1)} ha/hari). Tingkatkan kuota panen ke H ≥ 15,0 ha/hari!`;
  } else if (safetyFactor < 1.4 || harvestHaDay < 15.0) {
    advisorStatus = "UNDER_DOSING";
    advisorTitle = `HIGH LOAD CAUTION (SF = ${safetyFactor.toFixed(2)})`;
    advisorMessage = `Tegangan sling ${normalTensionKn.toFixed(1)} kN berada pada zona waspada (1,0 ≤ SF < 1,4) atau kuota panen ${harvestHaDay.toFixed(1)} ha/hari belum mencapai target percepatan pembersihan H_target ≥ 15,0 ha/hari. Optimalkan sudut defleksi ke 35° dan kuota panen 16,0 ha/hari.`;
  }

  const remainingServiceDays =
    netReductionRate > 0 ? Math.ceil(initialAreaHa / netReductionRate) : 999;

  const valveStatusMessage = isHydra
    ? `Mode HYDRA-CIRATA Aktif: Proteksi Katodik Anoda Korban (Zn-Al) + Selubung Polimer HDPE/PU + Viscoelastic Damper (η = 0,88) menjaga kekuatan aktual sling IWRC SS304 pada ${actualBreakingStrengthKn.toFixed(0)} kN (Nominal 577 kN) dengan Safety Factor ${safetyFactor.toFixed(2)} (AMAN).`
    : `Mode Eksisting (Tanpa Proteksi): Degradasi Crevice Corrosion & Corrosion Fatigue pada lingkungan DO 2,0 mg/L & H₂S 0,005 mg/L menurunkan kapasitas aktual sling IWRC SS304 ke ${actualBreakingStrengthKn.toFixed(0)} kN (SF = ${safetyFactor.toFixed(2)}).`;

  const colASaturationPct = +Math.min(100, (normalTensionKn / actualBreakingStrengthKn) * 100).toFixed(1);
  const colBSaturationPct = isHydra ? 88.0 : 0.0;

  // Ekuivalensi dekarbonisasi dari pencegahan pembusukan anaerobik metana eceng gondok di dasar waduk
  const singlePksCarbonTco2e = Math.round(harvestHaDay * 115);
  const totalCarbonReductionTco2e = singlePksCarbonTco2e * pksScaleCount;
  const treeEquivalentCount = totalCarbonReductionTco2e * 145;

  return {
    tbsCapacityTonPerHour: inflowQ,
    codInletGpl: thetaDeg,
    biocharDoseGpl: harvestHaDay,
    fiRatio: isHydra ? 0.88 : 1.0,
    h2sInletPpm: +frontalLoadKn.toFixed(1),
    pyrolysisTempC: serviceMonths,
    isColumnALead: isHydra,
    pksScaleCount,

    initialAreaHa,
    naturalGrowthRateHaDay,
    netCoverageRateHaDay,
    vInflowMs,
    vWindMs,
    vDriftMs,
    areaDay60DssHa,
    areaDay60ReactiveHa,

    frontalLoadKn: +frontalLoadKn.toFixed(1),
    normalTensionKn: +normalTensionKn.toFixed(1),
    tangentialDeflectionPct: +tangentialDeflectionPct.toFixed(1),
    loadReductionPct,

    nominalStrengthKn: 577,
    actualBreakingStrengthKn: +actualBreakingStrengthKn.toFixed(0),
    safetyFactor: +safetyFactor.toFixed(2),
    corrosionLossPct,

    projectedDoMgl,
    projectedH2sMgl,
    nutrientNRemovalKgDay,
    nutrientPRemovalKgDay,
    avoidedDowntimeLossDailyUnitIDR,

    // Compatibility Mappings for Dashboard KPIs
    methaneYieldLgVS: +safetyFactor.toFixed(2), // KPI 1: Safety Factor (SF)
    yieldBoostPct: loadReductionPct, // Reduksi beban tarik (%)
    desirabilityRSM: +desirability.toFixed(3),
    vsRemovalPct: +tangentialDeflectionPct.toFixed(1), // Efisiensi Defleksi 81.9%
    lagPhaseDays: netCoverageRateHaDay, // -3.1 ha/hari
    advisorStatus,
    advisorTitle,
    advisorMessage,

    pomeDailyM3: +inflowQ.toFixed(2), // Debit Inflow Q (m³/s)
    pomeHourlyM3: vDriftMs, // v_drift (m/s)
    microBiocharDailyKg: wetBiomassDailyTon, // Biomassa basah terangkut (Ton/hari)
    tkksDailyTon: initialAreaHa, // 430 ha
    tkksHourlyTon: naturalGrowthRateHaDay, // 12.9 ha/hari
    pelletDailyTon, // 48.0 Ton/hari bahan pelet KJA
    pelletMonthlyTon, // 1.440 Ton/bulan
    fertilizerDailyTon, // Ton nutrien N+P terangkat/hari
    fertilizerDailySacks50Kg, // 960 karung 50kg/hari
    rawBiogasDailyNm3: Math.round(wetBiomassDailyTon * 12.5),
    cleanBiomethaneDailyNm3: 100_000, // 100.000 petak KJA
    powerMW: avoidedLossDailyMillionIDR, // Rp 409,8 Juta/hari/unit Avoided Loss
    dailyElectricityKWh: Math.round(avoidedLossDailyMillionIDR * 1000),

    annualPomeM3: Math.round(inflowQ * 86400 * 365 / 1e6),
    annualTkksTon: Math.round(wetBiomassDailyTon * 330),
    annualPelletTon: +(pelletDailyTon * 330).toFixed(0),
    annualFertilizerTon: +(fertilizerDailyTon * 330).toFixed(1),
    annualBiomethaneNm3: 100_000,

    h2sOutletPpm: +normalTensionKn.toFixed(1), // Tegangan Tarik Sling T_normal (328.4 kN)
    h2sEfficiencyPct: +tangentialDeflectionPct.toFixed(1), // 81.9%
    betSurfaceAreaM2g: +actualBreakingStrengthKn.toFixed(0), // 555 kN
    phPzc: projectedDoMgl, // 2.65 mg/L DO
    colASaturationPct, // % Beban terhadap kapasitas aktual
    colBSaturationPct, // 88% efisiensi damper
    colAPressureDropMbar: vInflowMs, // v_inflow (m/s)
    colBPressureDropMbar: vDriftMs, // v_drift (m/s)
    colATempC: 29.0, // Suhu baseline 29°C
    colBTempC: 7.1, // pH baseline 7,1
    remainingServiceDays,
    nextRepeatOrderTon: pelletDailyTon,
    valveStatusMessage,
    autoSwitchTriggered: safetyFactor < 1.0,

    singlePksCarbonTco2e,
    totalCarbonReductionTco2e,
    lcaCarbonIntensityReductionPct: 68.5,
    treeEquivalentCount,

    tfmKineticSeries,
    h2sTelemetrySeries,
    sensitivityData,
  };
};
