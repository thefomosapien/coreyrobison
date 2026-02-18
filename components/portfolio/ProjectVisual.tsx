import type { Project } from '@/lib/types';

interface ProjectVisualProps {
  project: Project;
}

function RebrandVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1B2838 0%, #2C3E50 50%, #1B2838 100%)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="font-serif text-xl text-white/30 line-through"
          style={{ textDecorationColor: 'rgba(200,85,61,0.5)' }}>
          Veterans Advantage
        </div>
        <div className="text-accent text-2xl">↓</div>
        <div className="font-serif text-4xl text-white tracking-tight">
          We<span className="text-accent-soft">Salute</span>
        </div>
      </div>
    </div>
  );
}

function CardVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)' }}>
      <div
        className="w-3/4 rounded-xl p-6 flex flex-col justify-between relative overflow-hidden transition-transform duration-500 hover:-rotate-1"
        style={{
          aspectRatio: '1.586/1',
          background: 'linear-gradient(135deg, #1B2838 0%, #2A3B4E 40%, #1B2838 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)',
          transform: 'rotate(-3deg)',
        }}
      >
        <div className="absolute top-0 right-0 w-[60%] h-full"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(200,85,61,0.15), transparent 70%)' }} />
        <div className="flex justify-between items-start relative z-10">
          <div className="font-serif text-sm text-white tracking-wide">
            WeSalute<span className="text-accent-soft font-bold text-xs">+</span>
          </div>
          <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[0.55rem] text-white/40">
            ✓
          </div>
        </div>
        <div className="flex justify-between items-end relative z-10">
          <div className="text-[0.65rem] text-white/70 tracking-widest uppercase">Member Name</div>
          <div className="text-[0.55rem] text-white/30 tabular-nums">WS-2024-XXXX</div>
        </div>
      </div>
    </div>
  );
}

function MarketplaceVisual() {
  const tiles = [
    { color: '#2563EB', hasTag: true },
    { color: '#DC2626', hasTag: false },
    { color: '#059669', hasTag: true },
    { color: '#7C3AED', hasTag: false },
    { color: '#D97706', hasTag: true },
    { color: '#EC4899', hasTag: false },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-bg-alt">
      <div className="grid grid-cols-3 gap-2 p-8 w-full max-sm:grid-cols-2">
        {tiles.map((tile, i) => (
          <div key={i} className="bg-white rounded-lg p-4 flex flex-col gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="w-7 h-7 rounded-md" style={{ background: tile.color }} />
            <div className="h-1.5 rounded-full bg-bg-alt" style={{ width: i % 2 === 0 ? '80%' : '60%' }} />
            <div className="h-1.5 rounded-full bg-bg-alt" style={{ width: i % 2 === 0 ? '60%' : '80%' }} />
            {tile.hasTag && (
              <div className="text-[0.5rem] font-semibold tracking-wider uppercase text-accent bg-accent/[0.08] px-1.5 py-0.5 rounded w-fit">
                WeSalute+
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandSystemVisual() {
  const swatches = [
    { bg: '#1B2838', label: 'Navy / #1B2838', textColor: 'rgba(255,255,255,0.6)' },
    { bg: '#C8553D', label: 'Terracotta / #C8553D', textColor: 'rgba(255,255,255,0.7)' },
    { bg: '#F6F3EE', label: 'Cream / #F6F3EE', textColor: '#9B9590', border: true },
    { bg: '#2A5F3C', label: 'Service Green / #2A5F3C', textColor: 'rgba(255,255,255,0.6)' },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden bg-white"
      style={{ border: '1px solid rgba(26, 24, 20, 0.06)' }}>
      <div className="grid grid-cols-2 gap-4 w-[85%]">
        {swatches.map((swatch, i) => (
          <div
            key={i}
            className="rounded-lg flex items-end p-3 text-[0.6rem] font-medium tracking-wider"
            style={{
              background: swatch.bg,
              color: swatch.textColor,
              aspectRatio: '1.6',
              border: swatch.border ? '1px solid rgba(0,0,0,0.06)' : undefined,
            }}
          >
            {swatch.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoriaVisual() {
  const dots = Array.from({ length: 120 }, (_, i) => {
    if (i === 22 || i === 38 || i === 44) return 'highlight';
    if (i < 45) return 'lived';
    return 'empty';
  });

  return (
    <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
      <div className="w-[80%] flex flex-col gap-2">
        <div className="font-serif text-2xl text-white mb-1">Historia</div>
        <div className="text-xs text-white/40 mb-3">Your life, week by week</div>
        <div className="flex flex-wrap gap-[2px]">
          {dots.map((type, i) => (
            <div
              key={i}
              className="w-[5px] h-[5px] rounded-[1px]"
              style={{
                background:
                  type === 'highlight'
                    ? '#C8553D'
                    : type === 'lived'
                    ? 'rgba(200,85,61,0.5)'
                    : 'rgba(255,255,255,0.08)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DuhbateVisual() {
  return (
    <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="font-serif text-3xl text-ink tracking-tight">Duhbate</div>
        <div className="flex items-center gap-6">
          <div className="w-20 h-12 rounded-lg bg-[#059669] flex items-center justify-center text-[0.65rem] font-semibold tracking-wider uppercase text-white">
            For
          </div>
          <div className="font-serif text-sm text-ink-muted italic">vs</div>
          <div className="w-20 h-12 rounded-lg bg-[#DC2626] flex items-center justify-center text-[0.65rem] font-semibold tracking-wider uppercase text-white">
            Against
          </div>
        </div>
        <div className="w-[180px] h-2 rounded-full bg-[#DC2626] relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-[62%] bg-[#059669] rounded-full" />
        </div>
      </div>
    </div>
  );
}

function CustomVisual({ project }: { project: Project }) {
  if (project.thumbnail_url) {
    return (
      <div className="w-full h-full rounded-xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.thumbnail_url}
          alt={project.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden"
      style={{ background: project.visual_bg_color || '#EDE9E1' }}
    >
      <div className="font-serif text-2xl text-ink-muted">{project.name}</div>
    </div>
  );
}

export default function ProjectVisual({ project }: ProjectVisualProps) {
  const visualMap: Record<string, JSX.Element> = {
    rebrand: <RebrandVisual />,
    card: <CardVisual />,
    marketplace: <MarketplaceVisual />,
    'brand-system': <BrandSystemVisual />,
    historia: <HistoriaVisual />,
    duhbate: <DuhbateVisual />,
    custom: <CustomVisual project={project} />,
  };

  return visualMap[project.visual_type] || <CustomVisual project={project} />;
}
