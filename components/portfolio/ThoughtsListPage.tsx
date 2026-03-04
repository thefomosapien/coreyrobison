import type { Thought } from '@/lib/types';
import { getCategoryStyle } from '@/lib/categoryStyles';

interface ThoughtsListPageProps {
  thoughts: Thought[];
}

export default function ThoughtsListPage({ thoughts }: ThoughtsListPageProps) {
  return (
    <div className="flex flex-col">
      {thoughts.map((t, i) => {
        const catStyle = getCategoryStyle(t.category);
        return (
          <a
            key={t.slug}
            href={`/thoughts/${t.slug}`}
            className="flex items-center gap-3 group"
            style={{
              padding: '16px 0',
              borderBottom: i < thoughts.length - 1 ? '1px solid rgba(42,40,36,0.06)' : 'none',
              textDecoration: 'none',
            }}
          >
            <h2
              className="font-serif text-[17px] font-normal leading-[1.3] group-hover:text-ocean transition-colors duration-150"
              style={{ color: '#2A2824' }}
            >
              {t.title}
            </h2>
            <span
              className="font-pixel inline-block leading-[1.4] flex-shrink-0"
              style={{
                fontSize: 9,
                letterSpacing: '0.03em',
                padding: '3px 8px',
                borderRadius: 3,
                ...catStyle,
              }}
            >
              {t.category}
            </span>
          </a>
        );
      })}
      {thoughts.length === 0 && (
        <p style={{ fontSize: 16, color: '#7A7570', fontStyle: 'italic' }}>
          No thoughts published yet.
        </p>
      )}
    </div>
  );
}
