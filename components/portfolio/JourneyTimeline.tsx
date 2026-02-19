import type { JourneyItem } from '@/lib/types';
import ScrollReveal from './ScrollReveal';

interface JourneyTimelineProps {
  items: JourneyItem[];
}

export default function JourneyTimeline({ items }: JourneyTimelineProps) {
  return (
    <section id="journey" className="max-w-content mx-auto px-8 max-sm:px-5">
      <ScrollReveal>
        <div className="pt-32 pb-12 border-t border-ink/10">
          <div className="text-[0.75rem] font-medium tracking-[0.14em] uppercase text-ink-muted mb-4">
            Journey
          </div>
          <h2
            className="font-serif leading-tight tracking-tight max-w-[20ch]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
          >
            The path that got me here.
          </h2>
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div className="py-24">
          <div className="grid max-[900px]:grid-cols-[80px_1fr] grid-cols-[120px_1fr]">
            {items
              .filter((item) => item.is_visible)
              .map((item) => (
                <div key={item.id} className="contents">
                  <div className="text-[0.8rem] font-medium text-ink-muted py-7 border-r border-ink/10 pr-8 text-right">
                    {item.year_label}
                  </div>
                  <div className="py-7 pl-8 border-b border-ink/[0.05] last:border-b-0">
                    <div className="font-serif text-lg mb-0.5">{item.role}</div>
                    <div className="text-[0.85rem] text-ink-light mb-2">{item.company}</div>
                    <div className="text-[0.85rem] text-ink-muted italic">{item.note}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
