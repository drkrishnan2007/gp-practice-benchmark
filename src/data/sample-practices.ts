// Sample data for development - will be replaced by processed NHS data
import type { Practice, Aggregate, PracticeLookup, MetricDistribution } from "@/types/practice";

// Helper to create a distribution
function dist(min: number, p10: number, p25: number, median: number, p75: number, p90: number, max: number): MetricDistribution {
  return { min, p10, p25, median, p75, p90, max, mean: median * 1.02 };
}

export const samplePractices: Practice[] = [
  {
    code: "A81001",
    name: "The Medical Centre",
    postcode: "B1 1AA",
    pcnCode: "U12345",
    pcnName: "Central Birmingham PCN",
    icbCode: "QHL",
    icbName: "NHS Birmingham and Solihull ICB",
    regionCode: "Y60",
    regionName: "Midlands",
    listSize: 12500,
    wteGPs: 5.2,
    wteNurses: 2.8,
    wteAdmin: 8.5,
    wteDPC: 3.2,
    qofPoints: 542,
    qofMaxPoints: 564,
    appointments: 4200,
    dnaRate: 0.048,
    patientsPerGP: 2404,
    estimatedIncome: 1850000,
  },
  {
    code: "A81002",
    name: "Highfield Surgery",
    postcode: "B2 2BB",
    pcnCode: "U12345",
    pcnName: "Central Birmingham PCN",
    icbCode: "QHL",
    icbName: "NHS Birmingham and Solihull ICB",
    regionCode: "Y60",
    regionName: "Midlands",
    listSize: 8200,
    wteGPs: 3.8,
    wteNurses: 1.5,
    wteAdmin: 5.0,
    wteDPC: 1.8,
    qofPoints: 558,
    qofMaxPoints: 564,
    appointments: 2800,
    dnaRate: 0.032,
    patientsPerGP: 2158,
    estimatedIncome: 1200000,
  },
  {
    code: "A81003",
    name: "Victoria Health Centre",
    postcode: "B3 3CC",
    pcnCode: "U12345",
    pcnName: "Central Birmingham PCN",
    icbCode: "QHL",
    icbName: "NHS Birmingham and Solihull ICB",
    regionCode: "Y60",
    regionName: "Midlands",
    listSize: 15800,
    wteGPs: 6.0,
    wteNurses: 3.5,
    wteAdmin: 10.0,
    wteDPC: 4.5,
    qofPoints: 520,
    qofMaxPoints: 564,
    appointments: 5500,
    dnaRate: 0.065,
    patientsPerGP: 2633,
    estimatedIncome: 2350000,
  },
  {
    code: "B82001",
    name: "Riverside Medical Practice",
    postcode: "M1 1DD",
    pcnCode: "U23456",
    pcnName: "Manchester Central PCN",
    icbCode: "QOP",
    icbName: "NHS Greater Manchester ICB",
    regionCode: "Y62",
    regionName: "North West",
    listSize: 9500,
    wteGPs: 4.0,
    wteNurses: 2.0,
    wteAdmin: 6.0,
    wteDPC: 2.5,
    qofPoints: 545,
    qofMaxPoints: 564,
    appointments: 3200,
    dnaRate: 0.055,
    patientsPerGP: 2375,
    estimatedIncome: 1400000,
  },
  {
    code: "C83001",
    name: "London Bridge Surgery",
    postcode: "SE1 9RT",
    pcnCode: "U34567",
    pcnName: "Southwark Central PCN",
    icbCode: "QKK",
    icbName: "NHS South East London ICB",
    regionCode: "Y56",
    regionName: "London",
    listSize: 18000,
    wteGPs: 7.0,
    wteNurses: 4.0,
    wteAdmin: 12.0,
    wteDPC: 5.0,
    qofPoints: 530,
    qofMaxPoints: 564,
    appointments: 6200,
    dnaRate: 0.072,
    patientsPerGP: 2571,
    estimatedIncome: 2680000,
  },
];

export const sampleLookup: PracticeLookup[] = samplePractices.map(p => ({
  code: p.code,
  name: p.name,
  postcode: p.postcode,
}));

// National aggregate (based on realistic NHS benchmarks)
export const nationalAggregate: Aggregate = {
  code: "national",
  name: "England",
  type: "national",
  practiceCount: 6500,
  metrics: {
    listSize: dist(1200, 4500, 6800, 9200, 12500, 16000, 45000),
    wteGPs: dist(0.5, 2.0, 3.2, 4.5, 6.0, 8.0, 25.0),
    wteNurses: dist(0, 0.8, 1.5, 2.2, 3.2, 4.5, 12.0),
    patientsPerGP: dist(800, 1800, 2020, 2228, 2450, 2700, 4000),
    qofAchievement: dist(0.70, 0.88, 0.92, 0.95, 0.97, 0.99, 1.00),
    dnaRate: dist(0.01, 0.025, 0.035, 0.05, 0.065, 0.085, 0.15),
    estimatedIncome: dist(180000, 650000, 1000000, 1350000, 1850000, 2400000, 6500000),
  },
};

