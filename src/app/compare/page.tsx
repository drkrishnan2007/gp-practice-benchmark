"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AssessmentBadge } from "@/components/ui/AssessmentBadge";
import { formatCurrency, formatNumber, formatPercent, formatWTE } from "@/lib/format";
import { calculatePercentile, NHS_RATES } from "@/lib/calculations";
import { loadPracticeData, searchPractices, findPractice, getAggregate } from "@/lib/practice-data";
import type { Practice, Aggregate, PracticeLookup, MetricDistribution, AssessmentLevel } from "@/types/practice";

type ComparisonLevel = "pcn" | "icb" | "region" | "national";

// Assessment strategy determines how we interpret a metric
type AssessmentStrategy = "higher-better" | "lower-better" | "neutral" | "qof-absolute";

// Get QOF assessment based on absolute achievement percentage (not percentile)
function getQofAssessment(achievementRate: number): AssessmentLevel {
  // QOF achievement should be assessed on absolute performance:
  // - 95%+ is excellent
  // - 90-95% is good
  // - 85-90% may need attention
  // - <85% needs review
  if (achievementRate >= 0.95) return "good";
  if (achievementRate >= 0.90) return "neutral"; // Average performance
  if (achievementRate >= 0.85) return "stretched";
  return "concerning";
}

// Data structure from JSON
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

