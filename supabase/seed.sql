-- Clear existing data
TRUNCATE site_settings, projects, thoughts, reactions, journey_items, about_details, contact_links CASCADE;

-- Site Settings
INSERT INTO site_settings (name, title, headline, company_badge_text, company_badge_url, bio_paragraphs, photo_url, about_headline, about_paragraphs, contact_headline, email, linkedin_url, footer_tagline) VALUES (
  'Corey Robison',
  'Product Design & Strategy Leader',
  'Hola! I''m a product design & strategy leader at the forefront of *AI*.',
  'At WeSalute since 2017',
  'https://wesalute.com',
  ARRAY[
    'I''ve spent nearly a decade building everything from the ground up — brand, product, design system, strategy — for a company serving 3M+ members of the military community. I integrate AI into my design process, build AI-powered tools for my team, and ship full products with modern AI capabilities.',
    'Now I''m also shipping my own ideas. I just want to make things easier for people and maybe make a new friend along the way.'
  ],
  NULL,
  '',
  ARRAY[
    'I didn''t just want to make things look good — I wanted to stick around long enough to see them make a difference. That''s what brought me to WeSalute.',
    'I started as the only designer and worked on everything. Now I lead the design team, but my approach hasn''t changed: meet people where they are, listen more than you talk, and help them get where they want to go.',
    'I coach all three of my kids in baseball, softball, basketball, soccer, and volleyball. Coaching has taught me more about leadership than any job title ever could.'
  ],
  'Get in touch',
  'coreybrobison@gmail.com',
  'https://www.linkedin.com/in/coreyrobison',
  'Designing and building since 2015. Going strong in 2026.'
);

-- Thoughts
INSERT INTO thoughts (slug, title, category, sort_order) VALUES
  ('depth-over-breadth', 'Why I Stayed 9 Years at One Company', 'Career', 1),
  ('design-systems-solo', 'Building a Design System When You''re the Only Designer', 'Design Systems', 2),
  ('coaching-leadership', 'What Coaching Little League Taught Me About Design Leadership', 'Leadership', 3),
  ('ai-brand-assistant', 'I Built an AI Brand Assistant for My Team', 'AI', 4);

-- Seed reactions for thoughts
INSERT INTO reactions (target_type, target_id, reaction_type, count)
SELECT 'thought', t.id, r.type, r.cnt
FROM thoughts t
JOIN (VALUES
  ('depth-over-breadth', 'thoughtful', 12),
  ('depth-over-breadth', 'relatable', 8),
  ('depth-over-breadth', 'good', 7),
  ('depth-over-breadth', 'loved', 3),
  ('depth-over-breadth', 'mind', 2),
  ('design-systems-solo', 'thoughtful', 18),
  ('design-systems-solo', 'relatable', 15),
  ('design-systems-solo', 'good', 12),
  ('design-systems-solo', 'loved', 8),
  ('design-systems-solo', 'mind', 4),
  ('coaching-leadership', 'thoughtful', 20),
  ('coaching-leadership', 'relatable', 22),
  ('coaching-leadership', 'good', 10),
  ('coaching-leadership', 'loved', 9),
  ('coaching-leadership', 'mind', 5),
  ('ai-brand-assistant', 'thoughtful', 10),
  ('ai-brand-assistant', 'relatable', 5),
  ('ai-brand-assistant', 'good', 8),
  ('ai-brand-assistant', 'loved', 6),
  ('ai-brand-assistant', 'mind', 12)
) AS r(slug, type, cnt) ON t.slug = r.slug;

