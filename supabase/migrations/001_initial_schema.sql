-- Portfolio CMS Schema
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════
-- Site Settings (single row)
-- ══════════════════════════════════════
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  headline TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  meta_currently TEXT NOT NULL DEFAULT '',
  meta_location TEXT NOT NULL DEFAULT '',
  meta_side_projects TEXT NOT NULL DEFAULT '',
  about_headline TEXT NOT NULL DEFAULT '',
  about_paragraphs TEXT[] NOT NULL DEFAULT '{}',
  contact_headline TEXT NOT NULL DEFAULT '',
  contact_description TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Projects
-- ══════════════════════════════════════
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  tag TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  external_url TEXT,
  visual_type TEXT NOT NULL DEFAULT 'custom',
  visual_bg_color TEXT,
  thumbnail_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════
-- Journey Items
-- ══════════════════════════════════════
CREATE TABLE journey_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_label TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  company TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE
);

-- ══════════════════════════════════════
-- About Details
-- ══════════════════════════════════════
CREATE TABLE about_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL DEFAULT '',
  value TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);

-- ══════════════════════════════════════
-- Contact Links
-- ══════════════════════════════════════
CREATE TABLE contact_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  is_email BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0
);

-- ══════════════════════════════════════
-- Row Level Security
-- ══════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON journey_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON about_details FOR SELECT USING (true);
CREATE POLICY "Public read access" ON contact_links FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "Authenticated insert" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON site_settings FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated insert" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated insert" ON journey_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON journey_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON journey_items FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated insert" ON about_details FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON about_details FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON about_details FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated insert" ON contact_links FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated update" ON contact_links FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete" ON contact_links FOR DELETE TO authenticated USING (true);

-- ══════════════════════════════════════
-- Storage bucket for project images
-- ══════════════════════════════════════
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Authenticated upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Authenticated update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-images');
CREATE POLICY "Authenticated delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-images');

-- ══════════════════════════════════════
-- Updated_at trigger for projects
-- ══════════════════════════════════════
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