// Percentile bar component
function PercentileBar({ percentile, level }: { percentile: number; level: AssessmentLevel }) {
  const colors = {
    good: "bg-green-500",
    stretched: "bg-amber-500",
    concerning: "bg-red-500",
    neutral: "bg-slate-500",
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full relative">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-slate-300" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-400" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-slate-300" />
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${colors[level]} border-2 border-white shadow`}
          style={{ left: `calc(${Math.min(Math.max(percentile, 2), 98)}% - 6px)` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1 text-center">
        {Math.round(percentile)}th percentile
      </p>
    </div>
  );
}

// Metric card component
function MetricCard({
  label,
  value,
  formattedValue,
  distribution,
  comparisonLabel,
  strategy = "neutral",
}: {
  label: string;
  value: number;
  formattedValue: string;
  distribution: MetricDistribution;
  comparisonLabel: string;
  strategy?: AssessmentStrategy;
}) {
  const percentile = calculatePercentile(value, distribution);

  // Determine assessment level based on strategy
  let level: AssessmentLevel;
  let badgeLabels: Record<AssessmentLevel, string> | undefined;

  if (strategy === "qof-absolute") {
    // QOF uses absolute thresholds, not percentile
    level = getQofAssessment(value);
    badgeLabels = {
      good: "Excellent",
      neutral: "Good",
      stretched: "Average",
      concerning: "Below average",
    };
  } else if (strategy === "higher-better") {
    level = percentile >= 50 ? "good" : percentile >= 25 ? "stretched" : "concerning";
  } else if (strategy === "lower-better") {
    level = percentile <= 50 ? "good" : percentile <= 75 ? "stretched" : "concerning";
    badgeLabels = {
      good: "Good",
      stretched: "High",
      concerning: "Very high",
      neutral: "Info",
    };
  } else {
    // neutral - no judgment, just show the data
    level = "neutral";
  }

  const formatMedian = (v: number) => {
    if (label.includes("Income")) return formatCurrency(v);
    if (label.includes("Rate") || label.includes("Achievement")) return formatPercent(v);
    if (label.includes("WTE") || label.includes("per GP")) return v.toLocaleString(undefined, { maximumFractionDigits: 1 });
    return formatNumber(v);
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded-lg border border-slate-200 shadow-md">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-xs md:text-sm font-medium text-slate-600">{label}</p>
        {strategy !== "neutral" ? (
          <AssessmentBadge level={level} labels={badgeLabels} />
        ) : (
          <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
            Info
          </span>
        )}
      </div>
      <p className="text-xl md:text-2xl font-bold text-slate-800">{formattedValue}</p>
      <p className="text-xs md:text-sm text-slate-500 mt-1">
        {comparisonLabel} median: {formatMedian(distribution.median)}
      </p>
      <PercentileBar percentile={percentile} level={level} />
    </div>
  );
}

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Data state
  const [data, setData] = useState<PracticeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PracticeLookup[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [comparisonLevel, setComparisonLevel] = useState<ComparisonLevel>("pcn");

  // Custom WTE override
  const [customWteGPs, setCustomWteGPs] = useState<string>("");
  const [useCustomWte, setUseCustomWte] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadPracticeData()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Load practice from URL when data is ready
  useEffect(() => {
    if (!data) return;
    const code = searchParams.get("code");
    if (code) {
      const practice = findPractice(data.practices, code);
      if (practice) {
        setSelectedPractice(practice);
        setSearchQuery(practice.name);
      }
    }
  }, [data, searchParams]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (!data || query.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const results = searchPractices(data.lookup, query);
    setSearchResults(results);
    setShowResults(true);
  }, [data]);

  // Handle practice selection
  const handleSelectPractice = useCallback((lookup: PracticeLookup) => {
    if (!data) return;
    const practice = findPractice(data.practices, lookup.code);
    if (practice) {
      setSelectedPractice(practice);
      setSearchQuery(practice.name);
      setShowResults(false);
      // Reset custom WTE when changing practice
      setCustomWteGPs("");
      setUseCustomWte(false);
      router.push(`/compare?code=${practice.code}`, { scroll: false });
    }
  }, [data, router]);

  // Get current aggregate for comparison
  const currentAggregate = useMemo(() => {
    if (!data || !selectedPractice) return data?.aggregates.national || null;
    return getAggregate(selectedPractice, comparisonLevel, data.aggregates) || data.aggregates.national;
  }, [data, selectedPractice, comparisonLevel]);

  // Get comparison label
  const comparisonLabels: Record<ComparisonLevel, string> = {
    pcn: selectedPractice?.pcnName || "PCN",
    icb: selectedPractice?.icbName || "ICB",
    region: selectedPractice?.regionName || "Region",
    national: "National",
  };

  // Calculate effective WTE and patients per GP (using custom values if provided)
  const effectiveWteGPs = useMemo(() => {
    if (useCustomWte && customWteGPs) {
      const parsed = parseFloat(customWteGPs);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return selectedPractice?.wteGPs || 0;
  }, [useCustomWte, customWteGPs, selectedPractice?.wteGPs]);

  const effectivePatientsPerGP = useMemo(() => {
    if (!selectedPractice || effectiveWteGPs <= 0) return 0;
    return Math.round(selectedPractice.listSize / effectiveWteGPs);
  }, [selectedPractice, effectiveWteGPs]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-6">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold">GP Practice Comparison</h1>
            <p className="mt-2 text-teal-100">Loading practice data...</p>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md border p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading {data?.practiceCount?.toLocaleString() || ''} practices...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-100">
        <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-6">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-bold">GP Practice Comparison</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800">Failed to load practice data: {error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">GP Practice Comparison</h1>
          <p className="mt-2 text-teal-100">
            Compare your practice against {data.practiceCount.toLocaleString()} practices in England
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Section */}
        <section className="bg-white rounded-xl shadow-md border-l-4 border-l-teal-500 border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Find Your Practice</h2>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search by practice code or name
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="e.g. A81001 or 'Medical Centre'"
              className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
            />

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.code}
                    onClick={() => handleSelectPractice(result)}
                    className="w-full px-4 py-3 text-left hover:bg-teal-50 border-b border-slate-100 last:border-b-0"
                  >
                    <p className="font-medium text-slate-800">{result.name}</p>
                    <p className="text-sm text-slate-500">{result.code}</p>
                  </button>
                ))}
              </div>
            )}

            {showResults && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4">
                <p className="text-slate-500">No practices found matching &quot;{searchQuery}&quot;</p>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500 mt-3">
            Data from {data.dataDate}. {data.practiceCount.toLocaleString()} practices available.
          </p>
        </section>

        {/* Selected Practice Info */}
        {selectedPractice && currentAggregate && (
          <>
            <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">{selectedPractice.name}</h2>
                  <p className="text-slate-600 mt-1">{selectedPractice.code}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded">
                      {selectedPractice.pcnName}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded">
                      {selectedPractice.icbName}
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-sm rounded">
                      {selectedPractice.regionName}
                    </span>
                  </div>
                </div>
                <a
                  href="/health-check"
                  className="text-teal-600 hover:underline text-sm whitespace-nowrap"
                >
                  Use Health Check calculator &rarr;
                </a>
              </div>
            </section>

            {/* Custom WTE Override with Guidance */}
            <section className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              {/* Data Quality Note */}
              <div className="mb-4 pb-4 border-b border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-2">
                  About NHS Digital workforce data
                </p>
                <p className="text-xs text-amber-700">
                  WTE figures are self-reported by practices to the National Workforce Reporting System.
                  Data quality varies as there&apos;s no automatic validation against contracts or payroll.
                  Common issues include inconsistent session counting, unclear inclusion of registrars/locums,
                  and figures not being updated after staffing changes. If the figure below doesn&apos;t match
                  your actual staffing, enter your own WTE for more accurate comparisons.
                </p>
              </div>

              {/* WTE Input */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    Adjust WTE GPs
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    NHS Digital shows <strong>{formatWTE(selectedPractice.wteGPs)} WTE GPs</strong> for your practice.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder={formatWTE(selectedPractice.wteGPs)}
                    value={customWteGPs}
                    onChange={(e) => {
                      setCustomWteGPs(e.target.value);
                      setUseCustomWte(e.target.value !== "");
                    }}
                    className="w-24 px-3 py-2 text-sm border border-amber-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none bg-white"
                  />
                  <span className="text-sm text-amber-700">WTE</span>
                  {useCustomWte && (
                    <button
                      onClick={() => {
                        setCustomWteGPs("");
                        setUseCustomWte(false);
                      }}
                      className="text-xs text-amber-700 hover:text-amber-900 underline"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {useCustomWte && effectiveWteGPs > 0 && (
                <p className="text-sm text-amber-800 mb-4 p-2 bg-amber-100 rounded">
                  Using your figure: <strong>{formatWTE(effectiveWteGPs)} WTE GPs</strong> → {formatNumber(effectivePatientsPerGP)} patients per GP
                </p>
              )}

              {/* Calculation Methodology */}
              <details className="text-xs">
                <summary className="text-amber-800 font-medium cursor-pointer hover:text-amber-900">
                  How to calculate your WTE (NHS Digital methodology)
                </summary>
                <div className="mt-3 p-3 bg-white rounded border border-amber-200 text-slate-700">
                  <p className="font-medium mb-2">Formula: Hours per week ÷ 37.5 = WTE</p>

                  <p className="font-medium mt-3 mb-1">For GPs (using sessions):</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>1 session = 4 hours = 0.1 WTE</li>
                    <li>8 sessions/week = 0.85 WTE</li>
                    <li>10 sessions/week = 1.0 WTE</li>
                  </ul>

                  <p className="font-medium mt-3 mb-1">Example calculation:</p>
                  <div className="bg-slate-50 p-2 rounded font-mono text-xs">
                    GP Partner A: 8 sessions = 0.85 WTE<br/>
                    GP Partner B: 6 sessions = 0.64 WTE<br/>
                    Salaried GP: 8 sessions = 0.85 WTE<br/>
                    <span className="border-t border-slate-300 block mt-1 pt-1">
                      Total: 22 sessions = <strong>2.34 WTE</strong>
                    </span>
                  </div>

                  <p className="font-medium mt-3 mb-1">NHS Digital includes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>GP Partners, Salaried GPs, GP Retainers</li>
                    <li>GP Registrars (ST1-ST3)</li>
                    <li>Regular locums</li>
                  </ul>

                  <p className="font-medium mt-3 mb-1">NHS Digital excludes:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Ad-hoc locums (reported separately)</li>
                  </ul>

                  <p className="mt-3 text-slate-500">
                    <a
                      href="https://digital.nhs.uk/data-and-information/publications/statistical/general-and-personal-medical-services"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:underline"
                    >
                      NHS Digital GP Workforce methodology →
                    </a>
                  </p>
                </div>
              </details>
            </section>

            {/* Comparison Level Toggle */}
            <section className="bg-white rounded-xl shadow-md border border-slate-200 p-4 mb-6">
              <p className="text-sm font-medium text-slate-600 mb-3">Compare against:</p>
              <div className="grid grid-cols-4 gap-2">
                {(["pcn", "icb", "region", "national"] as ComparisonLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setComparisonLevel(level)}
                    className={`px-2 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                      comparisonLevel === level
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {level === "pcn" ? "PCN" : level === "icb" ? "ICB" : level === "region" ? "Region" : "National"}
                  </button>
                ))}
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-3">
                Comparing against {currentAggregate.practiceCount.toLocaleString()} practices in {comparisonLabels[comparisonLevel]}
              </p>
            </section>

            {/* Key Metrics Grid */}
            <section className="mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">Key Metrics</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <MetricCard
                  label="List Size"
                  value={selectedPractice.listSize}
                  formattedValue={formatNumber(selectedPractice.listSize)}
                  distribution={currentAggregate.metrics.listSize}
                  comparisonLabel={comparisonLabels[comparisonLevel]}
                  strategy="neutral"
                />
                <MetricCard
                  label={useCustomWte ? "Patients per GP (adjusted)" : "Patients per GP"}
                  value={effectivePatientsPerGP}
                  formattedValue={formatNumber(effectivePatientsPerGP)}
                  distribution={currentAggregate.metrics.patientsPerGP}
                  comparisonLabel={comparisonLabels[comparisonLevel]}
                  strategy="lower-better"
                />
                <MetricCard
                  label={useCustomWte ? "WTE GPs (adjusted)" : "WTE GPs"}
                  value={effectiveWteGPs}
                  formattedValue={formatWTE(effectiveWteGPs)}
                  distribution={currentAggregate.metrics.wteGPs}
                  comparisonLabel={comparisonLabels[comparisonLevel]}
                  strategy="neutral"
                />
                <MetricCard
                  label="QOF Achievement"
                  value={selectedPractice.qofMaxPoints > 0 ? selectedPractice.qofPoints / selectedPractice.qofMaxPoints : 0}
                  formattedValue={selectedPractice.qofMaxPoints > 0
                    ? formatPercent(selectedPractice.qofPoints / selectedPractice.qofMaxPoints)
                    : "N/A"}
                  distribution={currentAggregate.metrics.qofAchievement}
                  comparisonLabel={comparisonLabels[comparisonLevel]}
                  strategy="qof-absolute"
                />
                <MetricCard
                  label="WTE Nurses"
                  value={selectedPractice.wteNurses}
                  formattedValue={formatWTE(selectedPractice.wteNurses)}
                  distribution={currentAggregate.metrics.wteNurses}
                  comparisonLabel={comparisonLabels[comparisonLevel]}
                  strategy="neutral"
                />
                <MetricCard
                  label="Estimated Income"
                  value={selectedPractice.estimatedIncome}
                  formattedValue={formatCurrency(selectedPractice.estimatedIncome)}
                  distribution={currentAggregate.metrics.estimatedIncome}
                  comparisonLabel={comparisonLabels[comparisonLevel]}
                  strategy="neutral"
                />
              </div>
            </section>

            {/* Income Estimate Breakdown */}
            <section className="bg-teal-50 border border-teal-200 rounded-lg p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-teal-900 mb-2 md:mb-3">Income Estimate</h2>
              <p className="text-sm md:text-base text-teal-700 mb-4">
                Based on {formatNumber(selectedPractice.listSize)} patients and {formatNumber(selectedPractice.qofPoints)} QOF points:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-white rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm text-slate-500">Global Sum</p>
                  <p className="text-lg md:text-xl font-bold text-slate-800">
                    {formatCurrency(selectedPractice.listSize * NHS_RATES.globalSumPerPatient)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 hidden md:block">
                    {formatCurrency(NHS_RATES.globalSumPerPatient)} per patient
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 md:p-4">
                  <p className="text-xs md:text-sm text-slate-500">QOF</p>
                  <p className="text-lg md:text-xl font-bold text-slate-800">
                    {formatCurrency(selectedPractice.qofPoints * NHS_RATES.qofPointValue)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 hidden md:block">
                    {formatNumber(selectedPractice.qofPoints)} pts × {formatCurrency(NHS_RATES.qofPointValue)}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 md:p-4 col-span-2 md:col-span-1">
                  <p className="text-xs md:text-sm text-slate-500">Enhanced Services (est.)</p>
                  <p className="text-lg md:text-xl font-bold text-slate-800">
                    {formatCurrency(selectedPractice.listSize * NHS_RATES.typicalEnhancedServicesPerPatient)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 hidden md:block">
                    {formatCurrency(NHS_RATES.typicalEnhancedServicesPerPatient)}/patient typical
                  </p>
                </div>
              </div>
              <p className="text-sm text-teal-700 mt-4">
                Estimated using 2025/26 contract rates. Actual income varies by contract type and local arrangements.
              </p>
            </section>

            {/* Workforce Breakdown */}
            <section className="bg-white rounded-xl shadow-md border border-slate-200 p-4 md:p-6 mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-slate-800 mb-4">Workforce Breakdown</h2>
              <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                <table className="w-full text-left min-w-[320px]">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 text-xs md:text-sm font-medium text-slate-600">Role</th>
                      <th className="pb-3 text-xs md:text-sm font-medium text-slate-600 text-right">You</th>
                      <th className="pb-3 text-xs md:text-sm font-medium text-slate-600 text-right hidden sm:table-cell">{comparisonLabels[comparisonLevel]}</th>
                      <th className="pb-3 text-xs md:text-sm font-medium text-slate-600 text-right">National</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm md:text-base">
                    <tr className="border-b">
                      <td className="py-2 md:py-3 text-slate-800">
                        GPs
                        {useCustomWte && (
                          <span className="text-xs text-amber-600 ml-1">*</span>
                        )}
                      </td>
                      <td className="py-2 md:py-3 text-right font-medium">
                        {formatWTE(effectiveWteGPs)}
                      </td>
                      <td className="py-2 md:py-3 text-right text-slate-600 hidden sm:table-cell">{formatWTE(currentAggregate.metrics.wteGPs.median)}</td>
                      <td className="py-2 md:py-3 text-right text-slate-600">{formatWTE(data.aggregates.national.metrics.wteGPs.median)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 md:py-3 text-slate-800">Nurses</td>
                      <td className="py-2 md:py-3 text-right font-medium">{formatWTE(selectedPractice.wteNurses)}</td>
                      <td className="py-2 md:py-3 text-right text-slate-600 hidden sm:table-cell">{formatWTE(currentAggregate.metrics.wteNurses.median)}</td>
                      <td className="py-2 md:py-3 text-right text-slate-600">{formatWTE(data.aggregates.national.metrics.wteNurses.median)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 md:py-3 text-slate-800">Admin</td>
                      <td className="py-2 md:py-3 text-right font-medium">{formatWTE(selectedPractice.wteAdmin)}</td>
                      <td className="py-2 md:py-3 text-right text-slate-600 hidden sm:table-cell">-</td>
                      <td className="py-2 md:py-3 text-right text-slate-600">-</td>
                    </tr>
                    <tr>
                      <td className="py-2 md:py-3 text-slate-800">DPC</td>
                      <td className="py-2 md:py-3 text-right font-medium">{formatWTE(selectedPractice.wteDPC)}</td>
                      <td className="py-2 md:py-3 text-right text-slate-600 hidden sm:table-cell">-</td>
                      <td className="py-2 md:py-3 text-right text-slate-600">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs md:text-sm text-slate-500 mt-3">
                DPC = Direct Patient Care (pharmacists, physios, etc.)
                {useCustomWte && <span className="block mt-1">* Using your adjusted WTE figure</span>}
              </p>
            </section>
          </>
        )}

        {/* Empty State */}
        {!selectedPractice && (
          <section className="bg-white rounded-xl shadow-md border border-slate-200 p-8 text-center">
            <p className="text-slate-500 text-lg">
              Search for your practice above to see how you compare
            </p>
            <p className="text-slate-400 mt-2">
              Enter your practice code, name, or postcode to get started
            </p>
          </section>
        )}

        {/* Data Sources */}
        <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Data Sources</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://digital.nhs.uk/data-and-information/publications/statistical/general-and-personal-medical-services"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                GP Workforce Data - NHS England Digital &rarr;
              </a>
            </li>
            <li>
              <a
                href="https://digital.nhs.uk/data-and-information/publications/statistical/quality-and-outcomes-framework-achievement-prevalence-and-exceptions-data"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                Quality and Outcomes Framework - NHS England Digital &rarr;
              </a>
            </li>
            <li>
              <a
                href="https://digital.nhs.uk/data-and-information/publications/statistical/patients-registered-at-a-gp-practice"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                Patients Registered at a GP Practice - NHS England Digital &rarr;
              </a>
            </li>
          </ul>
          <p className="text-sm text-slate-500 mt-4">
            Data from {data.dataDate}. Updated monthly from NHS Digital publications.
          </p>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p>
            Independent tool by <a href="https://aryash.health" className="text-teal-400 hover:underline">Aryash Health</a>
          </p>
          <p className="mt-2 text-slate-400 text-sm">
            Data sourced from NHS Digital. This tool is for information only and does not constitute financial or business advice.
          </p>
          <p className="mt-4 space-x-4">
            <a href="/" className="text-teal-400 hover:underline">
              &larr; Back to Tools Home
            </a>
            <span className="text-slate-600">|</span>
            <a href="/blog" className="text-teal-400 hover:underline">
              Blog
            </a>
            <span className="text-slate-600">|</span>
            <a href="https://tools.aryash.health/privacy.html" className="text-teal-400 hover:underline">
              Privacy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// Loading fallback for Suspense
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">GP Practice Comparison</h1>
          <p className="mt-2 text-teal-100">
            Loading...
          </p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-slate-200 rounded w-full"></div>
        </div>
      </main>
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function ComparePage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ComparePageContent />
    </Suspense>
  );
}
