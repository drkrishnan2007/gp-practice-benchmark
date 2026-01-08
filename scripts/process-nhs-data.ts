/**
 * NHS Data Processing Script
 *
 * Processes NHS Digital CSV files into a JSON format for the GP Practice Comparison tool.
 *
 * Usage:
 *   1. Download NHS Digital CSV files to /raw-data/
 *   2. Run: npx tsx scripts/process-nhs-data.ts
 *   3. Output: /src/data/practices.json
 */

import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// Types
interface Practice {
  code: string;
  name: string;
  postcode: string;
  pcnCode: string;
  pcnName: string;
  icbCode: string;
  icbName: string;
  regionCode: string;
  regionName: string;
  listSize: number;
  wteGPs: number;
  wteNurses: number;
  wteAdmin: number;
  wteDPC: number;
  qofPoints: number;
  qofMaxPoints: number;
  appointments: number;
  dnaRate: number;
  patientsPerGP: number;
  estimatedIncome: number;
}

interface MetricDistribution {
  mean: number;
  median: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
  min: number;
  max: number;
}

interface Aggregate {
  code: string;
  name: string;
  type: 'pcn' | 'icb' | 'region' | 'national';
  practiceCount: number;
  metrics: {
    listSize: MetricDistribution;
    wteGPs: MetricDistribution;
    wteNurses: MetricDistribution;
    patientsPerGP: MetricDistribution;
    qofAchievement: MetricDistribution;
    dnaRate: MetricDistribution;
    estimatedIncome: MetricDistribution;
  };
}

// NHS 2025/26 rates
const NHS_RATES = {
  globalSumPerPatient: 121.79,
  qofPointValue: 225.49,
  qofMaxPoints: 564,
  typicalEnhancedServicesPerPatient: 25,
};

// Paths
const RAW_DATA_DIR = path.join(process.cwd(), 'raw-data');
const OUTPUT_PATH = path.join(process.cwd(), 'src', 'data', 'practices.json');

// Helper functions
function parseNumber(value: string | undefined): number {
  if (!value || value === '' || value === '*') return 0;
  const num = parseFloat(value.replace(/,/g, ''));
  return isNaN(num) ? 0 : num;
}

function round(value: number, decimals: number = 1): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// Higher precision rounding for percentage values (QOF achievement)
function roundPercent(value: number, decimals: number = 4): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (percentile / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function calculateDistribution(values: number[], highPrecision: boolean = false): MetricDistribution {
  const filtered = values.filter(v => v > 0);
  if (filtered.length === 0) {
    return { mean: 0, median: 0, p10: 0, p25: 0, p75: 0, p90: 0, min: 0, max: 0 };
  }
  const sorted = [...filtered].sort((a, b) => a - b);
  const sum = filtered.reduce((a, b) => a + b, 0);
  const roundFn = highPrecision ? roundPercent : round;
  return {
    mean: roundFn(sum / filtered.length),
    median: roundFn(calculatePercentile(filtered, 50)),
    p10: roundFn(calculatePercentile(filtered, 10)),
    p25: roundFn(calculatePercentile(filtered, 25)),
    p75: roundFn(calculatePercentile(filtered, 75)),
    p90: roundFn(calculatePercentile(filtered, 90)),
    min: roundFn(sorted[0]),
    max: roundFn(sorted[sorted.length - 1]),
  };
}

function estimateIncome(listSize: number, qofPoints: number): number {
  const globalSum = listSize * NHS_RATES.globalSumPerPatient;
  const qofIncome = qofPoints * NHS_RATES.qofPointValue;
  const enhancedServices = listSize * NHS_RATES.typicalEnhancedServicesPerPatient;
  return Math.round(globalSum + qofIncome + enhancedServices);
}

function readCsvFile(filename: string): Record<string, string>[] {
  const filepath = path.join(RAW_DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return [];
  }
  const content = fs.readFileSync(filepath, 'utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true,
    relax_column_count: true,
  }) as Record<string, string>[];
}

function findFile(pattern: string): string | null {
  const files = fs.readdirSync(RAW_DATA_DIR);
  const match = files.find(f => f.toLowerCase().includes(pattern.toLowerCase()));
  return match || null;
}

