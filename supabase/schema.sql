-- ==============================================================================
-- YOJANA FINDER: SUPABASE DATABASE SCHEMA & ROW LEVEL SECURITY
-- ==============================================================================

-- 1. Create Admins Table
-- Stores authorized administrator email addresses for Row Level Security verification.
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Schemes Table
-- Holds government welfare scheme details, eligibility metadata, and status.
CREATE TABLE IF NOT EXISTS schemes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_local_language TEXT,
  level TEXT DEFAULT 'Central',
  state TEXT DEFAULT 'All India',
  ministry_or_department TEXT,
  exact_beneficiary_category TEXT,
  description TEXT,
  benefit_amount TEXT,
  eligibility TEXT,
  min_age INTEGER,
  max_age INTEGER,
  max_income NUMERIC,
  gender TEXT DEFAULT 'All',
  education_level TEXT DEFAULT 'Any',
  occupation TEXT DEFAULT 'Any',
  rural_urban TEXT DEFAULT 'Rural and Urban',
  categories TEXT[] DEFAULT '{}',
  documents_needed TEXT[] DEFAULT '{}',
  how_to_apply TEXT,
  apply_link TEXT,
  source_url TEXT,
  status TEXT DEFAULT 'Open',
  last_verified TEXT,
  confidence TEXT DEFAULT 'High',
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Extended columns for complete compatibility with Yojana Finder features
  tagline TEXT,
  badge_color TEXT,
  last_date_to_apply TEXT,
  document_help TEXT,
  criteria JSONB DEFAULT '{}'::jsonb
);

-- 3. Create Reports Table
-- Allows citizens to report inaccurate or outdated scheme details.
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheme_name TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved BOOLEAN DEFAULT false,
  scheme_id TEXT
);

-- 4. Create Helpful Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_schemes_status ON schemes(status);
CREATE INDEX IF NOT EXISTS idx_schemes_state ON schemes(state);
CREATE INDEX IF NOT EXISTS idx_schemes_created_at ON schemes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_resolved ON reports(resolved);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Clean up any existing policies (safe for re-running)
DROP POLICY IF EXISTS "Public can read active schemes" ON schemes;
DROP POLICY IF EXISTS "Admins can view all schemes" ON schemes;
DROP POLICY IF EXISTS "Admins can insert schemes" ON schemes;
DROP POLICY IF EXISTS "Admins can update schemes" ON schemes;
DROP POLICY IF EXISTS "Admins can delete schemes" ON schemes;

DROP POLICY IF EXISTS "Public can insert reports" ON reports;
DROP POLICY IF EXISTS "Admins can read reports" ON reports;
DROP POLICY IF EXISTS "Admins can update reports" ON reports;
DROP POLICY IF EXISTS "Admins can delete reports" ON reports;

DROP POLICY IF EXISTS "Admins can view admins" ON admins;

-- ------------------------------------------------------------------------------
-- SCHEMES POLICIES
-- Rule: Anyone can read schemes whose status is not Closed.
-- Only admin (matched by email in admins table) can insert, update, or delete schemes.
-- ------------------------------------------------------------------------------

-- 5.1 Public Read: Any user can read active schemes (status != 'Closed' or status IS NULL)
CREATE POLICY "Public can read active schemes"
ON schemes FOR SELECT
USING (status IS DISTINCT FROM 'Closed');

-- 5.2 Admin Read: Admins can view ALL schemes, including 'Closed'
CREATE POLICY "Admins can view all schemes"
ON schemes FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);

-- 5.3 Admin Insert: Only admins can insert new schemes
CREATE POLICY "Admins can insert schemes"
ON schemes FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);

-- 5.4 Admin Update: Only admins can update schemes
CREATE POLICY "Admins can update schemes"
ON schemes FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
)
WITH CHECK (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);

-- 5.5 Admin Delete: Only admins can delete schemes
CREATE POLICY "Admins can delete schemes"
ON schemes FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);

-- ------------------------------------------------------------------------------
-- REPORTS POLICIES
-- Rule: Anyone can insert a report.
-- Only admin (matched by email in admins table) can read or update reports.
-- ------------------------------------------------------------------------------

-- 5.6 Public Insert: Anyone can insert a report (anonymous or authenticated)
CREATE POLICY "Public can insert reports"
ON reports FOR INSERT
WITH CHECK (true);

-- 5.7 Admin Read: Only admins can view reports
CREATE POLICY "Admins can read reports"
ON reports FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);

-- 5.8 Admin Update: Only admins can update reports (e.g. resolve)
CREATE POLICY "Admins can update reports"
ON reports FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
)
WITH CHECK (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);

-- 5.9 Admin Delete: Only admins can delete reports
CREATE POLICY "Admins can delete reports"
ON reports FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);

-- ------------------------------------------------------------------------------
-- ADMINS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view admins"
ON admins FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM admins)
);
