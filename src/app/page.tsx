"use client";

import { useState, useMemo } from "react";

// Published NHS Data 2025/26
const NHS_DATA = {
  // Income rates
  globalSumPerPatient: 121.79, // £ per weighted patient 2025/26
  qofPointValue: 225.49, // £ per point 2025/26
  qofMaxPoints: 564, // Maximum QOF points
  typicalEnhancedServicesPerPatient: 25, // Estimated average

  // Staffing benchmarks
  averagePatientsPerGP: 2228, // RCGP 2024
  londonPatientsPerGP: 2560,
  southWestPatientsPerGP: 2020,
  deprivedAreaPatientsPerGP: 2450,
  nurseToGPRatio: 0.5, // 1 nurse per 2 GPs

  // Financial benchmarks
  staffCostsPercentLow: 0.60,
  staffCostsPercentTypical: 0.65,
  staffCostsPercentHigh: 0.70,
  averagePartnerDrawings: 140200, // NHS Digital 2022/23
  salariedGPMin: 68975,
  salariedGPMax: 104085,

  // Employer on-costs (NI + pension)
  employerOnCostsPct: 0.2818, // 14.38% pension + 13.8% NI = 28.18%

  // Trends
  gpPartnerDeclineSince2015: 0.275, // 27.5%
  patientsPerGPIncreaseSince2015: 290,
  listSizeIncreasePct: 0.40, // 40%
  practiceNumberDeclinePct: 0.20, // 20%
};

// Role definitions with typical salaries (base salary before on-costs)
const HIRING_ROLES = [
  { id: "salaried-gp", name: "Salaried GP", salary: 76000, band: "Mid-range" },
  { id: "salaried-gp-experienced", name: "Salaried GP (Experienced)", salary: 95000, band: "Upper range" },
  { id: "anp", name: "Advanced Nurse Practitioner", salary: 53000, band: "Band 7" },
  { id: "practice-nurse-senior", name: "Practice Nurse (Senior)", salary: 44000, band: "Band 6" },
  { id: "practice-nurse", name: "Practice Nurse", salary: 36000, band: "Band 5" },
  { id: "hca", name: "Healthcare Assistant", salary: 25000, band: "Band 3" },
  { id: "practice-manager", name: "Practice Manager", salary: 48000, band: "Typical" },
  { id: "receptionist", name: "Receptionist", salary: 24000, band: "Band 3" },
  { id: "administrator", name: "Administrator/Secretary", salary: 26000, band: "Band 3-4" },
  { id: "custom", name: "Custom role...", salary: 0, band: "" },
];

// Data sources for references
const DATA_SOURCES = [
  { name: "NHS England Digital - GP Earnings 2023/24", url: "https://digital.nhs.uk/data-and-information/publications/statistical/gp-earnings-and-expenses-estimates/2023-24" },
  { name: "RCGP - Key Statistics 2024", url: "https://www.rcgp.org.uk/representing-you/key-statistics-insights" },
  { name: "BMA - GP Contract 2025/26", url: "https://www.bma.org.uk/pay-and-contracts/contracts/gp-contract/gp-contract-changes-england-202526" },
  { name: "BMA - Pressures in General Practice", url: "https://www.bma.org.uk/advice-and-support/nhs-delivery-and-workforce/pressures/pressures-in-general-practice-data-analysis" },
];

type AssessmentLevel = "good" | "stretched" | "concerning" | "neutral";

interface Assessment {
  level: AssessmentLevel;
  title: string;
  message: string;
}

function getGPAssessment(patientsPerGP: number): Assessment {
  if (patientsPerGP <= NHS_DATA.southWestPatientsPerGP) {
    return {
      level: "good",
      title: "Good capacity",
      message: `At ${patientsPerGP.toLocaleString()} patients per GP, you have better capacity than the England average of ${NHS_DATA.averagePatientsPerGP.toLocaleString()}.`,
    };
  } else if (patientsPerGP <= NHS_DATA.averagePatientsPerGP) {
    return {
      level: "good",
      title: "Typical for England",
      message: `At ${patientsPerGP.toLocaleString()} patients per GP, you're in line with the England average of ${NHS_DATA.averagePatientsPerGP.toLocaleString()}.`,
    };
  } else if (patientsPerGP <= NHS_DATA.deprivedAreaPatientsPerGP) {
    return {
      level: "stretched",
      title: "Above average workload",
      message: `At ${patientsPerGP.toLocaleString()} patients per GP, you're above the England average. This is common - many practices face similar workforce pressures.`,
    };
  } else {
    return {
      level: "concerning",
      title: "High workload",
      message: `At ${patientsPerGP.toLocaleString()} patients per GP, workload is higher than most practices. This is worth monitoring for sustainability.`,
    };
  }
}

