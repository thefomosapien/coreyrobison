const CATEGORY_COLORS: Record<string, { background: string; color: string }> = {
  AI: { background: 'rgba(90,138,154,0.15)', color: '#2A6070' },
  'Design Systems': { background: 'rgba(61,110,92,0.12)', color: '#2A5A3E' },
  Leadership: { background: 'rgba(198,140,90,0.15)', color: '#7A5A2A' },
  Career: { background: 'rgba(176,90,70,0.12)', color: '#8A3A20' },
  Product: { background: 'rgba(130,90,154,0.12)', color: '#5A2A7A' },
  Life: { background: 'rgba(180,100,110,0.12)', color: '#8A2A3A' },
  Observations: { background: 'rgba(90,100,154,0.1)', color: '#3A3A7A' },
};

const FALLBACK = { background: 'rgba(42,40,36,0.05)', color: '#8A857D' };

export function getCategoryStyle(category: string): { background: string; color: string } {
  return CATEGORY_COLORS[category] || FALLBACK;
}
