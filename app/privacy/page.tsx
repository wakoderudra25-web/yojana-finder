"use client";

import React from "react";
import Link from "next/link";
import { usePreferences } from "@/context/PreferencesContext";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  BookmarkCheck,
  AlertTriangle,
  ArrowLeft,
  FileCheck2,
  CheckCircle2,
  Info,
} from "lucide-react";

export default function PrivacyPage() {
  const { t, simpleMode } = usePreferences();

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t("home")}</span>
          </Link>
          <Link
            href="/eligibility"
            className="text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            {t("checkEligibility")} &rarr;
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Citizen Privacy Guarantee</span>
          </div>

          <h1
            className={`font-black text-slate-900 tracking-tight leading-tight ${
              simpleMode ? "text-2xl sm:text-3xl" : "text-xl sm:text-3xl"
            }`}
          >
            Privacy Policy & Data Security
          </h1>

          <p
            className={`text-slate-600 leading-relaxed ${
              simpleMode ? "text-base sm:text-lg font-medium" : "text-sm sm:text-base"
            }`}
          >
            Yojana Finder is an independent, public-service digital guide designed for Indian
            citizens. Our highest priority is your dignity, confidentiality, and data safety. We
            believe access to public welfare information must never come at the cost of your personal
            privacy.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="space-y-4">
          {/* Pillar 1: No Aadhaar collection */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  1. We Never Ask For or Store Aadhaar Numbers
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  We <strong>NEVER</strong> ask for your Aadhaar card number, PAN card, bank account
                  details, passwords, or biometrics. You will never see an Aadhaar input field on
                  Yojana Finder.
                </p>
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl text-xs text-red-900 font-medium">
                  <strong>Safety Tip:</strong> Never share your 12-digit Aadhaar number or OTP with
                  any unofficial portals, phone callers, or unauthorized agents claiming to process
                  government schemes.
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Answers are NOT stored anywhere */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <EyeOff className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  2. Eligibility Answers Are Never Stored On Any Server
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Every field in our eligibility checker (age, gender, state, occupation, income
                  bracket, ration card, disability, or social category) is processed purely in your
                  browser session to filter matching schemes in real-time.
                </p>
                <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 pt-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Answers are not uploaded to any remote database.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Every questionnaire question is strictly optional.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Closing the tab removes your active search inputs.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pillar 3: Saved schemes local storage */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  3. Saved Schemes Are Stored as Anonymous IDs on Your Device
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  When you tap the <strong>Save</strong> button on a scheme card, only the scheme's
                  identifier string (for example, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">pm-kisan</code>)
                  is saved in your web browser&apos;s local memory (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">localStorage</code>).
                  No personal profile or demographic answers are ever stored with it.
                </p>
              </div>
            </div>
          </div>

          {/* Pillar 4: Reporting inaccuracies */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  4. Reporting Wrong Details
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  If you submit a report using the &ldquo;Report a wrong detail&rdquo; form, only the
                  scheme name and your description of the issue are saved locally to help administrators
                  verify and update the scheme information. Providing an email is optional and solely
                  for follow-up questions.
                </p>
              </div>
            </div>
          </div>

          {/* Official .gov.in Warning */}
          <div className="bg-amber-50/95 border border-amber-300 rounded-2xl p-5 text-amber-950 space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <h3 className="font-bold text-sm sm:text-base text-amber-950">
                Notice on Official Government Portals
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed">
              Always apply only on the official <strong>.gov.in</strong> or <strong>.nic.in</strong>{" "}
              website. Beware of fake portals, third-party mobile apps, or unauthorized agents
              charging money. Genuine government welfare schemes do not require private agent fees.
            </p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-slate-500">
            Have questions or feedback? Contact us or report incorrect details directly on scheme cards.
          </p>
          <Link
            href="/schemes"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors shadow-sm shrink-0"
          >
            {t("browseSchemes")}
          </Link>
        </div>
      </div>
    </div>
  );
}
