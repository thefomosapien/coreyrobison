'use client';

import { useState } from 'react';
import { REACTION_MAP } from '@/lib/types';

interface ReactionsProps {
  targetType: 'thought' | 'project';
  targetId: string;
  initialReactions: Record<string, number>;
}

export default function Reactions({ targetType, targetId, initialReactions }: ReactionsProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [clicked, setClicked] = useState<Record<string, boolean>>({});

  const toggle = async (key: string) => {
    const wasClicked = clicked[key];
    const delta = wasClicked ? -1 : 1;

    // Optimistic update
    setClicked((prev) => ({ ...prev, [key]: !prev[key] }));
    setReactions((prev) => ({ ...prev, [key]: (prev[key] || 0) + delta }));

    // Persist to API (only increment, not decrement for simplicity)
    if (!wasClicked) {
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
        setClicked((prev) => ({ ...prev, [key]: false }));
        setReactions((prev) => ({ ...prev, [key]: (prev[key] || 0) - 1 }));
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-1.5" style={{ marginTop: 14 }}>
      {Object.entries(REACTION_MAP).map(([key, { emoji, label }]) => (
        <button
          key={key}
          onClick={(e) => {
            e.stopPropagation();
            toggle(key);
          }}
          aria-label={`React: ${label}`}
          title={label}
          className="font-sans transition-all duration-200"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            border: clicked[key] ? '1.5px solid #5A8A9A' : '1.5px solid rgba(42,40,36,0.1)',
            borderRadius: 100,
            background: clicked[key] ? 'rgba(90,138,154,0.08)' : 'transparent',
            cursor: 'pointer',
            fontSize: 13,
            color: clicked[key] ? '#3D6E7A' : '#A09A92',
            fontWeight: clicked[key] ? 500 : 400,
            lineHeight: 1,
          }}
        >
          <span>{emoji}</span>
          {(reactions[key] || 0) > 0 && <span style={{ fontSize: 11 }}>{reactions[key]}</span>}
        </button>
      ))}
    </div>
  );
}
