"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Lock,
  ShieldAlert,
  Plus,
  Edit,
  Trash2,
  Calendar,
  ShieldCheck,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  X,
  FileText,
  Building2,
  Award,
  ArrowLeft,
  RefreshCw,
  LogOut,
  Mail,
  Clock,
  Layers,
  HelpCircle,
} from "lucide-react";

interface SchemeItem {
  id: string;
  name: string;
  hindiName?: string;
  tagline: string;
  ministry: string;
  categoryTag: string;
  badgeColor?: string;
  shortDescription: string;
  benefitAmount: string;
  status: "Open" | "Closed" | "Verify";
  lastDateToApply: string | null;
  lastVerified: string;
  officialSourceUrl: string;
  applyUrl: string;
  documentHelp?: string;
  documentsNeeded: string[];
  criteria?: any;
}

interface ReportItem {
  id: string;
  schemeId: string;
  schemeName: string;
  whatsWrong: string;
  email?: string;
  createdAt: string;
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Tab: "schemes" | "reports"
  const [activeTab, setActiveTab] = useState<"schemes" | "reports">("schemes");

  // Schemes Data & Filter
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [loadingSchemes, setLoadingSchemes] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Reports Data
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loadingReports, setLoadingReports] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState<SchemeItem | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    hindiName: "",
    tagline: "",
    ministry: "",
    categoryTag: "General Support",
    benefitAmount: "",
    status: "Open" as "Open" | "Closed" | "Verify",
    lastDateToApply: "Ongoing / Open throughout the year",
    officialSourceUrl: "",
    applyUrl: "",
    shortDescription: "",
    documentHelp: "",
    documentsText: "",
    minAge: "",
    maxAge: "",
    maxAnnualIncome: "",
    requiresFarmer: false,
    requiresStudent: false,
    requiresSeniorCitizen: false,
  });

  // Check existing session token on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem("yf_admin_token");
    if (savedToken) {
      setPasscode(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch schemes
  const loadSchemes = async () => {
    setLoadingSchemes(true);
    try {
      const res = await fetch("/api/schemes");
      const data = await res.json();
      if (data.schemes) {
        setSchemes(data.schemes);
      }
    } catch (err) {
      console.error("Error loading schemes:", err);
    } finally {
      setLoadingSchemes(false);
    }
  };

  // Fetch reports
  const loadReports = async () => {
    setLoadingReports(true);
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      if (data.reports) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Error loading reports:", err);
    } finally {
      setLoadingReports(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSchemes();
      loadReports();
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError(null);

    // Verify passcode against default admin123 or whatever is accepted
    const inputPass = passcode.trim();
    if (inputPass === "admin123" || inputPass.length >= 6) {
      sessionStorage.setItem("yf_admin_token", inputPass);
      setIsAuthenticated(true);
    } else {
      setAuthError("Invalid admin passcode. Default demo passcode is: admin123");
    }
    setIsVerifying(false);
  };

  // Handle Logout
  const handleLogout = () => {
    sessionStorage.removeItem("yf_admin_token");
    setIsAuthenticated(false);
    setPasscode("");
  };

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingScheme(null);
    setFormData({
      id: "",
      name: "",
      hindiName: "",
      tagline: "",
      ministry: "",
      categoryTag: "General Support",
      benefitAmount: "",
      status: "Open",
      lastDateToApply: "Ongoing / Open throughout the year",
      officialSourceUrl: "",
      applyUrl: "",
      shortDescription: "",
      documentHelp: "",
      documentsText: "Aadhaar Card (verification only)\nBank Passbook\nIncome Proof",
      minAge: "",
      maxAge: "",
      maxAnnualIncome: "",
      requiresFarmer: false,
      requiresStudent: false,
      requiresSeniorCitizen: false,
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (scheme: SchemeItem) => {
    setEditingScheme(scheme);
    setFormData({
      id: scheme.id,
      name: scheme.name,
      hindiName: scheme.hindiName || "",
      tagline: scheme.tagline || "",
      ministry: scheme.ministry || "",
      categoryTag: scheme.categoryTag || "General Support",
      benefitAmount: scheme.benefitAmount || "",
      status: scheme.status || "Open",
      lastDateToApply: scheme.lastDateToApply || "",
      officialSourceUrl: scheme.officialSourceUrl || "",
      applyUrl: scheme.applyUrl || "",
      shortDescription: scheme.shortDescription || "",
      documentHelp: scheme.documentHelp || "",
      documentsText: (scheme.documentsNeeded || []).join("\n"),
      minAge: scheme.criteria?.minAge != null ? String(scheme.criteria.minAge) : "",
      maxAge: scheme.criteria?.maxAge != null ? String(scheme.criteria.maxAge) : "",
      maxAnnualIncome:
        scheme.criteria?.maxAnnualIncome != null
          ? String(scheme.criteria.maxAnnualIncome)
          : "",
      requiresFarmer: Boolean(scheme.criteria?.requiresFarmer),
      requiresStudent: Boolean(scheme.criteria?.requiresStudent),
      requiresSeniorCitizen: Boolean(scheme.criteria?.requiresSeniorCitizen),
    });
    setIsModalOpen(true);
  };

  // Submit Add or Edit Scheme
  const handleSubmitScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.ministry.trim() || !formData.benefitAmount.trim()) {
      alert("Scheme Name, Ministry, and Benefit Amount are required.");
      return;
    }

    setActionLoading(true);
    setFeedbackMessage(null);

    const documentsNeeded = formData.documentsText
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    const payload = {
      id: editingScheme ? editingScheme.id : undefined,
      name: formData.name.trim(),
      hindiName: formData.hindiName.trim(),
      tagline: formData.tagline.trim(),
      ministry: formData.ministry.trim(),
      categoryTag: formData.categoryTag.trim(),
      benefitAmount: formData.benefitAmount.trim(),
      status: formData.status,
      lastDateToApply: formData.lastDateToApply.trim(),
      officialSourceUrl: formData.officialSourceUrl.trim(),
      applyUrl: formData.applyUrl.trim(),
      shortDescription: formData.shortDescription.trim(),
      documentHelp: formData.documentHelp.trim(),
      documentsNeeded,
      criteria: {
        minAge: formData.minAge ? parseInt(formData.minAge, 10) : null,
        maxAge: formData.maxAge ? parseInt(formData.maxAge, 10) : null,
        maxAnnualIncome: formData.maxAnnualIncome
          ? parseInt(formData.maxAnnualIncome, 10)
          : null,
        requiresFarmer: formData.requiresFarmer || null,
        requiresStudent: formData.requiresStudent || null,
        requiresSeniorCitizen: formData.requiresSeniorCitizen || null,
      },
    };

    try {
      const url = "/api/schemes";
      const method = editingScheme ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": passcode,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save scheme");
      }

      setFeedbackMessage({
        type: "success",
        text: editingScheme
          ? `Scheme updated! 'Last verified' date automatically set to current date.`
          : `Scheme added successfully with current 'Last verified' timestamp!`,
      });

      setIsModalOpen(false);
      loadSchemes();
      setTimeout(() => setFeedbackMessage(null), 5000);
    } catch (err: any) {
      alert(err.message || "Failed to save scheme.");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Scheme
  const handleDeleteScheme = async (id: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/schemes?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": passcode,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete scheme");
      }

      setFeedbackMessage({
        type: "success",
        text: "Scheme deleted successfully.",
      });
      setDeleteConfirmationId(null);
      loadSchemes();
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to delete scheme.");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter schemes on client
  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      if (filterCategory !== "all" && s.categoryTag !== filterCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = s.name.toLowerCase().includes(q);
        const matchesHindi = s.hindiName?.toLowerCase().includes(q);
        const matchesMinistry = s.ministry.toLowerCase().includes(q);
        return matchesName || matchesHindi || matchesMinistry;
      }
      return true;
    });
  }, [schemes, filterCategory, searchQuery]);

  // Categories list
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    schemes.forEach((s) => set.add(s.categoryTag));
    return Array.from(set).sort();
  }, [schemes]);

  // 1. Render Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 text-slate-100">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Administrator Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage government schemes database and inspect citizen error reports.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl bg-red-900/40 border border-red-700/60 text-red-200 text-xs font-medium">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode (e.g. admin123)"
                className="w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Default demonstration passcode is <code className="text-amber-400">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm transition-all shadow-md shadow-amber-500/20"
            >
              {isVerifying ? "Verifying..." : "Unlock Admin Dashboard"}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              &larr; Return to Yojana Finder public site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Render Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to site</span>
            </Link>
            <div className="h-4 w-px bg-slate-700 hidden sm:block" />
            <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Yojana Finder Admin
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Scheme</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Feedback message banner */}
        {feedbackMessage && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between border ${
              feedbackMessage.type === "success"
                ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                : "bg-red-50 border-red-300 text-red-900"
            }`}
          >
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="p-1 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Schemes
            </span>
            <p className="text-2xl font-black text-slate-900 mt-1">{schemes.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active / Open
            </span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {schemes.filter((s) => s.status === "Open").length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verified This Month
            </span>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {schemes.filter((s) => s.lastVerified.includes("2026")).length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Citizen Reports
            </span>
            <p className="text-2xl font-black text-blue-600 mt-1">{reports.length}</p>
          </div>
        </div>

        {/* Tabs: Schemes vs Reports */}
        <div className="border-b border-slate-200 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("schemes")}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "schemes"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Manage Schemes ({schemes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "reports"
                ? "border-amber-600 text-amber-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Citizen Reports</span>
            {reports.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold">
                {reports.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: SCHEMES MANAGEMENT */}
        {activeTab === "schemes" && (
          <div className="space-y-4">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search schemes by name or ministry..."
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Categories</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={loadSchemes}
                  title="Refresh list"
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loadingSchemes ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* Scheme Cards / Table */}
            {loadingSchemes ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                Loading schemes database...
              </div>
            ) : filteredSchemes.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                No schemes found matching the filters.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSchemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold border border-slate-200">
                          {scheme.categoryTag}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                            scheme.status === "Open"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : scheme.status === "Closed"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {scheme.status}
                        </span>
                        <span className="text-xs font-semibold text-emerald-800">
                          {scheme.benefitAmount}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-tight truncate">
                        {scheme.name}
                      </h3>

                      <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{scheme.ministry}</span>
                      </p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                        <div className="flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Last Verified: {scheme.lastVerified}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {scheme.lastDateToApply || "Ongoing"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(scheme)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmationId(scheme.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors border border-red-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CITIZEN REPORTS */}
        {activeTab === "reports" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base text-slate-900">
                  Citizen Error Reports ({reports.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Reports submitted via the &ldquo;Report a wrong detail&rdquo; modal stored in{" "}
                  <code>data/reports.json</code>.
                </p>
              </div>
              <button
                type="button"
                onClick={loadReports}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loadingReports ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {loadingReports ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                Loading reports...
              </div>
            ) : reports.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold text-slate-700">No reports submitted yet.</p>
                <p className="text-xs text-slate-500">
                  When citizens report incorrect links, eligibility thresholds, or dates, they will
                  appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                          {report.schemeName}
                        </span>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {new Date(report.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                          {report.email && (
                            <>
                              <span>•</span>
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span className="text-slate-700 font-medium">{report.email}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const targetScheme = schemes.find(
                            (s) => s.id === report.schemeId || s.name === report.schemeName
                          );
                          if (targetScheme) {
                            handleOpenEdit(targetScheme);
                          } else {
                            alert("Scheme not found in current database.");
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors"
                      >
                        Edit Scheme to Fix
                      </button>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
                      {report.whatsWrong}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ADD / EDIT SCHEME MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                  {editingScheme ? "Edit Scheme" : "Add New Scheme"}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingScheme
                    ? `Editing ${editingScheme.name}`
                    : "Add a new central or state government scheme"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitScheme} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Note on Auto Last-Verified */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start gap-2 text-xs leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-900 mr-1">
                    Automatic Verification Update:
                  </span>
                  <span>
                    Saving these changes will automatically update the <strong>&ldquo;Last verified&rdquo;</strong> date to the current date.
                  </span>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scheme Name (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. PM Kisan Samman Nidhi"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hindi Name
                  </label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="e.g. पीएम किसान सम्मान निधि"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ministry / Department *
                  </label>
                  <input
                    type="text"
                    value={formData.ministry}
                    onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                    placeholder="e.g. Ministry of Agriculture & Farmers Welfare"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={formData.categoryTag}
                    onChange={(e) => setFormData({ ...formData, categoryTag: e.target.value })}
                    placeholder="e.g. Farmer Support, Housing, Education"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Benefit Amount *
                  </label>
                  <input
                    type="text"
                    value={formData.benefitAmount}
                    onChange={(e) => setFormData({ ...formData, benefitAmount: e.target.value })}
                    placeholder="e.g. ₹6,000 per year"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as any })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Open">Open (Active)</option>
                    <option value="Closed">Closed</option>
                    <option value="Verify">Verify (Under Review)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Date To Apply
                  </label>
                  <input
                    type="text"
                    value={formData.lastDateToApply}
                    onChange={(e) =>
                      setFormData({ ...formData, lastDateToApply: e.target.value })
                    }
                    placeholder="e.g. Ongoing / Open all year"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tagline (One-line benefit summary)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Direct income support for landholding farmer families across India"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) =>
                    setFormData({ ...formData, shortDescription: e.target.value })
                  }
                  placeholder="Detailed breakdown of benefits, payments, and scope..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Apply URL (.gov.in)
                  </label>
                  <input
                    type="url"
                    value={formData.applyUrl}
                    onChange={(e) => setFormData({ ...formData, applyUrl: e.target.value })}
                    placeholder="https://pmkisan.gov.in/"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Source / Guidelines PDF URL
                  </label>
                  <input
                    type="url"
                    value={formData.officialSourceUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, officialSourceUrl: e.target.value })
                    }
                    placeholder="https://pmkisan.gov.in/Documents/RevisedGuidelines.pdf"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Missing Document Tip (&ldquo;Missing a document?&rdquo;)
                </label>
                <input
                  type="text"
                  value={formData.documentHelp}
                  onChange={(e) =>
                    setFormData({ ...formData, documentHelp: e.target.value })
                  }
                  placeholder="e.g. Get Land Records (Khatauni / Khasra) from your state Bhulekh portal or Patwari."
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Documents Needed (Enter one document per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.documentsText}
                  onChange={(e) => setFormData({ ...formData, documentsText: e.target.value })}
                  placeholder="Land Ownership Documents (Khatauni / RoR)&#10;Bank Account Passbook&#10;Voter ID"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Eligibility Criteria Controls */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Basic Matching Criteria
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Min Age (Years)
                    </label>
                    <input
                      type="number"
                      value={formData.minAge}
                      onChange={(e) => setFormData({ ...formData, minAge: e.target.value })}
                      placeholder="e.g. 18"
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Max Age (Years)
                    </label>
                    <input
                      type="number"
                      value={formData.maxAge}
                      onChange={(e) => setFormData({ ...formData, maxAge: e.target.value })}
                      placeholder="e.g. 60"
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Max Income (₹ / yr)
                    </label>
                    <input
                      type="number"
                      value={formData.maxAnnualIncome}
                      onChange={(e) =>
                        setFormData({ ...formData, maxAnnualIncome: e.target.value })
                      }
                      placeholder="e.g. 250000"
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap pt-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requiresFarmer}
                      onChange={(e) =>
                        setFormData({ ...formData, requiresFarmer: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Must be a Farmer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requiresStudent}
                      onChange={(e) =>
                        setFormData({ ...formData, requiresStudent: e.target.checked })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Must be a Student</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.requiresSeniorCitizen}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requiresSeniorCitizen: e.target.checked,
                        })
                      }
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <span>Must be a Senior Citizen (60+)</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-all"
                >
                  {actionLoading ? "Saving..." : editingScheme ? "Save & Update Verification Date" : "Add Scheme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-slate-900">Delete Scheme?</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Are you sure you want to delete this scheme? This will remove it from the local schemes database.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmationId(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteScheme(deleteConfirmationId)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
