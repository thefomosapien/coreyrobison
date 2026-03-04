-- Seed data for deployed_projects
INSERT INTO deployed_projects (name, description, url, github_url, status, color_hex, supabase_account_email, supabase_project_url, notes, sort_order)
VALUES
  (
    'Historia',
    'Life documentation app with AI timeline builder',
    'https://historia.life',
    'https://github.com/coreyrobison/historia',
    'healthy',
    '#3D6E5C',
    'coreyrobison+historia@gmail.com',
    'https://xzabcdefghij.supabase.co',
    'Free tier — resets June 2026. Vercel Pro.',
    1
  ),
  (
    'Duhbate',
    'Community debate platform with live voting',
    'https://duhbate.app',
    'https://github.com/coreyrobison/duhbate',
    'healthy',
    '#C68C5A',
    'coreyrobison+duhbate@gmail.com',
    'https://abcxyzqrstuv.supabase.co',
    'Free tier — resets Aug 2026. Real-time subscriptions enabled.',
    2
  ),
  (
    'Mythwright',
    'AI-powered mythology and world-building tool',
    'https://mythwright.app',
    'https://github.com/coreyrobison/mythwright',
    'warning',
    '#5A8A9A',
    'coreyrobison+mythwright@gmail.com',
    'https://mnopqruvwxyz.supabase.co',
    'Free tier — has paused twice already. Might need upgrade soon.',
    3
  ),
  (
    'NestingPro',
    'Home organization and nesting planning app',
    'https://nestingpro.app',
    'https://github.com/coreyrobison/nestingpro',
    'paused',
    '#9B7A52',
    'coreyrobison+nestingpro@gmail.com',
    'https://fghijklmnopq.supabase.co',
    'Supabase project paused (inactive >1 week). Resume before sharing.',
    4
  );
