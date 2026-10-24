"use client";

import React, { Suspense, useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SAMPLE_SCHEMES, Scheme } from "@/data/schemes";
import { INDIAN_STATES_AND_UTS } from "@/data/states";
import { getCategoriesForState, matchesSocialCategory } from "@/data/categories";
import SchemeCard from "@/components/SchemeCard";
import { usePreferences } from "@/context/PreferencesContext";
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Sparkles,
  X,
  RefreshCw,
} from "lucide-react";

const SCHEMES_PER_PAGE = 20;

function BrowseSchemesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t, savedSchemeIds } = usePreferences();

  // Filter States (stored strictly in-memory, never persisted)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedSocialCategory, setSelectedSocialCategory] = useState("all");
  const [onlySaved, setOnlySaved] = useState(searchParams.get("saved") === "true");
  const [currentPage, setCurrentPage] = useState(1);

  const [allSchemes, setAllSchemes] = useState<Scheme[]>(SAMPLE_SCHEMES);

  // Sync saved query param if changed
  useEffect(() => {
    if (searchParams.get("saved") === "true") {
      setOnlySaved(true);
    }
  }, [searchParams]);

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

  // Extract all scheme categories
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    allSchemes.forEach((s) => set.add(s.categoryTag));
    return Array.from(set).sort();
  }, [allSchemes]);

  // Dynamically get social categories based on the selected state (or national list if none)
  const socialCategoryOptions = useMemo(() => {
    return getCategoriesForState(selectedState);
  }, [selectedState]);

  // Reset social category to "all" if selected category is not valid in the newly selected state
  useEffect(() => {
    if (selectedSocialCategory !== "all") {
      const exists = socialCategoryOptions.some((opt) => opt.code === selectedSocialCategory);
      if (!exists) {
        setSelectedSocialCategory("all");
      }
    }
  }, [selectedState, socialCategoryOptions, selectedSocialCategory]);

  // Filter schemes
  const filteredSchemes = useMemo(() => {
    return allSchemes.filter((scheme) => {
      // Saved filter
      if (onlySaved) {
        if (!savedSchemeIds.includes(scheme.id)) {
          return false;
        }
      }

      // Search query filter (name, hindiName, tagline, description, ministry, categoryTag)
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

      // Scheme Category filter
      if (selectedCategory !== "all") {
        if (scheme.categoryTag !== selectedCategory) {
          return false;
        }
      }

      // State filter
      if (selectedState !== "all") {
        const allowed = scheme.criteria.allowedStates;
        if (allowed && allowed.length > 0 && !allowed.includes("All")) {
          if (!allowed.includes(selectedState)) {
            return false;
          }
        }
      }

      // Social Category filter:
      // "A scheme should appear if its allowed categories include the selected one, or if it's open to everyone."
      if (selectedSocialCategory !== "all") {
        const matches = matchesSocialCategory(
          scheme.criteria.allowedSocialCategories,
          selectedSocialCategory,
          socialCategoryOptions
        );
        if (!matches) {
          return false;
        }
      }

      return true;
    });
  }, [
    searchQuery,
    selectedCategory,
    selectedState,
    selectedSocialCategory,
    onlySaved,
    savedSchemeIds,
    socialCategoryOptions,
  ]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedState, selectedSocialCategory, onlySaved]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSchemes.length / SCHEMES_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * SCHEMES_PER_PAGE;
  const paginatedSchemes = filteredSchemes.slice(startIndex, startIndex + SCHEMES_PER_PAGE);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedCategory !== "all" ||
    selectedState !== "all" ||
    selectedSocialCategory !== "all" ||
    onlySaved;

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedState("all");
    setSelectedSocialCategory("all");
    setOnlySaved(false);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browse Government Scheme Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {onlySaved ? t("savedSchemes") : t("browseSchemes")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Explore welfare programs, financial grants, subsidies, and scholarships across India.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/eligibility"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-600/20 transition-all"
            >
              <span>{t("checkEligibility")}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Search & Filters Card */}
        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3.5">
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

          {/* Filters: Category, State, Social Category (next to State) & Saved Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
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

            {/* Social Category Filter (Next to State Filter) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {t("socialCategory") || "Social Category"}
              </label>
              <select
                value={selectedSocialCategory}
                onChange={(e) => setSelectedSocialCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">{t("all") || "All"}</option>
                {socialCategoryOptions.map((cat) => (
                  <option key={cat.code} value={cat.code}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 leading-tight">
                {t("categoryHint") || "Category lists differ by state."}
              </p>
            </div>

            {/* Saved Schemes Toggle */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {t("savedSchemes")}
              </label>
              <button
                type="button"
                onClick={() => setOnlySaved(!onlySaved)}
                className={`w-full h-10 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-colors ${
                  onlySaved
                    ? "bg-amber-50 border-amber-300 text-amber-900"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Show Saved Only</span>
                </span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-200/80 text-[11px] font-bold text-slate-800">
                  {savedSchemeIds.length}
                </span>
              </button>
            </div>
          </div>

          {/* Active filter count & Reset */}
          {hasActiveFilters && (
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Found {filteredSchemes.length} matching schemes
              </span>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-2"
              >
                {t("clearFilters")}
              </button>
            </div>
          )}
        </div>

        {/* Results Count & Pagination Summary Bar */}
        <div className="mb-4 flex items-center justify-between text-xs sm:text-sm text-slate-600 font-medium">
          <span>
            {filteredSchemes.length === 0
              ? "No schemes match your filters"
              : `Showing ${startIndex + 1} - ${Math.min(
                  startIndex + SCHEMES_PER_PAGE,
                  filteredSchemes.length
                )} of ${filteredSchemes.length} schemes`}
          </span>

          {totalPages > 1 && (
            <span>
              {t("showingPage")} {currentPage} {t("of")} {totalPages}
            </span>
          )}
        </div>

        {/* Empty State */}
        {filteredSchemes.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto my-8">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t("noMatchesFound")}</h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              {t("noMatchesDescription")}
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t("clearFilters")}</span>
            </button>
          </div>
        )}

        {/* Scheme Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          {paginatedSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} userAnswers={null} />
          ))}
        </div>

        {/* Pagination Controls (20 per page) */}
        {totalPages > 1 && (
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>{t("previous")}</span>
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    currentPage === pageNum
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span>{t("next")}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowseSchemesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="p-6 text-center">
            <div className="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Loading schemes catalog...</p>
          </div>
        </div>
      }
    >
      <BrowseSchemesContent />
    </Suspense>
  );
}
