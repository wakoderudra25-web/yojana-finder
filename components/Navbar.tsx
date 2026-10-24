"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePreferences } from "@/context/PreferencesContext";
import { SUPPORTED_LANGUAGES } from "@/data/translations";
import {
  Compass,
  Bookmark,
  Eye,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const {
    t,
    language,
    setLanguage,
    simpleMode,
    toggleSimpleMode,
    savedSchemeIds,
  } = usePreferences();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
              {t("brandName")}
              <span className="text-amber-600">{t("brandSuffix")}</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 -mt-1 hidden xs:inline">
              {t("brandTagline")}
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-600">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/" ? "bg-slate-100 text-slate-900" : "hover:text-slate-900"
            }`}
          >
            {t("home")}
          </Link>
          <Link
            href="/schemes"
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              pathname === "/schemes" ? "bg-slate-100 text-slate-900" : "hover:text-slate-900"
            }`}
          >
            {t("browseSchemes")}
          </Link>
        </nav>

        {/* Right Controls: Simple Mode Toggle, Language Switcher, Saved Count, Eligibility CTA */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Simple Mode Toggle */}
          <button
            type="button"
            onClick={toggleSimpleMode}
            title={simpleMode ? t("normalMode") : t("simpleMode")}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              simpleMode
                ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {simpleMode ? t("normalMode") : t("simpleMode")}
            </span>
          </button>

          {/* Language Switcher */}
          <div className="relative inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`px-2 py-1 rounded-lg transition-all ${
                  language === lang.code
                    ? "bg-white text-slate-900 shadow-sm font-bold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {lang.nativeLabel}
              </button>
            ))}
          </div>

          {/* Saved Schemes Link with Count */}
          <Link
            href="/schemes?saved=true"
            title={t("savedSchemes")}
            className="relative p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <Bookmark className="w-4 h-4 text-slate-600" />
            {savedSchemeIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                {savedSchemeIds.length}
              </span>
            )}
          </Link>

          {/* Check Eligibility CTA */}
          <Link
            href="/eligibility"
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all"
          >
            {t("checkEligibility")}
          </Link>
        </div>
      </div>
    </header>
  );
}
