import type { SiteSettings, AboutDetail } from '@/lib/types';
import ScrollReveal from './ScrollReveal';

interface AboutSectionProps {
  settings: SiteSettings;
  details: AboutDetail[];
}

export default function AboutSection({ settings, details }: AboutSectionProps) {
  return (
    <section id="about" className="max-w-content mx-auto px-8">
      <ScrollReveal>
        <div className="pt-32 pb-12 border-t border-ink/10">
          <div className="text-[0.75rem] font-medium tracking-[0.14em] uppercase text-ink-muted mb-4">
            About
          </div>
          <h2
            className="font-serif leading-tight tracking-tight max-w-[20ch]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
          >
            A little more about me.
          </h2>
        </div>
      </ScrollReveal>
      <div className="py-24 pb-32">
        <ScrollReveal>
          <div className="grid grid-cols-2 gap-16 max-[900px]:grid-cols-1 max-[900px]:gap-12">
            <div>
              <h3 className="font-serif text-3xl mb-6 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                {settings.about_headline}
              </h3>
              {(settings.about_paragraphs || []).map((paragraph, i) => (
                <p key={i} className="text-ink-light text-[0.95rem] mb-5" style={{ lineHeight: '1.8' }}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="pt-2">
              {details.map((detail) => (
                <div key={detail.id} className="mb-8">
                  <div className="text-[0.7rem] font-medium tracking-[0.12em] uppercase text-ink-muted mb-2.5">
                    {detail.label}
                  </div>
                  <div className="text-[0.95rem] text-ink leading-relaxed">{detail.value}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
