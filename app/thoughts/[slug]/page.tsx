import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import type { Thought } from '@/lib/types';
import Nav from '@/components/portfolio/Nav';
import BackgroundAmbiance from '@/components/portfolio/BackgroundAmbiance';
import ThoughtContent from '@/components/portfolio/ThoughtContent';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getThought(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { thought: null, reactions: {}, relatedThoughts: [], siteName: '' };

  const supabase = createClient(url, key);

  const [{ data: thought }, { data: settings }] = await Promise.all([
    supabase.from('thoughts').select('*').eq('slug', slug).eq('is_published', true).single(),
    supabase.from('site_settings').select('name').single(),
  ]);

  if (!thought) return { thought: null, reactions: {}, relatedThoughts: [], siteName: settings?.name || '' };

  const [{ data: reactionRows }, { data: relatedRows }] = await Promise.all([
    supabase.from('reactions').select('reaction_type, count').eq('target_type', 'thought').eq('target_id', thought.id),
    supabase.from('thoughts').select('slug, title, category').eq('is_published', true).neq('slug', slug).order('created_at', { ascending: false }).limit(3),
  ]);

  const reactions: Record<string, number> = {};
  (reactionRows || []).forEach((r: { reaction_type: string; count: number }) => {
    reactions[r.reaction_type] = r.count;
  });

  return {
    thought: thought as Thought,
    reactions,
    relatedThoughts: (relatedRows || []) as { slug: string; title: string; category: string }[],
    siteName: settings?.name || '',
  };
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const { thought } = await getThought(slug);
  if (!thought) return { title: 'Not Found' };
  return {
    title: `${thought.title} — Corey Robison`,
    description: thought.excerpt || `${thought.title} — a thought by Corey Robison`,
  };
}

export default async function ThoughtPage({ params }: PageProps) {
  const { slug } = await params;
  const { thought, reactions, relatedThoughts, siteName } = await getThought(slug);

  if (!thought) notFound();

  return (
    <div className="min-h-screen relative" style={{ background: '#FDFCFA', color: '#2A2824' }}>
      <BackgroundAmbiance />
      <Nav name={siteName} currentPage="thought-detail" />
      <ThoughtContent thought={thought} reactions={reactions} relatedThoughts={relatedThoughts} />
    </div>
  );
}
