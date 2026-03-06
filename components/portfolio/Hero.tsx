'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { SiteSettings } from '@/lib/types';
import CompanyBadge from './CompanyBadge';

interface HeroProps {
  settings: SiteSettings;
}

function renderHeadline(text: string) {
  // Split on newlines first to support multi-line headlines
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    const parts = line.split(/\*([^*]+)\*/);
    const rendered = parts.map((part, i) =>
      i % 2 === 1 ? (
        <span key={`${lineIdx}-${i}`} style={{ color: '#5A8A9A' }}>{part}</span>
      ) : (
        <span key={`${lineIdx}-${i}`}>{part}</span>
      )
    );
    return (
      <span key={lineIdx}>
        {lineIdx > 0 && <br />}
        {rendered}
      </span>
    );
  });
}

function PhotoBlock({ settings, className, width, aspectRatio, borderRadius, priority, fullWidth, objectPosition }: {
  settings: SiteSettings;
  className?: string;
  width: number;
  aspectRatio: string;
  borderRadius: number;
  priority?: boolean;
  fullWidth?: boolean;
  objectPosition?: string;
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
      className={`items-center justify-center ${className || ''}`}
      style={{
        width: fullWidth ? '100%' : width,
        minWidth: fullWidth ? undefined : width,
        aspectRatio,
        borderRadius,
        overflow: 'hidden',
        border: '1px solid rgba(42,40,36,0.06)',
        flexShrink: 0,
        position: 'relative',
        background: currentUrl
          ? undefined
          : 'linear-gradient(135deg, #D4DFE6 0%, #C8D4DA 100%)',
        cursor: settings.photo_url ? 'pointer' : 'default',
        transition: 'transform 0.2s ease',
        transform: hinted ? 'scale(1.03) rotate(1deg)' : 'scale(1)',
      }}
      onClick={() => {
        if (settings.photo_url && altUrl) setShowAlt(!showAlt);
      }}
    >
      {currentUrl ? (
        <Image
          src={currentUrl}
          alt={settings.name}
          fill
          sizes={fullWidth ? '100vw' : `${width}px`}
          priority={priority}
          style={{
            objectFit: 'cover',
            objectPosition: objectPosition ?? 'center center',
            transition: 'transform 0.2s ease',
            transform: showAlt ? 'scale(1.02)' : 'scale(1)',
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-center p-5" style={{ color: '#6B6560' }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="#6B6560" strokeWidth="1.2">
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
        {/* Desktop photo — left side */}
        <PhotoBlock
          settings={settings}
          className="hidden tablet:flex"
          width={200}
          aspectRatio="3/4"
          borderRadius={10}
          priority
        />

        <div className="flex-1">
          <h1
            className="font-serif font-semibold"
            style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 2.7rem)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#1E1C19',
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
            style={{ fontSize: 16, lineHeight: 1.85, color: '#4A4540', maxWidth: '58ch' }}
          >
            {(settings.bio_paragraphs || []).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Mobile-only full-width photo below content */}
          <PhotoBlock
            settings={settings}
            className="flex tablet:hidden"
            width={600}
            aspectRatio="16/9"
            borderRadius={10}
            fullWidth
            objectPosition="center 60%"
            priority
          />
        </div>
      </div>
    </section>
  );
}
