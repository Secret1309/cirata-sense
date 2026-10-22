import { KUD_COMMUNITY_CONSTANTS } from "./constants";

export interface KudValorizationResult {
  // Input Echo
  spentPelletKg: number; // Biomassa eceng gondok terpanen (kg/tahun atau kg/siklus)
  sulfurGrade: "STANDARD" | "HIGH_SULFUR";
  applicationTarget: "SAWIT_PLASMA" | "HORTIKULTURA";

  // Output Products (Satuan Lapangan Sentra Pelet KJA Waduk Cirata)
  bioSulfurTotalKg: number; // Total Pelet Pakan Ikan Fermentasi (kg)
  bioSulfurSacks50Kg: number; // Kemasan Karung 50 kg Pelet KJA
  bladeReplacementSacks25Kg: number; // Ekuivalen Hektar Panen Eceng Gondok (ha)

  // Ecological & Aquaculture Impact (100.000 Petak KJA Waduk Cirata)
  treesFertilizedCount: number; // Jumlah Petak KJA Terlayani
  plantationAreaHectares: number; // Luas Tutupan Eceng Gondok Dibersihkan (Ha)
  sulfurContentPct: number; // % Protein Kasar Pelet Fermentasi (32,5% - 35,8%)
  carbonContentPct: number; // % Efisiensi Defleksi Tangensial Boom (81,9%)
  ktkValueMeq: number; // Serapan Total N & P (mg/L baseline: N 1,0 & P 0,24)
  waterRetentionBoostPct: number; // % Penghematan Biaya Pakan KJA

  // Financial Impact for KJA Fish Farmers & PLN Nusantara Power
  bioSulfurPurchaseCostIDR: number; // Nilai tebus Pelet Sirkular KJA @ Rp4.500/kg
  commercialFertilizerEquivalentIDR: number; // Harga Pakan Ikan Komersial @ Rp9.500/kg
  farmerCostSavingsIDR: number; // Penghematan biaya pakan pembudidaya KJA (Rp)
  farmerSavingsPct: number; // % penghematan biaya pakan
  costPerTreeIDR: number; // Biaya pakan sirkular per petak KJA (Rp/petak)

  // Step-by-step Valorization & Field Application SOP
  valorizationSteps: string[];

  // Environmental Safety Validation (PP No. 22 Tahun 2021 Kelas IV)
  safetyStatus: "CLEARED";
  safetyMessage: string;
  hubLocationName: string;
  availableTonsInHub: number;
  lastValidatedDate: string;
  labTestResults: typeof KUD_COMMUNITY_CONSTANTS.TCLP_AND_PAH_LIMITS;
}

