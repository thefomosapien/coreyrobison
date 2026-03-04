import type { JourneyItem } from '@/lib/types';
import ScrollReveal from './ScrollReveal';

interface JourneyTimelineProps {
  items: JourneyItem[];
}

export default function JourneyTimeline({ items }: JourneyTimelineProps) {
  const visible = items.filter((item) => item.is_visible);

  return (
    <section
      id="journey"
      aria-label="Career journey"
      style={{ paddingTop: 48, paddingBottom: 48, borderTop: '1px solid rgba(42,40,36,0.08)' }}
    >
      <ScrollReveal>
        <h2 className="font-serif text-[20px] font-normal" style={{ color: '#2A2824', marginBottom: 28 }}>
          Career journey
        </h2>
        {visible.map((item, i) => (
          <div
            key={item.id}
            className="grid grid-cols-[80px_1fr] tablet:grid-cols-[130px_1fr]"
            style={{ paddingBottom: 20 }}
          >
            <div className="font-sans font-medium" style={{ fontSize: 13, color: '#7A7570', paddingTop: 4, paddingRight: 20 }}>
              {item.year_label}
            </div>
            <div
              style={{
                paddingBottom: 20,
                borderBottom: i < visible.length - 1 ? '1px solid rgba(42,40,36,0.06)' : 'none',
              }}
            >
              <h3 className="font-serif font-normal" style={{ fontSize: 18, color: '#2A2824', marginBottom: 2, lineHeight: 1.3 }}>
                {item.role}
              </h3>
              <div style={{ fontSize: 14, color: '#5A5550', marginBottom: 5 }}>{item.company}</div>
              <div style={{ fontSize: 14, color: '#7A7570', fontStyle: 'italic', lineHeight: 1.65 }}>{item.note}</div>
            </div>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}