function createAggregate(
  practices: Practice[],
  code: string,
  name: string,
  type: 'pcn' | 'icb' | 'region' | 'national'
): Aggregate {
  return {
    code,
    name,
    type,
    practiceCount: practices.length,
    metrics: {
      listSize: calculateDistribution(practices.map(p => p.listSize)),
      wteGPs: calculateDistribution(practices.map(p => p.wteGPs)),
      wteNurses: calculateDistribution(practices.map(p => p.wteNurses)),
      patientsPerGP: calculateDistribution(practices.map(p => p.patientsPerGP)),
      // Use high precision for QOF achievement (0-1 decimal values)
      qofAchievement: calculateDistribution(
        practices.filter(p => p.qofMaxPoints > 0).map(p => p.qofPoints / p.qofMaxPoints),
        true // highPrecision
      ),
      dnaRate: calculateDistribution(practices.map(p => p.dnaRate)),
      estimatedIncome: calculateDistribution(practices.map(p => p.estimatedIncome)),
    },
  };
}

// Main processing function
async function processData() {
  console.log('NHS Data Processing Script');
  console.log('==========================\n');

  // Find the workforce file
  const workforceFile = findFile('Practice Level - Detailed');
  if (!workforceFile) {
    console.error('Error: Could not find workforce CSV file.');
    console.log('Expected file containing "Practice Level - Detailed" in /raw-data/');
    return;
  }

  console.log('Reading data files...');

  // Read workforce data (main source)
  console.log(`  Workforce: ${workforceFile}`);
  const workforceData = readCsvFile(workforceFile);
  console.log(`    Records: ${workforceData.length}`);

  // Read patient registration data
  const patientsFile = findFile('gp-reg-pat-prac-all');
  let patientsMap = new Map<string, number>();
  if (patientsFile) {
    console.log(`  Patients: ${patientsFile}`);
    const patientsData = readCsvFile(patientsFile);
    for (const row of patientsData) {
      if (row.SEX === 'ALL' && row.AGE === 'ALL') {
        patientsMap.set(row.CODE, parseNumber(row.NUMBER_OF_PATIENTS));
      }
    }
    console.log(`    Practices with patient data: ${patientsMap.size}`);
  }

  // Read QOF organisation reference (for max points)
  const qofOrgFile = findFile('ORGANISATION_REFERENCE');
  let qofMaxPointsMap = new Map<string, number>();
  if (qofOrgFile) {
    console.log(`  QOF Org Reference: ${qofOrgFile}`);
    const qofOrgData = readCsvFile(qofOrgFile);
    for (const row of qofOrgData) {
      qofMaxPointsMap.set(row.PRACTICE_CODE, parseNumber(row.REVISED_MAX_POINTS));
    }
    console.log(`    Practices with max points: ${qofMaxPointsMap.size}`);
  }

  // Read QOF achievement data (aggregate from regional files)
  const achievementFiles = fs.readdirSync(RAW_DATA_DIR).filter(f => f.startsWith('ACHIEVEMENT_') && f.endsWith('.csv'));
  let qofAchievementMap = new Map<string, number>();

  if (achievementFiles.length > 0) {
    console.log(`  QOF Achievement files: ${achievementFiles.length}`);
    let totalRows = 0;

    for (const file of achievementFiles) {
      const data = readCsvFile(file);
      for (const row of data) {
        if (row.MEASURE === 'ACHIEVED_POINTS') {
          const code = row.PRACTICE_CODE;
          const points = parseNumber(row.VALUE);
          qofAchievementMap.set(code, (qofAchievementMap.get(code) || 0) + points);
          totalRows++;
        }
      }
    }
    console.log(`    Practices with achievement: ${qofAchievementMap.size}`);
  }

  // Process practices
  console.log('\nProcessing practices...');
  const practices: Practice[] = [];
  let skipped = 0;

  for (const wf of workforceData) {
    const code = wf.PRAC_CODE || '';
    if (!code || code.length < 5) {
      skipped++;
      continue;
    }

    const name = wf.PRAC_NAME || 'Unknown';

    // Get list size (prefer patient data, fallback to workforce)
    const listSize = patientsMap.get(code) || parseNumber(wf.TOTAL_PATIENTS);

    // Skip practices with no patients
    if (listSize === 0) {
      skipped++;
      continue;
    }

    const postcode = wf.POSTCODE || '';
    const pcnCode = wf.PCN_CODE || '';
    const pcnName = wf.PCN_NAME || 'Unknown PCN';
    const icbCode = wf.ICB_CODE || wf.SUB_ICB_CODE || '';
    const icbName = wf.ICB_NAME || wf.SUB_ICB_NAME || 'Unknown ICB';
    const regionCode = wf.REGION_CODE || '';
    const regionName = wf.REGION_NAME || 'Unknown Region';

    const wteGPs = parseNumber(wf.TOTAL_GP_FTE);
    const wteNurses = parseNumber(wf.TOTAL_NURSES_FTE);
    const wteAdmin = parseNumber(wf.TOTAL_ADMIN_FTE);
    const wteDPC = parseNumber(wf.TOTAL_DPC_FTE);

    // Get QOF data
    const qofPoints = qofAchievementMap.get(code) || 0;
    const qofMaxPoints = qofMaxPointsMap.get(code) || NHS_RATES.qofMaxPoints;

    // Calculate derived metrics
    const patientsPerGP = wteGPs > 0 ? Math.round(listSize / wteGPs) : 0;
    const estimatedIncomeVal = estimateIncome(listSize, qofPoints);

    practices.push({
      code,
      name,
      postcode,
      pcnCode,
      pcnName,
      icbCode,
      icbName,
      regionCode,
      regionName,
      listSize,
      wteGPs,
      wteNurses,
      wteAdmin,
      wteDPC,
      qofPoints: round(qofPoints, 0),
      qofMaxPoints,
      appointments: 0, // Not available in current data
      dnaRate: 0,      // Not available in current data
      patientsPerGP,
      estimatedIncome: estimatedIncomeVal,
    });
  }

  console.log(`  Valid practices: ${practices.length}`);
  console.log(`  Skipped: ${skipped}`);

  // Build aggregates
  console.log('\nBuilding aggregates...');

  // National
  const nationalAggregate = createAggregate(practices, 'national', 'England', 'national');

  // Regions
  const regionGroups = new Map<string, Practice[]>();
  for (const p of practices) {
    if (!p.regionCode) continue;
    if (!regionGroups.has(p.regionCode)) {
      regionGroups.set(p.regionCode, []);
    }
    regionGroups.get(p.regionCode)!.push(p);
  }
  const regionAggregates: Aggregate[] = [];
  for (const [code, regionPractices] of regionGroups) {
    if (regionPractices.length < 5) continue;
    const name = regionPractices[0].regionName;
    regionAggregates.push(createAggregate(regionPractices, code, name, 'region'));
  }
  console.log(`  Regions: ${regionAggregates.length}`);

  // ICBs
  const icbGroups = new Map<string, Practice[]>();
  for (const p of practices) {
    if (!p.icbCode) continue;
    if (!icbGroups.has(p.icbCode)) {
      icbGroups.set(p.icbCode, []);
    }
    icbGroups.get(p.icbCode)!.push(p);
  }
  const icbAggregates: Aggregate[] = [];
  for (const [code, icbPractices] of icbGroups) {
    if (icbPractices.length < 3) continue;
    const name = icbPractices[0].icbName;
    icbAggregates.push(createAggregate(icbPractices, code, name, 'icb'));
  }
  console.log(`  ICBs: ${icbAggregates.length}`);

  // PCNs
  const pcnGroups = new Map<string, Practice[]>();
  for (const p of practices) {
    if (!p.pcnCode) continue;
    if (!pcnGroups.has(p.pcnCode)) {
      pcnGroups.set(p.pcnCode, []);
    }
    pcnGroups.get(p.pcnCode)!.push(p);
  }
  const pcnAggregates: Aggregate[] = [];
  for (const [code, pcnPractices] of pcnGroups) {
    if (pcnPractices.length < 2) continue;
    const name = pcnPractices[0].pcnName;
    pcnAggregates.push(createAggregate(pcnPractices, code, name, 'pcn'));
  }
  console.log(`  PCNs: ${pcnAggregates.length}`);

  // Build lookup (lightweight for search)
  const lookup = practices.map(p => ({
    code: p.code,
    name: p.name,
    postcode: p.postcode,
  }));

  // Create output
  const output = {
    generatedAt: new Date().toISOString(),
    dataDate: 'November 2025',
    practiceCount: practices.length,
    practices,
    aggregates: {
      national: nationalAggregate,
      regions: regionAggregates,
      icbs: icbAggregates,
      pcns: pcnAggregates,
    },
    lookup,
  };

  // Write output
  console.log('\nWriting output...');
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  const fileSizeBytes = fs.statSync(OUTPUT_PATH).size;
  const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);

  console.log(`\nDone! Output written to: ${OUTPUT_PATH}`);
  console.log(`File size: ${fileSizeMB} MB`);
  console.log(`\nSummary:`);
  console.log(`  Practices: ${practices.length}`);
  console.log(`  PCNs: ${pcnAggregates.length}`);
  console.log(`  ICBs: ${icbAggregates.length}`);
  console.log(`  Regions: ${regionAggregates.length}`);
  console.log(`  National median patients/GP: ${nationalAggregate.metrics.patientsPerGP.median}`);
}

// Run
processData().catch(console.error);
