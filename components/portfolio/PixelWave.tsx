'use client';

import { useEffect, useRef } from 'react';

const PX = 6;
const COLS = 140;
const ROWS = 16;
const W = COLS * PX;
const H = ROWS * PX;

// 8-bit ocean palette — distinct color bands
const COLORS = {
  foam:       '#E8F4F8',
  highlight:  '#9BB8C4',
  surface:    '#6EA3B2',
  mid:        '#5A8A9A',
  deep:       '#3D6E7A',
  abyss:      '#2A5260',
};

export default function PixelWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let animId: number;
    let t = 0;

    function render() {
      if (!ctx) return;
      t += 0.02;
      ctx.clearRect(0, 0, W, H);

      // Calculate wave surface heights per column (two overlapping sine waves)
      const surface: number[] = [];
      for (let c = 0; c < COLS; c++) {
        const w1 = Math.sin(c * 0.06 + t * 1.2) * 1.8;
        const w2 = Math.sin(c * 0.10 + t * 0.7 + 2.0) * 1.0;
        const w3 = Math.sin(c * 0.03 + t * 0.4) * 0.8;
        surface[c] = 2 + w1 + w2 + w3; // baseline around row 2-3
      }

      for (let c = 0; c < COLS; c++) {
        const surfRow = Math.round(surface[c]);

        for (let r = 0; r < ROWS; r++) {
          let color: string;

          if (r < surfRow - 1) {
            // Above the wave — empty (transparent)
            continue;
          } else if (r === surfRow - 1 || r === surfRow) {
            // Wave crest — foam / highlight
            // Animated foam: some columns get bright foam caps
            const foamChance = Math.sin(c * 0.15 + t * 1.8 + r * 0.5);
            if (r === surfRow - 1) {
              // Top edge: sporadic foam pixels
              if (foamChance > 0.3) {
                color = COLORS.foam;
              } else {
                continue; // skip for gappy foam look
              }
            } else {
              // Surface row
              color = foamChance > 0.5 ? COLORS.foam : COLORS.highlight;
            }
          } else if (r <= surfRow + 2) {
            // Just below surface — lighter water with shimmer
            const shimmer = Math.sin(c * 0.2 + t * 2.5 + r * 1.1);
            color = shimmer > 0.3 ? COLORS.highlight : COLORS.surface;
          } else if (r <= surfRow + 5) {
            // Mid water
            const shimmer = Math.sin(c * 0.12 + t * 1.5 - r * 0.8);
            color = shimmer > 0.5 ? COLORS.surface : COLORS.mid;
          } else if (r <= surfRow + 8) {
            // Deeper water
            const shimmer = Math.sin(c * 0.08 + t * 0.9 + r * 0.6);
            color = shimmer > 0.6 ? COLORS.mid : COLORS.deep;
          } else {
            // Deepest
            const shimmer = Math.sin(c * 0.06 + t * 0.5 - r * 0.4);
            color = shimmer > 0.7 ? COLORS.deep : COLORS.abyss;
          }

          ctx.fillStyle = color;
          ctx.fillRect(c * PX, r * PX, PX, PX);
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{ width: '100%', margin: '0 auto', opacity: 0.5 }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: '100%',
          height: 80,
          imageRendering: 'pixelated',
          display: 'block',
        }}
      />
    </div>
  );
}
