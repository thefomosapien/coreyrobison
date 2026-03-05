'use client';

import { useState, useEffect } from 'react';
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

function PhotoBlock({ settings, className, width, aspectRatio, borderRadius }: {
  settings: SiteSettings;
  className?: string;
  width: number;
  aspectRatio: string;
  borderRadius: number;
}) {
  const [showAlt, setShowAlt] = useState(false);
  const [hinted, setHinted] = useState(false);

  const altUrl = settings.photo_alt_url;
  const currentUrl = showAlt && altUrl ? altUrl : settings.photo_url;

  useEffect(() => {
    if (!settings.photo_url) return;
    const timer = setTimeout(() => {
      setHinted(true);
      setTimeout(() => setHinted(false), 600);
    }, 5000);
    return () => clearTimeout(timer);
  }, [settings.photo_url]);

  return (
    <div
      className={className}
      style={{
        width,
        minWidth: width,
        aspectRatio,
        borderRadius,
        overflow: 'hidden',
        border: '1px solid rgba(42,40,36,0.06)',
        flexShrink: 0,
        background: currentUrl
          ? undefined
          : 'linear-gradient(135deg, #D4DFE6 0%, #C8D4DA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: settings.photo_url ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        transform: hinted ? 'scale(1.03) rotate(1deg)' : 'scale(1)',
      }}
      onClick={() => {
        if (settings.photo_url && altUrl) setShowAlt(!showAlt);
      }}
    >
      {currentUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentUrl}
          alt={settings.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.2s ease',
            transform: showAlt ? 'scale(1.02)' : 'scale(1)',
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center p-5" style={{ color: '#7A7570' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#7A7570" strokeWidth="1.2">
            <circle cx="20" cy="14" r="6" />
            <path d="M8 36 Q8 24 20 24 Q32 24 32 36" />
          </svg>
          <span className="font-pixel" style={{ fontSize: 9 }}>Your photo here</span>
        </div>
      )}
    </div>
  );
}

export default function Hero({ settings }: HeroProps) {
  return (
    <section aria-label="Introduction" style={{ paddingTop: 40, paddingBottom: 56 }}>
      <div className="flex gap-10 items-start flex-col tablet:flex-row">
        <div className="flex-1">
          {/* On mobile: H1 + small photo side by side */}
          <div className="flex tablet:block items-start gap-4" style={{ marginBottom: 8 }}>
            <h1
              className="font-serif font-normal flex-1"
              style={{
                fontSize: 'clamp(2rem, 4.2vw, 2.7rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                color: '#2A2824',
              }}
            >
              {renderHeadline(settings.headline)}
            </h1>
            {/* Mobile-only inline photo, matched to headline height */}
            <PhotoBlock
              settings={settings}
              className="flex tablet:hidden"
              width={72}
              aspectRatio="3/4"
              borderRadius={8}
            />
          </div>

          {settings.company_badge_text && (
            <div style={{ marginBottom: 24 }}>
              <CompanyBadge text={settings.company_badge_text} url={settings.company_badge_url} />
            </div>
          )}

          <div
            className="flex flex-col gap-3"
            style={{ fontSize: 16, lineHeight: 1.75, color: '#5A5550', maxWidth: '58ch' }}
          >
            {(settings.bio_paragraphs || []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        {/* Desktop photo */}
        <PhotoBlock
          settings={settings}
          className="hidden tablet:flex"
          width={200}
          aspectRatio="3/4"
          borderRadius={10}
        />
      </div>
    </section>
  );
}
