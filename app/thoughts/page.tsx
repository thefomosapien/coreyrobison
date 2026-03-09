import { createClient } from '@supabase/supabase-js';
import type { Thought } from '@/lib/types';
import Nav from '@/components/portfolio/Nav';
import BackgroundAmbiance from '@/components/portfolio/BackgroundAmbiance';
import ThoughtsListPage from '@/components/portfolio/ThoughtsListPage';

export const revalidate = 60;

export const metadata = {
  title: 'Thoughts — Corey Robison',
  description: 'Thoughts on product, design & AI.',
};

async function getData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { thoughts: [], siteName: '' };

  const supabase = createClient(url, key);

  const [{ data: thoughts }, { data: settings }] = await Promise.all([
    supabase.from('thoughts').select('*').eq('is_published', true).order('sort_order'),
    supabase.from('site_settings').select('name').single(),
  ]);

  return {
    thoughts: (thoughts || []) as Thought[],
    siteName: settings?.name || '',
  };
}

export default async function ThoughtsPage() {
  const { thoughts, siteName } = await getData();

  return (
    <div className="min-h-screen relative" style={{ background: '#FDFCFA', color: '#1E1C19' }}>
      <BackgroundAmbiance />
      <Nav name={siteName} currentPage="thoughts" />
      <main className="max-w-content mx-auto px-6 relative z-[5]" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <header style={{ marginBottom: 40 }}>
          <h1 className="font-serif font-semibold" style={{ fontSize: 28, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#1E1C19', marginBottom: 8 }}>
            Thoughts on product, design & AI.
          </h1>
          <p style={{ fontSize: 16, color: '#4A4540', lineHeight: 1.85 }}>
            Things I&apos;ve learned, observed, and can&apos;t stop thinking about.
          </p>
        </header>
        <ThoughtsListPage thoughts={thoughts} />
      </main>
    </div>
  );
}
