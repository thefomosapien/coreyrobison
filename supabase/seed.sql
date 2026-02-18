-- Portfolio CMS Seed Data
-- Run this after the migration to populate initial content

-- ══════════════════════════════════════
-- Site Settings
-- ══════════════════════════════════════
INSERT INTO site_settings (
  name, title, headline, bio,
  meta_currently, meta_location, meta_side_projects,
  about_headline, about_paragraphs,
  contact_headline, contact_description,
  email, linkedin_url
) VALUES (
  'Corey Robison',
  'Sr. Product Designer',
  'I design things that <em>make life easier</em> for people.',
  'I''ve spent nearly a decade at WeSalute building everything from the ground up — brand, product, design system, strategy. Now I''m shipping my own ideas too. I just want to make things easier for people and maybe make a new friend along the way.',
  'Sr. Product Designer, WeSalute',
  'Salt Lake City, Utah',
  'Historia · Duhbate',
  'I didn''t just want to make things look good — I wanted to stick around long enough to see them make a difference.',
  ARRAY[
    'That''s what brought me to WeSalute. The mission to serve the veteran community was something I could believe in for the long haul. I started as the only designer and worked on everything — if it touched design, product, or customer experience, it was mine.',
    'Now I lead the design team, but my approach hasn''t changed: meet people where they are, listen more than you talk, and help them get where they want to go.',
    'I coach all three of my kids in baseball, softball, basketball, soccer, and volleyball. Honestly, coaching has taught me more about leadership than any job title ever could. Managing isn''t about giving orders — it''s about fostering talent and building relationships where people actually want to show up and do great work.'
  ],
  'Let''s talk.',
  'Whether you''re building something new or want to chat about design, coaching, or tattoos — I''m always up for a good conversation.',
  'coreybrobison@gmail.com',
  'https://www.linkedin.com/in/coreyrobison'
);

-- ══════════════════════════════════════
-- Projects
-- ══════════════════════════════════════
INSERT INTO projects (slug, tag, name, description, skills, visual_type, sort_order) VALUES
(
  'the-rebrand',
  'WeSalute — Brand',
  'The Rebrand That Changed Everything',
  'Led the complete transformation from Veterans Advantage to WeSalute — a new name, new identity, and new vision for a company serving the military community. I directed the rollout strategy across every touchpoint: consumer site, business portal, transactional emails, partner materials, and more.',
  ARRAY['Brand Strategy', 'Visual Identity', 'Rollout Planning', 'Cross-Platform'],
  'rebrand',
  1
),
(
  'wesalute-card',
  'WeSalute — Product Design',
  'WeSalute+ Card',
  'Redesigned the flagship physical and digital membership card through 12+ iterations, from product discovery and user surveys to final production. Navigated print constraints, legal requirements around military symbols, and the goal of creating something members would proudly carry.',
  ARRAY['Product Strategy', 'User Research', 'Industrial Print', '12+ Iterations'],
  'card',
  2
),
(
  'marketplace-navigation',
  'WeSalute — UX/UI',
  'Marketplace & Navigation Overhaul',
  'Redesigned the benefit discovery experience and information architecture for 3M+ users. Built differentiation between free and premium tiers, integrated Abenity''s offer catalog, and restructured site-wide navigation to reduce friction and improve conversion.',
  ARRAY['Information Architecture', 'UX Strategy', 'Conversion Design', 'Tier Differentiation'],
  'marketplace',
  3
),
(
  'brand-content-system',
  'WeSalute — Design Ops',
  'Brand & Content System',
  'Built 40+ pages of brand standards, content guidelines, and a design system from scratch in Confluence. Created the WeSalute Communications Guidelines, writer quick references, product-specific copy rules, and an AI-powered brand assistant to keep everything consistent at scale.',
  ARRAY['Design Systems', 'Content Strategy', 'Brand Guidelines', 'AI Integration'],
  'brand-system',
  4
),
(
  'historia',
  'Side Project — Shipped 2025',
  'Historia',
  'A life documentation app that visualizes your journey through chapters, milestones, and memories on a week-by-week grid. Features an AI Life Builder that creates your complete timeline from a simple conversation. Designed, built, and launched independently.',
  ARRAY['Full Product', 'AI Integration', 'Next.js', 'Supabase'],
  'historia',
  5
),
(
  'duhbate',
  'Side Project — Shipped 2025',
  'Duhbate',
  'A community debate platform where you make your case, face a challenger, and let the crowd decide who wins. Features timed phases, community voting, leaderboards, and category-based discovery across topics from sports to philosophy.',
  ARRAY['Full Product', 'Community Platform', 'Gamification', 'Real-time'],
  'duhbate',
  6
);

-- Set external_url for side projects
UPDATE projects SET external_url = 'https://historia.life' WHERE slug = 'historia';
UPDATE projects SET external_url = 'https://duhbate.app' WHERE slug = 'duhbate';

-- ══════════════════════════════════════
-- Journey Items
-- ══════════════════════════════════════
INSERT INTO journey_items (year_label, role, company, note, sort_order) VALUES
('2025', 'Side Projects: Historia & Duhbate', 'Independent', 'Designed, built, and launched two complete products from scratch.', 1),
('2020 — Now', 'Sr. Product Designer', 'WeSalute (fka Veterans Advantage)', 'Led rebrand, built design system, shipped 50+ product features. Went from solo designer to leading the design team.', 2),
('2017 — 2020', 'Product Designer', 'Veterans Advantage → WeSalute', 'Started as the only designer. Worked on everything — emails, landing pages, product strategy, partnership decks, parade floats.', 3),
('2015 — 2017', 'UX/UI Designer', 'Mix District Media · Billing Simplified', 'Early product design roles in the Salt Lake City area.', 4),
('2015 — 2016', 'MEAN Stack Development', 'DevMountain', 'Full-stack web development training that gave me the technical foundation to think like a developer.', 5);

-- ══════════════════════════════════════
-- About Details
-- ══════════════════════════════════════
INSERT INTO about_details (label, value, sort_order) VALUES
('Strengths', 'Product Strategy, Design Systems, Design Management, Brand Development, Content Strategy, Cross-functional Leadership', 1),
('Tools', 'Figma, Jira, Confluence, Shopify, Printful, HTML/CSS/JS, Supabase, Next.js', 2),
('Approach', 'Top-tier listener. Moves with intention, even when the demeanor is laid back. Asks the right questions, doesn''t just wait to talk.', 3),
('Fun Facts', 'Loves getting tattoos. Spent time as an auditioning actor in college — learned how to handle rejection and read a room. Not sure how that helps with design, but it probably does somehow.', 4);

-- ══════════════════════════════════════
-- Contact Links
-- ══════════════════════════════════════
INSERT INTO contact_links (label, url, is_email, sort_order) VALUES
('coreybrobison@gmail.com', 'mailto:coreybrobison@gmail.com', true, 1),
('LinkedIn', 'https://www.linkedin.com/in/coreyrobison', false, 2),
('Historia', 'https://historia.life', false, 3),
('Duhbate', 'https://duhbate.app', false, 4);
