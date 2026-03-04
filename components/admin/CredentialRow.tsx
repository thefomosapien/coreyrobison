'use client';

import { useState } from 'react';

function maskValue(value: string): string {
  if (value.length <= 16) return '••••••••••••';
  return value.slice(0, 12) + '••••••••' + value.slice(-4);
}

export default function CredentialRow({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!value) {
    return (
      <div className="flex items-center gap-3 py-2">
        <span
          className="font-pixel text-[8px] uppercase tracking-wider text-ink-faint w-[82px] shrink-0"
        >
          {label}
        </span>
        <span className="font-mono text-xs text-ink-ghost">—</span>
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <span
        className="font-pixel text-[8px] uppercase tracking-wider text-ink-faint w-[82px] shrink-0"
      >
        {label}
      </span>
      <button
        onClick={() => setRevealed(!revealed)}
        className="font-mono text-xs text-ink-light hover:text-ink transition-colors text-left truncate flex-1 min-w-0"
      >
        {revealed ? value : maskValue(value)}
      </button>
      <button
        onClick={handleCopy}
        className="font-pixel text-[8px] uppercase tracking-wider px-2 py-1 rounded text-ink-muted hover:text-ocean hover:bg-ocean/5 transition-colors shrink-0"
      >
        {copied ? '\u2713' : 'copy'}
      </button>
    </div>
  );
}
