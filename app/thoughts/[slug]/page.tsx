import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import type { Thought } from '@/lib/types';
import BackgroundAmbiance from '@/components/portfolio/BackgroundAmbiance';
import ThoughtContent from '@/components/portfolio/ThoughtContent';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getThought(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { thought: null, reactions: {} };

  const supabase = createClient(url, key);

  const { data: thought } = await supabase
    .from('thoughts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!thought) return { thought: null, reactions: {} };

  const { data: reactionRows } = await supabase
    .from('reactions')
    .select('reaction_type, count')
    .eq('target_type', 'thought')
    .eq('target_id', thought.id);

  const reactions: Record<string, number> = {};
  (reactionRows || []).forEach((r: { reaction_type: string; count: number }) => {
    reactions[r.reaction_type] = r.count;
  });

  return { thought: thought as Thought, reactions };
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
  const { thought, reactions } = await getThought(slug);

  if (!thought) notFound();

  return (
    <div className="min-h-screen relative" style={{ background: '#FAF8F4', color: '#2A2824' }}>
      <BackgroundAmbiance />
      <ThoughtContent thought={thought} reactions={reactions} />
    </div>
  );
}
