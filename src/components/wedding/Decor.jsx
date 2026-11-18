import React from 'react';

/** Thin line with a diamond in the middle, used under headings. */
export function Ornament({ className = '' }) {
  return (
    <svg viewBox="0 0 120 12" aria-hidden="true" className={`mx-auto h-3 w-28 ${className}`}>
      <line x1="0" y1="6" x2="50" y2="6" stroke="currentColor" strokeWidth="1" />
      <path d="M60 1 L65 6 L60 11 L55 6 Z" fill="currentColor" />
      <line x1="70" y1="6" x2="120" y2="6" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/** Small spaced-out capitals above headings. */
export function Eyebrow({ children, className = 'text-bronze' }) {
  return <p className={`text-xs font-medium uppercase tracking-[0.3em] ${className}`}>{children}</p>;
}

// An almond-shaped leaf, 9 units long, pointing along +x from the origin.
const LEAF = 'M0 0 C2.5 -2.6 6.5 -2.6 9 0 C6.5 2.6 2.5 2.6 0 0 Z';

// A laurel sprig running along the top edge, starting just after the corner blossom.
function Sprig() {
  const leaves = [
    { x: 38, y: 20.6, angle: -32 },
    { x: 48, y: 21, angle: 32 },
    { x: 58, y: 21, angle: -30 },
    { x: 68, y: 20.6, angle: 30 },
    { x: 78, y: 19.8, angle: -28 },
  ];
  return (
    <g>
      <path d="M30 20 C48 21.2 68 21 90 18.6" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {leaves.map((leaf) => (
        <path key={leaf.x} d={LEAF} fill="currentColor" opacity="0.85" transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.angle}) scale(1.15)`} />
      ))}
      <circle cx="92.5" cy="18.4" r="1.3" fill="currentColor" />
    </g>
  );
}

// Five round petals around a darker centre.
const BLOSSOM_PETALS = [0, 72, 144, 216, 288].map((deg) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { cx: 20 + 4.4 * Math.cos(rad), cy: 20 + 4.4 * Math.sin(rad) };
});

/** Top-left corner flourish: a small blossom with a laurel sprig along each edge. */
function CornerOrnament({ className }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      {BLOSSOM_PETALS.map((petal) => (
        <circle key={`${petal.cx}-${petal.cy}`} cx={petal.cx} cy={petal.cy} r="3.4" fill="currentColor" opacity="0.9" />
      ))}
      <circle cx="20" cy="20" r="2" fill="#8A5530" />
      <Sprig />
      {/* Mirror the sprig across the diagonal so it runs down the left edge. */}
      <g transform="matrix(0 1 1 0 0 0)">
        <Sprig />
      </g>
    </svg>
  );
}

const CORNERS = [
  'left-2 top-2 sm:left-4 sm:top-4',
  'right-2 top-2 -scale-x-100 sm:right-4 sm:top-4',
  'bottom-2 left-2 -scale-y-100 sm:bottom-4 sm:left-4',
  'bottom-2 right-2 -scale-x-100 -scale-y-100 sm:bottom-4 sm:right-4',
];

/**
 * Decorative double-line frame around the screen with a flourish in each corner.
 * It is fixed and ignores clicks, so the page scrolls and works underneath it.
 */
export function PageFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 text-caramel">
      <div className="absolute inset-2 border border-caramel/70 sm:inset-4" />
      <div className="absolute inset-[13px] border border-caramel/35 sm:inset-[22px]" />
      {CORNERS.map((position) => (
        <CornerOrnament key={position} className={`absolute h-16 w-16 sm:h-24 sm:w-24 ${position}`} />
      ))}
    </div>
  );
}
