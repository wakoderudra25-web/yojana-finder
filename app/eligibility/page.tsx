"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  INDIAN_STATES_AND_UTS,
  SOCIAL_CATEGORIES,
  EDUCATION_LEVELS,
  MARITAL_STATUSES,
  AREAS,
  FARMER_TYPES,
  EMPLOYMENT_STATUSES,
  RATION_CARD_TYPES,
  MINORITY_COMMUNITIES,
  SPECIAL_SITUATIONS,
  GENDERS,
} from "@/data/states";
import {
  ShieldCheck,
  ArrowRight,
  MapPin,
  IndianRupee,
  Sparkles,
  GraduationCap,
  Accessibility,
  AlertCircle,
} from "lucide-react";

export default function EligibilityFormPage() {
  const router = useRouter();

  // State & Age are required. All other fields are strictly optional with "prefer_not_to_say" or blank defaults
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("prefer_not_to_say");
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState("prefer_not_to_say");
  const [maritalStatus, setMaritalStatus] = useState("prefer_not_to_say");

  // Error validation state for required fields
  const [errors, setErrors] = useState<{ state?: string; age?: string }>({});

  // Education & Work
  const [educationLevel, setEducationLevel] = useState("prefer_not_to_say");
  const [employmentStatus, setEmploymentStatus] = useState("prefer_not_to_say");

  // Farming & Land
  const [farmerType, setFarmerType] = useState("prefer_not_to_say");
  const [landSize, setLandSize] = useState<string>("");

  // Income, Ration Card & Social Category
  const [income, setIncome] = useState<string>("");
  const [rationCardType, setRationCardType] = useState("prefer_not_to_say");
  const [category, setCategory] = useState("prefer_not_to_say");
  const [minorityCommunity, setMinorityCommunity] = useState("prefer_not_to_say");

  // Disability & Special Profiles
  const [disabilityPercentage, setDisabilityPercentage] = useState<string>("");
  const [isStudent, setIsStudent] = useState<boolean>(false);
  const [isFarmer, setIsFarmer] = useState<boolean>(false);
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);
  const [specialSituations, setSpecialSituations] = useState<string[]>([]);

  // Sync senior citizen flag when age changes if age >= 60
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAge(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 60) {
      setIsSeniorCitizen(true);
    }
  };

  // Toggle special situation checkboxes
  const handleSpecialSituationToggle = (id: string) => {
    setSpecialSituations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Quick preset loader to help user test quickly
  const loadPreset = (preset: "farmer" | "student" | "senior" | "widow_bpl") => {
    setErrors({});
    if (preset === "farmer") {
      setState("Maharashtra");
      setDistrict("Nashik");
      setArea("rural");
      setAge("45");
      setGender("Male");
      setMaritalStatus("married");
      setEducationLevel("school");
      setEmploymentStatus("self_employed");
      setFarmerType("owner");
      setLandSize("3.5");
      setIncome("180000");
      setRationCardType("apl");
      setCategory("General");
      setMinorityCommunity("none");
      setDisabilityPercentage("");
      setIsStudent(false);
      setIsFarmer(true);
      setIsSeniorCitizen(false);
      setSpecialSituations([]);
    } else if (preset === "student") {
      setState("Bihar");
      setDistrict("Patna");
      setArea("urban");
      setAge("20");
      setGender("Female");
      setMaritalStatus("single");
      setEducationLevel("graduate");
      setEmploymentStatus("unemployed");
      setFarmerType("not_a_farmer");
      setLandSize("");
      setIncome("120000");
      setRationCardType("bpl");
      setCategory("OBC");
      setMinorityCommunity("none");
      setDisabilityPercentage("");
      setIsStudent(true);
      setIsFarmer(false);
      setIsSeniorCitizen(false);
      setSpecialSituations([]);
    } else if (preset === "senior") {
      setState("Rajasthan");
      setDistrict("Jaipur");
      setArea("rural");
      setAge("67");
      setGender("Female");
      setMaritalStatus("widow");
      setEducationLevel("prefer_not_to_say");
      setEmploymentStatus("unemployed");
      setFarmerType("not_a_farmer");
      setLandSize("");
      setIncome("80000");
      setRationCardType("bpl");
      setCategory("SC");
      setMinorityCommunity("none");
      setDisabilityPercentage("");
      setIsStudent(false);
      setIsFarmer(false);
      setIsSeniorCitizen(true);
      setSpecialSituations([]);
    } else if (preset === "widow_bpl") {
      setState("Uttar Pradesh");
      setDistrict("Varanasi");
      setArea("rural");
      setAge("38");
      setGender("Female");
      setMaritalStatus("widow");
      setEducationLevel("school");
      setEmploymentStatus("unorganised_worker");
      setFarmerType("not_a_farmer");
      setLandSize("");
      setIncome("65000");
      setRationCardType("antyodaya");
      setCategory("OBC");
      setMinorityCommunity("none");
      setDisabilityPercentage("");
      setIsStudent(false);
      setIsFarmer(false);
      setIsSeniorCitizen(false);
      setSpecialSituations([]);
    }
  };

  const handleResetToOptional = () => {
    setState("");
    setDistrict("");
    setArea("prefer_not_to_say");
    setAge("");
    setGender("prefer_not_to_say");
    setMaritalStatus("prefer_not_to_say");
    setEducationLevel("prefer_not_to_say");
    setEmploymentStatus("prefer_not_to_say");
    setFarmerType("prefer_not_to_say");
    setLandSize("");
    setIncome("");
    setRationCardType("prefer_not_to_say");
    setCategory("prefer_not_to_say");
    setMinorityCommunity("prefer_not_to_say");
    setDisabilityPercentage("");
    setIsStudent(false);
    setIsFarmer(false);
    setIsSeniorCitizen(false);
    setSpecialSituations([]);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields: State and Age
    const newErrors: { state?: string; age?: string } = {};

    if (!state || state.trim() === "" || state === "prefer_not_to_say") {
      newErrors.state = "State is required. Please select your State or Union Territory.";
    }

    if (!age || !age.trim()) {
      newErrors.age = "Age is required. Please enter your age in years.";
    } else {
      const parsedAge = parseInt(age, 10);
      if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 120) {
        newErrors.age = "Please enter a valid age between 1 and 120.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Auto-focus first invalid input
      const firstErrorFieldId = newErrors.state ? "state-select" : "age-input";
      const targetElement = document.getElementById(firstErrorFieldId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
        targetElement.focus();
      }
      return;
    }

    // Build URL query params without storing answers anywhere
    const params = new URLSearchParams();

    params.set("state", state);

    if (district.trim()) params.set("district", district.trim());
    if (area && area !== "prefer_not_to_say") params.set("area", area);

    const parsedAge = parseInt(age, 10);
    params.set("age", parsedAge.toString());

    if (gender && gender !== "prefer_not_to_say") params.set("gender", gender);
    if (maritalStatus && maritalStatus !== "prefer_not_to_say") {
      params.set("maritalStatus", maritalStatus);
    }

    if (educationLevel && educationLevel !== "prefer_not_to_say") {
      params.set("educationLevel", educationLevel);
    }
    if (employmentStatus && employmentStatus !== "prefer_not_to_say") {
      params.set("employmentStatus", employmentStatus);
    }

    if (farmerType && farmerType !== "prefer_not_to_say") {
      params.set("farmerType", farmerType);
    }
    if (landSize.trim()) {
      const parsedLand = parseFloat(landSize);
      if (!isNaN(parsedLand)) params.set("landSize", parsedLand.toString());
    }

    if (income.trim()) {
      const parsedIncome = parseInt(income, 10);
      if (!isNaN(parsedIncome)) params.set("income", parsedIncome.toString());
    }

    if (rationCardType && rationCardType !== "prefer_not_to_say") {
      params.set("rationCardType", rationCardType);
    }
    if (category && category !== "prefer_not_to_say") {
      params.set("category", category);
    }
    if (minorityCommunity && minorityCommunity !== "prefer_not_to_say") {
      params.set("minorityCommunity", minorityCommunity);
    }

    if (disabilityPercentage.trim()) {
      const parsedDisability = parseInt(disabilityPercentage, 10);
      if (!isNaN(parsedDisability)) {
        params.set("disabilityPercentage", parsedDisability.toString());
      }
    }

    if (isStudent) params.set("student", "true");
    if (isFarmer) params.set("farmer", "true");
    if (isSeniorCitizen) params.set("senior", "true");

    if (specialSituations.length > 0) {
      params.set("specialSituations", specialSituations.join(","));
    }

    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb / Progress */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 1 of 2: Your Eligibility Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            Check Your Scheme Eligibility
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            <strong>State</strong> and <strong>Age</strong> are required so we can identify relevant central and state schemes. All other questions are optional with &ldquo;Prefer not to say&rdquo;. Unanswered optional fields never exclude you from any scheme.
          </p>
        </div>

        {/* Privacy Highlight Banner */}
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-2.5 mb-6">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Privacy First &amp; No Data Storage:</span> We do not save
            your answers anywhere (no database, no account). Answers are used only in your browser to
            filter schemes.
          </div>
        </div>

        {/* Quick Demo Pre-fill Buttons */}
        <div className="mb-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Quick Test Profiles:
            </p>
            <button
              type="button"
              onClick={handleResetToOptional}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2"
            >
              Reset all to optional
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadPreset("student")}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
            >
              🎓 OBC Graduate Student
            </button>
            <button
              type="button"
              onClick={() => loadPreset("farmer")}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
            >
              🌾 Landowner Farmer (3.5 Acres)
            </button>
            <button
              type="button"
              onClick={() => loadPreset("senior")}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
            >
              👴 Senior Citizen (67y, SC)
            </button>
            <button
              type="button"
              onClick={() => loadPreset("widow_bpl")}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              🏠 Widow / Antyodaya (Rural)
            </button>
          </div>
        </div>

        {/* Main Eligibility Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-8 space-y-6"
        >
          {/* Top Form Validation Error Alert */}
          {Object.keys(errors).length > 0 && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-950">Please complete the required fields:</span>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-red-800">
                  {errors.state && <li>{errors.state}</li>}
                  {errors.age && <li>{errors.age}</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Section 1: Demographics & Location */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-4">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Location &amp; Demographics</span>
            </h2>

            <div className="space-y-4">
              {/* State (Required) */}
              <div>
                <label
                  htmlFor="state-select"
                  className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                >
                  State / Union Territory <span className="text-red-500 font-bold">*</span>
                  <span className="text-xs font-normal text-slate-500 ml-1.5">(Required)</span>
                </label>
                <select
                  id="state-select"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    if (errors.state) setErrors((prev) => ({ ...prev, state: undefined }));
                  }}
                  className={`w-full h-11 px-3.5 rounded-xl border bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.state
                      ? "border-red-500 focus:ring-red-500 bg-red-50/20"
                      : "border-slate-300 focus:ring-amber-500 focus:border-amber-500"
                  }`}
                  aria-invalid={Boolean(errors.state)}
                  aria-describedby={errors.state ? "state-error-msg" : undefined}
                >
                  <option value="">-- Select your State or Union Territory (Required) --</option>
                  {INDIAN_STATES_AND_UTS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p
                    id="state-error-msg"
                    className="text-xs font-semibold text-red-600 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.state}</span>
                  </p>
                )}
              </div>

              {/* District and Area (Rural/Urban) in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* District */}
                <div>
                  <label
                    htmlFor="district-input"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    District (Optional)
                  </label>
                  <input
                    id="district-input"
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Pune, Patna, Varanasi"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>

                {/* Area */}
                <div>
                  <label
                    htmlFor="area-select"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Area Type
                  </label>
                  <select
                    id="area-select"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {AREAS.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Age, Gender, and Marital Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Age (Required) */}
                <div>
                  <label
                    htmlFor="age-input"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Age (years) <span className="text-red-500 font-bold">*</span>
                    <span className="text-xs font-normal text-slate-500 ml-1.5">(Required)</span>
                  </label>
                  <input
                    id="age-input"
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => {
                      handleAgeChange(e);
                      if (errors.age) setErrors((prev) => ({ ...prev, age: undefined }));
                    }}
                    placeholder="e.g. 25"
                    className={`w-full h-11 px-3.5 rounded-xl border bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 transition-colors ${
                      errors.age
                        ? "border-red-500 focus:ring-red-500 bg-red-50/20"
                        : "border-slate-300 focus:ring-amber-500 focus:border-amber-500"
                    }`}
                    aria-invalid={Boolean(errors.age)}
                    aria-describedby={errors.age ? "age-error-msg" : undefined}
                  />
                  {errors.age && (
                    <p
                      id="age-error-msg"
                      className="text-xs font-semibold text-red-600 mt-1.5 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.age}</span>
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label
                    htmlFor="gender-select"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Gender
                  </label>
                  <select
                    id="gender-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {GENDERS.map((g) => (
                      <option key={g.value} value={g.value}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label
                    htmlFor="marital-select"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Marital Status
                  </label>
                  <select
                    id="marital-select"
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {MARITAL_STATUSES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Education, Employment & Farmer Details */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-4">
              <GraduationCap className="w-4 h-4 text-amber-600" />
              <span>Education, Work &amp; Land</span>
            </h2>

            <div className="space-y-4">
              {/* Education Level */}
              <div>
                <label
                  htmlFor="education-select"
                  className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Education Level
                </label>
                <select
                  id="education-select"
                  value={educationLevel}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEducationLevel(val);
                    if (val !== "prefer_not_to_say") {
                      setIsStudent(true);
                    }
                  }}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  {EDUCATION_LEVELS.map((edu) => (
                    <option key={edu.value} value={edu.value}>
                      {edu.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Used for scholarships (ITI, Diploma, College) and technical training programs.
                </p>
              </div>

              {/* Employment Status */}
              <div>
                <label
                  htmlFor="employment-select"
                  className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Employment Status
                </label>
                <select
                  id="employment-select"
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  {EMPLOYMENT_STATUSES.map((emp) => (
                    <option key={emp.value} value={emp.value}>
                      {emp.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Farmer Type & Land Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="farmer-type-select"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Farmer Type
                  </label>
                  <select
                    id="farmer-type-select"
                    value={farmerType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFarmerType(val);
                      if (val === "owner" || val === "tenant") {
                        setIsFarmer(true);
                      }
                    }}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {FARMER_TYPES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="land-size-input"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Agricultural Land Size (in Acres)
                  </label>
                  <input
                    id="land-size-input"
                    type="number"
                    step="0.1"
                    min="0"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    placeholder="e.g. 2.5 (leave blank if none)"
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Small/marginal farmer benefits often apply for land up to 5 acres (2 hectares).
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Income, Ration Card & Category */}
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-4">
              <IndianRupee className="w-4 h-4 text-amber-600" />
              <span>Income, Ration Card &amp; Category</span>
            </h2>

            <div className="space-y-4">
              {/* Annual Household Income */}
              <div>
                <label
                  htmlFor="income-input"
                  className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Total Annual Household Income (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                    ₹
                  </div>
                  <input
                    id="income-input"
                    type="number"
                    min="0"
                    step="5000"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="e.g. 150000 (optional)"
                    className="w-full h-11 pl-8 pr-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Gross total family income before taxes</span>
                  {income && !isNaN(parseInt(income, 10)) && (
                    <span className="font-semibold text-amber-700">
                      ₹{parseInt(income, 10).toLocaleString("en-IN")} / year
                    </span>
                  )}
                </div>

                {/* Quick income preset buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-400 self-center mr-1">Quick set:</span>
                  {[
                    { label: "₹75k", val: "75000" },
                    { label: "₹1.5 Lakh", val: "150000" },
                    { label: "₹2.5 Lakh", val: "250000" },
                    { label: "₹3 Lakh", val: "300000" },
                  ].map((chip) => (
                    <button
                      key={chip.val}
                      type="button"
                      onClick={() => setIncome(chip.val)}
                      className={`px-2 py-0.5 text-[11px] rounded-md border transition-colors ${
                        income === chip.val
                          ? "bg-amber-100 text-amber-800 border-amber-300 font-semibold"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                  {income && (
                    <button
                      type="button"
                      onClick={() => setIncome("")}
                      className="px-2 py-0.5 text-[11px] rounded-md text-red-600 hover:bg-red-50 border border-transparent"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Ration Card & Social Category in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Ration Card */}
                <div>
                  <label
                    htmlFor="ration-select"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Ration Card Type
                  </label>
                  <select
                    id="ration-select"
                    value={rationCardType}
                    onChange={(e) => setRationCardType(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {RATION_CARD_TYPES.map((rc) => (
                      <option key={rc.value} value={rc.value}>
                        {rc.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Social Category */}
                <div>
                  <label
                    htmlFor="category-select"
                    className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                  >
                    Social Category
                  </label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    {SOCIAL_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Minority Community */}
              <div>
                <label
                  htmlFor="minority-select"
                  className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Religious Minority Community
                </label>
                <select
                  id="minority-select"
                  value={minorityCommunity}
                  onChange={(e) => setMinorityCommunity(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  {MINORITY_COMMUNITIES.map((min) => (
                    <option key={min.value} value={min.value}>
                      {min.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  National Minorities: Muslim, Christian, Sikh, Buddhist, Jain, Parsi (Ministry of
                  Minority Affairs schemes).
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4: Disability & Special Situations */}
          <div>
            <div className="mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Accessibility className="w-4 h-4 text-amber-600" />
                <span>Disability &amp; Special Situations</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select only if applicable to you. All fields are optional.
              </p>
            </div>

            <div className="space-y-4">
              {/* Disability Percentage */}
              <div>
                <label
                  htmlFor="disability-input"
                  className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5"
                >
                  Disability Percentage (if applicable)
                </label>
                <div className="relative">
                  <input
                    id="disability-input"
                    type="number"
                    min="0"
                    max="100"
                    value={disabilityPercentage}
                    onChange={(e) => setDisabilityPercentage(e.target.value)}
                    placeholder="e.g. 40 (leave blank if not applicable)"
                    className="w-full h-11 px-3.5 pr-8 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 font-semibold text-sm">
                    %
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  40% or more qualifies as benchmark disability for disability pensions and assistive
                  equipment schemes (ADIP).
                </p>
              </div>

              {/* Core Checkboxes: Student / Farmer / Senior Citizen */}
              <div className="space-y-2.5 pt-2">
                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isStudent}
                    onChange={(e) => setIsStudent(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <div className="text-xs sm:text-sm">
                    <span className="font-semibold text-slate-900 block">
                      Currently Enrolled Student
                    </span>
                    <span className="text-slate-500 text-[11px] sm:text-xs">
                      Enrolled in school, college, diploma, or technical training.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isFarmer}
                    onChange={(e) => setIsFarmer(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <div className="text-xs sm:text-sm">
                    <span className="font-semibold text-slate-900 block">
                      Farmer / Agricultural Worker
                    </span>
                    <span className="text-slate-500 text-[11px] sm:text-xs">
                      Practicing farming or engaged in agricultural operations.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSeniorCitizen}
                    onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <div className="text-xs sm:text-sm">
                    <span className="font-semibold text-slate-900 block">
                      Senior Citizen (60+ years)
                    </span>
                    <span className="text-slate-500 text-[11px] sm:text-xs">
                      Eligible for National Social Assistance old age pensions.
                    </span>
                  </div>
                </label>
              </div>

              {/* Special Situations Checkboxes */}
              <div className="pt-2">
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                  Special Situations (Optional):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SPECIAL_SITUATIONS.map((situation) => {
                    const isChecked = specialSituations.includes(situation.id);
                    return (
                      <label
                        key={situation.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-amber-50 border-amber-300 text-amber-900"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSpecialSituationToggle(situation.id)}
                          className="w-3.5 h-3.5 mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                        />
                        <span className="font-medium leading-tight">{situation.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 text-base font-bold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-xl shadow-md shadow-amber-600/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Find Matching Schemes</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2.5">
              Instant evaluation • No registration required • Unanswered fields never exclude you
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
