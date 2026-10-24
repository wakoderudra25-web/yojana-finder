"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Scheme, UserAnswers } from "@/data/schemes";
import { usePreferences } from "@/context/PreferencesContext";
import {
  CheckCircle2,
  FileText,
  ExternalLink,
  Building2,
  Award,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Calendar,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

// Lazy-load ReportModal to keep bundle lightweight for low-end mobile phones
const ReportModal = dynamic(() => import("@/components/ReportModal"), {
  ssr: false,
});

// Helper to identify criteria that the user left blank so they know to verify it (Requirement 4)
function getUnansweredCriteriaWarnings(scheme: Scheme, userAnswers?: UserAnswers | null): string[] {
  if (!userAnswers) return [];
  const warnings: string[] = [];
  const { criteria } = scheme;
  if (!criteria) return warnings;

  // 1. Income limit (e.g. Check: income limit applies)
  if (
    criteria.maxAnnualIncome != null &&
    (userAnswers.income == null || isNaN(userAnswers.income))
  ) {
    warnings.push("Check: income limit applies");
  }

  // 2. Social Category criteria
  if (
    criteria.allowedSocialCategories &&
    criteria.allowedSocialCategories.length > 0 &&
    (!userAnswers.category || userAnswers.category === "prefer_not_to_say")
  ) {
    warnings.push("Check: category criteria applies");
  }

  // 3. Gender criteria
  if (
    criteria.allowedGenders &&
    criteria.allowedGenders.length > 0 &&
    (!userAnswers.gender || userAnswers.gender === "prefer_not_to_say")
  ) {
    warnings.push("Check: gender criteria applies");
  }

  // 4. Area criteria (Rural / Urban)
  if (
    criteria.allowedAreas &&
    criteria.allowedAreas.length > 0 &&
    (!userAnswers.area || userAnswers.area === "prefer_not_to_say")
  ) {
    warnings.push("Check: area criteria applies");
  }

  // 5. Ration card criteria
  if (
    criteria.allowedRationCardTypes &&
    criteria.allowedRationCardTypes.length > 0 &&
    (!userAnswers.rationCardType || userAnswers.rationCardType === "prefer_not_to_say")
  ) {
    warnings.push("Check: ration card criteria applies");
  }

  // 6. Education criteria
  if (
    criteria.allowedEducationLevels &&
    criteria.allowedEducationLevels.length > 0 &&
    (!userAnswers.educationLevel || userAnswers.educationLevel === "prefer_not_to_say")
  ) {
    warnings.push("Check: education criteria applies");
  }

  // 7. Employment criteria
  if (
    ((criteria.allowedEmploymentStatuses && criteria.allowedEmploymentStatuses.length > 0) ||
      (criteria.excludedEmploymentStatuses && criteria.excludedEmploymentStatuses.length > 0)) &&
    (!userAnswers.employmentStatus || userAnswers.employmentStatus === "prefer_not_to_say")
  ) {
    warnings.push("Check: employment criteria applies");
  }

  // 8. Farmer criteria
  if (
    criteria.requiresFarmer === true &&
    userAnswers.isFarmer !== true &&
    (!userAnswers.farmerType ||
      userAnswers.farmerType === "prefer_not_to_say" ||
      userAnswers.farmerType === "not_a_farmer")
  ) {
    warnings.push("Check: farmer status applies");
  }

  // 9. Disability criteria
  if (
    criteria.minDisabilityPercentage != null &&
    (userAnswers.disabilityPercentage == null || isNaN(userAnswers.disabilityPercentage))
  ) {
    warnings.push("Check: disability criteria applies");
  }

  // 10. Marital status criteria
  if (
    criteria.allowedMaritalStatuses &&
    criteria.allowedMaritalStatuses.length > 0 &&
    (!userAnswers.maritalStatus || userAnswers.maritalStatus === "prefer_not_to_say")
  ) {
    warnings.push("Check: marital status applies");
  }

  // 11. Student status criteria
  if (criteria.requiresStudent === true && userAnswers.isStudent !== true) {
    warnings.push("Check: student status applies");
  }

  // 12. Senior citizen criteria
  if (
    criteria.requiresSeniorCitizen === true &&
    (userAnswers.age == null || userAnswers.age < 60) &&
    userAnswers.isSeniorCitizen !== true
  ) {
    warnings.push("Check: senior citizen criteria applies");
  }

  return warnings;
}

interface SchemeCardProps {
  scheme: Scheme;
  userAnswers?: UserAnswers | null;
}

export default function SchemeCard({ scheme, userAnswers }: SchemeCardProps) {
  const { t, language, simpleMode, isSchemeSaved, toggleSaveScheme } = usePreferences();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const saved = isSchemeSaved(scheme.id);

  const qualificationReason = userAnswers
    ? (typeof scheme.getQualificationReason === "function"
        ? scheme.getQualificationReason(userAnswers)
        : `Meets standard criteria for ${scheme.categoryTag}.`)
    : "Matches standard criteria for eligible citizens.";

  const displayName = language === "hi" && scheme.hindiName ? scheme.hindiName : scheme.name;

  // Compute criteria that were left blank by user (Requirement 4)
  const unansweredCheckLabels = userAnswers
    ? getUnansweredCriteriaWarnings(scheme, userAnswers)
    : [];

  // Text to Speech Read Aloud feature
  const handleReadAloud = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // cancel any active speech

    const textToSpeak = `${displayName}. ${scheme.shortDescription}. ${scheme.benefitAmount}. ${qualificationReason}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (language === "hi") {
      utterance.lang = "hi-IN";
    } else {
      utterance.lang = "en-IN";
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const statusBadgeStyle = {
    Open: "bg-emerald-50 text-emerald-700 border-emerald-300",
    Closed: "bg-red-50 text-red-700 border-red-300",
    Verify: "bg-amber-50 text-amber-700 border-amber-300",
  }[scheme.status || "Open"];

  const statusDotStyle = {
    Open: "bg-emerald-500",
    Closed: "bg-red-500",
    Verify: "bg-amber-500",
  }[scheme.status || "Open"];

  const targetApplyUrl = scheme.applyUrl || scheme.officialUrl || "#";

  return (
    <div
      className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col ${
        simpleMode
          ? "border-slate-300 shadow-md p-1"
          : "border-slate-200/90 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Top Banner: Category, Status, Dates & Save */}
      <div
        className={`p-4 sm:p-6 pb-4 border-b border-slate-100 flex flex-col gap-2.5 ${
          simpleMode ? "bg-slate-50/70" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Tag */}
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold border ${
                simpleMode ? "text-sm" : "text-xs"
              } ${scheme.badgeColor}`}
            >
              {scheme.categoryTag}
            </span>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold border ${
                simpleMode ? "text-sm" : "text-xs"
              } ${statusBadgeStyle}`}
            >
              <span className={`w-2 h-2 rounded-full animate-pulse ${statusDotStyle}`} />
              <span>
                {scheme.status === "Open"
                  ? t("statusOpen")
                  : scheme.status === "Closed"
                  ? t("statusClosed")
                  : t("statusVerify")}
              </span>
            </span>

            {/* Benefit Highlight Badge */}
            <span
              className={`inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 ${
                simpleMode ? "text-sm font-bold" : "text-xs"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{scheme.benefitAmount}</span>
            </span>
          </div>

          {/* Action Buttons: Save & Read Aloud */}
          <div className="flex items-center gap-1.5 ml-auto">
            {/* Read Aloud Button */}
            <button
              type="button"
              onClick={handleReadAloud}
              title={isSpeaking ? t("stopReading") : t("readAloud")}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-medium transition-colors ${
                isSpeaking
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              } ${simpleMode ? "text-sm font-bold" : "text-xs"}`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4 text-amber-700" />
                  <span>{t("stopReading")}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-slate-600" />
                  <span>{t("readAloud")}</span>
                </>
              )}
            </button>

            {/* Save Scheme Button (Stores ONLY scheme IDs) */}
            <button
              type="button"
              onClick={() => toggleSaveScheme(scheme.id)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                saved
                  ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-300"
              } ${simpleMode ? "text-sm font-bold" : "text-xs"}`}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 fill-current" />
                  <span>{t("savedScheme")}</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  <span>{t("saveScheme")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-extrabold text-slate-900 leading-snug tracking-tight ${
            simpleMode ? "text-xl sm:text-2xl mt-1 text-slate-950" : "text-lg sm:text-xl"
          }`}
        >
          {displayName}
        </h3>

        {/* Ministry & Tagline */}
        <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs sm:text-sm">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{scheme.ministry}</span>
        </div>

        {/* Short Description */}
        <p
          className={`text-slate-600 leading-relaxed ${
            simpleMode ? "text-base sm:text-lg font-medium text-slate-800" : "text-xs sm:text-sm"
          }`}
        >
          {scheme.shortDescription}
        </p>

        {/* Metadata info strip: Last Verified & Last Date */}
        {!simpleMode ? (
          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] sm:text-xs text-slate-500 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {t("lastDateToApply")}:{" "}
                <strong className="text-slate-700">
                  {scheme.lastDateToApply || t("ongoingDeadline")}
                </strong>
              </span>
            </div>

            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {t("lastVerified")}:{" "}
                <strong className="text-slate-700">{scheme.lastVerified}</strong>
              </span>
            </div>

            <div className="ml-auto flex items-center gap-3 flex-wrap">
              {scheme.officialSourceUrl && (
                <a
                  href={scheme.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-800 font-semibold underline underline-offset-2"
                >
                  <span>{t("viewOfficialSource")}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsReportModalOpen(true)}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-amber-800 font-medium underline underline-offset-2 transition-colors"
              >
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>{t("reportWrongDetail")}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">
              {t("lastVerified")}: <strong>{scheme.lastVerified}</strong>
            </span>
            <button
              type="button"
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1 text-amber-800 hover:text-amber-900 font-bold underline underline-offset-2"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{t("reportWrongDetail")}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Body: Why You Qualify & Documents */}
      <div className={`p-4 sm:p-6 flex-1 flex flex-col gap-4 ${simpleMode ? "gap-5" : ""}`}>
        {/* Why You Qualify Box */}
        <div
          className={`p-3.5 sm:p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/90 text-emerald-950 ${
            simpleMode ? "p-4 sm:p-5 bg-emerald-100/60 border-emerald-300" : ""
          }`}
        >
          <div className="flex items-start gap-2.5">
            <CheckCircle2
              className={`text-emerald-600 shrink-0 mt-0.5 ${
                simpleMode ? "w-6 h-6" : "w-5 h-5"
              }`}
            />
            <div>
              <p
                className={`font-bold uppercase tracking-wider text-emerald-800 ${
                  simpleMode ? "text-xs sm:text-sm" : "text-xs"
                }`}
              >
                {t("whyYouQualify")}
              </p>
              <p
                className={`text-emerald-950 mt-0.5 leading-relaxed font-semibold ${
                  simpleMode ? "text-base sm:text-lg" : "text-xs sm:text-sm"
                }`}
              >
                {qualificationReason}
              </p>
            </div>
          </div>
        </div>

        {/* Unanswered Criteria Verification Labels (Requirement 4) */}
        {unansweredCheckLabels.length > 0 && (
          <div className="space-y-1.5 -mt-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Verification Needed:
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {unansweredCheckLabels.map((label, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold bg-amber-50 text-amber-900 border border-amber-300 ${
                    simpleMode ? "text-xs sm:text-sm font-bold" : "text-[11px] sm:text-xs"
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Documents Needed (Streamlined in Simple Mode) */}
        <div className="space-y-2">
          <div
            className={`flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-500 ${
              simpleMode ? "text-sm text-slate-700" : "text-xs"
            }`}
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>{t("documentsNeeded")}</span>
          </div>

          <ul
            className={`space-y-1.5 text-slate-700 ${
              simpleMode ? "text-sm sm:text-base font-medium space-y-2" : "text-xs sm:text-sm"
            }`}
          >
            {scheme.documentsNeeded.map((doc, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span className="leading-snug">{doc}</span>
              </li>
            ))}
          </ul>

          {/* Missing Document Tip */}
          {scheme.documentHelp && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-950 flex items-start gap-2 text-xs sm:text-sm leading-relaxed">
              <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-900 mr-1">
                  {t("missingDocumentTipTitle")}
                </span>
                <span className="text-amber-900">{scheme.documentHelp}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Official .gov.in Fraud Prevention Warning near Apply Button */}
      <div className="mx-4 sm:mx-6 mb-3 p-3 rounded-xl bg-amber-50/95 border border-amber-300 text-amber-950 flex items-start gap-2.5 text-xs leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-900 mr-1">Important:</span>
          <span className="text-amber-900 font-medium">{t("officialGovWarning")}</span>
        </div>
      </div>

      {/* Card Action Footer with Official Link & Note */}
      <div className="p-4 sm:p-5 pt-3.5 bg-slate-50 border-t border-slate-100 mt-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Note */}
        <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
          {t("officialWebsiteNote")}
        </p>

        {/* Apply Button */}
        <a
          href={targetApplyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 px-5 py-3 font-bold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-xl transition-all shadow-sm ${
            simpleMode ? "text-base py-3.5 bg-amber-700 hover:bg-amber-800 text-white" : "text-xs sm:text-sm"
          }`}
        >
          <span>{t("applyOnOfficialWebsite")}</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Lazy-loaded Report Wrong Detail Modal */}
      {isReportModalOpen && (
        <ReportModal
          schemeId={scheme.id}
          schemeName={displayName}
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
        />
      )}
    </div>
  );
}
