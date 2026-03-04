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
      className="inline-flex items-center gap-1.5 font-pixel transition-all duration-200"
      style={{
        fontSize: 10,
        padding: '6px 14px',
        borderRadius: 100,
        background: 'linear-gradient(135deg, rgba(90,138,154,0.25) 0%, rgba(198,140,90,0.2) 50%, rgba(61,110,92,0.2) 100%)',
        color: '#2A6070',
        border: '1px solid rgba(90,138,154,0.3)',
        letterSpacing: '0.02em',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(90,138,154,0.35) 0%, rgba(198,140,90,0.28) 50%, rgba(61,110,92,0.28) 100%)';
        e.currentTarget.style.borderColor = 'rgba(90,138,154,0.45)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(90,138,154,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(90,138,154,0.25) 0%, rgba(198,140,90,0.2) 50%, rgba(61,110,92,0.2) 100%)';
        e.currentTarget.style.borderColor = 'rgba(90,138,154,0.3)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {text} ↗
    </a>
  );
}
