import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dr Krishnan Pasupathi | GP Practice Tools | Aryash Health",
  description: "GP Partner & Trainer with 29 years in medicine. Free practice benchmarking tools using NHS Digital data for GP partners and practice managers.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Hero - Professional Profile */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <p className="text-teal-200 text-sm font-medium mb-4">Aryash Health — For Professionals</p>
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Dr Krishnan Pasupathi
              </h1>
              <p className="text-teal-100 text-base md:text-lg mb-4">
                <span className="hidden sm:inline">MBBS MRCSEd MRCGP FHEA MBA</span>
                <span className="sm:hidden">MBBS · MRCGP · FHEA · MBA</span>
              </p>
              <p className="text-xl text-white mb-4">
                GP Partner & Trainer
              </p>
              <p className="text-teal-100 max-w-2xl">
                29 years in medicine. GP Trainer since 2016. Currently building AI-powered tools
                to help GP practices understand their performance and make better decisions.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:text-right">
              <a
                href="https://www.linkedin.com/in/krishnan-pasupathi-a68244129"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-teal-100 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </a>
              <p className="text-teal-200 text-sm">Buckinghamshire, UK</p>
            </div>
          </div>
        </div>
      </header>

      {/* Live Tools Section - White background */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-slate-800">Practice Tools</h2>
            <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">Live</span>
          </div>
          <p className="text-slate-600 mb-8">
            Free tools using published NHS Digital data to help you benchmark your practice.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Health Check Tool Card */}
            <Link
              href="/health-check"
              className="group bg-white rounded-xl border-l-4 border-l-teal-500 border border-slate-200 shadow-md hover:shadow-xl hover:border-teal-300 transition-all p-4 md:p-6"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-teal-700 transition-colors mb-1 md:mb-2">
                    Practice Health Check
                  </h3>
                  <p className="text-slate-600 text-xs md:text-sm mb-3 md:mb-4">
                    Enter your practice details to get personalised assessments on workforce capacity,
                    income estimates, and staffing costs against NHS benchmarks.
                  </p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    <span className="px-2 py-0.5 md:py-1 bg-slate-100 text-slate-600 text-xs rounded">Income calculator</span>
                    <span className="px-2 py-0.5 md:py-1 bg-slate-100 text-slate-600 text-xs rounded">Staffing analysis</span>
                    <span className="px-2 py-0.5 md:py-1 bg-slate-100 text-slate-600 text-xs rounded">Hiring costs</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-100 flex items-center text-teal-600 text-xs md:text-sm font-medium">
                Open Health Check
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>

            {/* Compare Tool Card */}
            <Link
              href="/compare"
              className="group bg-white rounded-xl border-l-4 border-l-teal-500 border border-slate-200 shadow-md hover:shadow-xl hover:border-teal-300 transition-all p-4 md:p-6"
            >
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-semibold text-slate-800 group-hover:text-teal-700 transition-colors mb-1 md:mb-2">
                    Practice Comparison
                  </h3>
                  <p className="text-slate-600 text-xs md:text-sm mb-3 md:mb-4">
                    Search for your practice and compare against your PCN, ICB, Region, and
                    National averages. See where you stand on key metrics.
                  </p>
                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    <span className="px-2 py-0.5 md:py-1 bg-slate-100 text-slate-600 text-xs rounded">6,158 practices</span>
                    <span className="px-2 py-0.5 md:py-1 bg-slate-100 text-slate-600 text-xs rounded">QOF data</span>
                    <span className="px-2 py-0.5 md:py-1 bg-slate-100 text-slate-600 text-xs rounded">Percentile rankings</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-slate-100 flex items-center text-teal-600 text-xs md:text-sm font-medium">
                Compare Your Practice
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* The Four M's - Slate background */}
      <section className="bg-slate-100 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">The Four M&apos;s</h2>
          <p className="text-slate-600 mb-8">
            Core areas of focus across clinical practice and leadership.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-md p-4 md:p-5">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm md:text-base mb-1">Multimorbidity</h3>
              <p className="text-xs md:text-sm text-slate-600">Managing patients with multiple long-term conditions</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-md p-4 md:p-5">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm md:text-base mb-1">Medical Education</h3>
              <p className="text-xs md:text-sm text-slate-600">Training registrars, AI-enhanced resources</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-md p-4 md:p-5">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm md:text-base mb-1">Men&apos;s Health</h3>
              <p className="text-xs md:text-sm text-slate-600">Surgical background in general practice</p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-md p-4 md:p-5">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-2 md:mb-3">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 text-sm md:text-base mb-1">Management</h3>
              <p className="text-xs md:text-sm text-slate-600">Business thinking in healthcare</p>
            </div>
          </div>
        </div>
      </section>

      {/* Background - White background */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* For Doctors & Trainees */}
            <div className="bg-slate-50 rounded-xl border-l-4 border-l-teal-500 shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">For Doctors & Trainees</h3>
              <p className="text-slate-600 text-sm mb-4">
                Teaching, mentoring, and exploring AI in GP training.
              </p>
              <ul className="space-y-2 text-sm text-slate-700 mb-4">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  GP Trainer since 2016
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Fellow of Higher Education Academy
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Diploma in Coach-Mentoring
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Mentored 30+ doctors and students
                </li>
              </ul>
              <p className="text-sm text-slate-500 italic">
                &quot;Exploring how AI tools can support GP training — particularly in designing tutorials and educational resources.&quot;
              </p>
            </div>

            {/* For Leaders & Managers */}
            <div className="bg-slate-50 rounded-xl border-l-4 border-l-teal-500 shadow-md p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">For Leaders & Managers</h3>
              <p className="text-slate-600 text-sm mb-4">
                Practice leadership, team management, and AI tools for healthcare organisations.
              </p>
              <ul className="space-y-2 text-sm text-slate-700 mb-4">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  GP Partner since 2015
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  MBA (Merit) from Warwick Business School
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Led QOF and systems-based care initiatives
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  EMCC Associate Member (coaching)
                </li>
              </ul>
              <p className="text-sm text-slate-500 italic">
                &quot;Building practical tools that help practice leaders make informed decisions using real NHS data.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section - Slate background */}
      <section className="bg-slate-100 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Coming Soon</h2>
          <p className="text-slate-600 mb-6">
            More tools in development to support GP practice leadership.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/80 rounded-lg border border-slate-200 shadow p-5">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">Practice Pulse</h3>
              <p className="text-sm text-slate-500">Confidential AI coaching companion for practice staff challenges</p>
            </div>

            <div className="bg-white/80 rounded-lg border border-slate-200 shadow p-5">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">Policy Decoder</h3>
              <p className="text-sm text-slate-500">Translates NHS policy documents into plain English summaries</p>
            </div>

            <div className="bg-white/80 rounded-lg border border-slate-200 shadow p-5">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-1">Partners Playbook</h3>
              <p className="text-sm text-slate-500">Business guidance for GP partnership decisions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources - White background */}
      <section className="bg-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Data Sources</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600">
              <ul className="space-y-1">
                <li>• GP Workforce Data — NHS England Digital (November 2025)</li>
                <li>• QOF Achievement — NHS England Digital (2024-25)</li>
              </ul>
              <ul className="space-y-1">
                <li>• Patient Registration — NHS England Digital (November 2025)</li>
                <li>• Contract Values — BMA GP Contract 2025/26</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <p className="font-medium text-white mb-1">Aryash Health</p>
              <p className="text-sm text-slate-300 mb-3">
                Independent tools by Dr Krishnan Pasupathi
              </p>
              <p className="text-xs text-slate-400">
                Data sourced from NHS Digital. For information only — not financial or business advice.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm md:text-right">
              <a href="https://tools.aryash.health" className="text-teal-400 hover:text-teal-300 transition-colors">
                Patient Tools
              </a>
              <a href="https://aryash.health" className="text-teal-400 hover:text-teal-300 transition-colors">
                About Aryash Health
              </a>
              <a
                href="mailto:krishnan@aryashhealth.com"
                className="text-teal-400 hover:text-teal-300 transition-colors"
              >
                Contact
              </a>
              <a href="https://tools.aryash.health/privacy.html" className="text-teal-400 hover:text-teal-300 transition-colors">
                Privacy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
