# Yojana Finder (योजना फाइंडर)

A clean, fast, mobile-first Next.js web application built with App Router and Tailwind CSS that helps Indian citizens discover government welfare schemes, scholarships, farming assistance, and pensions they are eligible for.

---

## 🌟 Key Features

### 1. Home Page (`/`)
- Clear, accessible explanation of the portal's purpose.
- **"Check Eligibility"** and **"Browse All Schemes"** direct actions.
- Highlights: No Aadhaar required, 100% free citizen tool, takes under 2 minutes.

### 2. Eligibility Form Page (`/eligibility`)
- **Completely Optional with "Prefer not to say":** Every field can be answered or skipped without penalty.
- **Zero Data Storage:** Answers are never saved to a database, cookies, or localStorage. They are evaluated in-memory/URL query params solely to filter schemes.
- **Profile Fields:**
  - **Education Level:** School, ITI, Diploma, Graduate, Postgraduate, PhD, or Prefer not to say.
  - **Marital Status:** Single, Married, Widow, Single Mother, Divorced, or Prefer not to say.
  - **Area & District:** Rural / Urban, District name (optional).
  - **Farmer & Landholding:** Landowner vs Tenant farmer, Land size in acres.
  - **Employment Status:** Unemployed, Self-employed, MSME owner, Unorganised worker, Gig worker, Government employee.
  - **Ration Card Type:** None, APL, BPL, Antyodaya (AAY).
  - **Disability Percentage:** Benchmark disability (0-100%).
  - **Social Category:** General, OBC, SC, ST, EWS.
  - **Minority Community:** None, Muslim, Christian, Sikh, Buddhist, Jain, Parsi.
  - **Special Situations:** Ex-serviceman, Freedom fighter's family, Orphan, Soldier's widow, Transgender.

### 3. Results Page (`/results`)
- **Matching Rule:** A blank scheme criterion applies to everyone, and an unanswered user field never excludes a scheme.
- **Interactive Filters:**
  - **Category Filter:** Refine by Farmer Support, Housing, Health, Education, Pensions, etc.
  - **State Filter:** Filter by specific State / UT or All India.
  - **Search Box:** Instant keyword search across scheme names, descriptions, ministries, and tags.
  - **Saved Tab:** Quick access to saved schemes alongside Eligible and All Schemes.

### 4. "Browse All Schemes" Catalog with Pagination (`/schemes`)
- Dedicated full catalog browser.
- **Pagination (20 per page):** Fast and lightweight, easily browsable on inexpensive phones.
- Includes Search box, Category filter, State filter, and "Show Saved Only" toggle.

### 5. Enhanced Scheme Cards (`components/SchemeCard.tsx`)
- **Live Status Badge:** `Open` (active), `Closed`, or `Verify` with pulsating indicator.
- **Last Date to Apply:** Displays deadline date or "Ongoing / Open all year".
- **Last Verified Date:** Explicit transparency showing when guidelines were verified (e.g. "October 2026").
- **View Official Source:** Direct link to government notifications or official gazette guidelines.
- **Apply on Official Website:** Opens the official application portal in a new tab (`rel="noopener noreferrer"`) with the reassuring note: *"You'll be taken to the official government website."*
- **"Missing a document?" Tip:** Embedded guidance under documents explaining where to obtain required papers (e.g. e-District portal, Tehsildar, CSC Centre).
- **Save Scheme:** Bookmark button storing *only scheme IDs* in browser storage.
- **Read Aloud:** Browser-native speech synthesis (`window.speechSynthesis`) that reads out the scheme name, description, benefits, and qualification reason in English or Hindi.

### 6. Language Switcher (Modular i18n)
- **English & Hindi (`EN | हिन्दी`):** Switch languages instantly across the site.
- **Extensible Architecture:** Adding a new language (like Marathi or Tamil) only requires creating one file in `data/translations/<lang>.ts` and registering it in `data/translations/index.ts`.

### 7. "Simple Mode" Accessibility Toggle
- Toggle button in Navbar.
- Larger typography, reduced visual clutter, higher contrast, and prominent Read Aloud features designed for elderly citizens or those with visual impairments.

---

## 🚀 How to Run the App

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Open in Browser
Visit [http://localhost:3000](http://localhost:3000).

---

## 🧪 Pages to Test

1. **Home Page:** [http://localhost:3000](http://localhost:3000)
2. **Eligibility Form:** [http://localhost:3000/eligibility](http://localhost:3000/eligibility)
3. **Results Page:** [http://localhost:3000/results](http://localhost:3000/results)
4. **Browse All Schemes (Catalog with Pagination):** [http://localhost:3000/schemes](http://localhost:3000/schemes)
