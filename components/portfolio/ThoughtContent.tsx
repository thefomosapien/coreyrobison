'use client';

import type { Thought } from '@/lib/types';
import PixelBadge from './PixelBadge';
import Reactions from './Reactions';

interface ThoughtContentProps {
  thought: Thought;
  reactions: Record<string, number>;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function renderBody(body: string) {
  // Split into paragraphs and render with basic markdown-like support
  const paragraphs = body.split(/\n\n+/);
  return paragraphs.map((p, i) => {
    const trimmed = p.trim();
    if (!trimmed) return null;

    // Heading (## or ###)
    if (trimmed.startsWith('### ')) {
      return (
        <h3
          key={i}
          className="font-serif text-[18px] font-normal"
          style={{ color: '#2A2824', marginTop: 32, marginBottom: 12 }}
        >
          {trimmed.slice(4)}
        </h3>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2
          key={i}
          className="font-serif text-[20px] font-normal"
          style={{ color: '#2A2824', marginTop: 36, marginBottom: 14 }}
        >
          {trimmed.slice(3)}
        </h2>
      );
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      return (
        <blockquote
          key={i}
          style={{
            borderLeft: '3px solid rgba(90,138,154,0.3)',
            paddingLeft: 16,
            margin: '20px 0',
            color: '#6B6660',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {trimmed.slice(2)}
        </blockquote>
      );
    }

    // Unordered list
    if (trimmed.match(/^[-*] /m)) {
      const items = trimmed.split(/\n/).filter(l => l.match(/^[-*] /));
      return (
        <ul key={i} style={{ margin: '16px 0', paddingLeft: 20 }}>
          {items.map((item, j) => (
            <li
              key={j}
              style={{ fontSize: 15, lineHeight: 1.75, color: '#2A2824', marginBottom: 6 }}
            >
              {renderInlineText(item.replace(/^[-*] /, ''))}
            </li>
          ))}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <p key={i} style={{ fontSize: 15, lineHeight: 1.75, color: '#2A2824', marginBottom: 18 }}>
        {renderInlineText(trimmed)}
      </p>
    );
  });
}

function renderInlineText(text: string) {
  // Handle bold (**text**) and italic (*text*)
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Italic
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

    const firstMatch = [boldMatch, italicMatch]
      .filter(Boolean)
      .sort((a, b) => (a!.index || 0) - (b!.index || 0))[0];

    if (!firstMatch || firstMatch.index === undefined) {
      parts.push(remaining);
      break;
    }

    if (firstMatch.index > 0) {
      parts.push(remaining.slice(0, firstMatch.index));
    }

    if (firstMatch === boldMatch) {
      parts.push(<strong key={keyIdx++}>{firstMatch[1]}</strong>);
    } else {
      parts.push(<em key={keyIdx++}>{firstMatch[1]}</em>);
    }

    remaining = remaining.slice(firstMatch.index + firstMatch[0].length);
  }

  return parts;
}

export default function ThoughtContent({ thought, reactions }: ThoughtContentProps) {
  return (
    <main className="max-w-[680px] mx-auto px-6 relative z-[5]" style={{ paddingTop: 48, paddingBottom: 80 }}>
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
          <PixelBadge variant="muted">{thought.category}</PixelBadge>
          <span className="font-pixel" style={{ fontSize: 9, color: '#A09A92' }}>
            {formatDate(thought.created_at)}
          </span>
        </div>
        <h1
          className="font-serif font-normal"
          style={{ fontSize: 32, lineHeight: 1.2, color: '#2A2824' }}
        >
          {thought.title}
        </h1>
        {thought.excerpt && (
          <p style={{ fontSize: 15, color: '#6B6660', lineHeight: 1.6, marginTop: 14 }}>
            {thought.excerpt}
          </p>
        )}
      </header>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(42,40,36,0.08)', marginBottom: 32 }} />

      {/* Body */}
      {thought.body ? (
        <article>{renderBody(thought.body)}</article>
      ) : (
        <p style={{ fontSize: 15, color: '#A09A92', fontStyle: 'italic' }}>
          This thought doesn&apos;t have a body yet.
        </p>
      )}

      {/* Reactions */}
      <div style={{ marginTop: 48, borderTop: '1px solid rgba(42,40,36,0.08)', paddingTop: 24 }}>
        <p className="font-pixel" style={{ fontSize: 10, color: '#A09A92', marginBottom: 4 }}>
          What did you think?
        </p>
        <Reactions targetType="thought" targetId={thought.id} initialReactions={reactions} />
      </div>
    </main>
  );
}
