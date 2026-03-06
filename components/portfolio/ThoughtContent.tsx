'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Thought } from '@/lib/types';
import { getCategoryStyle } from '@/lib/categoryStyles';
import Reactions from './Reactions';

interface ThoughtContentProps {
  thought: Thought;
  reactions: Record<string, number>;
  relatedThoughts?: { slug: string; title: string; category: string }[];
}

function extractHeadings(body: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const lines = body.split('\n');
  for (const line of lines) {
    const match = line.match(/^## (.+)$/);
    if (match) {
      const text = match[1].trim();
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      headings.push({ id, text });
    }
  }
  return headings;
}

// Parse :::tip, :::note, :::warning callout blocks
function preprocessCallouts(body: string): string {
  return body.replace(
    /:::(tip|note|warning)\n([\s\S]*?):::/g,
    (_, type, content) => {
      const escaped = content.trim().replace(/\|/g, '\\|');
      return `<callout-${type}>${escaped}</callout-${type}>`;
    }
  );
}

const CALLOUT_CONFIG: Record<string, { borderColor: string; bg: string; label: string }> = {
  tip: { borderColor: '#5A8A9A', bg: 'rgba(90,138,154,0.06)', label: '\u{1F4A1} Tip for you' },
  note: { borderColor: '#C68C5A', bg: 'rgba(198,140,90,0.06)', label: '\u{1F4DD} Keep in mind' },
  warning: { borderColor: '#D97706', bg: 'rgba(217,119,6,0.06)', label: '\u26A0\uFE0F Heads up' },
};

function CalloutBox({ type, children }: { type: string; children: React.ReactNode }) {
  const config = CALLOUT_CONFIG[type] || CALLOUT_CONFIG.note;
  return (
    <div
      style={{
        borderLeft: `4px solid ${config.borderColor}`,
        background: config.bg,
        padding: '16px 20px',
        borderRadius: '0 8px 8px 0',
        margin: '24px 0',
      }}
    >
      <div className="font-sans font-medium" style={{ fontSize: 14, color: config.borderColor, marginBottom: 6 }}>
        {config.label}
      </div>
      <div style={{ fontSize: 16, lineHeight: 1.85, color: '#1E1C19' }}>{children}</div>
    </div>
  );
}

function DecorativeHr() {
  return (
    <div style={{ textAlign: 'center', margin: '36px 0' }}>
      <svg width="80" height="12" viewBox="0 0 80 12" fill="none">
        <path d="M0 6 Q10 0 20 6 Q30 12 40 6 Q50 0 60 6 Q70 12 80 6" stroke="#5A8A9A" strokeWidth="1.5" fill="none" opacity="0.3" />
        <rect x="36" y="2" width="8" height="8" rx="1" fill="#5A8A9A" opacity="0.15" transform="rotate(45 40 6)" />
      </svg>
    </div>
  );
}

function ShareBlock({ thought }: { thought: Thought }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const tweetText = encodeURIComponent(`${thought.title} by @coreyrobison ${url}`);
  const linkedInUrl = encodeURIComponent(url);

  return (
    <div style={{ borderTop: '1px solid rgba(42,40,36,0.08)', marginTop: 48, paddingTop: 28 }}>
      <p className="font-sans font-medium" style={{ fontSize: 15, color: '#1E1C19', marginBottom: 14 }}>
        Share with friends
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleCopy}
          className="font-sans font-medium transition-all duration-200"
          style={{
            fontSize: 14,
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid rgba(42,40,36,0.1)',
            background: copied ? 'rgba(61,110,92,0.08)' : 'transparent',
            color: copied ? '#3D6E5C' : '#4A4540',
            cursor: 'pointer',
          }}
        >
          {copied ? 'Copied!' : 'Copy link'}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?text=${tweetText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-medium transition-all duration-200"
          style={{
            fontSize: 14,
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid rgba(42,40,36,0.1)',
            color: '#4A4540',
            textDecoration: 'none',
          }}
        >
          X / Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans font-medium transition-all duration-200"
          style={{
            fontSize: 14,
            padding: '8px 16px',
            borderRadius: 8,
            border: '1px solid rgba(42,40,36,0.1)',
            color: '#4A4540',
            textDecoration: 'none',
          }}
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}

function ReadMore({ thoughts }: { thoughts: { slug: string; title: string; category: string }[] }) {
  if (!thoughts.length) return null;
  return (
    <div style={{ borderTop: '1px solid rgba(42,40,36,0.08)', marginTop: 36, paddingTop: 28 }}>
      <p className="font-sans font-medium" style={{ fontSize: 15, color: '#1E1C19', marginBottom: 14 }}>
        Read more
      </p>
      <div className="flex flex-col gap-3">
        {thoughts.map((t) => {
          const catStyle = getCategoryStyle(t.category);
          return (
            <a
              key={t.slug}
              href={`/thoughts/${t.slug}`}
              className="flex items-center gap-3 group"
              style={{ textDecoration: 'none' }}
            >
              <span
                className="font-serif text-[16px] group-hover:text-ocean transition-colors duration-150"
                style={{ color: '#1E1C19' }}
              >
                {t.title}
              </span>
              <span
                className="font-pixel inline-block leading-[1.4]"
                style={{ fontSize: 9, padding: '3px 8px', borderRadius: 3, ...catStyle }}
              >
                {t.category}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function TableOfContents({ headings }: { headings: { id: string; text: string }[] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div
      className="hidden lg:block"
      style={{
        position: 'sticky',
        top: 100,
        width: 200,
        flexShrink: 0,
      }}
    >
      <div className="font-pixel uppercase" style={{ fontSize: 10, color: '#6B6560', marginBottom: 12, letterSpacing: '0.08em' }}>
        Contents
      </div>
      <div className="flex flex-col gap-2">
        {headings.map(({ id, text }) => (
          <a
            key={id}
            href={`#${id}`}
            className="font-sans transition-colors duration-150"
            style={{
              fontSize: 14,
              lineHeight: 1.4,
              color: activeId === id ? '#5A8A9A' : '#6B6560',
              fontWeight: activeId === id ? 500 : 400,
              textDecoration: 'none',
              borderLeft: activeId === id ? '2px solid #5A8A9A' : '2px solid transparent',
              paddingLeft: 10,
            }}
          >
            {text}
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ThoughtContent({ thought, reactions, relatedThoughts = [] }: ThoughtContentProps) {
  const headings = thought.body ? extractHeadings(thought.body) : [];
  const processedBody = thought.body ? preprocessCallouts(thought.body) : '';

  // Split the processed body to find callout tags and render them as components
  const catStyle = getCategoryStyle(thought.category);

  return (
    <main className="max-w-content mx-auto px-6 relative z-[5]" style={{ paddingTop: 48, paddingBottom: 80 }}>
      {/* Back link */}
      <a
        href="/"
        className="inline-flex items-center gap-1.5 font-pixel text-ocean hover:text-ocean-dark transition-colors duration-150"
        style={{ fontSize: 10, marginBottom: 36 }}
      >
        ← Back
      </a>

      {/* Header */}
      <header style={{ marginBottom: 36 }}>
        <div className="flex items-center gap-3" style={{ marginBottom: 12 }}>
          <span
            className="font-pixel inline-block leading-[1.4]"
            style={{ fontSize: 9, letterSpacing: '0.03em', padding: '3px 8px', borderRadius: 3, ...catStyle }}
          >
            {thought.category}
          </span>
        </div>
        <h1
          className="font-serif font-semibold"
          style={{ fontSize: 32, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#1E1C19' }}
        >
          {thought.title}
        </h1>
        {thought.excerpt && (
          <p style={{ fontSize: 16, color: '#4A4540', lineHeight: 1.85, marginTop: 14 }}>
            {thought.excerpt}
          </p>
        )}
      </header>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(42,40,36,0.08)', marginBottom: 32 }} />

      {/* Body + TOC */}
      <div className="flex gap-12">
        <article className="flex-1 min-w-0">
          {processedBody ? (
            <MarkdownBody content={processedBody} />
          ) : (
            <p style={{ fontSize: 16, color: '#6B6560', fontStyle: 'italic' }}>
              This thought doesn&apos;t have a body yet.
            </p>
          )}

          {/* Reactions */}
          <div style={{ marginTop: 48, borderTop: '1px solid rgba(42,40,36,0.08)', paddingTop: 24 }}>
            <p className="font-pixel" style={{ fontSize: 10, color: '#6B6560', marginBottom: 4 }}>
              What did you think?
            </p>
            <Reactions targetType="thought" targetId={thought.id} initialReactions={reactions} />
          </div>

          <ShareBlock thought={thought} />
          <ReadMore thoughts={relatedThoughts} />
        </article>

        {headings.length > 0 && <TableOfContents headings={headings} />}
      </div>
    </main>
  );
}

function MarkdownBody({ content }: { content: string }) {
  // Split content by callout tags for rendering
  const parts: { type: 'md' | 'callout'; calloutType?: string; text: string }[] = [];
  let remaining = content;

  while (remaining.length > 0) {
    const match = remaining.match(/<callout-(tip|note|warning)>([\s\S]*?)<\/callout-\1>/);
    if (!match || match.index === undefined) {
      parts.push({ type: 'md', text: remaining });
      break;
    }
    if (match.index > 0) {
      parts.push({ type: 'md', text: remaining.slice(0, match.index) });
    }
    parts.push({ type: 'callout', calloutType: match[1], text: match[2] });
    remaining = remaining.slice(match.index + match[0].length);
  }

  return (
    <>
      {parts.map((part, i) => {
        if (part.type === 'callout') {
          return (
            <CalloutBox key={i} type={part.calloutType!}>
              {part.text}
            </CalloutBox>
          );
        }
        return (
          <div key={i} className="prose-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                h1: ({ children }) => (
                  <h1 className="font-serif font-semibold" style={{ fontSize: 28, color: '#1E1C19', marginTop: 40, marginBottom: 16, lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => {
                  const text = String(children);
                  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
                  return (
                    <h2 id={id} className="font-serif font-semibold" style={{ fontSize: '1.4rem', color: '#1E1C19', marginTop: 40, marginBottom: 14, lineHeight: 1.2, letterSpacing: '-0.015em' }}>
                      {children}
                    </h2>
                  );
                },
                h3: ({ children }) => (
                  <h3 className="font-serif font-medium" style={{ fontSize: 18, color: '#1E1C19', marginTop: 32, marginBottom: 12, lineHeight: 1.3 }}>
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="font-serif font-medium" style={{ fontSize: 16, color: '#1E1C19', marginTop: 28, marginBottom: 10 }}>
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p style={{ fontSize: 16, lineHeight: 1.85, color: '#1E1C19', marginBottom: 18 }}>
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <blockquote style={{
                    borderLeft: '3px solid rgba(90,138,154,0.3)',
                    paddingLeft: 16,
                    margin: '20px 0',
                    color: '#4A4540',
                    fontStyle: 'italic',
                  }}>
                    {children}
                  </blockquote>
                ),
                ul: ({ children }) => (
                  <ul style={{ margin: '16px 0', paddingLeft: 20, listStyleType: 'disc' }}>{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol style={{ margin: '16px 0', paddingLeft: 20, listStyleType: 'decimal' }}>{children}</ol>
                ),
                li: ({ children }) => (
                  <li style={{ fontSize: 16, lineHeight: 1.85, color: '#1E1C19', marginBottom: 6 }}>{children}</li>
                ),
                code: ({ className, children, ...props }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return <code className={className} {...props}>{children}</code>;
                  }
                  return (
                    <code style={{
                      background: 'rgba(42,40,36,0.05)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: '0.9em',
                      color: '#5A2A7A',
                      fontFamily: 'monospace',
                    }}>
                      {children}
                    </code>
                  );
                },
                hr: () => <DecorativeHr />,
                table: ({ children }) => (
                  <div style={{ overflowX: 'auto', margin: '24px 0' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>{children}</table>
                  </div>
                ),
                th: ({ children }) => (
                  <th style={{ borderBottom: '2px solid rgba(42,40,36,0.1)', padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#1E1C19' }}>
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td style={{ borderBottom: '1px solid rgba(42,40,36,0.06)', padding: '8px 12px', color: '#4A4540' }}>
                    {children}
                  </td>
                ),
                img: ({ src, alt }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={src}
                    alt={alt || ''}
                    style={{ maxWidth: '100%', borderRadius: 8, margin: '24px 0', border: '1px solid rgba(42,40,36,0.06)' }}
                  />
                ),
                strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
                em: ({ children }) => <em>{children}</em>,
              }}
            >
              {part.text}
            </ReactMarkdown>
          </div>
        );
      })}
    </>
  );
}
