import type { SiteSettings } from '@/lib/types';
import PixelWave from './PixelWave';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  return (
    <footer
      id="contact"
      role="contentinfo"
      style={{ borderTop: '1px solid rgba(42,40,36,0.08)', padding: '48px 24px 20px', position: 'relative', zIndex: 5 }}
    >
      <div className="max-w-content mx-auto">
        <h2 className="font-serif font-semibold" style={{ fontSize: '1.4rem', lineHeight: 1.2, letterSpacing: '-0.015em', color: '#1E1C19', marginBottom: 14 }}>
          {settings.contact_headline}
        </h2>

        <div className="flex flex-wrap items-center gap-2" style={{ fontSize: 16, marginBottom: 48 }}>
          {settings.email && (
            <a
              href={`mailto:${settings.email}`}
              style={{ fontWeight: 600, color: '#1E1C19', borderBottom: '1.5px solid rgba(90,138,154,0.4)', paddingBottom: 1 }}
            >
              {settings.email}
            </a>
          )}
          {settings.email && settings.linkedin_url && <span style={{ color: '#8A8480' }}>・</span>}
          {settings.linkedin_url && (
            <a
              href={settings.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#4A4540' }}
            >
              LinkedIn
            </a>
          )}
        </div>

        <PixelWave />

        <div style={{ fontSize: 14, color: '#4A4540', lineHeight: 1.85, marginTop: 24, textAlign: 'center' }}>
          <p>{settings.footer_tagline}</p>
        </div>
        <div className="font-pixel" style={{ fontSize: 9, color: '#6B6560', lineHeight: 1.6, marginTop: 8, textAlign: 'center', letterSpacing: '0.03em' }}>
          <p>© {settings.name}.</p>
        </div>
      </div>
    </footer>
  );
}
