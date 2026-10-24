export interface SchemeCriteria {
  // Basic Demographics & Location
  minAge?: number | null;
  maxAge?: number | null;
  allowedGenders?: string[] | null; // e.g. ["Male", "Female", "Other"] or null = applies to all
  allowedStates?: string[] | null; // null = all states & UTs
  allowedDistricts?: string[] | null; // null = all districts
  allowedAreas?: ("rural" | "urban")[] | null; // null = applies to both rural and urban

  // Financial & Documentation
  maxAnnualIncome?: number | null; // null = no income ceiling
  minAnnualIncome?: number | null;
  allowedRationCardTypes?: ("none" | "apl" | "bpl" | "antyodaya")[] | null;

  // Education & Employment
  allowedEducationLevels?: (
    | "school"
    | "iti"
    | "diploma"
    | "graduate"
    | "postgraduate"
    | "phd"
  )[] | null;
  allowedOccupations?: string[] | null;
  allowedEmploymentStatuses?: (
    | "unemployed"
    | "self_employed"
    | "msme_owner"
    | "unorganised_worker"
    | "gig_worker"
    | "government_employee"
  )[] | null;
  excludedEmploymentStatuses?: (
    | "unemployed"
    | "self_employed"
    | "msme_owner"
    | "unorganised_worker"
    | "gig_worker"
    | "government_employee"
  )[] | null;

  // Farmer & Land Size
  requiresFarmer?: boolean | null; // true = must be farmer
  allowedFarmerTypes?: ("owner" | "tenant")[] | null;
  maxLandSizeAcres?: number | null; // maximum land holding in acres

  // Social, Community & Family
  allowedSocialCategories?: ("General" | "OBC" | "SC" | "ST" | "EWS")[] | null;
  allowedMinorityCommunities?: (
    | "Muslim"
    | "Christian"
    | "Sikh"
    | "Buddhist"
    | "Jain"
    | "Parsi"
  )[] | null;
  allowedMaritalStatuses?: (
    | "single"
    | "married"
    | "widow"
    | "single_mother"
    | "divorced"
  )[] | null;

  // Disability & Special Situations
  minDisabilityPercentage?: number | null;
  allowedSpecialSituations?: (
    | "ex_serviceman"
    | "freedom_fighter_family"
    | "orphan"
    | "soldier_widow"
    | "transgender"
  )[] | null;

  // Checkboxes
  requiresStudent?: boolean | null;
  requiresSeniorCitizen?: boolean | null;
}

export type SchemeStatus = "Open" | "Closed" | "Verify";

export interface Scheme {
  id: string;
  name: string;
  hindiName?: string;
  tagline: string;
  ministry: string;
  categoryTag: string;
  badgeColor: string;
  shortDescription: string;
  benefitAmount: string;
  status: SchemeStatus;
  lastDateToApply: string | null;
  lastVerified: string;
  officialSourceUrl: string;
  applyUrl: string;
  officialUrl?: string; // legacy fallback
  documentHelp: string;
  documentsNeeded: string[];
  criteria: SchemeCriteria;
  getQualificationReason: (answers: UserAnswers) => string;
}

export interface UserAnswers {
  // All fields are strictly optional with 'prefer_not_to_say' or null
  state?: string | null;
  district?: string | null;
  area?: "rural" | "urban" | "prefer_not_to_say" | null;
  age?: number | null;
  gender?: string | null;
  maritalStatus?:
    | "single"
    | "married"
    | "widow"
    | "single_mother"
    | "divorced"
    | "prefer_not_to_say"
    | null;

  // Education & Work
  educationLevel?:
    | "school"
    | "iti"
    | "diploma"
    | "graduate"
    | "postgraduate"
    | "phd"
    | "prefer_not_to_say"
    | null;
  occupation?: string | null;
  employmentStatus?:
    | "unemployed"
    | "self_employed"
    | "msme_owner"
    | "unorganised_worker"
    | "gig_worker"
    | "government_employee"
    | "prefer_not_to_say"
    | null;

  // Financial & Ration Card
  income?: number | null;
  rationCardType?: "none" | "apl" | "bpl" | "antyodaya" | "prefer_not_to_say" | null;

  // Land & Farmer
  farmerType?: "owner" | "tenant" | "not_a_farmer" | "prefer_not_to_say" | null;
  landSize?: number | null; // acres

  // Social & Minority
  category?: "General" | "OBC" | "SC" | "ST" | "EWS" | "prefer_not_to_say" | null;
  minorityCommunity?:
    | "none"
    | "Muslim"
    | "Christian"
    | "Sikh"
    | "Buddhist"
    | "Jain"
    | "Parsi"
    | "prefer_not_to_say"
    | null;

  // Disability
  disabilityPercentage?: number | null;

  // Checkboxes & Special Situations
  isStudent?: boolean | null;
  isFarmer?: boolean | null;
  isSeniorCitizen?: boolean | null;
  specialSituations?: string[] | null;
}