// PCN aggregate for "Central Birmingham PCN"
export const samplePcnAggregate: Aggregate = {
  code: "U12345",
  name: "Central Birmingham PCN",
  type: "pcn",
  practiceCount: 3,
  metrics: {
    listSize: dist(8000, 8200, 10000, 12500, 14500, 15800, 16000),
    wteGPs: dist(3.5, 3.8, 4.5, 5.2, 5.8, 6.0, 6.2),
    wteNurses: dist(1.4, 1.5, 2.0, 2.8, 3.2, 3.5, 3.6),
    patientsPerGP: dist(2100, 2158, 2280, 2404, 2520, 2633, 2700),
    qofAchievement: dist(0.90, 0.92, 0.94, 0.96, 0.98, 0.99, 1.00),
    dnaRate: dist(0.030, 0.032, 0.040, 0.048, 0.058, 0.065, 0.070),
    estimatedIncome: dist(1150000, 1200000, 1500000, 1850000, 2100000, 2350000, 2400000),
  },
};

// ICB aggregate for "NHS Birmingham and Solihull ICB"
export const sampleIcbAggregate: Aggregate = {
  code: "QHL",
  name: "NHS Birmingham and Solihull ICB",
  type: "icb",
  practiceCount: 180,
  metrics: {
    listSize: dist(1500, 5000, 7200, 9800, 13000, 17000, 42000),
    wteGPs: dist(0.8, 2.2, 3.5, 4.8, 6.2, 8.5, 22.0),
    wteNurses: dist(0.2, 1.0, 1.6, 2.4, 3.5, 4.8, 10.0),
    patientsPerGP: dist(900, 1850, 2050, 2280, 2500, 2750, 3800),
    qofAchievement: dist(0.72, 0.89, 0.93, 0.96, 0.98, 0.99, 1.00),
    dnaRate: dist(0.015, 0.028, 0.038, 0.052, 0.068, 0.088, 0.14),
    estimatedIncome: dist(200000, 700000, 1050000, 1420000, 1920000, 2500000, 6200000),
  },
};

// Region aggregate for "Midlands"
export const sampleRegionAggregate: Aggregate = {
  code: "Y60",
  name: "Midlands",
  type: "region",
  practiceCount: 1100,
  metrics: {
    listSize: dist(1300, 4800, 7000, 9400, 12800, 16500, 44000),
    wteGPs: dist(0.6, 2.1, 3.3, 4.6, 6.1, 8.2, 24.0),
    wteNurses: dist(0.1, 0.9, 1.5, 2.3, 3.3, 4.6, 11.0),
    patientsPerGP: dist(850, 1820, 2030, 2250, 2480, 2720, 3900),
    qofAchievement: dist(0.71, 0.88, 0.92, 0.95, 0.97, 0.99, 1.00),
    dnaRate: dist(0.012, 0.026, 0.036, 0.051, 0.066, 0.086, 0.145),
    estimatedIncome: dist(185000, 680000, 1020000, 1380000, 1880000, 2450000, 6400000),
  },
};

// Export all aggregates for easy access
export const sampleAggregates = {
  national: nationalAggregate,
  regions: [sampleRegionAggregate],
  icbs: [sampleIcbAggregate],
  pcns: [samplePcnAggregate],
};

// Helper to find aggregate by code
export function findAggregate(code: string, type: 'pcn' | 'icb' | 'region' | 'national'): Aggregate | null {
  if (type === 'national') return nationalAggregate;

  const list = type === 'pcn' ? sampleAggregates.pcns :
               type === 'icb' ? sampleAggregates.icbs :
               sampleAggregates.regions;

  return list.find(a => a.code === code) || null;
}

// Helper to find practice by code
export function findPractice(code: string): Practice | null {
  return samplePractices.find(p => p.code === code) || null;
}

// Helper to search practices
export function searchPractices(query: string): PracticeLookup[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return sampleLookup.filter(p =>
    p.code.toLowerCase().includes(q) ||
    p.name.toLowerCase().includes(q) ||
    p.postcode.toLowerCase().replace(/\s/g, '').includes(q.replace(/\s/g, ''))
  ).slice(0, 10);
}
