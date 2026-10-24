export interface SocialCategoryOption {
  code: string;
  label: string;
  parentCategory?: "General" | "OBC" | "SC" | "ST" | "EWS";
}

export const NATIONAL_CATEGORIES: SocialCategoryOption[] = [
  { code: "General", label: "General / Open Category", parentCategory: "General" },
  { code: "OBC", label: "OBC (Other Backward Class)", parentCategory: "OBC" },
  { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
  { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
  { code: "EWS", label: "EWS (Economically Weaker Section)", parentCategory: "EWS" },
];

export const STATE_CATEGORIES: Record<string, SocialCategoryOption[]> = {
  Maharashtra: [
    { code: "General", label: "General / Open", parentCategory: "General" },
    { code: "EWS", label: "EWS (Economically Weaker Section)", parentCategory: "EWS" },
    { code: "OBC", label: "OBC (Other Backward Class)", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "VJ (A)", label: "VJ (A) / VJNT (Vimukta Jati)", parentCategory: "OBC" },
    { code: "NT (B)", label: "NT (B) (Nomadic Tribe B)", parentCategory: "OBC" },
    { code: "NT (C)", label: "NT (C) (Dhangar / Nomadic Tribe C)", parentCategory: "OBC" },
    { code: "NT (D)", label: "NT (D) (Vanjari / Nomadic Tribe D)", parentCategory: "OBC" },
    { code: "SBC", label: "SBC (Special Backward Category)", parentCategory: "OBC" },
  ],
  Karnataka: [
    { code: "General", label: "General (Open)", parentCategory: "General" },
    { code: "Category 1", label: "Category 1", parentCategory: "OBC" },
    { code: "Category 2A", label: "Category 2A", parentCategory: "OBC" },
    { code: "Category 2B", label: "Category 2B (Muslims)", parentCategory: "OBC" },
    { code: "Category 3A", label: "Category 3A", parentCategory: "OBC" },
    { code: "Category 3B", label: "Category 3B", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "EWS", label: "EWS", parentCategory: "EWS" },
  ],
  "Tamil Nadu": [
    { code: "General", label: "Open Competition (OC / General)", parentCategory: "General" },
    { code: "BC", label: "BC (Backward Class)", parentCategory: "OBC" },
    { code: "BCM", label: "BCM (Backward Class Muslim)", parentCategory: "OBC" },
    { code: "MBC/DNC", label: "MBC / DNC (Most Backward / Denotified)", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "SCA", label: "SCA (SC Arunthathiyar)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
  ],
  Bihar: [
    { code: "General", label: "General (Unreserved)", parentCategory: "General" },
    { code: "BC", label: "BC (Backward Class / BC-II)", parentCategory: "OBC" },
    { code: "EBC", label: "EBC (Extremely Backward Class / BC-I)", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "EWS", label: "EWS (Economically Weaker Section)", parentCategory: "EWS" },
  ],
  "Uttar Pradesh": [
    { code: "General", label: "General / Unreserved", parentCategory: "General" },
    { code: "OBC", label: "OBC (Other Backward Class)", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "EWS", label: "EWS (Economically Weaker Section)", parentCategory: "EWS" },
  ],
  Kerala: [
    { code: "General", label: "General / Open", parentCategory: "General" },
    { code: "Ezhava", label: "Ezhava / Thiyya", parentCategory: "OBC" },
    { code: "Muslim", label: "Muslim", parentCategory: "OBC" },
    { code: "LC/AI", label: "Latin Catholic / Anglo Indian", parentCategory: "OBC" },
    { code: "OBX", label: "Other Backward Christian", parentCategory: "OBC" },
    { code: "Viswakarma", label: "Viswakarma", parentCategory: "OBC" },
    { code: "Dheevara", label: "Dheevara", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "EWS", label: "EWS", parentCategory: "EWS" },
  ],
  "Andhra Pradesh": [
    { code: "General", label: "OC (Open Category / General)", parentCategory: "General" },
    { code: "BC-A", label: "BC-A (Aboriginal / Nomadic)", parentCategory: "OBC" },
    { code: "BC-B", label: "BC-B (Vocational groups)", parentCategory: "OBC" },
    { code: "BC-C", label: "BC-C (Scheduled Caste converts to Christianity)", parentCategory: "OBC" },
    { code: "BC-D", label: "BC-D (Other Classes)", parentCategory: "OBC" },
    { code: "BC-E", label: "BC-E (Socially & Educationally Backward Muslims)", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "EWS", label: "EWS", parentCategory: "EWS" },
  ],
  Telangana: [
    { code: "General", label: "OC (Open Category / General)", parentCategory: "General" },
    { code: "BC-A", label: "BC-A", parentCategory: "OBC" },
    { code: "BC-B", label: "BC-B", parentCategory: "OBC" },
    { code: "BC-C", label: "BC-C", parentCategory: "OBC" },
    { code: "BC-D", label: "BC-D", parentCategory: "OBC" },
    { code: "BC-E", label: "BC-E", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "EWS", label: "EWS", parentCategory: "EWS" },
  ],
  Gujarat: [
    { code: "General", label: "General / Open", parentCategory: "General" },
    { code: "SEBC", label: "SEBC / OBC (Socially & Educationally Backward)", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "EWS", label: "EWS", parentCategory: "EWS" },
  ],
  Rajasthan: [
    { code: "General", label: "General / Open", parentCategory: "General" },
    { code: "OBC", label: "OBC (Other Backward Class)", parentCategory: "OBC" },
    { code: "MBC", label: "MBC (Most Backward Class - Gurjar, etc.)", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "EWS", label: "EWS", parentCategory: "EWS" },
  ],
  "West Bengal": [
    { code: "General", label: "General / Open", parentCategory: "General" },
    { code: "OBC-A", label: "OBC-A (More Backward)", parentCategory: "OBC" },
    { code: "OBC-B", label: "OBC-B (Backward)", parentCategory: "OBC" },
    { code: "SC", label: "SC (Scheduled Caste)", parentCategory: "SC" },
    { code: "ST", label: "ST (Scheduled Tribe)", parentCategory: "ST" },
    { code: "EWS", label: "EWS", parentCategory: "EWS" },
  ],
};

/**
 * Returns social categories for a given state or the national default list when no state is selected.
 */
export function getCategoriesForState(stateName?: string | null): SocialCategoryOption[] {
  if (stateName && stateName !== "all" && STATE_CATEGORIES[stateName]) {
    return STATE_CATEGORIES[stateName];
  }
  return NATIONAL_CATEGORIES;
}

/**
 * Checks whether a scheme matches the selected social category:
 * "A scheme should appear if its allowed categories include the selected one, or if it's open to everyone."
 */
export function matchesSocialCategory(
  allowedCategories: string[] | null | undefined,
  selectedCategoryCode: string,
  categoryOptions: SocialCategoryOption[]
): boolean {
  // If user selected "All", it never excludes any scheme
  if (!selectedCategoryCode || selectedCategoryCode === "all") {
    return true;
  }

  // If a scheme has no category restrictions, it is open to everyone
  if (!allowedCategories || allowedCategories.length === 0) {
    return true;
  }

  // 1. Direct code match (e.g. "SC" in ["SC", "ST", "OBC"])
  if (allowedCategories.includes(selectedCategoryCode)) {
    return true;
  }

  // 2. Parent category match (e.g. VJ (A) -> OBC, or Category 2A -> OBC)
  const option = categoryOptions.find((opt) => opt.code === selectedCategoryCode);
  if (option?.parentCategory && allowedCategories.includes(option.parentCategory)) {
    return true;
  }

  return false;
}