-- Projects
INSERT INTO projects (slug, tag, name, description, skills, external_url, visual_type, sort_order) VALUES
  ('rebrand', 'WeSalute — Brand', 'The Rebrand That Changed Everything', 'Led the complete transformation from Veterans Advantage to WeSalute — new name, new identity, new vision. Directed rollout across every touchpoint: consumer site, business portal, emails, partner materials, and more.', ARRAY['Brand Strategy', 'Visual Identity', 'Rollout Planning', 'Cross-Platform'], NULL, 'rebrand', 1),
  ('wesalute-card', 'WeSalute — Product', 'WeSalute+ Card', 'Redesigned the flagship membership card through 12+ iterations, from product discovery and user surveys to final production. Navigated print constraints, legal requirements around military symbols, and the goal of creating something members would proudly carry.', ARRAY['Product Strategy', 'User Research', 'Industrial Print', '12+ Iterations'], NULL, 'card', 2),
  ('marketplace', 'WeSalute — UX/UI', 'Marketplace & Navigation Overhaul', 'Redesigned the benefit discovery experience and information architecture for 3M+ users. Built differentiation between free and premium tiers, integrated Abenity''s offer catalog, and restructured navigation to reduce friction and improve conversion.', ARRAY['Information Architecture', 'UX Strategy', 'Conversion Design', 'Tier Differentiation'], NULL, 'marketplace', 3),
  ('brand-system', 'WeSalute — Design Ops', 'Brand & Content System', 'Built 40+ pages of brand standards, content guidelines, and a design system from scratch in Confluence. Created communication guidelines, writer references, product-specific copy rules, and an AI-powered brand assistant.', ARRAY['Design Systems', 'Content Strategy', 'Brand Guidelines', 'AI Integration'], NULL, 'brand-system', 4),
  ('historia', 'Side Project — 2025', 'Historia', 'A life documentation app that visualizes your journey through chapters, milestones, and memories on a week-by-week grid. Features an AI Life Builder that creates your complete timeline from a simple conversation.', ARRAY['Full Product', 'AI Integration', 'Next.js', 'Supabase'], 'https://historia.life', 'historia', 5),
  ('duhbate', 'Side Project — 2025', 'Duhbate', 'A community debate platform where you make your case, face a challenger, and let the crowd decide. Features timed phases, community voting, leaderboards, and category discovery.', ARRAY['Full Product', 'Community Platform', 'Gamification', 'Real-time'], 'https://duhbate.app', 'duhbate', 6);

-- Seed some reactions for projects too
INSERT INTO reactions (target_type, target_id, reaction_type, count)
SELECT 'project', p.id, 'good', 0 FROM projects p
UNION ALL
SELECT 'project', p.id, 'loved', 0 FROM projects p
UNION ALL
SELECT 'project', p.id, 'mind', 0 FROM projects p
UNION ALL
SELECT 'project', p.id, 'thoughtful', 0 FROM projects p
UNION ALL
SELECT 'project', p.id, 'relatable', 0 FROM projects p;

-- Journey Items
INSERT INTO journey_items (year_label, role, company, note, sort_order) VALUES
  ('2025 – now', 'Side Projects: Historia & Duhbate', 'Independent', 'Designed, built, and launched two complete products from scratch.', 1),
  ('2020 – now', 'Sr. Product Designer', 'WeSalute (fka Veterans Advantage)', 'Led rebrand, built design system, shipped 50+ product features. Went from solo designer to leading the design team.', 2),
  ('2017 – 2020', 'Product Designer', 'Veterans Advantage → WeSalute', 'Started as the only designer. Worked on everything — emails, landing pages, product strategy, partnership decks, parade floats.', 3),
  ('2015 – 2017', 'UX/UI Designer', 'Mix District Media · Billing Simplified', 'Early product design roles in Salt Lake City.', 4),
  ('2015 – 2016', 'MEAN Stack Development', 'DevMountain', 'Full-stack web development training that gave me the technical foundation to think like a developer.', 5);

-- About Details
INSERT INTO about_details (label, value, sort_order) VALUES
  ('Strengths', 'Product Strategy, Design Systems, Brand Development, AI Integration, Cross-functional Leadership', 1),
  ('Tools', 'Figma, Jira, Confluence, Next.js, Supabase, Claude, Cursor, HTML/CSS/JS', 2),
  ('Approach', 'Top-tier listener. Moves with intention. Asks the right questions, doesn''t just wait to talk.', 3),
  ('Fun facts', 'Loves tattoos. Former auditioning actor. Coaches five youth sports. Designs parade floats sometimes.', 4);

-- Contact Links
INSERT INTO contact_links (label, url, is_email, sort_order) VALUES
  ('coreybrobison@gmail.com', 'mailto:coreybrobison@gmail.com', true, 1),
  ('LinkedIn', 'https://www.linkedin.com/in/coreyrobison', false, 2),
  ('Historia', 'https://historia.life', false, 3),
  ('Duhbate', 'https://duhbate.app', false, 4);