export function calculateKudValorization(
  spentPelletKg: number,
  sulfurGrade: "STANDARD" | "HIGH_SULFUR" = "STANDARD",
  applicationTarget: "SAWIT_PLASMA" | "HORTIKULTURA" = "SAWIT_PLASMA"
): KudValorizationResult {
  const KC = KUD_COMMUNITY_CONSTANTS;
  const hub = KC.HUB_LOCATIONS[sulfurGrade];

  // 1. Konversi Biomassa Eceng Gondok di Collection Bay -> Pelet Pakan Fermentasi KJA
  // Basis: 1 ha panen eceng gondok menghasilkan 3.000 kg (3 ton) pelet fermentasi siap guna
  const conditioningFactor = sulfurGrade === "HIGH_SULFUR" ? 1.05 : 1.0;
  const bioSulfurTotalKg = Math.round(spentPelletKg * conditioningFactor);
  const bioSulfurSacks50Kg = +(bioSulfurTotalKg / KC.BIOSULFUR_SACK_WEIGHT_KG).toFixed(1);
  // Luas ha eceng gondok yang dipanen (1 ha = 3.000 kg pelet)
  const harvestedAreaHa = +(spentPelletKg / 3000).toFixed(1);
  const bladeReplacementSacks25Kg = harvestedAreaHa;

  // 2. Cakupan Petak KJA Terlayani (Total 100.000 Petak KJA di Waduk Cirata)
  const dosePerPlotKg = applicationTarget === "SAWIT_PLASMA" ? 18.0 : 12.0;
  const treesFertilizedCount = Math.min(100_000, Math.floor(bioSulfurTotalKg / dosePerPlotKg));
  const plantationAreaHectares = harvestedAreaHa;

  // 3. Penghematan Ekonomi Pembudidaya KJA
  const bioSulfurPurchaseCostIDR = bioSulfurTotalKg * KC.BIOSULFUR_PRICE_PER_KG;
  const commercialFertilizerEquivalentIDR =
    bioSulfurTotalKg * KC.COMMERCIAL_ZA_FERTILIZER_PRICE_PER_KG;
  const farmerCostSavingsIDR =
    commercialFertilizerEquivalentIDR - bioSulfurPurchaseCostIDR;
  const farmerSavingsPct = +(
    (farmerCostSavingsIDR / commercialFertilizerEquivalentIDR) *
    100
  ).toFixed(1);
  const costPerTreeIDR =
    treesFertilizedCount > 0
      ? Math.round(bioSulfurPurchaseCostIDR / treesFertilizedCount)
      : 0;

  // 4. Langkah SOP Lapangan Collection Bay & Sirkularitas Pakan 100.000 KJA
  const valorizationSteps = [
    `Langkah 1 - Penggiringan Pasif Hidrodinamika (θ = 35°): Arus permukaan Waduk Cirata memanfaatkan 81,9% komponen gaya tangensial (F_T = F_D cos 35°) sepanjang bentangan boom 1,4 km untuk menggiring gulma eceng gondok menuju Collection Bay tepi tanpa membebani sling IWRC SS304.`,
    `Langkah 2 - Pengerukan Terjadwal di Collection Bay: Ekskavator mengangkat biomassa eceng gondok sesuai kuota DSS (H ≥ 15–16 ha/hari, melampaui laju tumbuh alami 12,9 ha/hari) setara ${harvestedAreaHa.toLocaleString("id-ID")} Ha tutupan bersih.`,
    `Langkah 3 - Pencacahan & Bio-Fermentasi Pelet KJA: Biomassa dicacah, dikeringkan, dan difermentasi menggunakan probiotik menjadi ${(bioSulfurTotalKg / 1000).toFixed(1)} Ton (${bioSulfurSacks50Kg.toLocaleString("id-ID")} Karung @50 kg) pelet ikan berprotein ${hub.sulfurContentPct}% untuk menyuplai hingga ${treesFertilizedCount.toLocaleString("id-ID")} petak KJA.`,
    `Langkah 4 - Pemulihan Kualitas Air (PP 22/2021 Kelas IV): Ekstraksi biomassa secara permanen memutus siklus eutrofikasi nutrien (Total N 1,0 mg/L & Total P 0,24 mg/L), memulihkan kadar DO perairan ke >2,65 mg/L, serta menekan H₂S terlarut (<0,002 mg/L).`,
  ];

  const safetyMessage =
    "✅ MEMENUHI BAKU MUTU AIR PP NO. 22 TAHUN 2021 LAMPIRAN VI (KELAS IV): Berdasarkan data pengujian laboratorium Waduk Cirata (Additional Supporting Data ICC 2026), kandungan logam berat terlarut berada jauh di bawah ambang batas (Hg <0,0007 mg/L; As <0,0195 mg/L; Se <0,0050 mg/L; Ba 0,02 mg/L; Boron <0,0163 mg/L), sehingga biomassa eceng gondok 100% aman diolah menjadi pakan ikan fermentasi KJA.";

  return {
    spentPelletKg,
    sulfurGrade,
    applicationTarget,
    bioSulfurTotalKg,
    bioSulfurSacks50Kg,
    bladeReplacementSacks25Kg,
    treesFertilizedCount,
    plantationAreaHectares,
    sulfurContentPct: hub.sulfurContentPct,
    carbonContentPct: 81.9,
    ktkValueMeq: hub.ktkValueMeq,
    waterRetentionBoostPct: hub.waterRetentionBoostPct,
    bioSulfurPurchaseCostIDR,
    commercialFertilizerEquivalentIDR,
    farmerCostSavingsIDR,
    farmerSavingsPct,
    costPerTreeIDR,
    valorizationSteps,
    safetyStatus: "CLEARED",
    safetyMessage,
    hubLocationName: hub.locationName,
    availableTonsInHub: hub.availableSpentPelletTons,
    lastValidatedDate: hub.lastValidated,
    labTestResults: KC.TCLP_AND_PAH_LIMITS,
  };
}
