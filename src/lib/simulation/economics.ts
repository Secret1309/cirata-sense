import { BIOTRAP_CONSTANTS } from "./constants";
import { MassBalanceResult } from "./massBalance";

export interface FinancialProjectionYear {
  year: number;
  label: string;
  revenueMiliar: number;
  opexMiliar: number;
  netCashFlowMiliar: number;
  cumulativeCashFlowMiliar: number;
}

export interface EconomicResult {
  // === 1. UNIT ECONOMICS PLTA CIRATA & SIRKULARITAS PAKAN 100.000 KJA ===
  skidCapexRazorIDR: number; // Rp420 Juta / paket Retrofitting Mooring, Damper & Anoda Zn-Al
  annualBioTrapBladeCostIDR: number; // Biaya Operasional Tahunan Sistem HYDRA-CIRATA
  annualCoalCarbonCostIDR: number; // Biaya Ekskavator Reaktif Konvensional + Risiko Jebol Trash Boom
  annualOpexSavingsPerPksIDR: number; // Penghematan OPEX Ekskavator + Proteksi Downtime (Rp17.074.290,072/jam/unit)
  opexReductionPct: number; // 62.5% penghematan biaya penanganan
  annualBioSulfurRevenuePerPksIDR: number; // Nilai Ekonomi Pelet Pakan Fermentasi untuk 100.000 KJA (@ Rp4.500/kg)
  annualElectricityValuePerPksIDR: number; // Nilai Proteksi Pendapatan Listrik (Avoided Downtime Loss)

  // === 2. COLLECTION BAY & SENTRA PELET KJA (SKALA WADUK CIRATA 8 UNIT TURBIN) ===
  pksScaleCount: number;
  coLocationHubCapexIDR: number; // Rp2,85 Miliar Total Initial CAPEX
  capexBreakdown: {
    pyrolysisSteamKiln: number; // Re-orientasi Diagonal Boom θ = 35° (1,4 km) & Mooring
    pelletizerExtruder: number; // Unit Pencacah, Fermentasi & Ekstruder Pelet KJA
    leadLagSkidInventory: number; // Viscoelastic Mooring Damper (η = 0,88) & Proteksi Katodik Zn-Al
    iotTelemetryPlc: number; // Load Cell Sling IWRC SS304, Sensor DO/H₂S & ADCP
    bioSulfurGranulator: number; // Infrastruktur Collection Bay & Conveyor Ramp Tepi
    epcInstallation: number; // Instalasi & Kalibrasi Sistem DSS CIRATA-SENSE
  };

  opexBreakdown: {
    tkksBiomassLogistics: number; // Operasional Ekskavator Terjadwal di Collection Bay
    steamActivationEnergy: number; // Proses Fermentasi & Peletasi Biomassa Eceng Gondok
    laborAndHubOps: number; // Tenaga Kerja Operator & Kemitraan Pembudidaya KJA
    iotCloudAndMaintenance: number; // Pemeliharaan Anoda Korban Zn-Al & Telemetri CIRATA-SENSE
    packagingAndDistribution: number; // Distribusi Pakan Pelet Sirkular ke 100.000 Petak KJA
  };

  revenueBreakdown: {
    hardwareSkidSales: number; // Avoided Downtime Loss Turbin (Rp17.074.290,072/jam/unit)
    pelletRepeatOrderSales: number; // Substitusi & Penjualan Pelet Pakan KJA (48 Ton/hari @ Rp4.500/kg)
    bioSulfurFertilizerSales: number; // Penghematan OPEX Armada Alat Berat (Ekskavator)
    carbonCreditVerifiedValue: number; // Kredit Karbon Pencegahan Emisi Metana Pembusukan Gulma
  };

  annualHubRevenueIDR: number;
  annualHubOpexIDR: number;
  grossProfitIDR: number;
  netProfitIDR: number;

  // === 3. INVESTMENT FEASIBILITY METRICS (WACC 10%) ===
  metrics: {
    npvIDR: number;
    irrPct: number;
    paybackYears: number;
    waccPct: number;
    tkdnPct: number;
    hardwareMarginPct: number;
    fiveYearProjections: FinancialProjectionYear[];
  };
}

