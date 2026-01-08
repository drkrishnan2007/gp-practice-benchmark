import type { Practice, Aggregate, PracticeLookup } from "@/types/practice";

// Type for the full data structure
interface PracticeData {
  generatedAt: string;
  dataDate: string;
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

// Cached data
let cachedData: PracticeData | null = null;

/**
 * Load practice data from JSON file
 */
export async function loadPracticeData(): Promise<PracticeData> {
  if (cachedData) return cachedData;

  const response = await fetch('/practices.json');
  if (!response.ok) {
    throw new Error('Failed to load practice data');
  }

  cachedData = await response.json();
  return cachedData!;
}

/**
 * Search practices by code or name
 */
export function searchPractices(lookup: PracticeLookup[], query: string): PracticeLookup[] {
  const q = query.toLowerCase().trim();
  if (!q || q.length < 2) return [];

  return lookup.filter(p =>
    p.code.toLowerCase().includes(q) ||
    p.name.toLowerCase().includes(q)
  ).slice(0, 10);
}

/**
 * Find a practice by code
 */
export function findPractice(practices: Practice[], code: string): Practice | null {
  return practices.find(p => p.code === code) || null;
}

/**
 * Get aggregate for comparison
 */
export function getAggregate(
  practice: Practice,
  level: 'pcn' | 'icb' | 'region' | 'national',
  aggregates: PracticeData['aggregates']
): Aggregate | null {
  switch (level) {
    case 'national':
      return aggregates.national;
    case 'region':
      return aggregates.regions.find(a => a.code === practice.regionCode) || null;
    case 'icb':
      return aggregates.icbs.find(a => a.code === practice.icbCode) || null;
    case 'pcn':
      return aggregates.pcns.find(a => a.code === practice.pcnCode) || null;
    default:
      return aggregates.national;
  }
}
