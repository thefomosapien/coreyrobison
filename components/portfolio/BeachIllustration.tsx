export default function BeachIllustration() {
  return (
    <svg
      viewBox="0 0 800 130"
      style={{ width: '100%', maxWidth: 480, display: 'block', margin: '0 auto', opacity: 0.45 }}
    >
      {/* Horizon line */}
      <line x1="0" y1="55" x2="800" y2="55" stroke="#9BB8C4" strokeWidth="0.5" opacity="0.4" />
      {/* Gentle waves */}
      <path d="M0 62 Q40 56 80 62 Q120 68 160 62 Q200 56 240 62 Q280 68 320 62 Q360 56 400 62 Q440 68 480 62 Q520 56 560 62 Q600 68 640 62 Q680 56 720 62 Q760 68 800 62" fill="none" stroke="#7BA3B0" strokeWidth="0.8" opacity="0.5" />
      <path d="M-20 70 Q30 64 70 70 Q110 76 150 70 Q190 64 230 70 Q270 76 310 70 Q350 64 390 70 Q430 76 470 70 Q510 64 550 70 Q590 76 630 70 Q670 64 710 70 Q750 76 790 70" fill="none" stroke="#7BA3B0" strokeWidth="0.6" opacity="0.35" />
      {/* Shore / sand line */}
      <path d="M0 85 Q100 80 200 84 Q350 90 500 82 Q650 78 800 85" fill="none" stroke="#C6A882" strokeWidth="0.8" opacity="0.5" />
      {/* Palm tree */}
      <g transform="translate(140, 20)" stroke="#8B7355" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M0 65 Q2 40 -1 15" />
        <path d="M-1 15 Q-25 8 -35 18" strokeWidth="1" />
        <path d="M-1 15 Q-20 0 -30 5" strokeWidth="1" />
        <path d="M-1 15 Q5 -2 -5 -5" strokeWidth="1" />
        <path d="M-1 15 Q20 2 28 10" strokeWidth="1" />
        <path d="M-1 15 Q22 12 30 22" strokeWidth="1" />
      </g>
      {/* Seashell */}
      <g transform="translate(380, 88)" stroke="#C6A882" strokeWidth="0.8" fill="none">
        <path d="M0 0 Q4 -6 10 0 Q4 2 0 0" />
        <line x1="2" y1="-1" x2="5" y2="-4" opacity="0.5" />
        <line x1="5" y1="0" x2="6" y2="-4" opacity="0.5" />
        <line x1="7" y1="-1" x2="7" y2="-4" opacity="0.5" />
      </g>
      {/* Starfish */}
      <g transform="translate(520, 90)" stroke="#C6A882" strokeWidth="0.7" fill="none">
        <path d="M0 -5 L1 -1 L5 0 L2 2 L2.5 6 L0 3.5 L-2.5 6 L-2 2 L-5 0 L-1 -1 Z" />
      </g>
      {/* Small wave foam dots */}
      <circle cx="300" cy="76" r="1" fill="#9BB8C4" opacity="0.25" />
      <circle cx="310" cy="74" r="0.7" fill="#9BB8C4" opacity="0.2" />
      <circle cx="460" cy="75" r="0.8" fill="#9BB8C4" opacity="0.2" />
      <circle cx="600" cy="73" r="1" fill="#9BB8C4" opacity="0.2" />
      {/* Sun */}
      <circle cx="660" cy="28" r="14" fill="none" stroke="#E8C88A" strokeWidth="0.6" opacity="0.35" />
      {/* Birds */}
      <g stroke="#9BB8C4" strokeWidth="0.6" fill="none" opacity="0.3">
        <path d="M560 22 Q563 18 566 22" />
        <path d="M572 19 Q575 15 578 19" />
        <path d="M584 23 Q586 20 588 23" />
      </g>
    </svg>
  );
}