export const calculateBioTrapEconomics = (
  mb: MassBalanceResult
): EconomicResult => {
  const C = BIOTRAP_CONSTANTS;
  // Scale factor based on daily harvest quota (reference 16.0 ha/day) and safety factor resilience
  const harvestRatio = mb.biocharDoseGpl / 16.0;
  const resilienceRatio = mb.isColumnALead ? 1.0 : 0.65;
  const scaleFactor = Math.max(0.45, harvestRatio * resilienceRatio);

  // 1. Unit Economics & Avoided Downtime Loss
  const skidCapexRazorIDR = C.SKID_CAPEX_RAZOR_IDR; // Rp420 Juta
  // Avoided Downtime Loss: Rp17.074.290,072 /jam/unit * 24 jam = Rp409.782.961,73 /hari/unit
  // Jika mencegah minimal 6 hari (144 jam) potensi gangguan/jebol per tahun per unit:
  const annualOpexSavingsPerPksIDR = Math.round(
    C.DOWNTIME_LOSS_PER_HOUR_UNIT_IDR * 24 * 6 * resilienceRatio
  ); // ~Rp2,46 Miliar / unit / tahun
  const annualBioTrapBladeCostIDR = Math.round(850_000_000 * harvestRatio);
  const annualCoalCarbonCostIDR = annualBioTrapBladeCostIDR + annualOpexSavingsPerPksIDR;
  const opexReductionPct = 62.5;

  // Nilai ekonomi konversi pelet pakan KJA (48 ton/hari * 300 hari operasi * Rp4.500/kg * faktor penyerapan)
  const annualBioSulfurRevenuePerPksIDR = Math.round(
    mb.pelletDailyTon * 1000 * 300 * 450
  );

  // Nilai proteksi keandalan pembangkitan PLTA Cirata (8 unit)
  const annualElectricityValuePerPksIDR = Math.round(
    C.DOWNTIME_LOSS_PER_HOUR_UNIT_IDR * 24 * 30 // 30 hari risiko banjir puncak
  );

  // 2. Total Initial CAPEX Sistem Terintegrasi HYDRA-CIRATA (Rp2,85 Miliar)
  const coLocationHubCapexIDR = C.COLOCATION_HUB_CAPEX_IDR;

  const capexBreakdown = {
    pyrolysisSteamKiln: 850_000_000,
    pelletizerExtruder: 480_000_000,
    leadLagSkidInventory: 730_000_000, // Damper 420 Jt + Anoda & Selubung 310 Jt
    iotTelemetryPlc: 250_000_000,
    bioSulfurGranulator: 340_000_000,
    epcInstallation: 200_000_000,
  };

  // 3. Proyeksi Arus Kas 5 Tahun (Miliar Rupiah) - Valuasi Sirkular Pelet KJA + Penghematan OPEX & Downtime
  const baseRev = [5.4, 10.2, 15.6, 19.8, 24.2];
  const baseOpex = [3.2, 4.8, 6.4, 7.6, 8.8];
  const baseCumCf = [-0.65, 4.75, 13.95, 26.15, 41.55];

  const fiveYearProjections: FinancialProjectionYear[] = baseRev.map(
    (rev, idx) => {
      const r = +(rev * scaleFactor).toFixed(2);
      const o = +(baseOpex[idx] * scaleFactor).toFixed(2);
      const net = +(r - o).toFixed(2);
      const cum = +(baseCumCf[idx] * scaleFactor).toFixed(2);
      return {
        year: idx + 1,
        label: `Tahun ${idx + 1}`,
        revenueMiliar: r,
        opexMiliar: o,
        netCashFlowMiliar: net,
        cumulativeCashFlowMiliar: cum,
      };
    }
  );

  const annualHubRevenueIDR = Math.round(15_600_000_000 * scaleFactor);
  const annualHubOpexIDR = Math.round(6_400_000_000 * scaleFactor);
  const grossProfitIDR = annualHubRevenueIDR - annualHubOpexIDR;
  const netProfitIDR = Math.round(grossProfitIDR * 0.8);

  const opexBreakdown = {
    tkksBiomassLogistics: Math.round(annualHubOpexIDR * 0.25),
    steamActivationEnergy: Math.round(annualHubOpexIDR * 0.28),
    laborAndHubOps: Math.round(annualHubOpexIDR * 0.22),
    iotCloudAndMaintenance: Math.round(annualHubOpexIDR * 0.12),
    packagingAndDistribution: Math.round(annualHubOpexIDR * 0.13),
  };

  const revenueBreakdown = {
    hardwareSkidSales: Math.round(annualHubRevenueIDR * 0.35),
    pelletRepeatOrderSales: Math.round(annualHubRevenueIDR * 0.42),
    bioSulfurFertilizerSales: Math.round(annualHubRevenueIDR * 0.16),
    carbonCreditVerifiedValue: Math.round(annualHubRevenueIDR * 0.07),
  };

  const npvIDR = Math.round(C.REF_NPV_SOM_IDR * scaleFactor);
  const irrPct = +(C.REF_IRR_PCT * Math.min(1.15, Math.max(0.65, scaleFactor))).toFixed(1);
  const paybackYears = +(C.REF_PAYBACK_YEARS / Math.min(1.2, Math.max(0.6, scaleFactor))).toFixed(1);

  return {
    skidCapexRazorIDR,
    annualBioTrapBladeCostIDR,
    annualCoalCarbonCostIDR,
    annualOpexSavingsPerPksIDR,
    opexReductionPct,
    annualBioSulfurRevenuePerPksIDR,
    annualElectricityValuePerPksIDR,
    pksScaleCount: mb.pksScaleCount,
    coLocationHubCapexIDR,
    capexBreakdown,
    opexBreakdown,
    revenueBreakdown,
    annualHubRevenueIDR,
    annualHubOpexIDR,
    grossProfitIDR,
    netProfitIDR,
    metrics: {
      npvIDR,
      irrPct,
      paybackYears,
      waccPct: 10.0,
      tkdnPct: 90.0,
      hardwareMarginPct: 35.0,
      fiveYearProjections,
    },
  };
};
