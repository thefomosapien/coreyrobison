'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Reaction, Thought, Project } from '@/lib/types';
import { REACTION_MAP } from '@/lib/types';

interface AggregatedRow {
  targetName: string;
  targetType: 'thought' | 'project';
  reactions: Record<string, number>;
  total: number;
}

const reactionTypes = Object.keys(REACTION_MAP);

export default function ReactionsPage() {
  const [rows, setRows] = useState<AggregatedRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [reactionsRes, thoughtsRes, projectsRes] = await Promise.all([
        supabase.from('reactions').select('*'),
        supabase.from('thoughts').select('id, title'),
        supabase.from('projects').select('id, name'),
      ]);

      const reactions: Reaction[] = reactionsRes.data || [];
      const thoughts: Pick<Thought, 'id' | 'title'>[] = thoughtsRes.data || [];
      const projects: Pick<Project, 'id' | 'name'>[] = projectsRes.data || [];

      const thoughtMap = new Map(thoughts.map((t) => [t.id, t.title]));
      const projectMap = new Map(projects.map((p) => [p.id, p.name]));

      // Aggregate reactions by target
      const aggregated = new Map<string, AggregatedRow>();

      for (const reaction of reactions) {
        const key = `${reaction.target_type}:${reaction.target_id}`;
        if (!aggregated.has(key)) {
          let targetName = 'Unknown';
          if (reaction.target_type === 'thought') {
            targetName = thoughtMap.get(reaction.target_id) || 'Unknown Thought';
          } else {
            targetName = projectMap.get(reaction.target_id) || 'Unknown Project';
          }
          aggregated.set(key, {
            targetName,
            targetType: reaction.target_type,
            reactions: {},
            total: 0,
          });
        }
        const row = aggregated.get(key)!;
        row.reactions[reaction.reaction_type] = (row.reactions[reaction.reaction_type] || 0) + reaction.count;
        row.total += reaction.count;
      }

      // Sort by total reactions descending
      const sorted = Array.from(aggregated.values()).sort((a, b) => b.total - a.total);
      setRows(sorted);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="text-ink-muted">Loading...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-1">Reactions</h1>
        <p className="text-sm text-ink-muted">
          Overview of reactions across thoughts and projects ({rows.reduce((sum, r) => sum + r.total, 0)} total)
        </p>
      </div>

      <div className="bg-white rounded-xl border border-ink/[0.06] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_auto_repeat(5,60px)_60px] gap-2 px-5 py-3 border-b border-ink/[0.08] bg-bg-alt/50 text-xs font-medium tracking-wider uppercase text-ink-muted">
          <div>Target</div>
          <div className="w-20 text-center">Type</div>
          {reactionTypes.map((type) => (
            <div key={type} className="text-center" title={REACTION_MAP[type].label}>
              {REACTION_MAP[type].emoji}
            </div>
          ))}
          <div className="text-center">Total</div>
        </div>

        {/* Table rows */}
        {rows.map((row, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_auto_repeat(5,60px)_60px] gap-2 px-5 py-3 border-b border-ink/[0.04] last:border-b-0 hover:bg-bg/50 transition items-center"
          >
            <div className="font-medium text-sm truncate">{row.targetName}</div>
            <div className="w-20 text-center">
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  row.targetType === 'thought'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {row.targetType}
              </span>
            </div>
            {reactionTypes.map((type) => (
              <div key={type} className="text-center text-sm text-ink-light">
                {row.reactions[type] || 0}
              </div>
            ))}
            <div className="text-center text-sm font-medium">{row.total}</div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="p-8 text-center text-ink-muted text-sm">No reactions yet.</div>
        )}
      </div>
    </div>
  );
}
