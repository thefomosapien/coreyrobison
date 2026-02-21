'use client';

import { useEffect, useRef } from 'react';

const PIXEL = 4;
const COLS = 120;
const ROWS = 32;
const W = COLS * PIXEL;
const H = ROWS * PIXEL;

// palette – matches the site's ocean/sand tones
const SKY = '#DAE8ED';
const OCEAN_DEEP = '#3D6E7A';
const OCEAN = '#5A8A9A';
const OCEAN_LIGHT = '#7BA3B0';
const FOAM = '#D6E6EB';
const WHITE = '#F0F6F8';
const SAND = '#C6A882';
const SAND_DARK = '#B09468';
const SAND_WET = '#9BB8C4';

function drawPixel(ctx: CanvasRenderingContext2D, col: number, row: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(col * PIXEL, row * PIXEL, PIXEL, PIXEL);
}

export default function BeachIllustration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

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
      t += 0.025;

      ctx.clearRect(0, 0, W, H);

      // -- sky gradient (rows 0-9)
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < COLS; c++) {
          drawPixel(ctx, c, r, SKY);
        }
      }

      // -- ocean body (rows 10-22)
      for (let r = 10; r < 23; r++) {
        for (let c = 0; c < COLS; c++) {
          const depthRatio = (r - 10) / 12;
          // subtle horizontal wave shimmer
          const shimmer = Math.sin(c * 0.15 + t * 2 + r * 0.3) * 0.5 + 0.5;
          let color: string;
          if (depthRatio < 0.3) {
            color = shimmer > 0.6 ? OCEAN_LIGHT : OCEAN;
          } else if (depthRatio < 0.7) {
            color = shimmer > 0.7 ? OCEAN : OCEAN_DEEP;
          } else {
            color = shimmer > 0.8 ? OCEAN : OCEAN_DEEP;
          }
          drawPixel(ctx, c, r, color);
        }
      }

      // -- rolling wave surface at row ~10 with animated bobbing
      for (let c = 0; c < COLS; c++) {
        const waveY = Math.sin(c * 0.08 + t * 1.5) * 1.2
                     + Math.sin(c * 0.04 + t * 0.8) * 0.8;
        const rowOffset = Math.round(waveY);
        const baseRow = 10;

        if (rowOffset < 0) {
          // wave dips – show sky
          for (let dr = rowOffset; dr < 0; dr++) {
            drawPixel(ctx, c, baseRow + dr, SKY);
          }
          drawPixel(ctx, c, baseRow + rowOffset, OCEAN_LIGHT);
        } else {
          // wave crests – extend ocean upward
          for (let dr = 0; dr <= rowOffset; dr++) {
            drawPixel(ctx, c, baseRow - dr, OCEAN_LIGHT);
          }
        }
      }

      // -- main crashing wave
      const waveCycle = t % (Math.PI * 4); // full cycle
      const phase = waveCycle / (Math.PI * 4); // 0 to 1

      // wave position: moves from right to center-left
      const waveX = Math.floor(COLS * 0.8 - phase * COLS * 0.5);

      // wave height: builds up, peaks, crashes
      let waveHeight: number;
      let curlAmount: number;
      let crashed: boolean;

      if (phase < 0.35) {
        // building
        waveHeight = Math.floor(phase / 0.35 * 10);
        curlAmount = 0;
        crashed = false;
      } else if (phase < 0.55) {
        // curling
        const curlPhase = (phase - 0.35) / 0.2;
        waveHeight = 10 + Math.floor(curlPhase * 3);
        curlAmount = curlPhase;
        crashed = false;
      } else if (phase < 0.75) {
        // crashing
        const crashPhase = (phase - 0.55) / 0.2;
        waveHeight = Math.floor(13 - crashPhase * 8);
        curlAmount = 1 - crashPhase * 0.5;
        crashed = true;
      } else {
        // dissipating foam
        const foamPhase = (phase - 0.75) / 0.25;
        waveHeight = Math.floor(5 - foamPhase * 5);
        curlAmount = 0;
        crashed = true;
      }

      // draw the main wave body
      const waveBaseRow = 22;
      const waveWidth = 18 + Math.floor(phase * 8);

      for (let dc = -waveWidth; dc <= waveWidth; dc++) {
        const col = waveX + dc;
        if (col < 0 || col >= COLS) continue;

        // parabolic wave shape
        const distFromCenter = Math.abs(dc) / waveWidth;
        const colHeight = Math.floor(waveHeight * (1 - distFromCenter * distFromCenter));

        if (colHeight <= 0) continue;

        for (let dr = 0; dr < colHeight; dr++) {
          const row = waveBaseRow - dr;
          if (row < 0 || row >= ROWS) continue;

          const heightRatio = dr / Math.max(colHeight, 1);
          let color: string;

          if (heightRatio > 0.85) {
            color = crashed ? WHITE : FOAM;
          } else if (heightRatio > 0.6) {
            color = OCEAN_LIGHT;
          } else {
            color = OCEAN;
          }
          drawPixel(ctx, col, row, color);
        }
      }

      // draw the wave curl
      if (curlAmount > 0 && waveHeight > 4) {
        const curlLen = Math.floor(curlAmount * 8);
        const curlTop = waveBaseRow - waveHeight;

        for (let i = 0; i < curlLen; i++) {
          const cx = waveX - Math.floor(waveWidth * 0.3) + i * 2;
          const cy = curlTop + Math.floor(i * i * 0.2);
          if (cx >= 0 && cx < COLS && cy >= 0 && cy < ROWS) {
            drawPixel(ctx, cx, cy, WHITE);
            if (cx + 1 < COLS) drawPixel(ctx, cx + 1, cy, FOAM);
            if (cy + 1 < ROWS) drawPixel(ctx, cx, cy + 1, OCEAN_LIGHT);
          }
        }
      }

      // spray particles when crashing
      if (crashed && phase < 0.85) {
        const sprayCount = 8;
        const sprayPhase = phase < 0.75 ? (phase - 0.55) / 0.2 : 1;
        for (let i = 0; i < sprayCount; i++) {
          const seed = i * 137.5 + t * 0.1;
          const angle = (Math.sin(seed) * 0.8 - 0.5) * Math.PI;
          const dist = sprayPhase * (8 + (i % 4) * 3);
          const sx = waveX + Math.floor(Math.cos(angle) * dist);
          const sy = waveBaseRow - waveHeight + Math.floor(Math.sin(angle) * dist * 0.5) - 2;
          if (sx >= 0 && sx < COLS && sy >= 0 && sy < ROWS) {
            drawPixel(ctx, sx, sy, i % 2 === 0 ? WHITE : FOAM);
          }
        }
      }

      // -- shoreline foam (row 23-24)
      for (let c = 0; c < COLS; c++) {
        const foamWave = Math.sin(c * 0.12 + t * 1.2) * 0.5
                       + Math.sin(c * 0.06 + t * 0.6 + 1) * 0.5;
        if (foamWave > 0.2) {
          drawPixel(ctx, c, 23, FOAM);
        } else {
          drawPixel(ctx, c, 23, SAND_WET);
        }
        // wet sand transition
        const wetSand = Math.sin(c * 0.1 + t * 0.4) > 0;
        drawPixel(ctx, c, 24, wetSand ? SAND_WET : SAND);
      }

      // -- sand (rows 25-31)
      for (let r = 25; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          // occasional darker sand grains for texture
          const grain = Math.sin(c * 7.3 + r * 13.1) > 0.85;
          drawPixel(ctx, c, r, grain ? SAND_DARK : SAND);
        }
      }

      // -- receding water wash on sand (animated)
      const washPhase = (Math.sin(t * 0.6) + 1) / 2; // 0 to 1 oscillation
      const washReach = Math.floor(25 + washPhase * 3);
      for (let r = 25; r <= Math.min(washReach, ROWS - 1); r++) {
        const washStrength = 1 - (r - 25) / 3;
        if (washStrength <= 0) continue;
        for (let c = 0; c < COLS; c++) {
          const noise = Math.sin(c * 0.2 + t + r * 0.5);
          if (noise > 1 - washStrength) {
            drawPixel(ctx, c, r, SAND_WET);
          }
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    frameRef.current = animId;

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', opacity: 0.55 }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{
          width: '100%',
          height: 'auto',
          imageRendering: 'pixelated',
          display: 'block',
        }}
      />
    </div>
  );
}
