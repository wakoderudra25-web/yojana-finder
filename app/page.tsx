import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  GraduationCap,
  Tractor,
  HeartPulse,
  Home,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-white to-slate-50 pt-10 pb-16 sm:pt-16 sm:pb-20 border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs sm:text-sm font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>100% Free • No Aadhaar Required • Indicative Guide</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-tight">
            Find Government Schemes <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
              You Are Eligible For
            </span>
          </h1>

          {/* Short Simple Explanation */}
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Millions of Indian citizens miss out on welfare benefits simply because they don&apos;t
            know what exists. Answer a few basic questions to see which Central and State schemes
            match your profile.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/eligibility"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base sm:text-lg font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-2xl shadow-lg shadow-amber-600/25 hover:shadow-amber-600/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/schemes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base sm:text-lg font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-2xl shadow-sm transition-all"
            >
              <span>Browse All Schemes</span>
            </Link>
          </div>

          {/* Privacy & Speed Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Takes under 2 minutes</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>No Aadhaar or personal ID collected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              <span>Simple, direct answers</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-12 sm:py-16 bg-white border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How Yojana Finder Works
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Three simple steps to discover welfare schemes tailored to you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-base mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base">Enter Basic Profile</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Provide your state, age, category, income range, and work status. We never ask for
                your Aadhaar, name, or phone number.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-base mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Instant Eligibility Check</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our engine compares your details against official criteria to show schemes you
                qualify for, along with an explanation of why you qualify.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-base mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">View Documents & Apply</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Get a checklist of documents needed and direct links to official government portals
                to submit your official application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes Categories Preview */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Sample Database
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Supported Government Schemes
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Here are examples of major central initiatives included in our eligibility engine:
              </p>
            </div>

            <Link
              href="/eligibility"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800"
            >
              <span>See which one fits you</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Tractor className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">PM Kisan Samman Nidhi</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  ₹6,000/year direct financial support for landholding farmers.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-red-100 text-red-800">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Ayushman Bharat (PM-JAY)</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Up to ₹5 Lakh/year cashless hospital treatment for eligible families.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-blue-100 text-blue-800">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Pradhan Mantri Awas Yojana</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Housing subsidy for low-income families to build a permanent home.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3.5">
              <div className="p-2.5 rounded-lg bg-purple-100 text-purple-800">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Post-Matric Scholarships</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tuition fees & grants for SC, ST, and OBC students in higher education.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg sm:text-xl font-bold">
                Ready to find which schemes you qualify for?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                No registration required. Check for yourself or family members right now.
              </p>
            </div>
            <Link
              href="/eligibility"
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-sm"
            >
              <span>Check Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
