-- Migration: Update site_settings columns + add thoughts & reactions tables
-- Run this in the Supabase SQL Editor to bring the DB in line with 001_schema.sql

-- ══════════════════════════════════════
-- site_settings: drop old columns
-- ══════════════════════════════════════
ALTER TABLE site_settings
  DROP COLUMN IF EXISTS bio,
  DROP COLUMN IF EXISTS meta_currently,
  DROP COLUMN IF EXISTS meta_location,
  DROP COLUMN IF EXISTS meta_side_projects,
  DROP COLUMN IF EXISTS contact_description;

-- ══════════════════════════════════════
-- site_settings: add new columns
-- ══════════════════════════════════════
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS company_badge_text text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS company_badge_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio_paragraphs text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS footer_tagline text NOT NULL DEFAULT '';

-- ══════════════════════════════════════
-- Thoughts table
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS thoughts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  body text,
  excerpt text,
  is_published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════
-- Reactions table
-- ══════════════════════════════════════
CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reaction_type text NOT NULL,
  count int NOT NULL DEFAULT 0,
  UNIQUE (target_type, target_id, reaction_type)
);

-- ══════════════════════════════════════
-- RLS + policies for new tables (idempotent)
-- ══════════════════════════════════════
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON thoughts;
CREATE POLICY "Public read" ON thoughts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read" ON reactions;
CREATE POLICY "Public read" ON reactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public increment" ON reactions;
CREATE POLICY "Public increment" ON reactions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update" ON reactions;
CREATE POLICY "Public update" ON reactions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Auth write" ON thoughts;
CREATE POLICY "Auth write" ON thoughts FOR ALL USING (auth.role() = 'authenticated');

-- ══════════════════════════════════════
-- Updated_at trigger for thoughts (idempotent)
-- ══════════════════════════════════════
DROP TRIGGER IF EXISTS set_updated_at ON thoughts;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON thoughts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
