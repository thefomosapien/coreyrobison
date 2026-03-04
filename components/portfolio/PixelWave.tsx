'use client';

import { useEffect, useRef } from 'react';

const PX = 7;
const COLS = 120;
const ROWS = 12;
const W = COLS * PX;
const H = ROWS * PX;

const OCEAN = '#5A8A9A';
const OCEAN_LIGHT = '#9BB8C4';
const NAVY = '#1E2D3D';

function hexToRgb(hex: string): [number, number, number] {
  const v = parseInt(hex.slice(1), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

const OCEAN_RGB = hexToRgb(OCEAN);
const LIGHT_RGB = hexToRgb(OCEAN_LIGHT);
const NAVY_RGB = hexToRgb(NAVY);

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
      t += 0.03;
      ctx.clearRect(0, 0, W, H);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const wave1 = Math.sin(c * 0.1 + t * 1.5 + r * 0.4);
          const wave2 = Math.sin(c * 0.06 + t * 0.8 - r * 0.3);
          const combined = (wave1 + wave2) / 2;

          const depthFactor = r / ROWS;

          let rgb: [number, number, number];
          if (combined > 0.3) {
            const blend = Math.min((combined - 0.3) / 0.7, 1);
            rgb = [
              Math.round(OCEAN_RGB[0] + (LIGHT_RGB[0] - OCEAN_RGB[0]) * blend),
              Math.round(OCEAN_RGB[1] + (LIGHT_RGB[1] - OCEAN_RGB[1]) * blend),
              Math.round(OCEAN_RGB[2] + (LIGHT_RGB[2] - OCEAN_RGB[2]) * blend),
            ];
          } else if (combined < -0.2) {
            const blend = Math.min((-0.2 - combined) / 0.8, 1) * depthFactor;
            rgb = [
              Math.round(OCEAN_RGB[0] + (NAVY_RGB[0] - OCEAN_RGB[0]) * blend),
              Math.round(OCEAN_RGB[1] + (NAVY_RGB[1] - OCEAN_RGB[1]) * blend),
              Math.round(OCEAN_RGB[2] + (NAVY_RGB[2] - OCEAN_RGB[2]) * blend),
            ];
          } else {
            rgb = [...OCEAN_RGB];
          }

          // Toggle pixels on/off for 8-bit feel
          const toggle = Math.sin(c * 3.7 + r * 5.1 + t * 2) > 0.6 - depthFactor * 0.3;
          if (!toggle && depthFactor > 0.5) continue;

          ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
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
