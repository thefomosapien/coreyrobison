import type { Thought } from '@/lib/types';
import PixelBadge from './PixelBadge';
import ScrollReveal from './ScrollReveal';

interface ThoughtsListProps {
  thoughts: Thought[];
  reactionTotals: Record<string, number>;
}

export default function ThoughtsList({ thoughts, reactionTotals }: ThoughtsListProps) {
  return (
    <section
      id="thoughts"
      aria-label="Latest thoughts"
      style={{ paddingTop: 40, paddingBottom: 40, borderTop: '1px solid rgba(42,40,36,0.08)' }}
    >
      <ScrollReveal>
        <h2 className="font-serif text-[20px] font-normal mb-5" style={{ color: '#2A2824' }}>
          Latest thoughts
        </h2>
        <div className="flex flex-col">
          {thoughts.map((t, i) => (
            <a
              key={t.slug}
              href={`#${t.slug}`}
              className="flex items-center justify-between gap-4 group"
              style={{
                padding: '14px 0',
                borderBottom: i < thoughts.length - 1 ? '1px solid rgba(42,40,36,0.06)' : 'none',
              }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <h3
                  className="font-serif text-[17px] font-normal leading-[1.3] group-hover:text-ocean transition-colors duration-150 whitespace-nowrap overflow-hidden text-ellipsis"
                  style={{ color: '#2A2824' }}
                >
                  {t.title}
                </h3>
                <PixelBadge variant="muted">{t.category}</PixelBadge>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <PixelBadge variant="count">
                  {reactionTotals[t.id] || 0} ♡
                </PixelBadge>
              </div>
            </a>
          ))}
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 font-pixel text-ocean"
          style={{ fontSize: 10, marginTop: 18 }}
        >
          View all thoughts →
        </a>
      </ScrollReveal>
    </section>
  );
}
