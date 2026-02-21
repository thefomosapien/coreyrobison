interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: 'accent' | 'muted' | 'warm' | 'count';
}

const styles: Record<string, { background: string; color: string }> = {
  accent: { background: 'rgba(90,138,154,0.1)', color: '#3D6E7A' },
  muted: { background: 'rgba(42,40,36,0.05)', color: '#8A857D' },
  warm: { background: 'rgba(198,156,109,0.12)', color: '#9B7A52' },
  count: { background: 'rgba(90,138,154,0.08)', color: '#5A8A9A' },
};

export default function PixelBadge({ children, variant = 'muted' }: PixelBadgeProps) {
  const s = styles[variant] || styles.muted;
  return (
    <span
      className="font-pixel inline-block leading-[1.4]"
      style={{
        fontSize: 9,
        letterSpacing: '0.03em',
        padding: '3px 8px',
        borderRadius: 3,
        ...s,
      }}
    >
      {children}
    </span>
  );
}
