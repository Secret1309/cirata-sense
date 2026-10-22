import { create } from "zustand";
import { PomeMode, POME_MODES, DEFAULT_POME_PROFILES } from "@/lib/simulation/constants";
import { runBioTrapSimulation, MassBalanceResult } from "@/lib/simulation/massBalance";
import { calculateBioTrapEconomics, EconomicResult } from "@/lib/simulation/economics";

interface SimulationStore {
  // Inputs mapped to CIRATA-SENSE 4 Integrated Modules:
  // tbsCapacity -> 1. Debit Inflow Waduk Q (m³/s: 60 - 280, default 243.27 High-Flow)
  // codInlet    -> 2. Sudut Defleksi Trash Boom θ (°: 25 - 90, default 35° HYDRA-CIRATA)
  // biocharDose -> 3. Kuota Panen Harian DSS H (ha/hari: 5.0 - 25.0, default 16.0 ha/hari)
  // fiRatio     -> Efisiensi Viscoelastic Damper η (0.88 pada HYDRA, 1.00 pada Eksisting)
  // h2sInlet    -> Beban Tarik Frontal T_frontal (kN)
  // pyrolysisTemp -> Usia Pakai Sling t (bulan: 1 - 36, default 18 bulan)
  // isColumnALead -> Mode Rekayasa Metalurgi & Damper (true = HYDRA-CIRATA Zn-Al + HDPE/PU + Damper, false = Eksisting)
  // pksScaleCount -> Jumlah Unit Turbin PLTA Cirata Terlindungi (1 - 8 unit, default 8)
  pomeMode: PomeMode;
  tbsCapacity: number;
  codInlet: number;
  biocharDose: number;
  fiRatio: number;
  h2sInlet: number;
  pyrolysisTemp: number;
  isColumnALead: boolean;
  pksScaleCount: number;

  // Results
  isSimulating: boolean;
  massBalanceResult: MassBalanceResult;
  economicResults: EconomicResult;

  // Actions
  setPomeMode: (mode: PomeMode) => void;
  setParams: (params: Partial<SimulationStore>) => void;
  toggleLeadLag: () => void;
  resetOptimal: () => void;
  runSimulation: () => Promise<void>;
}

const initialMb = runBioTrapSimulation({
  pomeMode: POME_MODES.STANDARD_DIET,
  tbsCapacity: 243.27,
  codInlet: 35,
  biocharDose: 16.0,
  fiRatio: 0.88,
  h2sInlet: 620.0,
  pyrolysisTemp: 18,
  isColumnALead: true,
  pksScaleCount: 8,
});

const initialEcon = calculateBioTrapEconomics(initialMb);

const recomputeState = (state: SimulationStore, overrides: Partial<SimulationStore> = {}) => {
  const next = { ...state, ...overrides };
  const mb = runBioTrapSimulation({
    pomeMode: next.pomeMode,
    tbsCapacity: next.tbsCapacity,
    codInlet: next.codInlet,
    biocharDose: next.biocharDose,
    fiRatio: next.fiRatio,
    h2sInlet: next.h2sInlet,
    pyrolysisTemp: next.pyrolysisTemp,
    isColumnALead: next.isColumnALead,
    pksScaleCount: next.pksScaleCount,
  });
  const econ = calculateBioTrapEconomics(mb);
  return {
    ...overrides,
    massBalanceResult: mb,
    economicResults: econ,
  };
};

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  pomeMode: POME_MODES.STANDARD_DIET,
  tbsCapacity: 243.27,
  codInlet: 35,
  biocharDose: 16.0,
  fiRatio: 0.88,
  h2sInlet: 620.0,
  pyrolysisTemp: 18,
  isColumnALead: true,
  pksScaleCount: 8,

  isSimulating: false,
  massBalanceResult: initialMb,
  economicResults: initialEcon,

  setPomeMode: (mode) =>
    set((state) => {
      const profile = DEFAULT_POME_PROFILES[mode];
      return recomputeState(state, {
        pomeMode: mode,
        tbsCapacity: profile.inflowDefault,
        codInlet: profile.thetaDefault,
        biocharDose: profile.harvestDefault,
        isColumnALead: profile.metalModeDefault === "hydra",
        pyrolysisTemp: profile.serviceMonthsDefault,
      });
    }),

  setParams: (params) =>
    set((state) => recomputeState(state, params)),

  toggleLeadLag: () =>
    set((state) =>
      recomputeState(state, { isColumnALead: !state.isColumnALead })
    ),

  resetOptimal: () =>
    set((state) =>
      recomputeState(state, {
        pomeMode: POME_MODES.STANDARD_DIET,
        tbsCapacity: 243.27,
        codInlet: 35,
        biocharDose: 16.0,
        fiRatio: 0.88,
        h2sInlet: 620.0,
        pyrolysisTemp: 18,
        isColumnALead: true,
        pksScaleCount: 8,
      })
    ),

  runSimulation: async () => {
    set({ isSimulating: true });
    await new Promise((resolve) => setTimeout(resolve, 450));
    const state = get();
    set({
      isSimulating: false,
      ...recomputeState(state),
    });
  },
}));
