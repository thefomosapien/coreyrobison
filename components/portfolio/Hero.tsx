import type { SiteSettings } from '@/lib/types';
import CompanyBadge from './CompanyBadge';

interface HeroProps {
  settings: SiteSettings;
}

function renderHeadline(text: string) {
  const parts = text.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} style={{ color: '#5A8A9A' }}>{part}</span>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Hero({ settings }: HeroProps) {
  return (
    <section aria-label="Introduction" style={{ paddingTop: 40, paddingBottom: 56 }}>
      <div className="flex gap-10 items-start flex-col tablet:flex-row">
        <div className="flex-1">
          <h1
            className="font-serif font-normal"
            style={{
              fontSize: 'clamp(2rem, 4.2vw, 2.7rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: '#2A2824',
              marginBottom: 8,
            }}
          >
            {renderHeadline(settings.headline)}
          </h1>

          {settings.company_badge_text && (
            <div style={{ marginBottom: 24 }}>
              <CompanyBadge text={settings.company_badge_text} url={settings.company_badge_url} />
            </div>
          )}

          <div
            className="flex flex-col gap-3"
            style={{ fontSize: 15, lineHeight: 1.75, color: '#6B6660', maxWidth: '58ch' }}
          >
            {(settings.bio_paragraphs || []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div
          className="hidden tablet:flex"
          style={{
            width: 200,
            minWidth: 200,
            aspectRatio: '3/4',
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid rgba(42,40,36,0.06)',
            flexShrink: 0,
            background: settings.photo_url
              ? undefined
              : 'linear-gradient(135deg, #D4DFE6 0%, #C8D4DA 100%)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {settings.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.photo_url}
              alt={settings.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center p-5" style={{ color: '#A09A92' }}>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#A09A92" strokeWidth="1.2">
                <circle cx="20" cy="14" r="6" />
                <path d="M8 36 Q8 24 20 24 Q32 24 32 36" />
              </svg>
              <span className="font-pixel" style={{ fontSize: 8 }}>Your photo here</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
