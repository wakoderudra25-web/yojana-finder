import Link from "next/link";
import { AlertCircle, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Important Official Disclaimer Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-slate-300 space-y-1.5 leading-relaxed">
              <p className="font-semibold text-white">
                Official Disclaimer & Indicative Eligibility Notice
              </p>
              <p>
                Eligibility results displayed on <strong>Yojana Finder</strong> are indicative
                only and calculated from publicly released scheme guidelines. We are an
                independent citizen information tool and are{" "}
                <span className="text-amber-300 underline underline-offset-2">
                  NOT affiliated with, operated by, or endorsed by the Government of India or any
                  State Government
                </span>
                .
              </p>
              <p className="text-slate-400">
                Official government departments, competent verification authorities, and the
                designated official portals determine final eligibility and benefits disbursement.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-slate-800 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              <strong>Zero Data Storage:</strong> We never collect Aadhaar numbers, phone numbers,
              or passwords.
            </span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/eligibility" className="hover:text-white transition-colors">
              Check Eligibility
            </Link>
            <Link href="/schemes" className="hover:text-white transition-colors">
              Browse Schemes
            </Link>
            <Link href="/privacy" className="hover:text-white font-medium text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/admin" className="hover:text-white text-slate-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Yojana Finder. Designed for Indian Citizens.</p>
          <p className="flex items-center gap-1.5">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>for public empowerment</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
