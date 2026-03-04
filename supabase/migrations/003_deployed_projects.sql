-- Deployed Projects — admin-only ops table for tracking live side projects
CREATE TABLE IF NOT EXISTS deployed_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  url text,
  github_url text,
  status text NOT NULL DEFAULT 'healthy',
  color_hex text,
  supabase_account_email text,
  supabase_project_url text,
  supabase_anon_key text,
  supabase_service_key text,
  notes text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Row Level Security
ALTER TABLE deployed_projects ENABLE ROW LEVEL SECURITY;

-- No public read — admin-only table
-- Authenticated full access
CREATE POLICY "Auth full access" ON deployed_projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Index for sort ordering
CREATE INDEX idx_deployed_projects_sort ON deployed_projects (sort_order);
