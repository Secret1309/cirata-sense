import { MassBalanceResult } from "./simulation/massBalance";
import { EconomicResult } from "./simulation/economics";

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportSimulationData = (result: MassBalanceResult) => {
  const rows = [
    ["CIRATA-SENSE™ v2.6 DSS (HYDRA-CIRATA) - Laporan Simulasi 4 Modul Terintegrasi", "", ""],
    ["Kompetisi EUREKA! ITB 2026 | Industrial Case Competition (Collaborating with PT PLN Nusantara Power)", "", ""],
    ["Tim Physics for Spirit - Institut Teknologi Bandung (ITB)", "", ""],
    ["Tanggal Export", new Date().toLocaleDateString("id-ID"), ""],
    ["", "", ""],
    ["=== 1. PARAMETER INPUT & SKENARIO HIDROLOGI WADUK CIRATA ===", "", ""],
    ["Parameter", "Nilai", "Satuan"],
    ["Debit Inflow Waduk (Q)", result.tbsCapacityTonPerHour.toFixed(2), "m3/s"],
    ["Sudut Defleksi Trash Boom (θ)", result.codInletGpl.toFixed(0), "derajat (°)"],
    ["Kuota Panen Harian DSS (H)", result.biocharDoseGpl.toFixed(1), "ha/hari"],
    ["Mode Proteksi Metalurgi & Damper", result.isColumnALead ? "HYDRA-CIRATA (Anoda Zn-Al + HDPE/PU + Damper η=0,88)" : "Eksisting (Tanpa Proteksi / Tanpa Damper)", "-"],
    ["Usia Layanan Sling IWRC SS304 (t)", result.pyrolysisTempC.toFixed(0), "bulan"],
    ["", "", ""],
    ["=== 2. MODUL 1 & 2: OSEANOGRAFI & FISIKA HIDRODINAMIKA TRASH BOOM ===", "", ""],
    ["Luas Tutupan Awal Eceng Gondok (A0)", result.initialAreaHa.toFixed(0), "ha (dari 6.200 ha Waduk)"],
    ["Pertambahan Alami Harian (r = 0,03/hari)", `+${result.naturalGrowthRateHaDay.toFixed(2)}`, "ha/hari"],
    ["Neraca Laju Tutupan Harian (dA/dt)", `${result.netCoverageRateHaDay >= 0 ? "+" : ""}${result.netCoverageRateHaDay.toFixed(2)}`, "ha/hari"],
    ["Kecepatan Transpor Permukaan (v_drift)", result.vDriftMs.toFixed(2), "m/s"],
    ["Beban Tarik Frontal (θ = 90°)", result.frontalLoadKn.toFixed(1), "kN"],
    ["Tegangan Tarik Normal Sling (T_normal)", result.normalTensionKn.toFixed(1), "kN"],
    ["Reduksi Beban Tarik Sling", `-${result.loadReductionPct.toFixed(1)}`, "%"],
    ["Efisiensi Defleksi Tangensial ke Collection Bay (F_T)", result.tangentialDeflectionPct.toFixed(1), "%"],
    ["", "", ""],
    ["=== 3. MODUL 3: INDEKS KESEHATAN METALURGI SLING IWRC SS304 (Ø20 mm) ===", "", ""],
    ["Kapasitas Tarik Nominal Sling (T_nominal)", result.nominalStrengthKn.toString(), "kN"],
    ["Kapasitas Tarik Aktual Sling (T_aktual)", result.actualBreakingStrengthKn.toString(), "kN"],
    ["Safety Factor Sling (SF = T_aktual / T_normal)", result.safetyFactor.toFixed(2), result.safetyFactor >= 1.4 ? "AMAN" : result.safetyFactor >= 1.0 ? "WASPADA" : "JEBOL!"],
    ["Status Keputusan Otomasi DSS", result.advisorStatus, "-"],
    ["", "", ""],
    ["=== 4. MODUL 4: SIRKULARITAS PAKAN 100.000 KJA & BAKU MUTU AIR (PP 22/2021 KELAS IV) ===", "", ""],
    ["Produksi Bahan Baku Pelet Fermentasi KJA", result.pelletDailyTon.toFixed(1), "Ton/hari"],
    ["Kemasan Distribusi Pelet KJA (@50 kg)", result.fertilizerDailySacks50Kg.toString(), "Karung/hari"],
    ["Proyeksi Pemulihan Oksigen Terlarut (DO)", result.projectedDoMgl.toFixed(2), "mg/L (Baku Mutu >1 mg/L)"],
    ["Proyeksi Reduksi Sulfida Terlarut (H2S)", result.projectedH2sMgl.toFixed(3), "mg/L (Baseline 0,005 mg/L)"],
    ["Proteksi Risiko Downtime per Unit (24 Jam)", `Rp ${Math.round(result.avoidedDowntimeLossDailyUnitIDR).toLocaleString("id-ID")}`, "Rp/hari/unit"],
  ];

  const tsv = rows.map((row) => row.join("\t")).join("\n");
  downloadFile(
    tsv,
    `CIRATA_SENSE_Simulasi_4_Modul_${new Date().toISOString().slice(0, 10)}.xls`,
    "application/vnd.ms-excel"
  );
};

