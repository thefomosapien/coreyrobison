import { createClient } from '@supabase/supabase-js';
import Nav from '@/components/portfolio/Nav';
import Hero from '@/components/portfolio/Hero';
import ThoughtsList from '@/components/portfolio/ThoughtsList';
import ProjectCard from '@/components/portfolio/ProjectCard';
import JourneyTimeline from '@/components/portfolio/JourneyTimeline';
import AboutSection from '@/components/portfolio/AboutSection';
import Footer from '@/components/portfolio/Footer';
import BackgroundAmbiance from '@/components/portfolio/BackgroundAmbiance';
import ScrollReveal from '@/components/portfolio/ScrollReveal';
import type { SiteSettings, Project, Thought, Reaction, JourneyItem, AboutDetail, ContactLink } from '@/lib/types';

export const revalidate = 60;

async function getData() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      return { settings: null, projects: [], thoughts: [], reactions: [], journeyItems: [], aboutDetails: [], contactLinks: [] };
    }

    const supabase = createClient(url, key);

    const [settingsRes, projectsRes, thoughtsRes, reactionsRes, journeyRes, aboutRes, contactRes] = await Promise.all([
      supabase.from('site_settings').select('*').single(),
      supabase.from('projects').select('*').eq('is_visible', true).order('sort_order'),
      supabase.from('thoughts').select('*').eq('is_published', true).order('sort_order'),
      supabase.from('reactions').select('*'),
      supabase.from('journey_items').select('*').eq('is_visible', true).order('sort_order'),
      supabase.from('about_details').select('*').order('sort_order'),
      supabase.from('contact_links').select('*').order('sort_order'),
    ]);

    return {
      settings: settingsRes.data as SiteSettings | null,
      projects: (projectsRes.data || []) as Project[],
      thoughts: (thoughtsRes.data || []) as Thought[],
      reactions: (reactionsRes.data || []) as Reaction[],
      journeyItems: (journeyRes.data || []) as JourneyItem[],
      aboutDetails: (aboutRes.data || []) as AboutDetail[],
      contactLinks: (contactRes.data || []) as ContactLink[],
    };
  } catch {
    return { settings: null, projects: [], thoughts: [], reactions: [], journeyItems: [], aboutDetails: [], contactLinks: [] };
  }
}

function buildReactionMap(reactions: Reaction[], targetType: string, targetId: string): Record<string, number> {
  const map: Record<string, number> = { thoughtful: 0, relatable: 0, good: 0, loved: 0, mind: 0 };
  reactions
    .filter((r) => r.target_type === targetType && r.target_id === targetId)
    .forEach((r) => { map[r.reaction_type] = r.count; });
  return map;
}

function getTotalReactions(reactions: Reaction[], targetId: string): number {
  return reactions
    .filter((r) => r.target_id === targetId)
    .reduce((sum, r) => sum + r.count, 0);
}

export default async function Home() {
  const { settings, projects, thoughts, reactions, journeyItems, aboutDetails, contactLinks } = await getData();

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h1 className="font-serif text-3xl mb-4">Portfolio Setup Required</h1>
          <p className="text-ink-muted">
            Please configure your Supabase environment variables and run the seed data.
          </p>
        </div>
      </div>
    );
  }

  const thoughtReactionTotals: Record<string, number> = {};
  thoughts.forEach((t) => { thoughtReactionTotals[t.id] = getTotalReactions(reactions, t.id); });

  return (
    <div className="min-h-screen relative" style={{ background: '#FAF8F4', color: '#2A2824' }}>
      {/* Skip to content */}
      <a
        href="#main-content"
        className="absolute top-[-40px] left-0 bg-ink text-white z-[999] focus:top-0"
        style={{ padding: '8px 16px', fontSize: 13 }}
      >
        Skip to main content
      </a>

      <BackgroundAmbiance />

      <Nav name={settings.name} />

      <main id="main-content" className="max-w-content mx-auto px-6 relative z-[5]">
        <Hero settings={settings} />

        <ThoughtsList thoughts={thoughts} reactionTotals={thoughtReactionTotals} />

        {/* Work Section */}
        <section
          id="work"
          aria-label="Selected work"
          style={{ paddingTop: 48, paddingBottom: 48, borderTop: '1px solid rgba(42,40,36,0.08)' }}
        >
          <ScrollReveal>
            <h2 className="font-serif text-[20px] font-normal" style={{ color: '#2A2824', marginBottom: 6 }}>
              Selected work
            </h2>
            <p style={{ fontSize: 14, color: '#A09A92', marginBottom: 32, lineHeight: 1.6 }}>
              9 years at one company. Hundreds of shipped products. Here&apos;s the highlight reel.
            </p>
          </ScrollReveal>
          <div className="flex flex-col" style={{ gap: 36 }}>
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                reactions={buildReactionMap(reactions, 'project', project.id)}
              />
            ))}
          </div>
        </section>

        <JourneyTimeline items={journeyItems} />
        <AboutSection settings={settings} details={aboutDetails} />
      </main>

      <Footer settings={settings} links={contactLinks} />
    </div>
  );
}