function getStaffCostAssessment(staffCostsPct: number): Assessment {
  if (staffCostsPct < NHS_DATA.staffCostsPercentLow) {
    return {
      level: "good",
      title: "Efficient staffing",
      message: `Staff costs at ${(staffCostsPct * 100).toFixed(0)}% is below the typical 65-70% range - this often indicates efficient operations and leaves more room for partner drawings.`,
    };
  } else if (staffCostsPct <= NHS_DATA.staffCostsPercentHigh) {
    return {
      level: "good",
      title: "Typical range",
      message: `Staff costs at ${(staffCostsPct * 100).toFixed(0)}% is within the typical 65-70% range for GP practices.`,
    };
  } else if (staffCostsPct <= 0.80) {
    return {
      level: "stretched",
      title: "Above typical",
      message: `Staff costs at ${(staffCostsPct * 100).toFixed(0)}% is above the typical 65-70% range. This reduces the margin available for partner drawings.`,
    };
  } else {
    return {
      level: "concerning",
      title: "High staff costs",
      message: `Staff costs at ${(staffCostsPct * 100).toFixed(0)}% is well above typical. It may be worth reviewing whether current staffing levels are sustainable.`,
    };
  }
}

function AssessmentBadge({ level }: { level: AssessmentLevel }) {
  const styles = {
    good: "bg-green-100 text-green-800 border-green-200",
    stretched: "bg-yellow-100 text-yellow-800 border-yellow-200",
    concerning: "bg-red-100 text-red-800 border-red-200",
    neutral: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[level]}`}>
      {level === "good" && "On track"}
      {level === "stretched" && "Stretched"}
      {level === "concerning" && "Needs attention"}
      {level === "neutral" && "Note"}
    </span>
  );
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Home() {
  // Phase 1: Basic inputs
  const [listSize, setListSize] = useState<string>("");
  const [wteGPs, setWteGPs] = useState<string>("");

  // Phase 2: Financial inputs
  const [useEstimatedIncome, setUseEstimatedIncome] = useState(true);
  const [actualIncome, setActualIncome] = useState<string>("");
  const [staffCosts, setStaffCosts] = useState<string>("");

  // Phase 3: Detailed inputs
  const [wteNurses, setWteNurses] = useState<string>("");
  const [wteAdmin, setWteAdmin] = useState<string>("");
  const [numPartners, setNumPartners] = useState<string>("");

  // Hiring calculator
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [customSalary, setCustomSalary] = useState<string>("");

  // Calculations
  const calculations = useMemo(() => {
    const list = parseFloat(listSize) || 0;
    const gps = parseFloat(wteGPs) || 0;
    const nurses = parseFloat(wteNurses) || 0;
    const admin = parseFloat(wteAdmin) || 0;
    const partners = parseFloat(numPartners) || 0;

    // Income estimates
    const estimatedGlobalSum = list * NHS_DATA.globalSumPerPatient;
    const estimatedQOF = NHS_DATA.qofPointValue * NHS_DATA.qofMaxPoints * (list / 8000); // Scaled by practice size
    const estimatedEnhanced = list * NHS_DATA.typicalEnhancedServicesPerPatient;
    const estimatedTotalIncome = estimatedGlobalSum + estimatedQOF + estimatedEnhanced;

    const income = useEstimatedIncome
      ? estimatedTotalIncome
      : (parseFloat(actualIncome) || 0);

    const staffCostsAmount = parseFloat(staffCosts) || 0;
    const staffCostsPct = income > 0 ? staffCostsAmount / income : 0;

    // GP benchmarks
    const patientsPerGP = gps > 0 ? list / gps : 0;
    const benchmarkGPs = list / NHS_DATA.averagePatientsPerGP;
    const gpGap = benchmarkGPs - gps;
    const gpGapPct = gps > 0 ? (gpGap / benchmarkGPs) * 100 : 0;

    // Nurse benchmarks
    const benchmarkNurses = benchmarkGPs * NHS_DATA.nurseToGPRatio;
    const nurseGap = benchmarkNurses - nurses;

    // Staff costs benchmarks
    const benchmarkStaffCostsLow = income * NHS_DATA.staffCostsPercentLow;
    const benchmarkStaffCostsTypical = income * NHS_DATA.staffCostsPercentTypical;
    const benchmarkStaffCostsHigh = income * NHS_DATA.staffCostsPercentHigh;

    // Profit estimates
    const estimatedProfit = income - staffCostsAmount - (income * 0.15); // 15% for other costs
    const profitPerPartner = partners > 0 ? estimatedProfit / partners : 0;

    return {
      list,
      gps,
      nurses,
      admin,
      partners,
      estimatedGlobalSum,
      estimatedQOF,
      estimatedEnhanced,
      estimatedTotalIncome,
      income,
      staffCostsAmount,
      staffCostsPct,
      patientsPerGP,
      benchmarkGPs,
      gpGap,
      gpGapPct,
      benchmarkNurses,
      nurseGap,
      benchmarkStaffCostsLow,
      benchmarkStaffCostsTypical,
      benchmarkStaffCostsHigh,
      estimatedProfit,
      profitPerPartner,
    };
  }, [listSize, wteGPs, wteNurses, wteAdmin, numPartners, useEstimatedIncome, actualIncome, staffCosts]);

  // Hiring calculator calculations
  const hiringCalculations = useMemo(() => {
    if (!selectedRole || calculations.income === 0 || calculations.staffCostsAmount === 0) {
      return null;
    }

    const role = HIRING_ROLES.find(r => r.id === selectedRole);
    if (!role) return null;

    const baseSalary = selectedRole === "custom"
      ? (parseFloat(customSalary) || 0)
      : role.salary;

    if (baseSalary === 0) return null;

    // Total cost including employer on-costs
    const totalCost = baseSalary * (1 + NHS_DATA.employerOnCostsPct);
    const onCostsAmount = baseSalary * NHS_DATA.employerOnCostsPct;

    // New staff costs
    const newStaffCosts = calculations.staffCostsAmount + totalCost;
    const newStaffCostsPct = newStaffCosts / calculations.income;
    const staffCostsPctChange = newStaffCostsPct - calculations.staffCostsPct;

    // Impact on profit
    const newProfit = calculations.income - newStaffCosts - (calculations.income * 0.15);
    const newProfitPerPartner = calculations.partners > 0 ? newProfit / calculations.partners : 0;
    const profitPerPartnerChange = newProfitPerPartner - calculations.profitPerPartner;

    // Assessment
    let assessment: { level: AssessmentLevel; message: string };
    if (newStaffCostsPct <= NHS_DATA.staffCostsPercentHigh) {
      assessment = {
        level: "good",
        message: "This hire would keep your staff costs within the typical range.",
      };
    } else if (newStaffCostsPct <= 0.75) {
      assessment = {
        level: "stretched",
        message: "This hire would take staff costs above 70%. Many practices operate at this level, though it does reduce partner margins.",
      };
    } else {
      assessment = {
        level: "concerning",
        message: "This would be a significant increase in staff costs. Worth considering whether the role will generate additional income or savings to offset the cost.",
      };
    }

    return {
      roleName: selectedRole === "custom" ? "Custom role" : role.name,
      baseSalary,
      onCostsAmount,
      totalCost,
      newStaffCosts,
      newStaffCostsPct,
      staffCostsPctChange,
      newProfitPerPartner,
      profitPerPartnerChange,
      assessment,
    };
  }, [selectedRole, customSalary, calculations]);

  const hasBasicInputs = calculations.list > 0 && calculations.gps > 0;
  const hasFinancialInputs = calculations.income > 0 && calculations.staffCostsAmount > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">GP Practice Health Check</h1>
          <p className="mt-2 text-teal-100">
            Compare your practice against published NHS benchmarks
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <p className="text-lg text-slate-700">
            This tool helps GP partners see how their practice compares to published NHS data.
            Enter your numbers below to get an honest assessment — whether that&apos;s reassurance
            that you&apos;re on track, or a gentle prompt to look at certain areas.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            All benchmarks are from official NHS sources (2024/25 and 2025/26 data).
          </p>
          <p className="mt-4">
            <a href="/compare" className="text-teal-600 hover:underline font-medium">
              Compare your practice to others in your PCN, ICB, and region &rarr;
            </a>
          </p>
        </div>

        {/* Phase 1: Basic Staffing */}
        <section className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            1. Basic Practice Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Practice list size (patients)
              </label>
              <input
                type="number"
                value={listSize}
                onChange={(e) => setListSize(e.target.value)}
                placeholder="e.g. 12000"
                className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Total WTE GPs (partners + salaried)
              </label>
              <input
                type="number"
                step="0.1"
                value={wteGPs}
                onChange={(e) => setWteGPs(e.target.value)}
                placeholder="e.g. 5.0"
                className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Phase 1 Results */}
          {hasBasicInputs && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-3">GP Staffing Assessment</h3>

              <div className="flex items-start gap-3 mb-4">
                <AssessmentBadge level={getGPAssessment(calculations.patientsPerGP).level} />
                <div>
                  <p className="font-medium text-slate-800">
                    {getGPAssessment(calculations.patientsPerGP).title}
                  </p>
                  <p className="text-slate-600 mt-1">
                    {getGPAssessment(calculations.patientsPerGP).message}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-slate-500">Your patients per GP</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {calculations.patientsPerGP.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-slate-500">England average</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {NHS_DATA.averagePatientsPerGP.toLocaleString()}
                  </p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-slate-500">Benchmark WTE GPs</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {calculations.benchmarkGPs.toFixed(1)}
                  </p>
                  {calculations.gpGap > 0.5 && (
                    <p className="text-sm text-amber-600 mt-1">
                      ({calculations.gpGap.toFixed(1)} below benchmark)
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-500 mt-4">
                Context: Since 2015, patients per GP have increased by {NHS_DATA.patientsPerGPIncreaseSince2015} (+15%),
                while GP partner numbers have fallen by {(NHS_DATA.gpPartnerDeclineSince2015 * 100).toFixed(0)}%.
              </p>
            </div>
          )}
        </section>

        {/* Phase 2: Financial Context */}
        <section className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            2. Financial Picture
          </h2>

          {/* Income section */}
          <div className="mb-6">
            <h3 className="font-medium text-slate-700 mb-3">Practice Income</h3>

            {calculations.list > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 mb-2">
                  Based on your list size of {calculations.list.toLocaleString()} patients,
                  estimated NHS income is:
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(calculations.estimatedTotalIncome)}
                </p>
                <div className="text-sm text-blue-700 mt-2 space-y-1">
                  <p>Global Sum: {formatCurrency(calculations.estimatedGlobalSum)}</p>
                  <p>QOF (estimated max): {formatCurrency(calculations.estimatedQOF)}</p>
                  <p>Enhanced Services (typical): {formatCurrency(calculations.estimatedEnhanced)}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={useEstimatedIncome}
                  onChange={() => setUseEstimatedIncome(true)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-slate-700">Use estimated income</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!useEstimatedIncome}
                  onChange={() => setUseEstimatedIncome(false)}
                  className="w-4 h-4 text-teal-600"
                />
                <span className="text-slate-700">Enter actual income</span>
              </label>
            </div>

            {!useEstimatedIncome && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Total annual income (all sources including private)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">£</span>
                  <input
                    type="number"
                    value={actualIncome}
                    onChange={(e) => setActualIncome(e.target.value)}
                    placeholder="e.g. 1800000"
                    className="w-full pl-8 pr-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Staff costs section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Annual staff costs (salaries, NI, pensions - excluding partner drawings)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">£</span>
              <input
                type="number"
                value={staffCosts}
                onChange={(e) => setStaffCosts(e.target.value)}
                placeholder="e.g. 1100000"
                className="w-full pl-8 pr-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>
            {calculations.income > 0 && (
              <p className="text-sm text-slate-500 mt-2">
                Typical range: {formatCurrency(calculations.benchmarkStaffCostsLow)} - {formatCurrency(calculations.benchmarkStaffCostsHigh)}
                (60-70% of income)
              </p>
            )}
          </div>

          {/* Phase 2 Results */}
          {hasFinancialInputs && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-3">Financial Assessment</h3>

              <div className="flex items-start gap-3 mb-4">
                <AssessmentBadge level={getStaffCostAssessment(calculations.staffCostsPct).level} />
                <div>
                  <p className="font-medium text-slate-800">
                    {getStaffCostAssessment(calculations.staffCostsPct).title}
                  </p>
                  <p className="text-slate-600 mt-1">
                    {getStaffCostAssessment(calculations.staffCostsPct).message}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-slate-500">Your staff costs</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {(calculations.staffCostsPct * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-slate-500">of income</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-slate-500">Typical range</p>
                  <p className="text-2xl font-bold text-slate-800">65-70%</p>
                  <p className="text-sm text-slate-500">of income</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-slate-500">Remaining for profit + costs</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {((1 - calculations.staffCostsPct) * 100).toFixed(0)}%
                  </p>
                  <p className="text-sm text-slate-500">{formatCurrency(calculations.income - calculations.staffCostsAmount)}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Hiring Calculator */}
        {hasFinancialInputs && (
          <section className="bg-gradient-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-teal-900 mb-2">
              Thinking of Hiring?
            </h2>
            <p className="text-teal-700 mb-4">
              See the financial impact of adding a new team member.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role you&apos;re considering
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white"
                >
                  <option value="">Select a role...</option>
                  {HIRING_ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name} {role.band && `(${role.band})`}
                      {role.salary > 0 && ` - ${formatCurrency(role.salary)}`}
                    </option>
                  ))}
                </select>
              </div>

              {selectedRole === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Annual salary (before on-costs)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">£</span>
                    <input
                      type="number"
                      value={customSalary}
                      onChange={(e) => setCustomSalary(e.target.value)}
                      placeholder="e.g. 45000"
                      className="w-full pl-8 pr-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Hiring Impact Results */}
            {hiringCalculations && (
              <div className="bg-white rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3 mb-4">
                  <AssessmentBadge level={hiringCalculations.assessment.level} />
                  <p className="text-slate-700">{hiringCalculations.assessment.message}</p>
                </div>

                <h3 className="font-semibold text-slate-800 mb-3">
                  Impact of hiring a {hiringCalculations.roleName}
                </h3>

                {/* Cost breakdown */}
                <div className="bg-slate-50 rounded p-3 mb-4">
                  <p className="text-sm text-slate-600 mb-2">Total cost to practice:</p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-slate-500">Base salary</p>
                      <p className="font-semibold">{formatCurrency(hiringCalculations.baseSalary)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">On-costs (28%)</p>
                      <p className="font-semibold">{formatCurrency(hiringCalculations.onCostsAmount)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Total cost</p>
                      <p className="font-bold text-teal-700">{formatCurrency(hiringCalculations.totalCost)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    On-costs include employer NI (13.8%) and pension (14.38%)
                  </p>
                </div>

                {/* Impact metrics */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded p-3">
                    <p className="text-sm text-slate-500 mb-1">Staff costs would change</p>
                    <p className="text-lg">
                      <span className="font-bold">{(calculations.staffCostsPct * 100).toFixed(0)}%</span>
                      <span className="mx-2">→</span>
                      <span className="font-bold text-teal-700">{(hiringCalculations.newStaffCostsPct * 100).toFixed(0)}%</span>
                    </p>
                    <p className="text-sm text-slate-500">
                      (+{(hiringCalculations.staffCostsPctChange * 100).toFixed(1)} percentage points)
                    </p>
                  </div>

                  {calculations.partners > 0 && (
                    <div className="bg-slate-50 rounded p-3">
                      <p className="text-sm text-slate-500 mb-1">Profit per partner would change</p>
                      <p className="text-lg">
                        <span className="font-bold">{formatCurrency(calculations.profitPerPartner)}</span>
                        <span className="mx-2">→</span>
                        <span className="font-bold text-teal-700">{formatCurrency(hiringCalculations.newProfitPerPartner)}</span>
                      </p>
                      <p className="text-sm text-red-600">
                        ({formatCurrency(hiringCalculations.profitPerPartnerChange)} per partner)
                      </p>
                    </div>
                  )}
                </div>

                {/* Helpful note */}
                <p className="text-sm text-slate-500 mt-4 p-3 bg-amber-50 rounded border border-amber-200">
                  <strong>Consider:</strong> Will this hire generate income (e.g., a salaried GP seeing patients)
                  or free up capacity elsewhere? The financial impact may be offset by increased revenue or efficiency.
                </p>
              </div>
            )}

            {!hiringCalculations && selectedRole && selectedRole !== "custom" && (
              <p className="text-sm text-teal-700 italic">
                Enter your staff costs above to see the hiring impact.
              </p>
            )}
          </section>
        )}

        {/* Phase 3: Detailed Analysis */}
        <section className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            3. Detailed Breakdown (Optional)
          </h2>
          <p className="text-slate-600 mb-4">
            Add more detail for a fuller picture of your practice.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                WTE Practice Nurses
              </label>
              <input
                type="number"
                step="0.1"
                value={wteNurses}
                onChange={(e) => setWteNurses(e.target.value)}
                placeholder="e.g. 3.0"
                className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
              {hasBasicInputs && (
                <p className="text-sm text-slate-500 mt-1">
                  Benchmark: {calculations.benchmarkNurses.toFixed(1)} WTE
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                WTE Admin Staff
              </label>
              <input
                type="number"
                step="0.1"
                value={wteAdmin}
                onChange={(e) => setWteAdmin(e.target.value)}
                placeholder="e.g. 8.0"
                className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Number of Partners (WTE)
              </label>
              <input
                type="number"
                step="0.1"
                value={numPartners}
                onChange={(e) => setNumPartners(e.target.value)}
                placeholder="e.g. 3.0"
                className="w-full px-4 py-3 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-600 focus:border-teal-600 outline-none"
              />
            </div>
          </div>

          {/* Partner profit estimate */}
          {hasFinancialInputs && calculations.partners > 0 && (
            <div className="mt-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-3">Partner Drawings Estimate</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-slate-500">Estimated profit per partner</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatCurrency(calculations.profitPerPartner)}
                  </p>
                  <p className="text-sm text-slate-500">pre-tax</p>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-slate-500">National average (2022/23)</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {formatCurrency(NHS_DATA.averagePartnerDrawings)}
                  </p>
                  <p className="text-sm text-slate-500">pre-tax</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 mt-3">
                Note: This estimate assumes ~15% of income goes to premises, admin and other costs.
                Actual figures depend on your specific circumstances.
              </p>
            </div>
          )}

          {/* Nurse comparison */}
          {hasBasicInputs && calculations.nurses > 0 && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-2">Nursing Staff</h3>
              <p className="text-slate-600">
                You have {calculations.nurses} WTE nurses.
                The typical ratio is 1 nurse per 2 GPs, suggesting {calculations.benchmarkNurses.toFixed(1)} WTE for your GP numbers.
                {calculations.nurseGap > 0.5 && (
                  <span className="text-amber-600"> You may be {calculations.nurseGap.toFixed(1)} WTE below typical levels.</span>
                )}
                {calculations.nurseGap < -0.5 && (
                  <span className="text-green-600"> You have good nursing coverage.</span>
                )}
              </p>
            </div>
          )}
        </section>

        {/* ARRS Information */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">
            About ARRS-Funded Roles
          </h2>
          <p className="text-blue-800 mb-3">
            The benchmarks above focus on <strong>practice-funded staff</strong>. Your PCN should also
            provide ARRS-funded roles at no direct cost to the practice:
          </p>
          <ul className="text-blue-800 space-y-1 ml-4 list-disc">
            <li>Clinical Pharmacists (up to £66,972 reimbursed per WTE)</li>
            <li>Care Coordinators</li>
            <li>Social Prescribing Link Workers</li>
            <li>First Contact Physiotherapists</li>
            <li>Paramedics and Physician Associates</li>
            <li>Mental Health Practitioners</li>
            <li>Newly qualified GPs (from 2024/25)</li>
            <li>Practice Nurses (from 2025/26)</li>
          </ul>
          <p className="text-sm text-blue-700 mt-3">
            ARRS funding for 2025/26: £1.70 billion nationally (£26.63 per weighted patient).
          </p>
        </section>

        {/* Context: The Bigger Picture */}
        <section className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            The Bigger Picture
          </h2>
          <p className="text-slate-600 mb-4">
            If your practice is stretched, you&apos;re not alone. The data shows systemic pressure
            across general practice:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-3xl font-bold text-amber-800">27.5%</p>
              <p className="text-amber-700">fewer GP partners since 2015</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-3xl font-bold text-amber-800">+15%</p>
              <p className="text-amber-700">more patients per GP since 2015</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-3xl font-bold text-amber-800">20%</p>
              <p className="text-amber-700">fewer practices in the last decade</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-3xl font-bold text-amber-800">+40%</p>
              <p className="text-amber-700">average list size increase</p>
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">
            Data Sources
          </h2>
          <p className="text-slate-600 mb-4">
            All figures in this tool come from published NHS and official sources:
          </p>
          <ul className="space-y-2">
            {DATA_SOURCES.map((source, index) => (
              <li key={index}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:underline"
                >
                  {source.name} →
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-slate-500">
          <p>
            Independent tool by <a href="https://aryash.health" className="text-teal-600 hover:underline">Aryash Health</a>
          </p>
          <p className="mt-1">
            Data sourced from NHS Digital. This tool is for information only and does not constitute financial or business advice.
          </p>
        </footer>
      </main>
    </div>
  );
}
