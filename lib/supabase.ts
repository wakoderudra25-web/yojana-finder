import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Scheme, SchemeCriteria, SchemeStatus } from "@/data/schemes";

// Environment variables from .env.local (Never hardcoded)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Checks whether Supabase environment variables are configured with valid values.
 */
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("http") &&
  !supabaseUrl.includes("placeholder") &&
  !supabaseUrl.includes("your-project")
);

/**
 * Singleton Supabase client instance using public anon key.
 * If credentials are not yet configured, returns null to allow graceful fallback.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Helper to get an active Supabase client or null if unconfigured
 */
export function getSupabase(): SupabaseClient | null {
  return supabase;
}

/**
 * Maps a row from the Supabase 'schemes' table to the application Scheme interface.
 * Ensures backward compatibility with all frontend components and matching algorithms.
 */
export function mapDatabaseRowToScheme(row: any): Scheme {
  // If row already has JSON criteria stored, use it; otherwise synthesize criteria from column values
  const criteria: SchemeCriteria = row.criteria || {
    minAge: row.min_age != null ? Number(row.min_age) : null,
    maxAge: row.max_age != null ? Number(row.max_age) : null,
    allowedGenders: row.gender && row.gender !== "All" && row.gender !== "Both" 
      ? [row.gender] 
      : null,
    allowedStates: row.state && row.state !== "All India" && row.state !== "Central" 
      ? [row.state] 
      : null,
    allowedDistricts: null,
    allowedAreas: row.rural_urban
      ? row.rural_urban.toLowerCase().includes("rural") && row.rural_urban.toLowerCase().includes("urban")
        ? null
        : row.rural_urban.toLowerCase() === "rural"
        ? ["rural"]
        : row.rural_urban.toLowerCase() === "urban"
        ? ["urban"]
        : null
      : null,
    maxAnnualIncome: row.max_income != null ? Number(row.max_income) : null,
    allowedRationCardTypes: null,
    allowedEducationLevels: row.education_level && row.education_level !== "Any"
      ? [row.education_level.toLowerCase() as any]
      : null,
    allowedOccupations: row.occupation && row.occupation !== "Any" ? [row.occupation] : null,
    allowedEmploymentStatuses: null,
    excludedEmploymentStatuses: null,
    requiresFarmer: row.occupation?.toLowerCase().includes("farmer") || false,
    allowedFarmerTypes: null,
    maxLandSizeAcres: null,
    allowedSocialCategories: Array.isArray(row.categories) && row.categories.length > 0 
      ? (row.categories as any) 
      : null,
    allowedMinorityCommunities: null,
    allowedMaritalStatuses: null,
    minDisabilityPercentage: null,
    allowedSpecialSituations: null,
    requiresStudent: row.occupation?.toLowerCase().includes("student") || false,
    requiresSeniorCitizen: Boolean(row.min_age && Number(row.min_age) >= 60),
  };

  return {
    id: row.id,
    name: row.name,
    hindiName: row.name_local_language || "",
    tagline: row.tagline || row.exact_beneficiary_category || row.name,
    ministry: row.ministry_or_department || "Government of India",
    categoryTag: (Array.isArray(row.categories) && row.categories[0]) || row.exact_beneficiary_category || "General Support",
    badgeColor: row.badge_color || "bg-emerald-100 text-emerald-800 border-emerald-300",
    shortDescription: row.description || "",
    benefitAmount: row.benefit_amount || "Financial Support",
    status: (row.status === "Closed" || row.status === "Verify" ? row.status : "Open") as SchemeStatus,
    lastDateToApply: row.last_date_to_apply || "Ongoing / Open throughout the year",
    lastVerified: row.last_verified || "October 2026",
    officialSourceUrl: row.source_url || row.officialSourceUrl || "",
    applyUrl: row.apply_link || row.applyUrl || "",
    officialUrl: row.apply_link || row.applyUrl || "",
    documentHelp: row.document_help || "Verify document requirements on official government portal or local service centre.",
    documentsNeeded: Array.isArray(row.documents_needed)
      ? row.documents_needed
      : typeof row.documents_needed === "string"
      ? row.documents_needed.split("\n").map((s: string) => s.trim()).filter(Boolean)
      : [],
    criteria,
  };
}

/**
 * Maps a Scheme object to the Supabase 'schemes' table schema format.
 */
export function mapSchemeToDatabaseRow(scheme: Partial<Scheme>) {
  const criteria = scheme.criteria || {};
  return {
    id: scheme.id,
    name: scheme.name,
    name_local_language: scheme.hindiName || null,
    level: criteria.allowedStates && criteria.allowedStates.length > 0 ? "State" : "Central",
    state: criteria.allowedStates && criteria.allowedStates.length > 0 ? criteria.allowedStates.join(", ") : "All India",
    ministry_or_department: scheme.ministry || null,
    exact_beneficiary_category: scheme.tagline || scheme.categoryTag || null,
    description: scheme.shortDescription || null,
    benefit_amount: scheme.benefitAmount || null,
    eligibility: typeof criteria === "object" ? JSON.stringify(criteria) : null,
    min_age: criteria.minAge ?? null,
    max_age: criteria.maxAge ?? null,
    max_income: criteria.maxAnnualIncome ?? null,
    gender: criteria.allowedGenders && criteria.allowedGenders.length > 0 ? criteria.allowedGenders.join(", ") : "All",
    education_level: criteria.allowedEducationLevels && criteria.allowedEducationLevels.length > 0 ? criteria.allowedEducationLevels.join(", ") : "Any",
    occupation: criteria.allowedOccupations && criteria.allowedOccupations.length > 0 ? criteria.allowedOccupations.join(", ") : "Any",
    rural_urban: criteria.allowedAreas && criteria.allowedAreas.length > 0 ? criteria.allowedAreas.join(", ") : "Rural and Urban",
    categories: criteria.allowedSocialCategories || (scheme.categoryTag ? [scheme.categoryTag] : []),
    documents_needed: scheme.documentsNeeded || [],
    how_to_apply: scheme.applyUrl ? `Apply online at ${scheme.applyUrl}` : "Apply through official department portal",
    apply_link: scheme.applyUrl || null,
    source_url: scheme.officialSourceUrl || null,
    status: scheme.status || "Open",
    last_verified: scheme.lastVerified || "October 2026",
    confidence: "High",
    document_help: scheme.documentHelp || null,
    tagline: scheme.tagline || null,
    badge_color: scheme.badgeColor || null,
    criteria: criteria,
  };
}

/**
 * Client helper to fetch active schemes directly from Supabase (or return null to trigger fallback)
 */
export async function fetchSchemesFromSupabase(): Promise<Scheme[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("schemes")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Supabase fetch error:", error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data.map(mapDatabaseRowToScheme);
  } catch (err) {
    console.warn("Failed to fetch schemes from Supabase:", err);
    return null;
  }
}

/**
 * Client helper to submit a report to Supabase
 */
export async function submitReportToSupabase(payload: {
  schemeName: string;
  message: string;
  email?: string;
  schemeId?: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!supabase) {
    return { success: false, error: "Supabase is not configured" };
  }

  try {
    const { error } = await supabase.from("reports").insert([
      {
        scheme_name: payload.schemeName,
        message: payload.message,
        email: payload.email || null,
        scheme_id: payload.schemeId || null,
        resolved: false,
      },
    ]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to submit report" };
  }
}
