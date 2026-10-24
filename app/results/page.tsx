"use client";

import React, { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SAMPLE_SCHEMES, filterSchemes, UserAnswers, Scheme } from "@/data/schemes";
import { INDIAN_STATES_AND_UTS } from "@/data/states";
import SchemeCard from "@/components/SchemeCard";
import { usePreferences } from "@/context/PreferencesContext";
import {
  ArrowLeft,
  SlidersHorizontal,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Search,
  Filter,
  Bookmark,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SCHEMES_PER_PAGE = 20;

function ResultsContent() {
  const searchParams = useSearchParams();
  const { t, savedSchemeIds, isSchemeSaved } = usePreferences();

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [activeTab, setActiveTab] = useState<"eligible" | "all" | "saved">("eligible");
  const [currentPage, setCurrentPage] = useState(1);
  const [allSchemes, setAllSchemes] = useState<Scheme[]>(SAMPLE_SCHEMES);

  // Dynamically load updated schemes from API
  useEffect(() => {
    fetch("/api/schemes")
      .then((res) => res.json())
      .then((data) => {
        if (data.schemes && Array.isArray(data.schemes) && data.schemes.length > 0) {
          setAllSchemes(data.schemes);
        }
      })
      .catch(() => {});
  }, []);

  // Reset page when filters or tabs change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedState, activeTab]);

  // Safely parse user answers from query parameters (all strictly optional)
  const userAnswers: UserAnswers = useMemo(() => {
    const rawAge = searchParams.get("age");
    const rawIncome = searchParams.get("income");
    const rawLand = searchParams.get("landSize");
    const rawDisability = searchParams.get("disabilityPercentage");
    const rawSituations = searchParams.get("specialSituations");

    const parsedAge = rawAge ? parseInt(rawAge, 10) : null;
    const parsedIncome = rawIncome ? parseInt(rawIncome, 10) : null;
    const parsedLand = rawLand ? parseFloat(rawLand) : null;
    const parsedDisability = rawDisability ? parseInt(rawDisability, 10) : null;

    return {
      state: searchParams.get("state") || null,
      district: searchParams.get("district") || null,
      area: (searchParams.get("area") as any) || null,
      age: parsedAge && !isNaN(parsedAge) ? parsedAge : null,
      gender: searchParams.get("gender") || null,
      maritalStatus: (searchParams.get("maritalStatus") as any) || null,

      educationLevel: (searchParams.get("educationLevel") as any) || null,
      employmentStatus: (searchParams.get("employmentStatus") as any) || null,
      income: parsedIncome && !isNaN(parsedIncome) ? parsedIncome : null,
      rationCardType: (searchParams.get("rationCardType") as any) || null,

      farmerType: (searchParams.get("farmerType") as any) || null,
      landSize: parsedLand && !isNaN(parsedLand) ? parsedLand : null,

      category: (searchParams.get("category") as any) || null,
      minorityCommunity: (searchParams.get("minorityCommunity") as any) || null,
      disabilityPercentage:
        parsedDisability && !isNaN(parsedDisability) ? parsedDisability : null,

      isStudent: searchParams.get("student") === "true",
      isFarmer: searchParams.get("farmer") === "true",
      isSeniorCitizen: searchParams.get("senior") === "true",
      specialSituations: rawSituations ? rawSituations.split(",").filter(Boolean) : null,
    };
  }, [searchParams]);

  // Count total answered questions (Requirement 2 & 3)
  const answeredCount = useMemo(() => {
    let count = 0;
    if (userAnswers.state && userAnswers.state !== "prefer_not_to_say" && userAnswers.state.trim() !== "") count++;
    if (userAnswers.district && userAnswers.district.trim() !== "") count++;
    if (userAnswers.area && userAnswers.area !== "prefer_not_to_say") count++;
    if (userAnswers.age != null && !isNaN(userAnswers.age)) count++;
    if (userAnswers.gender && userAnswers.gender !== "prefer_not_to_say") count++;
    if (userAnswers.maritalStatus && userAnswers.maritalStatus !== "prefer_not_to_say") count++;
    if (userAnswers.educationLevel && userAnswers.educationLevel !== "prefer_not_to_say") count++;
    if (userAnswers.employmentStatus && userAnswers.employmentStatus !== "prefer_not_to_say") count++;
    if (userAnswers.farmerType && userAnswers.farmerType !== "prefer_not_to_say") count++;
    if (userAnswers.landSize != null && !isNaN(userAnswers.landSize)) count++;
    if (userAnswers.income != null && !isNaN(userAnswers.income)) count++;
    if (userAnswers.rationCardType && userAnswers.rationCardType !== "prefer_not_to_say") count++;
    if (userAnswers.category && userAnswers.category !== "prefer_not_to_say") count++;
    if (userAnswers.minorityCommunity && userAnswers.minorityCommunity !== "prefer_not_to_say") count++;
    if (userAnswers.disabilityPercentage != null && !isNaN(userAnswers.disabilityPercentage)) count++;
    if (userAnswers.isStudent === true) count++;
    if (userAnswers.isFarmer === true) count++;
    if (userAnswers.isSeniorCitizen === true) count++;
    if (userAnswers.specialSituations && userAnswers.specialSituations.length > 0) count++;
    return count;
  }, [userAnswers]);

  // Extract all unique categories present in the schemes data
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    allSchemes.forEach((s) => set.add(s.categoryTag));
    return Array.from(set).sort();
  }, [allSchemes]);

  // Filter schemes according to user answers
  const eligibleSchemes: Scheme[] = useMemo(() => {
    return filterSchemes(userAnswers, allSchemes);
  }, [userAnswers, allSchemes]);

  // Base list depending on active tab
  const baseSchemes = useMemo(() => {
    if (activeTab === "eligible") return eligibleSchemes;
    if (activeTab === "saved") {
      return allSchemes.filter((s) => savedSchemeIds.includes(s.id));
    }
    return allSchemes;
  }, [activeTab, eligibleSchemes, savedSchemeIds, allSchemes]);

  // Apply Search, Category, and State filters on top
  const filteredSchemes = useMemo(() => {
    return baseSchemes.filter((scheme) => {
      // 1. Search Query filter (name, tagline, description, ministry, category)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = scheme.name.toLowerCase().includes(q);
        const matchesHindi = scheme.hindiName?.toLowerCase().includes(q);
        const matchesTagline = scheme.tagline.toLowerCase().includes(q);
        const matchesDesc = scheme.shortDescription.toLowerCase().includes(q);
        const matchesMinistry = scheme.ministry.toLowerCase().includes(q);
        const matchesCat = scheme.categoryTag.toLowerCase().includes(q);
        if (
          !matchesName &&
          !matchesHindi &&
          !matchesTagline &&
          !matchesDesc &&
          !matchesMinistry &&
          !matchesCat
        ) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== "all") {
        if (scheme.categoryTag !== selectedCategory) {
          return false;
        }
      }

      // 3. State filter
      if (selectedState !== "all") {
        const allowed = scheme.criteria.allowedStates;
        if (allowed && allowed.length > 0 && !allowed.includes("All")) {
          if (!allowed.includes(selectedState)) {
            return false;
          }
        }
      }

      return true;
    });
  }, [baseSchemes, searchQuery, selectedCategory, selectedState]);

  // Active filters count
  const hasActiveFilters =
    searchQuery.trim() !== "" || selectedCategory !== "all" || selectedState !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedState("all");
  };

  // Pagination calculation for mobile-first speed and low memory usage
  const totalPages = Math.ceil(filteredSchemes.length / SCHEMES_PER_PAGE) || 1;
  const paginatedSchemes = useMemo(() => {
    const start = (currentPage - 1) * SCHEMES_PER_PAGE;
    return filteredSchemes.slice(start, start + SCHEMES_PER_PAGE);
  }, [filteredSchemes, currentPage]);

  // Build active criteria badges for the summary card
  const activeBadges: { label: string; value: string }[] = useMemo(() => {
    const badges: { label: string; value: string }[] = [];
    if (userAnswers.state && userAnswers.state !== "prefer_not_to_say") {
      badges.push({ label: "State", value: userAnswers.state });
    }
    if (userAnswers.district) {
      badges.push({ label: "District", value: userAnswers.district });
    }
    if (userAnswers.area && userAnswers.area !== "prefer_not_to_say") {
      badges.push({ label: "Area", value: userAnswers.area === "rural" ? "Rural" : "Urban" });
    }
    if (userAnswers.age != null) {
      badges.push({ label: "Age", value: `${userAnswers.age} yrs` });
    }
    if (userAnswers.gender && userAnswers.gender !== "prefer_not_to_say") {
      badges.push({ label: "Gender", value: userAnswers.gender });
    }
    if (userAnswers.maritalStatus && userAnswers.maritalStatus !== "prefer_not_to_say") {
      const formatted = userAnswers.maritalStatus.replace("_", " ");
      badges.push({
        label: "Marital",
        value: formatted.charAt(0).toUpperCase() + formatted.slice(1),
      });
    }
    if (userAnswers.educationLevel && userAnswers.educationLevel !== "prefer_not_to_say") {
      badges.push({ label: "Education", value: userAnswers.educationLevel.toUpperCase() });
    }
    if (userAnswers.employmentStatus && userAnswers.employmentStatus !== "prefer_not_to_say") {
      const formatted = userAnswers.employmentStatus.replace("_", " ");
      badges.push({
        label: "Work",
        value: formatted.charAt(0).toUpperCase() + formatted.slice(1),
      });
    }
    if (userAnswers.income != null) {
      badges.push({
        label: "Income",
        value: `₹${userAnswers.income.toLocaleString("en-IN")}/yr`,
      });
    }
    if (userAnswers.rationCardType && userAnswers.rationCardType !== "prefer_not_to_say") {
      badges.push({ label: "Ration Card", value: userAnswers.rationCardType.toUpperCase() });
    }
    if (userAnswers.farmerType && userAnswers.farmerType !== "prefer_not_to_say") {
      badges.push({
        label: "Farmer Type",
        value: userAnswers.farmerType === "owner" ? "Landowner" : "Tenant",
      });
    }
    if (userAnswers.landSize != null) {
      badges.push({ label: "Land", value: `${userAnswers.landSize} Acres` });
    }
    if (userAnswers.category && userAnswers.category !== "prefer_not_to_say") {
      badges.push({ label: "Category", value: userAnswers.category });
    }
    if (
      userAnswers.minorityCommunity &&
      userAnswers.minorityCommunity !== "prefer_not_to_say" &&
      userAnswers.minorityCommunity !== "none"
    ) {
      badges.push({ label: "Minority", value: userAnswers.minorityCommunity });
    }
    if (userAnswers.disabilityPercentage != null) {
      badges.push({ label: "Disability", value: `${userAnswers.disabilityPercentage}%` });
    }
    return badges;
  }, [userAnswers]);

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/eligibility"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-amber-700 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("backToForm")}</span>
            </Link>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Schemes you may be eligible for
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Based on the {answeredCount} details you gave. Answer more questions for better results.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/schemes"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              <span>{t("browseSchemes")}</span>
            </Link>
            <Link
              href="/eligibility"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-xs sm:text-sm font-semibold text-amber-800 hover:bg-amber-100 shadow-sm transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-700" />
              <span>{t("modifyAnswers")}</span>
            </Link>
          </div>
        </div>

        {/* Profile Summary Card */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Evaluated Profile
            </span>
            <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {t("zeroDataStorage")}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {activeBadges.length > 0 ? (
              activeBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium"
                >
                  <span className="text-slate-400 mr-1">{badge.label}:</span>
                  <strong className="text-slate-900">{badge.value}</strong>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic">
                No specific fields answered. Showing all open schemes.
              </div>
            )}

            {userAnswers.isStudent && (
              <div className="px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-medium">
                🎓 Student
              </div>
            )}
            {userAnswers.isFarmer && (
              <div className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-medium">
                🌾 Farmer
              </div>
            )}
            {userAnswers.isSeniorCitizen && (
              <div className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-medium">
                👴 Senior Citizen
              </div>
            )}

            {userAnswers.specialSituations &&
              userAnswers.specialSituations.map((sit) => (
                <div
                  key={sit}
                  className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-medium"
                >
                  ⭐ {sit.replace("_", " ")}
                </div>
              ))}
          </div>
        </div>

        {/* If user answered fewer than 3 questions in total, show message instead of list (Requirement 2) */}
        {answeredCount < 3 ? (
          <div className="my-8 p-8 sm:p-12 rounded-3xl bg-white border border-amber-200/90 shadow-sm text-center max-w-xl mx-auto space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <SlidersHorizontal className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                Answer a few more questions to see schemes that fit you
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                You gave {answeredCount} {answeredCount === 1 ? "detail" : "details"} so far (State and Age). Please answer at least 3 questions to see schemes that fit you.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/eligibility"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-md shadow-amber-600/20 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to eligibility form</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Search & Filters Bar */}
            <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns: Category & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {t("category")}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">{t("allCategories")}</option>
                {availableCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* State Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {t("state")}
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">{t("allStates")}</option>
                {INDIAN_STATES_AND_UTS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Reset if any active */}
          {hasActiveFilters && (
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Filtering {filteredSchemes.length} of {baseSchemes.length} schemes
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-2"
              >
                {t("clearFilters")}
              </button>
            </div>
          )}
        </div>

        {/* Tab Switcher: Eligible / All / Saved */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              {filteredSchemes.length}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {filteredSchemes.length === 1
                ? t("singleSchemeFound")
                : `${filteredSchemes.length} ${t("matchingSchemesFound")}`}
            </h2>
          </div>

          {/* Tab buttons */}
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setActiveTab("eligible")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "eligible"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Eligible ({eligibleSchemes.length})
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === "all"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Schemes ({SAMPLE_SCHEMES.length})
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                activeTab === "saved"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({savedSchemeIds.length})</span>
            </button>
          </div>
        </div>

        {/* Empty State when 0 schemes match */}
        {filteredSchemes.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-lg mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t("noMatchesFound")}</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {t("noMatchesDescription")}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t("clearFilters")}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setActiveTab("all");
                  clearFilters();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
              >
                <span>Browse All Available Schemes</span>
              </button>
            </div>
          </div>
        )}

        {/* List of Scheme Cards (Paginated for fast mobile rendering) */}
        <div className="grid grid-cols-1 gap-6">
          {paginatedSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              userAnswers={userAnswers}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t("previous")}</span>
            </button>

            <span className="text-xs sm:text-sm font-semibold text-slate-600">
              {t("showingPage")} <strong>{currentPage}</strong> {t("of")} <strong>{totalPages}</strong>
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span>{t("next")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
          </>
        )}

        {/* Bottom Helpful Reminder */}
        <div className="mt-10 p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-950 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <p className="font-bold text-amber-900">Application Assistance Tip:</p>
            <p className="mt-1 text-amber-800">
              Each scheme card provides an <strong>&quot;Apply on official website&quot;</strong>{" "}
              button that opens the authorized government portal. If you are missing any document,
              refer to the <strong>&quot;Missing a document?&quot;</strong> tip inside the card.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="p-6 text-center">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">
              Matching your profile with government schemes...
            </p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
