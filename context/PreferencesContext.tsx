"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  getTranslation,
  TranslationKey,
} from "@/data/translations";

interface PreferencesContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  simpleMode: boolean;
  setSimpleMode: (simple: boolean) => void;
  toggleSimpleMode: () => void;
  savedSchemeIds: string[];
  toggleSaveScheme: (schemeId: string) => void;
  isSchemeSaved: (schemeId: string) => boolean;
  t: (key: TranslationKey) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [simpleMode, setSimpleModeState] = useState<boolean>(false);
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load UI preferences and saved scheme IDs on client mount
  useEffect(() => {
    try {
      const storedLang = localStorage.getItem("yojana_pref_lang") as LanguageCode;
      const isValid = SUPPORTED_LANGUAGES.some((l) => l.code === storedLang);
      if (storedLang && isValid) {
        setLanguageState(storedLang);
      }

      const storedSimpleMode = localStorage.getItem("yojana_pref_simple_mode");
      if (storedSimpleMode !== null) {
        setSimpleModeState(storedSimpleMode === "true");
      }

      // STRICT PRIVACY: only scheme IDs are stored, NEVER user eligibility answers
      const storedSaved = localStorage.getItem("yojana_saved_scheme_ids");
      if (storedSaved) {
        const parsed = JSON.parse(storedSaved);
        if (Array.isArray(parsed)) {
          setSavedSchemeIds(parsed);
        }
      }
    } catch {
      // In case localStorage is disabled or restricted
    }
    setIsHydrated(true);
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("yojana_pref_lang", lang);
    } catch {}
  };

  const setSimpleMode = (simple: boolean) => {
    setSimpleModeState(simple);
    try {
      localStorage.setItem("yojana_pref_simple_mode", simple ? "true" : "false");
    } catch {}
  };

  const toggleSimpleMode = () => {
    setSimpleMode(!simpleMode);
  };

  const toggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds((prev) => {
      const next = prev.includes(schemeId)
        ? prev.filter((id) => id !== schemeId)
        : [...prev, schemeId];
      try {
        localStorage.setItem("yojana_saved_scheme_ids", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const isSchemeSaved = (schemeId: string) => {
    return savedSchemeIds.includes(schemeId);
  };

  const t = (key: TranslationKey) => {
    return getTranslation(language, key);
  };

  return (
    <PreferencesContext.Provider
      value={{
        language,
        setLanguage,
        simpleMode,
        setSimpleMode,
        toggleSimpleMode,
        savedSchemeIds,
        toggleSaveScheme,
        isSchemeSaved,
        t,
      }}
    >
      <div className={simpleMode ? "simple-mode-active" : ""}>{children}</div>
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