export const exportEconomicReport = (econ: EconomicResult) => {
  const formatNum = (n: number) => Math.round(n).toLocaleString("id-ID");

  const rows = [
    ["CIRATA-SENSE™ v2.6 DSS - Laporan Valuasi Ekonomi, Proteksi Downtime & Sirkularitas KJA", "", ""],
    ["Kompetisi EUREKA! ITB 2026 | Industrial Case Competition (PT PLN Nusantara Power)", "", ""],
    ["Tim Physics for Spirit - Institut Teknologi Bandung (ITB)", "", ""],
    ["Tanggal Export", new Date().toLocaleDateString("id-ID"), ""],
    ["", "", ""],
    ["=== 1. PARAMETER BIAYA DOWNTIME & EFISIENSI OPERASIONAL PLTA CIRATA ===", "", ""],
    ["Metrik", "Nilai (Rp)", "Keterangan"],
    ["Kerugian Akibat Downtime (Baseline Case)", "17.074.290,072", "Rp/jam/unit"],
    ["Avoided Downtime Loss Harian (24 Jam/Unit)", "409.782.962", "Rp/hari/unit"],
    ["CAPEX Retrofitting Mooring, Damper & Anoda Zn-Al", formatNum(econ.skidCapexRazorIDR), "Per Paket Sektor Boom"],
    ["Penghematan OPEX Ekskavator & Risiko Jebol Tahunan", formatNum(econ.annualOpexSavingsPerPksIDR), `Hemat ${econ.opexReductionPct}% OPEX Penanganan`],
    ["Nilai Ekonomi Pakan Pelet Fermentasi KJA", formatNum(econ.annualBioSulfurRevenuePerPksIDR), "Rp 4.500/kg untuk 100.000 Petak KJA"],
    ["", "", ""],
    ["=== 2. KELAYAKAN INVESTASI INTEGRASI HYDRA-CIRATA & SENTRA PELET KJA ===", "", ""],
    ["Total Initial CAPEX Infrastruktur Terpadu", formatNum(econ.coLocationHubCapexIDR), "IDR"],
    ["Total Nilai Manfaat & Pendapatan Tahunan", formatNum(econ.annualHubRevenueIDR), "IDR/tahun"],
    ["Biaya Operasional (OPEX) Tahunan", formatNum(econ.annualHubOpexIDR), "IDR/tahun"],
    ["Surplus Bersih Tahunan", formatNum(econ.netProfitIDR), "IDR/tahun"],
    ["Net Present Value (NPV, WACC 10%)", formatNum(econ.metrics.npvIDR), "IDR"],
    ["Internal Rate of Return (IRR)", econ.metrics.irrPct.toFixed(1), "% / tahun"],
    ["Payback Period", econ.metrics.paybackYears.toFixed(1), "Tahun"],
    ["", "", ""],
    ["=== 3. PROYEKSI ARUS KAS 5 TAHUN (MILIAR IDR) ===", "", ""],
    ["Tahun", "Manfaat & Revenue (Miliar Rp)", "OPEX (Miliar Rp)", "Cumulative Cash Flow (Miliar Rp)"],
    ...econ.metrics.fiveYearProjections.map((p) => [
      p.label,
      p.revenueMiliar.toFixed(2),
      p.opexMiliar.toFixed(2),
      p.cumulativeCashFlowMiliar.toFixed(2),
    ]),
  ];

  const tsv = rows.map((row) => row.join("\t")).join("\n");
  downloadFile(
    tsv,
    `CIRATA_SENSE_Laporan_Ekonomi_KJA_${new Date().toISOString().slice(0, 10)}.xls`,
    "application/vnd.ms-excel"
  );
};
