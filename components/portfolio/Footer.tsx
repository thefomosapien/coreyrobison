import type { SiteSettings, ContactLink } from '@/lib/types';
import BeachIllustration from './BeachIllustration';

interface FooterProps {
  settings: SiteSettings;
  links: ContactLink[];
}

export default function Footer({ settings, links }: FooterProps) {
  const emailLink = links.find((l) => l.is_email);
  const otherLinks = links.filter((l) => !l.is_email);

  return (
    <footer
      id="contact"
      role="contentinfo"
      style={{ borderTop: '1px solid rgba(42,40,36,0.08)', padding: '48px 24px 20px', position: 'relative', zIndex: 5 }}
    >
      <div className="max-w-content mx-auto">
        <h2 className="font-serif text-[20px] font-normal" style={{ color: '#2A2824', marginBottom: 14 }}>
          {settings.contact_headline}
        </h2>

        <div className="flex flex-wrap items-center gap-2" style={{ fontSize: 14, marginBottom: 48 }}>
          {emailLink && (
            <>
              <a
                href={emailLink.url}
                style={{ fontWeight: 600, color: '#2A2824', borderBottom: '1.5px solid rgba(90,138,154,0.4)', paddingBottom: 1 }}
              >
                {emailLink.label}
              </a>
              {otherLinks.length > 0 && <span style={{ color: '#C4BDB4' }}>・</span>}
            </>
          )}
          {otherLinks.map((link, i) => (
            <span key={link.id} className="inline-flex items-center gap-2">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#6B6660' }}
              >
                {link.label}
              </a>
              {i < otherLinks.length - 1 && <span style={{ color: '#C4BDB4' }}>・</span>}
            </span>
          ))}
        </div>

        <BeachIllustration />

        <div style={{ fontSize: 12, color: '#C4BDB4', lineHeight: 1.6, marginTop: 24, textAlign: 'center' }}>
          <p>{settings.footer_tagline}</p>
          <p>© {settings.name}.</p>
        </div>
      </div>
    </footer>
  );
}
