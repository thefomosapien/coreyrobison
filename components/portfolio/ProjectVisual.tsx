import type { Project } from '@/lib/types';

interface ProjectVisualProps {
  project: Project;
}

function VisRebrand() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1E2D3D 0%, #2A3D50 50%, #1E2D3D 100%)',
        borderRadius: 10,
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="font-serif line-through"
          style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', textDecorationColor: 'rgba(90,138,154,0.5)' }}
        >
          Veterans Advantage
        </div>
        <div style={{ color: '#5A8A9A', fontSize: 14 }}>↓</div>
        <div className="font-serif" style={{ fontSize: 22, color: '#fff', letterSpacing: '-0.02em' }}>
          We<span style={{ color: '#E8C88A' }}>Salute</span>
        </div>
      </div>
    </div>
  );
}

function VisCard() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)', borderRadius: 10 }}
    >
      <div
        style={{
          width: '70%',
          aspectRatio: '1.586/1',
          borderRadius: 8,
          background: 'linear-gradient(135deg, #1E2D3D 0%, #2A3D50 40%, #1E2D3D 100%)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          transform: 'rotate(-3deg)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '50%',
            height: '100%',
            background: 'radial-gradient(ellipse at top right, rgba(90,138,154,0.12), transparent 70%)',
          }}
        />
        <div className="flex justify-between items-start">
          <div className="font-serif" style={{ fontSize: 9, color: '#fff' }}>
            WeSalute<span style={{ color: '#E8C88A', fontWeight: 700, fontSize: 7 }}>+</span>
          </div>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 6,
              color: 'rgba(255,255,255,0.3)',
            }}
          >
            ✓
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Member Name
          </div>
          <div style={{ fontSize: 5, color: 'rgba(255,255,255,0.25)' }}>WS-2024-XXXX</div>
        </div>
      </div>
    </div>
  );
}

function VisMarketplace() {
  const colors = ['#5A8A9A', '#C68C5A', '#6B8A5A', '#8A6B8A', '#9A8A5A', '#5A7A6A'];
  return (
    <div
      className="w-full h-full grid grid-cols-3 gap-1.5 p-4"
      style={{ background: '#F0EDE6', borderRadius: 10 }}
    >
      {colors.map((c, i) => (
        <div
          key={i}
          className="flex flex-col gap-1.5"
          style={{
            background: '#fff',
            borderRadius: 6,
            padding: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ width: 20, height: 20, borderRadius: 4, background: c }} />
          <div style={{ height: 4, borderRadius: 2, background: '#EDE8E0', width: '75%' }} />
          <div style={{ height: 4, borderRadius: 2, background: '#EDE8E0', width: '55%' }} />
          {i % 2 === 0 && (
            <div
              className="font-pixel"
              style={{
                fontSize: 5,
                color: '#5A8A9A',
                background: 'rgba(90,138,154,0.08)',
                padding: '1px 4px',
                borderRadius: 2,
                width: 'fit-content',
              }}
            >
              WeSalute+
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function VisBrandSystem() {
  const swatches = [
    { bg: '#1E2D3D', label: 'Navy', dark: false },
    { bg: '#C68C5A', label: 'Sand', dark: false },
    { bg: '#F5F0E8', label: 'Cream', dark: true },
    { bg: '#3D6E5C', label: 'Tide', dark: false },
  ];
  return (
    <div
      className="w-full h-full grid grid-cols-2 gap-2.5 p-5"
      style={{
        background: '#fff',
        border: '1px solid rgba(42,40,36,0.06)',
        borderRadius: 10,
        alignContent: 'center',
      }}
    >
      {swatches.map((s, i) => (
        <div
          key={i}
          className="flex items-end"
          style={{
            borderRadius: 6,
            aspectRatio: '1.6',
            background: s.bg,
            padding: '6px 8px',
            fontSize: 6,
            fontWeight: 500,
            letterSpacing: '0.03em',
            color: s.dark ? '#8A857D' : 'rgba(255,255,255,0.5)',
            border: s.dark ? '1px solid rgba(0,0,0,0.06)' : 'none',
          }}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}

function VisHistoria() {
  const dots = Array.from({ length: 100 }, (_, i) =>
    i < 40 ? (i === 18 || i === 32 || i === 39 ? 'highlight' : 'lived') : ''
  );
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2"
      style={{ background: 'linear-gradient(135deg, #0f1a20 0%, #1a2830 100%)', borderRadius: 10 }}
    >
      <div className="font-serif" style={{ fontSize: 16, color: '#fff' }}>Historia</div>
      <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>
        Your life, week by week
      </div>
      <div className="flex flex-wrap gap-[2px]" style={{ maxWidth: 120, marginTop: 4 }}>
        {dots.map((cls, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: 4,
              borderRadius: 1,
              background:
                cls === 'highlight'
                  ? '#5A8A9A'
                  : cls === 'lived'
                  ? 'rgba(90,138,154,0.4)'
                  : 'rgba(255,255,255,0.06)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function VisDuhbate() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-2.5"
      style={{
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #FEF3C7 100%)',
        borderRadius: 10,
      }}
    >
      <div className="font-serif" style={{ fontSize: 18, color: '#2A2520' }}>Duhbate</div>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center"
          style={{
            width: 56,
            height: 34,
            borderRadius: 6,
            background: '#3D6E5C',
            color: '#fff',
            fontSize: 7,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          For
        </div>
        <div className="font-serif italic" style={{ fontSize: 10, color: '#8A857D' }}>vs</div>
        <div
          className="flex items-center justify-center"
          style={{
            width: 56,
            height: 34,
            borderRadius: 6,
            background: '#C68C5A',
            color: '#fff',
            fontSize: 7,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Against
        </div>
      </div>
      <div style={{ width: 120, height: 6, borderRadius: 3, background: '#C68C5A', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '62%', background: '#3D6E5C', borderRadius: 3 }} />
      </div>
    </div>
  );
}

function CustomVisual({ project }: { project: Project }) {
  if (project.thumbnail_url) {
    return (
      <div className="w-full h-full overflow-hidden" style={{ borderRadius: 10 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: project.visual_bg_color || '#F0EDE6', borderRadius: 10 }}
    >
      <div className="font-serif text-ink-muted" style={{ fontSize: 18 }}>{project.name}</div>
    </div>
  );
}

export default function ProjectVisual({ project }: ProjectVisualProps) {
  const map: Record<string, JSX.Element> = {
    rebrand: <VisRebrand />,
    card: <VisCard />,
    marketplace: <VisMarketplace />,
    'brand-system': <VisBrandSystem />,
    historia: <VisHistoria />,
    duhbate: <VisDuhbate />,
    custom: <CustomVisual project={project} />,
  };
  return map[project.visual_type] || <CustomVisual project={project} />;
}
