import { createServerSupabaseClient } from '@/lib/supabase/server';
import Nav from '@/components/portfolio/Nav';
import Hero from '@/components/portfolio/Hero';
import ProjectCard from '@/components/portfolio/ProjectCard';
import JourneyTimeline from '@/components/portfolio/JourneyTimeline';
import AboutSection from '@/components/portfolio/AboutSection';
import Footer from '@/components/portfolio/Footer';
import ScrollReveal from '@/components/portfolio/ScrollReveal';
import type { SiteSettings, Project, JourneyItem, AboutDetail, ContactLink } from '@/lib/types';

export const revalidate = 60;

async function getData() {
  const supabase = createServerSupabaseClient();

  const [settingsRes, projectsRes, journeyRes, aboutRes, contactRes] = await Promise.all([
    supabase.from('site_settings').select('*').single(),
    supabase.from('projects').select('*').eq('is_visible', true).order('sort_order'),
    supabase.from('journey_items').select('*').eq('is_visible', true).order('sort_order'),
    supabase.from('about_details').select('*').order('sort_order'),
    supabase.from('contact_links').select('*').order('sort_order'),
  ]);

  return {
    settings: settingsRes.data as SiteSettings,
    projects: (projectsRes.data || []) as Project[],
    journeyItems: (journeyRes.data || []) as JourneyItem[],
    aboutDetails: (aboutRes.data || []) as AboutDetail[],
    contactLinks: (contactRes.data || []) as ContactLink[],
  };
}

export default async function Home() {
  const { settings, projects, journeyItems, aboutDetails, contactLinks } = await getData();

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h1 className="font-serif text-3xl mb-4">Portfolio Setup Required</h1>
          <p className="text-ink-light">
            Please configure your Supabase environment variables and run the seed data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Nav name={settings.name} />
      <Hero settings={settings} />

      <section id="work" className="max-w-content mx-auto px-8">
        <ScrollReveal>
          <div className="pt-32 pb-12 border-t border-ink/10">
            <div className="text-[0.75rem] font-medium tracking-[0.14em] uppercase text-ink-muted mb-4">
              Selected Work
            </div>
            <h2
              className="font-serif leading-tight tracking-tight max-w-[20ch]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
            >
              9 years. One mission. Hundreds of shipped products.
            </h2>
          </div>
        </ScrollReveal>
        <div className="pb-16">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <JourneyTimeline items={journeyItems} />
      <AboutSection settings={settings} details={aboutDetails} />
      <Footer settings={settings} links={contactLinks} />
    </main>
  );
}