export const SAMPLE_SCHEMES: Scheme[] = [
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi (PM-KISAN)",
    hindiName: "पीएम किसान सम्मान निधि",
    tagline: "Direct income support for landholding farmer families across India",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    categoryTag: "Farmer Support",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    shortDescription:
      "Financial assistance of ₹6,000 per year provided to cultivable landholding farmer families in three equal 4-monthly installments directly into bank accounts.",
    benefitAmount: "₹6,000 per year",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://pmkisan.gov.in/Documents/RevisedGuidelines.pdf",
    applyUrl: "https://pmkisan.gov.in/",
    officialUrl: "https://pmkisan.gov.in/",
    documentHelp:
      "Get Land Records (Khatauni / Khasra) from your state Bhulekh portal or local Tehsildar / Patwari.",
    documentsNeeded: [
      "Land Ownership Documents (Khatauni / RoR / Khasra papers)",
      "Bank Account Passbook (linked with Aadhaar at the bank)",
      "Voter ID / Valid Photo Identity Proof",
      "Active Mobile Number for OTP updates",
    ],
    criteria: {
      minAge: 18,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: true,
      allowedFarmerTypes: ["owner"],
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) => {
      const parts: string[] = [];
      if (user.farmerType === "owner") {
        parts.push("You are a landholding farmer");
      } else if (user.isFarmer) {
        parts.push("You identified as a farmer");
      } else {
        parts.push("You may qualify as a farmer");
      }
      if (user.landSize != null && !isNaN(user.landSize)) {
        parts.push(`with ${user.landSize} acres of land`);
      }
      if (user.age != null) {
        parts.push(`(age ${user.age})`);
      }
      return `${parts.join(" ")}, qualifying your household for ₹6,000/year direct financial support.`;
    },
  },
  {
    id: "pm-awas-yojana",
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    hindiName: "प्रधानमंत्री आवास योजना",
    tagline: "Affordable housing subsidy for families living in kucha houses or without pucca homes",
    ministry: "Ministry of Housing and Urban Affairs / Ministry of Rural Development",
    categoryTag: "Housing & Shelter",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    shortDescription:
      "Financial subsidy and assistance to build or purchase a permanent (pucca) home with basic amenities like water, sanitation, and electricity. Preference given to women heads, widows, and BPL families.",
    benefitAmount: "Up to ₹1,30,000 - ₹2,67,000 Subsidy",
    status: "Open",
    lastDateToApply: "March 31, 2027",
    lastVerified: "October 2026",
    officialSourceUrl: "https://pmaymis.gov.in/PMAY_Guidelines.aspx",
    applyUrl: "https://pmaymis.gov.in/",
    officialUrl: "https://pmaymis.gov.in/",
    documentHelp:
      "Get an Income Certificate from your state e-District portal or local CSC (Common Service Centre).",
    documentsNeeded: [
      "Income Certificate issued by Tehsildar or Gram Panchayat",
      "Ration Card (BPL / Antyodaya / Priority Household)",
      "Identity Proof (Voter ID, Driving License, or Passport)",
      "Bank Account Passbook copy with IFSC",
      "Self-declaration / Affidavit showing you do not own a pucca house in India",
    ],
    criteria: {
      minAge: 18,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 300000,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) => {
      const highlights: string[] = [];
      if (user.income != null && !isNaN(user.income)) {
        highlights.push(`household income ₹${user.income.toLocaleString("en-IN")}`);
      }
      if (user.maritalStatus === "widow" || user.maritalStatus === "single_mother") {
        highlights.push("preference for women-headed households/widows");
      }
      if (user.area === "rural") {
        highlights.push("PMAY-Gramin rural assistance");
      } else if (user.area === "urban") {
        highlights.push("PMAY-Urban credit subsidy");
      }
      const reasonText = highlights.length > 0 ? ` (${highlights.join(", ")})` : "";
      return `Your profile falls within the EWS/LIG affordable housing bracket${reasonText} for permanent home construction subsidy.`;
    },
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    hindiName: "आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना",
    tagline: "World's largest free health insurance cover for vulnerable families",
    ministry: "National Health Authority, Ministry of Health & Family Welfare",
    categoryTag: "Health & Medical",
    badgeColor: "bg-red-100 text-red-800 border-red-300",
    shortDescription:
      "Cashless and paperless access to secondary and tertiary medical treatment up to ₹5,00,000 per family per year in empaneled public and private hospitals nationwide.",
    benefitAmount: "₹5,00,000 / year Health Cover",
    status: "Open",
    lastDateToApply: "Ongoing / Open throughout the year",
    lastVerified: "September 2026",
    officialSourceUrl: "https://nha.gov.in/PM-JAY",
    applyUrl: "https://beneficiary.nha.gov.in/",
    officialUrl: "https://beneficiary.nha.gov.in/",
    documentHelp:
      "Ration Card or NFSA slip can be verified or downloaded from your state Food & Civil Supplies portal.",
    documentsNeeded: [
      "Ration Card or State Food Security / NFSA Card",
      "Government Photo ID (Voter ID, Ration Card, etc.)",
      "Proof of Residence in your State",
    ],
    criteria: {
      minAge: null,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 250000,
      allowedRationCardTypes: ["bpl", "antyodaya"],
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: [
        "unemployed",
        "self_employed",
        "unorganised_worker",
        "gig_worker",
      ],
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) => {
      const tags: string[] = [];
      if (user.rationCardType === "bpl" || user.rationCardType === "antyodaya") {
        tags.push(`active ${user.rationCardType.toUpperCase()} ration card`);
      }
      if (user.employmentStatus === "unorganised_worker" || user.employmentStatus === "gig_worker") {
        tags.push("unorganised worker safety net");
      }
      if (user.income != null && !isNaN(user.income)) {
        tags.push(`annual income under ₹2.5 Lakhs`);
      }
      const tagStr = tags.length > 0 ? ` (${tags.join(", ")})` : "";
      return `Your socio-economic profile${tagStr} qualifies your household for ₹5 Lakh/year cashless hospital treatment.`;
    },
  },
  {
    id: "post-matric-scholarship",
    name: "Post-Matric Scholarship (SC / ST / OBC)",
    hindiName: "पोस्ट-मैट्रिक छात्रवृत्ति (एससी / एसटी / ओबीसी)",
    tagline: "Financial grant for higher secondary, ITI, diploma, college, and university education",
    ministry: "Ministry of Social Justice & Empowerment / Ministry of Tribal Affairs",
    categoryTag: "Scholarship & Education",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    shortDescription:
      "Covers tuition fees, maintenance allowance, study tour charges, and book grants for students pursuing ITI, Polytechnic Diploma, Undergraduate, Postgraduate, or PhD studies.",
    benefitAmount: "100% Tuition Fee Reimbursement + Monthly Allowance",
    status: "Open",
    lastDateToApply: "December 31, 2026",
    lastVerified: "October 2026",
    officialSourceUrl: "https://scholarships.gov.in/public/schemeGuidelines/PMS_Guidelines.pdf",
    applyUrl: "https://scholarships.gov.in/",
    officialUrl: "https://scholarships.gov.in/",
    documentHelp:
      "Apply for Caste and Income certificates at your state e-District portal or local Tehsil / Sub-Divisional Magistrate office.",
    documentsNeeded: [
      "Caste / Community Certificate from competent Revenue Authority",
      "Latest Academic Marksheet / Passing Certificate",
      "Current College / Institution Fee Receipt & Bonafide Letter",
      "Family Income Certificate (valid for current financial year)",
      "Student's Active Bank Account Passbook",
    ],
    criteria: {
      minAge: 15,
      maxAge: 35,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 250000,
      allowedRationCardTypes: null,
      allowedEducationLevels: ["iti", "diploma", "graduate", "postgraduate", "phd"],
      allowedOccupations: null,
      allowedEmploymentStatuses: ["unemployed"],
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: ["SC", "ST", "OBC"],
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: true,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) => {
      const details: string[] = [];
      if (user.educationLevel && user.educationLevel !== "prefer_not_to_say") {
        details.push(`${user.educationLevel.toUpperCase()} student`);
      } else {
        details.push("Student");
      }
      if (user.category && user.category !== "prefer_not_to_say") {
        details.push(`${user.category} category`);
      }
      if (user.income != null && !isNaN(user.income)) {
        details.push(`household income within ₹2.5 Lakhs limit`);
      }
      return `You qualify as a ${details.join(" from ")} for complete post-matric tuition reimbursement and living stipend.`;
    },
  },
  {
    id: "ign-old-age-pension",
    name: "Indira Gandhi National Old Age Pension (IGNOAPS)",
    hindiName: "इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना",
    tagline: "Monthly social security pension for elderly citizens from low-income homes",
    ministry: "Ministry of Rural Development (National Social Assistance Programme)",
    categoryTag: "Senior Citizen Pension",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    shortDescription:
      "Direct monthly pension credited into the bank or post office accounts of senior citizens aged 60 and above living below poverty line or with low family income.",
    benefitAmount: "Monthly Pension (State + Central contribution)",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "September 2026",
    officialSourceUrl: "https://nsap.nic.in/guidelines.html",
    applyUrl: "https://nsap.nic.in/",
    officialUrl: "https://nsap.nic.in/",
    documentHelp:
      "Get Age and BPL proof from your local Gram Panchayat / Municipal Ward Councillor or Civil Hospital Medical Board.",
    documentsNeeded: [
      "Age Proof (Birth Certificate, Voter ID, or Medical Age Certificate)",
      "BPL Card / Low Income Certificate from Panchayat / Ward Councillor",
      "State Domicile / Residence Proof",
      "Bank or Post Office Savings Account Passbook",
      "Two recent passport size photographs",
    ],
    criteria: {
      minAge: 60,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 200000,
      allowedRationCardTypes: ["bpl", "antyodaya"],
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: true,
    },
    getQualificationReason: (user) => {
      const notes: string[] = [];
      if (user.age != null && !isNaN(user.age)) {
        notes.push(`age ${user.age} (60+ senior citizen)`);
      } else {
        notes.push("Senior citizen (60+)");
      }
      if (user.rationCardType === "bpl" || user.rationCardType === "antyodaya") {
        notes.push(`${user.rationCardType.toUpperCase()} status`);
      }
      if (user.income != null && !isNaN(user.income)) {
        notes.push(`income within ₹2 Lakh threshold`);
      }
      return `${notes.join(", ")} meets the national criteria for monthly central & state old-age social security pension.`;
    },
  },
  {
    id: "pm-mudra-yojana",
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    hindiName: "प्रधानमंत्री मुद्रा योजना",
    tagline: "Collateral-free micro loans up to ₹20 Lakhs for small business entrepreneurs",
    ministry: "Department of Financial Services, Ministry of Finance",
    categoryTag: "Self-Employment & Business",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    shortDescription:
      "Provides collateral-free business loans under Shishu (up to ₹50k), Kishore (up to ₹5L), and Tarun (up to ₹20L) categories to non-corporate, non-farm small enterprises.",
    benefitAmount: "Collateral-free loan up to ₹20,00,000",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://www.mudra.org.in/",
    applyUrl: "https://www.udyamimitra.in/",
    officialUrl: "https://www.udyamimitra.in/",
    documentHelp:
      "Get your Udyam Registration certificate online for free at udyamregistration.gov.in using your business details.",
    documentsNeeded: [
      "Proof of Identity (Voter ID / Driving License / PAN)",
      "Proof of Residence / Business Address Proof",
      "Business Quotation / Machinery Purchase Estimate",
      "Bank Account Statement for last 6 months",
      "Udyam MSME Registration Certificate (if applicable)",
    ],
    criteria: {
      minAge: 18,
      maxAge: 65,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: ["self_employed", "msme_owner", "unorganised_worker"],
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `You selected Self-Employed or Small Business owner, qualifying for collateral-free business credit under Mudra.`,
  },
  {
    id: "sukanya-samriddhi",
    name: "Sukanya Samriddhi Yojana (SSY)",
    hindiName: "सुकन्या समृद्धि योजना",
    tagline: "High-interest government savings scheme for girl child education & marriage",
    ministry: "Ministry of Finance / Department of Posts",
    categoryTag: "Women & Child Support",
    badgeColor: "bg-pink-100 text-pink-800 border-pink-300",
    shortDescription:
      "Government-backed small deposit savings scheme for girl child with tax exemption (80C) and one of the highest government guaranteed interest rates (8.2%+).",
    benefitAmount: "8.2% Compound Interest + Tax Free Returns",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samriddhi-Account.aspx",
    applyUrl: "https://www.indiapost.gov.in/",
    officialUrl: "https://www.indiapost.gov.in/",
    documentHelp:
      "Birth certificates are issued by the Municipal Registrar of Births & Deaths or local Gram Panchayat office.",
    documentsNeeded: [
      "Birth Certificate of Girl Child (under 10 years)",
      "Identity Proof of Parent / Guardian",
      "Address Proof of Parent / Guardian",
      "Passport size photos of child and parent",
    ],
    criteria: {
      minAge: null,
      maxAge: 10,
      allowedGenders: ["Female"],
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: null,
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `Applicable for families with young daughters under 10 years to secure education and future savings.`,
  },
  {
    id: "pm-svanidhi",
    name: "PM SVANidhi (Street Vendors Scheme)",
    hindiName: "पीएम स्वनिधि (स्ट्रीट वेंडर योजना)",
    tagline: "Micro credit working capital scheme for urban street vendors and hawkers",
    ministry: "Ministry of Housing and Urban Affairs",
    categoryTag: "Self-Employment & Business",
    badgeColor: "bg-cyan-100 text-cyan-800 border-cyan-300",
    shortDescription:
      "Provides collateral-free working capital loan of ₹10,000, ₹20,000, and ₹50,000 on prompt repayment with 7% interest subsidy for street vendors.",
    benefitAmount: "Working Capital Loan up to ₹50,000 + 7% Interest Subsidy",
    status: "Open",
    lastDateToApply: "December 31, 2026",
    lastVerified: "October 2026",
    officialSourceUrl: "https://pmsvanidhi.mohua.gov.in/Home/Guidelines",
    applyUrl: "https://pmsvanidhi.mohua.gov.in/",
    officialUrl: "https://pmsvanidhi.mohua.gov.in/",
    documentHelp:
      "Vending Certificate or Letter of Recommendation (LoR) is available from your Urban Local Body (ULB) / Nagar Nigam.",
    documentsNeeded: [
      "Vending Certificate / Urban Local Body Identity Card",
      "Voter ID / Government Identity Card",
      "Bank Account Passbook",
    ],
    criteria: {
      minAge: 18,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: ["urban"],
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: ["unorganised_worker", "self_employed", "gig_worker"],
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `You marked your work as unorganised or self-employed in an urban area, qualifying for SVANidhi micro credit.`,
  },
  {
    id: "pm-vishwakarma",
    name: "PM Vishwakarma Scheme",
    hindiName: "पीएम विश्वकर्मा योजना",
    tagline: "End-to-end support for traditional artisans and craftspeople across 18 trades",
    ministry: "Ministry of Micro, Small and Medium Enterprises",
    categoryTag: "Artisan & Craft Support",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-300",
    shortDescription:
      "Recognition via Vishwakarma certificate, 5-7 days skill training with ₹500/day stipend, ₹15,000 toolkit grant, and up to ₹3,00,000 loan at 5% interest rate.",
    benefitAmount: "₹15,000 Toolkit Incentive + ₹3 Lakh Loan @ 5%",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://pmvishwakarma.gov.in/Home/Guidelines",
    applyUrl: "https://pmvishwakarma.gov.in/",
    officialUrl: "https://pmvishwakarma.gov.in/",
    documentHelp:
      "Register directly at your nearest CSC centre; Gram Panchayat or ULB performs digital artisan verification.",
    documentsNeeded: [
      "Active Mobile Number and Bank Passbook",
      "Skill / Trade declaration in one of the 18 specified traditional trades",
      "Proof of age (minimum 18 years)",
    ],
    criteria: {
      minAge: 18,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: ["self_employed", "unorganised_worker"],
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `Traditional artisans and independent craftspeople qualify for free skill training, ₹15,000 toolkit grant, and 5% credit.`,
  },
  {
    id: "atal-pension-yojana",
    name: "Atal Pension Yojana (APY)",
    hindiName: "अटल पेंशन योजना",
    tagline: "Guaranteed monthly pension of ₹1,000 to ₹5,000 for unorganised sector workers",
    ministry: "PFRDA, Ministry of Finance",
    categoryTag: "Senior Citizen Pension",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    shortDescription:
      "Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from age 60 based on modest monthly contributions during working years.",
    benefitAmount: "Guaranteed ₹1,000 - ₹5,000 Monthly Pension",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "September 2026",
    officialSourceUrl: "https://www.npscra.nsdl.co.in/scheme-details.php",
    applyUrl: "https://enps.nsdl.com/",
    officialUrl: "https://enps.nsdl.com/",
    documentHelp:
      "Enroll directly at any public or private bank where you hold an active savings account with auto-debit facility.",
    documentsNeeded: [
      "Savings Bank Account Passbook",
      "Valid Government Photo ID",
      "Nominee details and active mobile number",
    ],
    criteria: {
      minAge: 18,
      maxAge: 40,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: [
        "unemployed",
        "self_employed",
        "unorganised_worker",
        "gig_worker",
        "msme_owner",
      ],
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `You are between 18 and 40 years of age, qualifying you to lock in guaranteed lifelong government monthly pension.`,
  },
  {
    id: "pm-ujjwala-yojana",
    name: "Pradhan Mantri Ujjwala Yojana (PMUY)",
    hindiName: "प्रधानमंत्री उज्ज्वला योजना",
    tagline: "Deposit-free LPG cylinder connection and subsidy for women from poor households",
    ministry: "Ministry of Petroleum and Natural Gas",
    categoryTag: "Women & Child Support",
    badgeColor: "bg-rose-100 text-rose-800 border-rose-300",
    shortDescription:
      "Provides deposit-free LPG gas connection with free first cylinder and stove to adult women from poor and vulnerable households without existing gas connections.",
    benefitAmount: "Free LPG Connection + First Refill & Stove",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://www.pmuy.gov.in/guidelines.html",
    applyUrl: "https://www.pmuy.gov.in/",
    officialUrl: "https://www.pmuy.gov.in/",
    documentHelp:
      "Ration cards listing all adult family members can be obtained from your local Food Inspector or Tehsil supply office.",
    documentsNeeded: [
      "Ration Card issued by State Govt supporting household composition",
      "Woman applicant's identity proof (Voter ID / Driving License)",
      "Bank Account details (linked with applicant's name)",
      "Self-declaration of not possessing an active LPG connection",
    ],
    criteria: {
      minAge: 18,
      maxAge: null,
      allowedGenders: ["Female"],
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 250000,
      allowedRationCardTypes: ["bpl", "antyodaya"],
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `Adult women from BPL or low-income households qualify for deposit-free clean LPG cooking gas connection.`,
  },
  {
    id: "adip-scheme",
    name: "ADIP Scheme (Assistive Equipment for Persons with Disabilities)",
    hindiName: "एडिप योजना (दिव्यांगजनों हेतु सहायक उपकरण)",
    tagline: "Free aids, tricycles, hearing aids, and motorized wheelchairs for Divyangjan",
    ministry: "Department of Empowerment of Persons with Disabilities, Ministry of Social Justice",
    categoryTag: "Disability Support",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    shortDescription:
      "Provides free durable, modern and scientifically manufactured assistive aids and appliances (prosthetics, wheelchairs, braille kits, hearing aids) to needy persons with disabilities.",
    benefitAmount: "100% Free Specialized Assistive Devices (Up to ₹50,000+)",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://disabilityaffairs.gov.in/content/page/adip.php",
    applyUrl: "https://www.swavlambancard.gov.in/",
    officialUrl: "https://www.swavlambancard.gov.in/",
    documentHelp:
      "Get your UDID (Unique Disability ID) Card or Disability Certificate from your District Civil Hospital Medical Board.",
    documentsNeeded: [
      "Disability Certificate showing 40% or more benchmark disability (or UDID Card)",
      "Income Certificate showing monthly income up to ₹22,500 (or annual ₹2.7L)",
      "Proof of Residence and Passport size photograph",
    ],
    criteria: {
      minAge: null,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 270000,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: null,
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: 40,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `You reported a benchmark disability (40%+), qualifying for 100% free assistive equipment and aids under ALIMCO/ADIP.`,
  },
  {
    id: "stand-up-india",
    name: "Stand-Up India Scheme",
    hindiName: "स्टैंड-अप इंडिया योजना",
    tagline: "Bank loans between ₹10 Lakhs and ₹1 Crore for SC/ST and Women Entrepreneurs",
    ministry: "Ministry of Finance",
    categoryTag: "Self-Employment & Business",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    shortDescription:
      "Facilitates bank loans between ₹10 Lakhs and ₹1 Crore to at least one SC or ST borrower and at least one woman borrower per bank branch for greenfield enterprises.",
    benefitAmount: "Bank Loan from ₹10 Lakh to ₹1 Crore",
    status: "Open",
    lastDateToApply: "Ongoing until 2028",
    lastVerified: "October 2026",
    officialSourceUrl: "https://www.standupmitra.in/Home/SUISchemes",
    applyUrl: "https://www.standupmitra.in/",
    officialUrl: "https://www.standupmitra.in/",
    documentHelp:
      "Prepare a Detailed Project Report (DPR) with assistance from your District Industries Centre (DIC) or MSME DFO.",
    documentsNeeded: [
      "Caste Certificate (for SC/ST) or Woman Identity proof",
      "Detailed Project Report (DPR) for new greenfield venture",
      "PAN Card, Address Proof, and Promoter contribution details",
    ],
    criteria: {
      minAge: 18,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: ["self_employed", "msme_owner"],
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: ["SC", "ST"],
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `SC/ST and women entrepreneurs qualify for Stand-Up India credit up to ₹1 Crore for launching new ventures.`,
  },
  {
    id: "national-apprenticeship-naps",
    name: "National Apprenticeship Promotion Scheme (NAPS)",
    hindiName: "राष्ट्रीय शिक्षुता प्रोत्साहन योजना (एनएपीएस)",
    tagline: "Monthly stipend support and hands-on industry skill training for youth",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    categoryTag: "Scholarship & Education",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    shortDescription:
      "Government provides stipend reimbursement up to ₹1,500/month along with industry practical training to ITI, Diploma, and Graduate students to boost employability.",
    benefitAmount: "Monthly Industry Stipend (₹1,500 govt subsidy + Company wage)",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://www.apprenticeshipindia.gov.in/guidelines",
    applyUrl: "https://www.apprenticeshipindia.gov.in/",
    officialUrl: "https://www.apprenticeshipindia.gov.in/",
    documentHelp:
      "Register with your Class 10/ITI/Diploma marksheet on the Apprenticeship India portal to generate your Candidate ID.",
    documentsNeeded: [
      "Educational Certificate (School, ITI, Diploma, or Degree marksheet)",
      "Bank Account details (for Direct Benefit Transfer)",
      "Government Identity Proof",
    ],
    criteria: {
      minAge: 16,
      maxAge: 30,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: ["iti", "diploma", "graduate"],
      allowedOccupations: null,
      allowedEmploymentStatuses: ["unemployed"],
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `ITI, Diploma, and young graduates qualify for paid on-the-job training in recognized companies nationwide.`,
  },
  {
    id: "pm-fasal-bima",
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    hindiName: "प्रधानमंत्री फसल बीमा योजना",
    tagline: "Comprehensive crop insurance shield against natural calamities, drought, and floods",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    categoryTag: "Farmer Support",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-300",
    shortDescription:
      "Uniform lowest premium (1.5% for Rabi, 2% for Kharif, 5% for commercial/horticultural crops) with complete insurance cover against unavoidable natural risks from pre-sowing to post-harvest.",
    benefitAmount: "Full Sum Insured Claim payout for crop loss",
    status: "Open",
    lastDateToApply: "Seasonal (July 31 for Kharif / Dec 31 for Rabi)",
    lastVerified: "October 2026",
    officialSourceUrl: "https://pmfby.gov.in/pdf/Revised_Operational_Guidelines.pdf",
    applyUrl: "https://pmfby.gov.in/",
    officialUrl: "https://pmfby.gov.in/",
    documentHelp:
      "Sowing Certificate or Patwari Girdawari report is issued by your village Halka Patwari / Revenue Officer.",
    documentsNeeded: [
      "Land Record / Khatauni Copy or Tenancy Agreement",
      "Sowing Certificate / Crop Sown Declaration from Patwari",
      "Bank Account Passbook (Kisan Credit Card / Savings account)",
    ],
    criteria: {
      minAge: 18,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: ["rural"],
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: null,
      requiresFarmer: true,
      allowedFarmerTypes: ["owner", "tenant"],
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `Both owner and tenant farmers cultivating notified crops are eligible for subsidized government crop insurance.`,
  },
  {
    id: "pm-matru-vandana",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    hindiName: "प्रधानमंत्री मातृ वंदना योजना",
    tagline: "Direct cash maternity assistance for pregnant women and lactating mothers",
    ministry: "Ministry of Women and Child Development",
    categoryTag: "Women & Child Support",
    badgeColor: "bg-pink-100 text-pink-800 border-pink-300",
    shortDescription:
      "Direct benefit cash incentive of ₹5,000 in installments (and additional ₹6,000 for second girl child) for nutrition and partial compensation of wage loss during childbirth.",
    benefitAmount: "₹5,000 - ₹6,000 Direct Cash Maternity Benefit",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://pmmvy.wcd.gov.in/Home/Guidelines",
    applyUrl: "https://pmmvy.wcd.gov.in/",
    officialUrl: "https://pmmvy.wcd.gov.in/",
    documentHelp:
      "MCP (Mother and Child Protection) Card is issued upon pregnancy registration at your nearest Anganwadi Centre or PHC.",
    documentsNeeded: [
      "Mother and Child Protection (MCP) Card from Anganwadi / Health Centre",
      "Mother's identity proof and bank account details",
      "Child's Birth Certificate (for subsequent installments)",
    ],
    criteria: {
      minAge: 19,
      maxAge: 45,
      allowedGenders: ["Female"],
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 250000,
      allowedRationCardTypes: ["bpl", "antyodaya"],
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `Pregnant and lactating mothers from low-income families qualify for ₹5,000-₹6,000 direct cash nutrition support.`,
  },
  {
    id: "rashtriya-vayoshri-yojana",
    name: "Rashtriya Vayoshri Yojana (RVY)",
    hindiName: "राष्ट्रीय वयोश्री योजना",
    tagline: "Free physical living aids and assisted-living devices for BPL Senior Citizens",
    ministry: "Ministry of Social Justice and Empowerment",
    categoryTag: "Senior Citizen Pension",
    badgeColor: "bg-orange-100 text-orange-800 border-orange-300",
    shortDescription:
      "Provides assisted living devices (walking sticks, elbow crutches, walkers, hearing aids, wheelchairs, spectacles, dentures) free of cost to senior citizens from BPL category.",
    benefitAmount: "100% Free Specialized Senior Living Aids",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://socialjustice.gov.in/schemes/73",
    applyUrl: "https://www.alimco.in/",
    officialUrl: "https://www.alimco.in/",
    documentHelp:
      "Senior Citizen Age Certificate can be issued by District Medical Officer; BPL proof by Panchayat / Food Supply officer.",
    documentsNeeded: [
      "Proof of Age (Voter Card / Matriculation / Age Certificate 60+)",
      "BPL Ration Card or Monthly Income Certificate under ₹15,000",
      "Doctor's certificate stating age-related disability/infirmity",
    ],
    criteria: {
      minAge: 60,
      maxAge: null,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 180000,
      allowedRationCardTypes: ["bpl", "antyodaya"],
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: true,
    },
    getQualificationReason: (user) =>
      `Senior citizens (60+) from low-income / BPL families qualify for free wheelchairs, hearing aids, and living devices.`,
  },
  {
    id: "nmmss-scholarship",
    name: "National Means-cum-Merit Scholarship (NMMSS)",
    hindiName: "राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति योजना",
    tagline: "₹12,000 per year scholarship for meritorious students from class 9 to 12",
    ministry: "Department of School Education & Literacy, Ministry of Education",
    categoryTag: "Scholarship & Education",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-300",
    shortDescription:
      "Awards ₹12,000 per annum (₹1,000 per month) to gifted students of economically weaker sections to arrest dropouts at class 8 and encourage higher secondary study.",
    benefitAmount: "₹12,000 per year (Class 9 to 12)",
    status: "Open",
    lastDateToApply: "November 30, 2026",
    lastVerified: "September 2026",
    officialSourceUrl: "https://scholarships.gov.in/public/schemeGuidelines/NMMSS_Guidelines.pdf",
    applyUrl: "https://scholarships.gov.in/",
    officialUrl: "https://scholarships.gov.in/",
    documentHelp:
      "School Headmaster or Principal provides the class 7/8 mark report and student bonafide certificate.",
    documentsNeeded: [
      "Class 7 & 8 Marksheet (minimum 55% marks, 50% for SC/ST)",
      "Parental Income Certificate (annual income under ₹3.5 Lakhs)",
      "Student Bank Account Passbook",
    ],
    criteria: {
      minAge: 12,
      maxAge: 18,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 350000,
      allowedRationCardTypes: null,
      allowedEducationLevels: ["school"],
      allowedOccupations: null,
      allowedEmploymentStatuses: ["unemployed"],
      excludedEmploymentStatuses: null,
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: true,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `School students from households with income up to ₹3.5 Lakhs qualify for ₹12,000/yr government merit scholarship.`,
  },
  {
    id: "national-overseas-scholarship",
    name: "National Overseas Scholarship for SC / ST Students",
    hindiName: "राष्ट्रीय प्रवासी छात्रवृत्ति योजना",
    tagline: "Full financial funding for Masters and PhD studies in top international universities",
    ministry: "Ministry of Social Justice & Empowerment",
    categoryTag: "Scholarship & Education",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-300",
    shortDescription:
      "Provides complete tuition fees, annual maintenance allowance, airfare, and visa fees for low-income SC, De-notified Nomadic, and Landless agricultural students pursuing Masters/PhD abroad.",
    benefitAmount: "100% International Tuition Fees + Living Allowance ($15,000+ / yr)",
    status: "Open",
    lastDateToApply: "March 31, 2027",
    lastVerified: "October 2026",
    officialSourceUrl: "https://nosmsje.gov.in/Home/Guidelines",
    applyUrl: "https://nosmsje.gov.in/",
    officialUrl: "https://nosmsje.gov.in/",
    documentHelp:
      "Valid passport is issued by the Regional Passport Office (RPO); Caste & Income verified via state revenue portals.",
    documentsNeeded: [
      "Unconditional Admission Letter from QS Ranked Top 500 Global University",
      "Caste Certificate (SC / DNT / Landless Agri Worker)",
      "Family Income Certificate (under ₹8,00,000/year)",
      "Valid Indian Passport",
    ],
    criteria: {
      minAge: 21,
      maxAge: 35,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: 800000,
      allowedRationCardTypes: null,
      allowedEducationLevels: ["graduate", "postgraduate"],
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: null,
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: ["SC", "ST"],
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: true,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `SC/ST graduates with family income under ₹8 Lakhs qualify for full government sponsorship to pursue Masters/PhD abroad.`,
  },
  {
    id: "day-nrlm-livelihood",
    name: "Deendayal Antyodaya Yojana - NRLM (SHG Scheme)",
    hindiName: "दीनदयाल अंत्योदय योजना - राष्ट्रीय ग्रामीण आजीविका मिशन",
    tagline: "Low-interest collateral-free loans up to ₹20 Lakhs for Rural Women Self-Help Groups",
    ministry: "Ministry of Rural Development",
    categoryTag: "Self-Employment & Business",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-300",
    shortDescription:
      "Mobilizes rural poor women into Self-Help Groups (SHGs) and provides revolving funds, community investment support, and bank credit linkage up to ₹20 Lakhs at 7% interest.",
    benefitAmount: "Collateral-free SHG Bank Credit up to ₹20,00,000 @ 7%",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://aajeevika.gov.in/",
    applyUrl: "https://nrlm.gov.in/",
    officialUrl: "https://nrlm.gov.in/",
    documentHelp:
      "Join or register your Self-Help Group (SHG) through your village Gram Panchayat VDO or Block Mission Management Unit (BMMU).",
    documentsNeeded: [
      "SHG Member Resolution & Passbook Copy",
      "Women members' Voter IDs and Village Residence proof",
      "Panchasutra grading pass report from Block office",
    ],
    criteria: {
      minAge: 18,
      maxAge: 60,
      allowedGenders: ["Female"],
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: ["rural"],
      maxAnnualIncome: 250000,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: ["unorganised_worker", "self_employed", "unemployed"],
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `Rural women qualify for group-based micro enterprise funding and subsidized credit under National Rural Livelihoods Mission.`,
  },
  {
    id: "pm-kisan-maan-dhan",
    name: "PM Kisan Maan Dhan Yojana (PM-KMY)",
    hindiName: "पीएम किसान मानधन योजना",
    tagline: "Assured old age pension of ₹3,000 per month for small and marginal farmers",
    ministry: "Ministry of Agriculture & Farmers Welfare / LIC",
    categoryTag: "Farmer Support",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    shortDescription:
      "Voluntary and contributory pension scheme for small and marginal farmers providing guaranteed minimum ₹3,000 per month pension upon reaching 60 years of age.",
    benefitAmount: "Guaranteed ₹3,000 Monthly Pension for Farmers",
    status: "Open",
    lastDateToApply: "Ongoing / Open all year",
    lastVerified: "October 2026",
    officialSourceUrl: "https://maandhan.in/pmkmy",
    applyUrl: "https://maandhan.in/",
    officialUrl: "https://maandhan.in/",
    documentHelp:
      "Visit any Common Service Centre (CSC) with your PM-KISAN registered bank passbook and Aadhaar for instant registration.",
    documentsNeeded: [
      "Cultivable land record (up to 2 hectares / 5 acres)",
      "Savings Bank Account Passbook",
      "Valid Government Photo ID",
    ],
    criteria: {
      minAge: 18,
      maxAge: 40,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: ["rural"],
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: ["government_employee"],
      requiresFarmer: true,
      allowedFarmerTypes: ["owner"],
      maxLandSizeAcres: 5,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `Small and marginal farmers holding up to 5 acres qualify for matched government contribution toward ₹3,000/month retirement pension.`,
  },
  {
    id: "pm-suraksha-bima",
    name: "Pradhan Mantri Suraksha Bima Yojana (PMSBY)",
    hindiName: "प्रधानमंत्री सुरक्षा बीमा योजना",
    tagline: "Affordable accidental death and disability insurance cover at just ₹20 per year",
    ministry: "Department of Financial Services, Ministry of Finance",
    categoryTag: "Health & Medical",
    badgeColor: "bg-red-100 text-red-800 border-red-300",
    shortDescription:
      "Provides ₹2,00,000 for accidental death or permanent total disability, and ₹1,00,000 for permanent partial disability at an ultra-low premium of just ₹20/year.",
    benefitAmount: "₹2,00,000 Accidental Death / Disability Insurance Cover",
    status: "Open",
    lastDateToApply: "Ongoing / Auto-debited annually on May 31",
    lastVerified: "October 2026",
    officialSourceUrl: "https://www.jansuraksha.gov.in/Files/PMSBY/English/Rules.pdf",
    applyUrl: "https://www.jansuraksha.gov.in/",
    officialUrl: "https://www.jansuraksha.gov.in/",
    documentHelp:
      "Fill out a one-page simple consent form at your bank branch or via mobile netbanking.",
    documentsNeeded: [
      "Active Savings Bank Account",
      "Consent for auto-debit of ₹20 annual premium",
      "Nominee identification details",
    ],
    criteria: {
      minAge: 18,
      maxAge: 70,
      allowedGenders: null,
      allowedStates: null,
      allowedDistricts: null,
      allowedAreas: null,
      maxAnnualIncome: null,
      allowedRationCardTypes: null,
      allowedEducationLevels: null,
      allowedOccupations: null,
      allowedEmploymentStatuses: null,
      excludedEmploymentStatuses: null,
      requiresFarmer: null,
      allowedFarmerTypes: null,
      maxLandSizeAcres: null,
      allowedSocialCategories: null,
      allowedMinorityCommunities: null,
      allowedMaritalStatuses: null,
      minDisabilityPercentage: null,
      allowedSpecialSituations: null,
      requiresStudent: null,
      requiresSeniorCitizen: null,
    },
    getQualificationReason: (user) =>
      `All citizens aged 18 to 70 with a savings bank account are eligible for ₹2 Lakh accidental insurance for just ₹20/year.`,
  },
];

/**
 * Helper to check if a user provided an explicit answer to a field.
 * Unanswered, empty string, null, undefined, or 'prefer_not_to_say' are treated as UNANSWERED.
 */
function isAnswered<T>(val: T | null | undefined): boolean {
  if (val === null || val === undefined) return false;
  if (typeof val === "string") {
    const trimmed = val.trim();
    return trimmed !== "" && trimmed !== "prefer_not_to_say" && trimmed !== "unspecified";
  }
  if (typeof val === "number") {
    return !isNaN(val);
  }
  return true;
}

/**
 * Filter function strictly adhering to the user's rule:
 * 1. "a blank scheme criterion means it applies to everyone" (never excludes any user)
 * 2. "an unanswered user field never excludes a scheme" (user's skipped or 'prefer not to say' field never excludes)
 *
 * A scheme is ONLY excluded if the scheme specifies a strict criterion AND the user
 * provided an explicit answer that violates/contradicts that criterion.
 */
export function filterSchemes(
  user: UserAnswers,
  schemesList: Scheme[] = SAMPLE_SCHEMES
): Scheme[] {
  return schemesList.filter((scheme) => {
    const { criteria } = scheme;

    // 1. Age (minAge / maxAge)
    if (isAnswered(user.age)) {
      const age = user.age as number;
      if (criteria.minAge !== null && criteria.minAge !== undefined && age < criteria.minAge) {
        return false;
      }
      if (criteria.maxAge !== null && criteria.maxAge !== undefined && age > criteria.maxAge) {
        return false;
      }
    }

    // 2. Gender
    if (
      criteria.allowedGenders !== null &&
      criteria.allowedGenders !== undefined &&
      criteria.allowedGenders.length > 0 &&
      isAnswered(user.gender)
    ) {
      if (!criteria.allowedGenders.includes(user.gender as string)) {
        return false;
      }
    }

    // 3. State
    if (
      criteria.allowedStates !== null &&
      criteria.allowedStates !== undefined &&
      criteria.allowedStates.length > 0 &&
      isAnswered(user.state) &&
      user.state !== "All India"
    ) {
      if (
        !criteria.allowedStates.includes(user.state as string) &&
        !criteria.allowedStates.includes("All")
      ) {
        return false;
      }
    }

    // 4. District
    if (
      criteria.allowedDistricts !== null &&
      criteria.allowedDistricts !== undefined &&
      criteria.allowedDistricts.length > 0 &&
      isAnswered(user.district)
    ) {
      const userDist = (user.district as string).toLowerCase().trim();
      const match = criteria.allowedDistricts.some((d) => d.toLowerCase().trim() === userDist);
      if (!match) {
        return false;
      }
    }

    // 5. Area (Rural / Urban)
    if (
      criteria.allowedAreas !== null &&
      criteria.allowedAreas !== undefined &&
      criteria.allowedAreas.length > 0 &&
      isAnswered(user.area)
    ) {
      if (!criteria.allowedAreas.includes(user.area as "rural" | "urban")) {
        return false;
      }
    }

    // 6. Annual Income (maxAnnualIncome / minAnnualIncome)
    if (isAnswered(user.income)) {
      const inc = user.income as number;
      if (
        criteria.maxAnnualIncome !== null &&
        criteria.maxAnnualIncome !== undefined &&
        inc > criteria.maxAnnualIncome
      ) {
        return false;
      }
      if (
        criteria.minAnnualIncome !== null &&
        criteria.minAnnualIncome !== undefined &&
        inc < criteria.minAnnualIncome
      ) {
        return false;
      }
    }

    // 7. Ration Card Type
    if (
      criteria.allowedRationCardTypes !== null &&
      criteria.allowedRationCardTypes !== undefined &&
      criteria.allowedRationCardTypes.length > 0 &&
      isAnswered(user.rationCardType)
    ) {
      if (
        !criteria.allowedRationCardTypes.includes(
          user.rationCardType as "none" | "apl" | "bpl" | "antyodaya"
        )
      ) {
        return false;
      }
    }

    // 8. Education Level
    if (
      criteria.allowedEducationLevels !== null &&
      criteria.allowedEducationLevels !== undefined &&
      criteria.allowedEducationLevels.length > 0 &&
      isAnswered(user.educationLevel)
    ) {
      if (
        !criteria.allowedEducationLevels.includes(
          user.educationLevel as "school" | "iti" | "diploma" | "graduate" | "postgraduate" | "phd"
        )
      ) {
        return false;
      }
    }

    // 9. Employment Status (Allowed & Excluded)
    if (isAnswered(user.employmentStatus)) {
      const emp = user.employmentStatus as any;
      if (
        criteria.allowedEmploymentStatuses !== null &&
        criteria.allowedEmploymentStatuses !== undefined &&
        criteria.allowedEmploymentStatuses.length > 0
      ) {
        if (!criteria.allowedEmploymentStatuses.includes(emp)) {
          return false;
        }
      }
      if (
        criteria.excludedEmploymentStatuses !== null &&
        criteria.excludedEmploymentStatuses !== undefined &&
        criteria.excludedEmploymentStatuses.length > 0
      ) {
        if (criteria.excludedEmploymentStatuses.includes(emp)) {
          return false;
        }
      }
    }

    // 10. Farmer & Land Size
    if (criteria.requiresFarmer === true) {
      if (user.farmerType === "not_a_farmer" || (user.isFarmer === false && user.farmerType === "not_a_farmer")) {
        return false;
      }
    }

    if (
      criteria.allowedFarmerTypes !== null &&
      criteria.allowedFarmerTypes !== undefined &&
      criteria.allowedFarmerTypes.length > 0 &&
      isAnswered(user.farmerType) &&
      user.farmerType !== "not_a_farmer"
    ) {
      if (!criteria.allowedFarmerTypes.includes(user.farmerType as "owner" | "tenant")) {
        return false;
      }
    }

    if (
      criteria.maxLandSizeAcres !== null &&
      criteria.maxLandSizeAcres !== undefined &&
      isAnswered(user.landSize)
    ) {
      if ((user.landSize as number) > criteria.maxLandSizeAcres) {
        return false;
      }
    }

    // 11. Social Category
    if (
      criteria.allowedSocialCategories !== null &&
      criteria.allowedSocialCategories !== undefined &&
      criteria.allowedSocialCategories.length > 0 &&
      isAnswered(user.category)
    ) {
      if (!criteria.allowedSocialCategories.includes(user.category as any)) {
        return false;
      }
    }

    // 12. Minority Community
    if (
      criteria.allowedMinorityCommunities !== null &&
      criteria.allowedMinorityCommunities !== undefined &&
      criteria.allowedMinorityCommunities.length > 0 &&
      isAnswered(user.minorityCommunity)
    ) {
      if (
        user.minorityCommunity === "none" ||
        !criteria.allowedMinorityCommunities.includes(user.minorityCommunity as any)
      ) {
        return false;
      }
    }

    // 13. Marital Status
    if (
      criteria.allowedMaritalStatuses !== null &&
      criteria.allowedMaritalStatuses !== undefined &&
      criteria.allowedMaritalStatuses.length > 0 &&
      isAnswered(user.maritalStatus)
    ) {
      if (!criteria.allowedMaritalStatuses.includes(user.maritalStatus as any)) {
        return false;
      }
    }

    // 14. Disability Percentage
    if (
      criteria.minDisabilityPercentage !== null &&
      criteria.minDisabilityPercentage !== undefined &&
      isAnswered(user.disabilityPercentage)
    ) {
      if ((user.disabilityPercentage as number) < criteria.minDisabilityPercentage) {
        return false;
      }
    }

    // 15. Student Checkbox / Flag
    if (criteria.requiresStudent === true) {
      if (user.isStudent === false && user.educationLevel === "school" ? false : user.isStudent === false) {
        return false;
      }
    }

    // 16. Senior Citizen Checkbox / Flag
    if (criteria.requiresSeniorCitizen === true) {
      if (isAnswered(user.age) && (user.age as number) < 60 && user.isSeniorCitizen === false) {
        return false;
      }
    }

    // 17. Special Situations
    if (
      criteria.allowedSpecialSituations !== null &&
      criteria.allowedSpecialSituations !== undefined &&
      criteria.allowedSpecialSituations.length > 0 &&
      user.specialSituations &&
      user.specialSituations.length > 0 &&
      !user.specialSituations.includes("prefer_not_to_say")
    ) {
      const hasMatch = user.specialSituations.some((s) =>
        criteria.allowedSpecialSituations!.includes(s as any)
      );
      if (!hasMatch) {
        return false;
      }
    }

    return true;
  });
}
