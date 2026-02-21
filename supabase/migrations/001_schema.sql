-- Site Settings (single row)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  headline text NOT NULL DEFAULT '',
  company_badge_text text NOT NULL DEFAULT '',
  company_badge_url text NOT NULL DEFAULT '',
  bio_paragraphs text[] NOT NULL DEFAULT '{}',
  photo_url text,
  about_headline text NOT NULL DEFAULT '',
  about_paragraphs text[] NOT NULL DEFAULT '{}',
  contact_headline text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  footer_tagline text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  tag text NOT NULL DEFAULT '',
  name text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}',
  external_url text,
  visual_type text NOT NULL DEFAULT 'custom',
  visual_bg_color text,
  thumbnail_url text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Thoughts (NEW)
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

-- Reactions (NEW)
CREATE TABLE IF NOT EXISTS reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reaction_type text NOT NULL,
  count int NOT NULL DEFAULT 0,
  UNIQUE (target_type, target_id, reaction_type)
);

-- Journey Items
CREATE TABLE IF NOT EXISTS journey_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_label text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  company text NOT NULL DEFAULT '',
  note text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true
);

-- About Details
CREATE TABLE IF NOT EXISTS about_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT '',
  value text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0
);

-- Contact Links
CREATE TABLE IF NOT EXISTS contact_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  is_email boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0
);

-- Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_links ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read" ON thoughts FOR SELECT USING (true);
CREATE POLICY "Public read" ON reactions FOR SELECT USING (true);
CREATE POLICY "Public read" ON journey_items FOR SELECT USING (true);
CREATE POLICY "Public read" ON about_details FOR SELECT USING (true);
CREATE POLICY "Public read" ON contact_links FOR SELECT USING (true);

-- Public insert/update on reactions only
CREATE POLICY "Public increment" ON reactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update" ON reactions FOR UPDATE USING (true);

-- Authenticated write on everything
CREATE POLICY "Auth write" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON thoughts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON journey_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON about_details FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON contact_links FOR ALL USING (auth.role() = 'authenticated');
