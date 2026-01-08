// Practice data structure from NHS Digital datasets
export interface Practice {
  code: string;           // e.g. "A81001"
  name: string;
  postcode: string;

  // Organisational hierarchy
  pcnCode: string;
  pcnName: string;
  icbCode: string;
  icbName: string;
  regionCode: string;
  regionName: string;

  // Core metrics from NHS datasets
  listSize: number;
  wteGPs: number;
  wteNurses: number;
  wteAdmin: number;
  wteDPC: number;         // Direct patient care staff (pharmacists, physios, etc.)
  qofPoints: number;
  qofMaxPoints: number;
  appointments: number;   // Monthly appointment count
  dnaRate: number;        // Did not attend rate (0-1)

  // Derived metrics
  patientsPerGP: number;
  estimatedIncome: number;
}

// Lightweight lookup for search (smaller payload)
export interface PracticeLookup {
  code: string;
  name: string;
  postcode: string;
}

// Statistical distribution for a metric
export interface MetricDistribution {
  mean: number;
  median: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
  min: number;
  max: number;
}

// Aggregate statistics for comparison at PCN/ICB/Region/National level
export interface Aggregate {
  code: string;           // PCN/ICB/Region code or "national"
  name: string;
  type: 'pcn' | 'icb' | 'region' | 'national';
  practiceCount: number;
  metrics: {
    listSize: MetricDistribution;
    wteGPs: MetricDistribution;
    wteNurses: MetricDistribution;
    patientsPerGP: MetricDistribution;
    qofAchievement: MetricDistribution;  // As percentage
    dnaRate: MetricDistribution;
    estimatedIncome: MetricDistribution;
  };
}

// Full data structure loaded from JSON
export interface PracticeData {
  generatedAt: string;    // ISO date of data generation
  dataDate: string;       // Month/year of source data (e.g. "November 2025")
  practiceCount: number;
  practices: Practice[];
  aggregates: {
    national: Aggregate;
    regions: Aggregate[];
    icbs: Aggregate[];
    pcns: Aggregate[];
  };
  lookup: PracticeLookup[];
}

// Assessment levels matching existing Health Check
export type AssessmentLevel = 'good' | 'stretched' | 'concerning' | 'neutral';

export interface Assessment {
  level: AssessmentLevel;
  title: string;
  message: string;
}

// Comparison result for a single metric
export interface MetricComparison {
  value: number;
  percentile: number;     // 0-100
  assessment: Assessment;
  comparisonValue: number; // Median of comparison group
  comparisonLabel: string; // e.g. "PCN median"
}
