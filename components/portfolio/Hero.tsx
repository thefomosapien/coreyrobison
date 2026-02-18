import type { SiteSettings } from '@/lib/types';

interface HeroProps {
  settings: SiteSettings;
}

export default function Hero({ settings }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center pt-20">
      <div className="max-w-content mx-auto px-8 w-full">
        <div
          className="text-[0.8rem] font-medium tracking-[0.12em] uppercase text-accent mb-6 opacity-0 animate-fade-up-delay-1"
        >
          {settings.title}
        </div>
        <h1
          className="font-serif leading-[1.1] tracking-tight max-w-[16ch] mb-8 opacity-0 animate-fade-up-delay-2"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', letterSpacing: '-0.03em' }}
          dangerouslySetInnerHTML={{ __html: settings.headline }}
        />
        <p
          className="text-lg leading-relaxed text-ink-light max-w-[58ch] mb-10 opacity-0 animate-fade-up-delay-3"
          style={{ lineHeight: '1.7' }}
        >
          {settings.bio}
        </p>
        <div className="flex gap-12 text-[0.82rem] text-ink-muted tracking-wide opacity-0 animate-fade-up-delay-4 max-md:flex-col max-md:gap-5">
          <span>
            <strong className="text-ink font-medium block mb-0.5">Currently</strong>
            {settings.meta_currently}
          </span>
          <span>
            <strong className="text-ink font-medium block mb-0.5">Location</strong>
            {settings.meta_location}
          </span>
          <span>
            <strong className="text-ink font-medium block mb-0.5">Side Projects</strong>
            {settings.meta_side_projects}
          </span>
        </div>
      </div>
    </section>
  );
}
