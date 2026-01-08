import type { MetricDistribution, AssessmentLevel, Assessment } from "@/types/practice";

/**
 * Calculate the percentile position of a value within a distribution
 * Uses linear interpolation between known percentile points
 */
export function calculatePercentile(
  value: number,
  distribution: MetricDistribution
): number {
  const { p10, p25, median, p75, p90, min, max } = distribution;

  // Handle edge cases
  if (value <= min) return 0;
  if (value >= max) return 100;

  // Interpolate between known percentile points
  const points = [
    { percentile: 0, value: min },
    { percentile: 10, value: p10 },
    { percentile: 25, value: p25 },
    { percentile: 50, value: median },
    { percentile: 75, value: p75 },
    { percentile: 90, value: p90 },
    { percentile: 100, value: max },
  ];

  // Find the two points to interpolate between
  for (let i = 0; i < points.length - 1; i++) {
    const lower = points[i];
    const upper = points[i + 1];

    if (value >= lower.value && value <= upper.value) {
      // Linear interpolation
      const ratio = (value - lower.value) / (upper.value - lower.value);
      return lower.percentile + ratio * (upper.percentile - lower.percentile);
    }
  }

  return 50; // Fallback to median
}

/**
 * Get assessment level based on percentile position
 * @param percentile - The percentile (0-100)
 * @param higherIsBetter - If true, higher percentile = good. If false, lower percentile = good
 */
export function getAssessmentLevel(
  percentile: number,
  higherIsBetter: boolean = true
): AssessmentLevel {
  // For "higher is better" metrics (e.g., QOF achievement)
  // >= 50th percentile = good, 25-50 = stretched, <25 = concerning

  // For "lower is better" metrics (e.g., DNA rate)
  // <= 50th percentile = good, 50-75 = stretched, >75 = concerning

  if (higherIsBetter) {
    if (percentile >= 50) return "good";
    if (percentile >= 25) return "stretched";
    return "concerning";
  } else {
    if (percentile <= 50) return "good";
    if (percentile <= 75) return "stretched";
    return "concerning";
  }
}

/**
 * Generate an assessment with message for a metric
 */
export function getMetricAssessment(
  metricName: string,
  value: number,
  percentile: number,
  comparisonMedian: number,
  comparisonLabel: string,
  higherIsBetter: boolean = true,
  formatValue: (v: number) => string = (v) => v.toLocaleString()
): Assessment {
  const level = getAssessmentLevel(percentile, higherIsBetter);
  const formattedValue = formatValue(value);
  const formattedMedian = formatValue(comparisonMedian);
  const percentileRounded = Math.round(percentile);

  const titles: Record<AssessmentLevel, string> = {
    good: "On track",
    stretched: "Stretched",
    concerning: "Needs attention",
    neutral: "Note",
  };

  let message: string;
  const comparison = higherIsBetter
    ? value >= comparisonMedian ? "above" : "below"
    : value <= comparisonMedian ? "below" : "above";

  if (level === "good") {
    message = `Your ${metricName} of ${formattedValue} is ${comparison} the ${comparisonLabel} of ${formattedMedian}. You're in the ${percentileRounded}th percentile.`;
  } else if (level === "stretched") {
    message = `Your ${metricName} of ${formattedValue} is ${comparison} the ${comparisonLabel} of ${formattedMedian}. This puts you in the ${percentileRounded}th percentile.`;
  } else {
    message = `Your ${metricName} of ${formattedValue} is notably ${comparison} the ${comparisonLabel} of ${formattedMedian}. You're in the ${percentileRounded}th percentile - worth reviewing.`;
  }

  return {
    level,
    title: titles[level],
    message,
  };
}

/**
 * NHS 2025/26 contract rates for income estimation
 */
export const NHS_RATES = {
  globalSumPerPatient: 121.79,  // £ per weighted patient
  qofPointValue: 225.49,       // £ per point
  qofMaxPoints: 564,           // Maximum QOF points
  typicalEnhancedServicesPerPatient: 25, // Estimated average
};

/**
 * Estimate practice income from list size and QOF points
 */
export function estimateIncome(listSize: number, qofPoints: number): number {
  const globalSum = listSize * NHS_RATES.globalSumPerPatient;
  const qofIncome = qofPoints * NHS_RATES.qofPointValue;
  const enhancedServices = listSize * NHS_RATES.typicalEnhancedServicesPerPatient;

  return globalSum + qofIncome + enhancedServices;
}
