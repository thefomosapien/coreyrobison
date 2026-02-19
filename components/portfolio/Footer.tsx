import type { SiteSettings, ContactLink } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
  links: ContactLink[];
}

export default function Footer({ settings, links }: FooterProps) {
  const emailLink = links.find((l) => l.is_email);
  const otherLinks = links.filter((l) => !l.is_email);

  return (
    <footer id="contact" className="bg-ink text-white/70 py-24">
      <div className="max-w-content mx-auto px-8 max-sm:px-5 flex justify-between items-start max-[900px]:flex-col max-[900px]:gap-12">
        <div>
          <h2
            className="font-serif text-white mb-4 tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}
          >
            {settings.contact_headline}
          </h2>
          <p className="text-[0.95rem] leading-relaxed max-w-[36ch] mb-8" style={{ lineHeight: '1.7' }}>
            {settings.contact_description}
          </p>
        </div>
        <div className="flex flex-col gap-3 text-right max-[900px]:text-left">
          {emailLink && (
            <a
              href={emailLink.url}
              className="text-lg text-white font-medium relative inline-flex items-center gap-1.5 hover:text-white transition-colors max-[900px]:justify-start justify-end"
            >
              {emailLink.label}
              <span className="absolute bottom-[-2px] left-0 w-full h-px bg-accent" />
            </a>
          )}
          {otherLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.9rem] text-white/50 hover:text-white transition-colors inline-flex items-center gap-1.5 max-[900px]:justify-start justify-end"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>
      <div className="max-w-content mx-auto px-8 max-sm:px-5">
        <div className="mt-16 pt-8 border-t border-white/[0.08] text-[0.75rem] text-white/25 flex justify-between max-[900px]:flex-col max-[900px]:gap-2">
          <span>© {new Date().getFullYear()} {settings.name}</span>
          <span>Designed with care in Salt Lake City</span>
        </div>
      </div>
    </footer>
  );
}
