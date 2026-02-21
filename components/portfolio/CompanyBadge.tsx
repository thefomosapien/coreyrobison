'use client';

interface CompanyBadgeProps {
  text: string;
  url: string;
}

export default function CompanyBadge({ text, url }: CompanyBadgeProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 font-pixel transition-all duration-200 hover:opacity-90"
      style={{
        fontSize: 10,
        padding: '6px 14px',
        borderRadius: 100,
        background: 'linear-gradient(135deg, rgba(90,138,154,0.12) 0%, rgba(198,140,90,0.1) 100%)',
        color: '#3D6E7A',
        border: '1px solid rgba(90,138,154,0.1)',
        letterSpacing: '0.02em',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(90,138,154,0.18) 0%, rgba(198,140,90,0.15) 100%)';
        e.currentTarget.style.borderColor = 'rgba(90,138,154,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(90,138,154,0.12) 0%, rgba(198,140,90,0.1) 100%)';
        e.currentTarget.style.borderColor = 'rgba(90,138,154,0.1)';
      }}
    >
      {text} ↗
    </a>
  );
}
