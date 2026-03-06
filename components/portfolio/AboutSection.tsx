import type { SiteSettings, AboutDetail } from '@/lib/types';
import ScrollReveal from './ScrollReveal';

interface AboutSectionProps {
  settings: SiteSettings;
  details: AboutDetail[];
}

export default function AboutSection({ settings, details }: AboutSectionProps) {
  return (
    <section
      id="about"
      aria-label="About"
      style={{ paddingTop: 48, paddingBottom: 56, borderTop: '1px solid rgba(42,40,36,0.08)' }}
    >
      <ScrollReveal>
        <h2 className="font-serif font-semibold" style={{ fontSize: '1.4rem', lineHeight: 1.2, letterSpacing: '-0.015em', color: '#1E1C19', marginBottom: 20 }}>
          A bit more
        </h2>
        <div
          className="flex flex-col"
          style={{ fontSize: 16, lineHeight: 1.85, color: '#4A4540', gap: 14, maxWidth: '60ch', marginBottom: 32 }}
        >
          {(settings.about_paragraphs || []).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2" style={{ gap: 24, maxWidth: 560 }}>
          {details.map((detail) => (
            <div key={detail.id}>
              <div
                className="font-pixel uppercase"
                style={{ fontSize: 10, color: '#6B6560', marginBottom: 6, letterSpacing: '0.08em' }}
              >
                {detail.label}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.65, color: '#4A4540' }}>{detail.value}</div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
