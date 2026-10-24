import { en, TranslationKey } from "./en";
import { hi } from "./hi";
import { mr } from "./mr";

export type LanguageCode = "en" | "hi" | "mr";

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "mr", label: "Marathi", nativeLabel: "मराठी" },
];

export const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en,
  hi,
  mr,
};

export { type TranslationKey };

/**
 * Helper to fetch translation with fallback to English
 */
export function getTranslation(lang: LanguageCode, key: TranslationKey): string {
  const dictionary = translations[lang] || translations.en;
  return dictionary[key] || translations.en[key] || key;
}
