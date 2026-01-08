import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GP Practice Tools | Aryash Health",
  description: "Free tools for GP partners and practice managers. Benchmark your practice against NHS Digital data - workforce, finances, and QOF performance.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <p className="text-teal-200 text-sm font-medium mb-2">Aryash Health</p>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Tools for GP Professionals
              </h1>
              <p className="text-teal-100 text-lg max-w-2xl">
                Practical resources to help GP partners and practice managers understand
                their practice performance against NHS benchmarks.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Tools Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Practice Tools</h2>
          <p className="text-slate-600 mb-8">
            Free tools using published NHS Digital data to help you benchmark your practice.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Health Check Tool Card */}
            <Link
              href="/health-check"
              className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-800 group-hover:text-teal-700 transition-colors mb-2">
                    Practice Health Check
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Enter your practice details to get personalised assessments on workforce capacity,
                    income estimates, and staffing costs against NHS benchmarks.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Income calculator</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Staffing analysis</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Hiring costs</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-teal-600 text-sm font-medium">
                Open Health Check
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Compare Tool Card */}
            <Link
              href="/compare"
              className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-800 group-hover:text-teal-700 transition-colors mb-2">
                    Practice Comparison
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Search for your practice and compare against your PCN, ICB, Region, and
                    National averages. See where you stand on key metrics.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">6,158 practices</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">QOF data</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">Percentile rankings</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-teal-600 text-sm font-medium">
                Compare Your Practice
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </section>

        {/* About Section */}
        <section className="mb-16">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">About These Tools</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 mb-4">
                These tools are designed by <strong>Dr Krishnan Pasupathi</strong>, a GP Partner
                with 29 years in medicine, including experience in practice management and an MBA
                in Healthcare Leadership.
              </p>
              <p className="text-slate-600 mb-4">
                The aim is to make NHS Digital data more accessible and actionable for GP practices.
                Rather than wading through complex spreadsheets, these tools present the information
                in a way that helps practice leaders make informed decisions.
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mt-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Data Sources</h3>
                <ul className="text-sm text-slate-600 space-y-1">
                  <li>• GP Workforce Data - NHS England Digital (November 2025)</li>
                  <li>• QOF Achievement - NHS England Digital (2024-25)</li>
                  <li>• Patient Registration - NHS England Digital (November 2025)</li>
                  <li>• Contract Values - BMA GP Contract 2025/26</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Coming Soon</h2>
          <p className="text-slate-600 mb-6">
            More tools in development to support GP practice leadership.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-5 opacity-75">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">Practice Pulse</h3>
              <p className="text-sm text-slate-500">Confidential coaching companion for practice challenges</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5 opacity-75">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">Policy Decoder</h3>
              <p className="text-sm text-slate-500">Plain English summaries of NHS policy documents</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-5 opacity-75">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">Partners Playbook</h3>
              <p className="text-sm text-slate-500">Business guidance for GP partnership decisions</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-600">
                Independent tools by{" "}
                <a href="https://aryash.health" className="text-teal-600 hover:underline">
                  Aryash Health
                </a>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Data sourced from NHS Digital. For information only - not financial or business advice.
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <a href="https://tools.aryash.health" className="text-teal-600 hover:underline">
                Patient Tools
              </a>
              <a href="https://aryash.health" className="text-teal-600 hover:underline">
                About Aryash
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
