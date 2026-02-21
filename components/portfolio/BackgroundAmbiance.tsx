export default function BackgroundAmbiance() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Warm sky gradient at top */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{
          height: '35vh',
          background: 'linear-gradient(180deg, rgba(173,210,224,0.07) 0%, rgba(232,200,138,0.04) 40%, transparent 100%)',
        }}
      />
      {/* Very faint wave lines mid-page */}
      <svg
        className="absolute left-[-5%] w-[110%]"
        style={{ top: '45%', opacity: 0.02 }}
        viewBox="0 0 1400 60"
        preserveAspectRatio="none"
      >
        <path
          d="M0 30 Q70 10 140 30 Q210 50 280 30 Q350 10 420 30 Q490 50 560 30 Q630 10 700 30 Q770 50 840 30 Q910 10 980 30 Q1050 50 1120 30 Q1190 10 1260 30 Q1330 50 1400 30"
          fill="none"
          stroke="#5A8A9A"
          strokeWidth="2"
          style={{ animation: 'gentleWave 8s ease-in-out infinite' }}
        />
        <path
          d="M0 45 Q70 25 140 45 Q210 65 280 45 Q350 25 420 45 Q490 65 560 45 Q630 25 700 45 Q770 65 840 45 Q910 25 980 45 Q1050 65 1120 45 Q1190 25 1260 45 Q1330 65 1400 45"
          fill="none"
          stroke="#5A8A9A"
          strokeWidth="1.5"
          style={{ animation: 'gentleWave 10s ease-in-out infinite reverse' }}
        />
      </svg>
      {/* Warm glow at bottom like sand */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '25vh',
          background: 'linear-gradient(0deg, rgba(210,190,160,0.06) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
