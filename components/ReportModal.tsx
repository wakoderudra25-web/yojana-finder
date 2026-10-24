"use client";

import React, { useState } from "react";
import { X, AlertTriangle, Send, CheckCircle2, Loader2 } from "lucide-react";
import { usePreferences } from "@/context/PreferencesContext";

interface ReportModalProps {
  schemeId: string;
  schemeName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportModal({
  schemeId,
  schemeName,
  isOpen,
  onClose,
}: ReportModalProps) {
  const { t } = usePreferences();
  const [whatsWrong, setWhatsWrong] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsWrong.trim()) {
      setError("Please describe what detail is incorrect.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemeId,
          schemeName,
          whatsWrong: whatsWrong.trim(),
          email: email.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit report");
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setWhatsWrong("");
        setEmail("");
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                Report a Wrong Detail
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">
                {schemeName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="p-4 sm:p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-slate-900">
                Thank you for your report!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your feedback has been saved locally and will be reviewed to keep scheme details accurate for all citizens.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Scheme Name (Read-only reference) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scheme
                </label>
                <input
                  type="text"
                  value={schemeName}
                  disabled
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-xs sm:text-sm font-medium cursor-not-allowed"
                />
              </div>

              {/* What is wrong */}
              <div>
                <label
                  htmlFor="whats-wrong"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  What is wrong or outdated? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="whats-wrong"
                  rows={4}
                  value={whatsWrong}
                  onChange={(e) => setWhatsWrong(e.target.value)}
                  placeholder="e.g. Official website link is not working, deadline has passed, income ceiling changed, or documents list needs an update..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>

              {/* Optional Email */}
              <div>
                <label
                  htmlFor="reporter-email"
                  className="block text-xs font-semibold text-slate-800 mb-1"
                >
                  Your Email (Optional)
                </label>
                <input
                  id="reporter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com (if you'd like a follow-up)"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Optional. We respect your privacy and will never share your email.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 disabled:opacity-50 rounded-xl shadow-sm transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
