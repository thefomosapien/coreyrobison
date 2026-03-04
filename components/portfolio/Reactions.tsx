'use client';

import { useState, useRef } from 'react';
import { REACTION_MAP } from '@/lib/types';

interface ReactionsProps {
  targetType: 'thought' | 'project';
  targetId: string;
  initialReactions: Record<string, number>;
}

export default function Reactions({ targetType, targetId, initialReactions }: ReactionsProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [pulsing, setPulsing] = useState<Record<string, boolean>>({});
  const timeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const increment = async (key: string) => {
    // Optimistic update — always increment
    setReactions((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));

    // Brief pulse animation
    setPulsing((prev) => ({ ...prev, [key]: true }));
    if (timeoutRefs.current[key]) clearTimeout(timeoutRefs.current[key]);
    timeoutRefs.current[key] = setTimeout(() => {
      setPulsing((prev) => ({ ...prev, [key]: false }));
    }, 150);

    // Persist to API
    try {
      await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          reaction_type: key,
        }),
      });
    } catch {
      // Revert on failure
      setReactions((prev) => ({ ...prev, [key]: Math.max((prev[key] || 0) - 1, 0) }));
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5" style={{ marginTop: 14 }}>
      {Object.entries(REACTION_MAP).map(([key, { emoji, label }]) => {
        const count = reactions[key] || 0;
        const hasCount = count > 0;
        return (
          <button
            key={key}
            onClick={(e) => {
              e.stopPropagation();
              increment(key);
            }}
            aria-label={`React: ${label}`}
            title={label}
            className="font-sans transition-all duration-200"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 10px',
              border: hasCount ? '1.5px solid #5A8A9A' : '1.5px solid rgba(42,40,36,0.1)',
              borderRadius: 100,
              background: hasCount ? 'rgba(90,138,154,0.08)' : 'transparent',
              cursor: 'pointer',
              fontSize: 13,
              color: hasCount ? '#3D6E7A' : '#7A7570',
              fontWeight: hasCount ? 500 : 400,
              lineHeight: 1,
              transform: pulsing[key] ? 'scale(1.12)' : 'scale(1)',
            }}
          >
            <span>{emoji}</span>
            {hasCount && <span style={{ fontSize: 11 }}>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
