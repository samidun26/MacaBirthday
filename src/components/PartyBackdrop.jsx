/**
 * The backdrop: a pixel-art bakery window.
 *
 * Every sprite is inline SVG drawn on a tiny integer grid with `crispEdges`, so it stays
 * genuinely pixel-art at any size instead of turning into a blurry upscale. No image
 * files, nothing to download, and it scales cleanly on a phone screen.
 *
 * Sprites sit behind the content. Cards are opaque, so anything that lands under one is
 * simply hidden — which is why they can be scattered freely without a mobile/desktop
 * special case.
 */

/* ------------------------------------------------------------------ sprites */

function Flower({ petal = '#ff9ec4', center = '#ffd98e' }) {
  return (
    <svg viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={petal}>
        <rect x="2" y="0" width="3" height="1" />
        <rect x="1" y="1" width="5" height="1" />
        <rect x="0" y="2" width="2" height="3" />
        <rect x="5" y="2" width="2" height="3" />
        <rect x="1" y="5" width="5" height="1" />
        <rect x="2" y="6" width="3" height="1" />
      </g>
      <rect x="2" y="2" width="3" height="3" fill={center} />
    </svg>
  );
}

function Heart({ fill = '#e8558d' }) {
  return (
    <svg viewBox="0 0 7 6" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={fill}>
        <rect x="1" y="0" width="2" height="1" />
        <rect x="4" y="0" width="2" height="1" />
        <rect x="0" y="1" width="7" height="2" />
        <rect x="1" y="3" width="5" height="1" />
        <rect x="2" y="4" width="3" height="1" />
        <rect x="3" y="5" width="1" height="1" />
      </g>
    </svg>
  );
}

/** Two-tier birthday cake with a lit candle. */
function Cake() {
  return (
    <svg viewBox="0 0 13 13" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="6" y="0" width="1" height="1" fill="#ffb02e" />
      <rect x="6" y="1" width="1" height="2" fill="#b295f5" />
      <rect x="2" y="3" width="9" height="1" fill="#ffffff" />
      <rect x="1" y="4" width="11" height="1" fill="#ffffff" />
      <rect x="1" y="5" width="11" height="1" fill="#ff9ec4" />
      <rect x="1" y="6" width="11" height="3" fill="#ffd98e" />
      <rect x="1" y="9" width="11" height="1" fill="#ff9ec4" />
      <rect x="1" y="10" width="11" height="2" fill="#ffd98e" />
      <rect x="0" y="12" width="13" height="1" fill="#ffffff" />
    </svg>
  );
}

function Cupcake() {
  return (
    <svg viewBox="0 0 11 13" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="5" y="0" width="1" height="1" fill="#e0455f" />
      <g fill="#ff9ec4">
        <rect x="3" y="1" width="5" height="1" />
        <rect x="2" y="2" width="7" height="1" />
        <rect x="1" y="3" width="9" height="2" />
        <rect x="2" y="5" width="7" height="1" />
      </g>
      <rect x="1" y="6" width="9" height="1" fill="#ffffff" />
      <g fill="#ffc2d9">
        <rect x="2" y="7" width="7" height="3" />
        <rect x="3" y="10" width="5" height="2" />
      </g>
    </svg>
  );
}

function Cherry() {
  return (
    <svg viewBox="0 0 9 9" shapeRendering="crispEdges" aria-hidden="true">
      <rect x="5" y="0" width="1" height="3" fill="#6fd3b0" />
      <rect x="6" y="1" width="2" height="1" fill="#6fd3b0" />
      <g fill="#e0455f">
        <rect x="2" y="3" width="5" height="1" />
        <rect x="1" y="4" width="7" height="3" />
        <rect x="2" y="7" width="5" height="1" />
      </g>
    </svg>
  );
}

/** Sitting cat, seen from the front. */
function Cat({ fur = '#ffc2d9', ear = '#ff9ec4' }) {
  return (
    <svg viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={fur}>
        <rect x="2" y="0" width="2" height="2" />
        <rect x="8" y="0" width="2" height="2" />
        <rect x="1" y="2" width="10" height="5" />
        <rect x="2" y="7" width="8" height="4" />
        <rect x="10" y="8" width="2" height="1" />
        <rect x="11" y="6" width="1" height="2" />
      </g>
      <g fill={ear}>
        <rect x="3" y="1" width="1" height="1" />
        <rect x="8" y="1" width="1" height="1" />
        <rect x="5" y="5" width="2" height="1" />
      </g>
      <g fill="#5a3542">
        <rect x="3" y="4" width="1" height="1" />
        <rect x="8" y="4" width="1" height="1" />
      </g>
    </svg>
  );
}

/** Cat loaf: the shape she makes when she refuses to move. */
function CatLoaf({ fur = '#b295f5' }) {
  return (
    <svg viewBox="0 0 12 9" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={fur}>
        <rect x="2" y="0" width="2" height="1" />
        <rect x="7" y="0" width="2" height="1" />
        <rect x="1" y="1" width="9" height="3" />
        <rect x="0" y="4" width="11" height="4" />
        <rect x="11" y="5" width="1" height="2" />
      </g>
      <g fill="#5a3542">
        <rect x="3" y="2" width="1" height="1" />
        <rect x="7" y="2" width="1" height="1" />
      </g>
    </svg>
  );
}

/** Four-point sparkle. */
function Sparkle({ fill = '#ffd98e' }) {
  return (
    <svg viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true">
      <g fill={fill}>
        <rect x="3" y="0" width="1" height="7" />
        <rect x="0" y="3" width="7" height="1" />
        <rect x="2" y="2" width="3" height="3" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ layout */

/* left/top are percentages, so the scatter reflows with the viewport instead of
 * clustering in a corner on a narrow screen. `s` is the sprite width in px. */
const SCATTER = [
  { C: Cake, left: 4, top: 8, s: 58, delay: 0 },
  { C: Flower, left: 15, top: 26, s: 30, delay: 0.6 },
  { C: Heart, left: 8, top: 46, s: 26, delay: 1.2 },
  { C: Cupcake, left: 3, top: 66, s: 44, delay: 0.3 },
  { C: Sparkle, left: 18, top: 80, s: 22, delay: 1.5 },
  { C: Flower, left: 10, top: 92, s: 34, delay: 0.9 },
  { C: Cherry, left: 22, top: 6, s: 28, delay: 1.8 },
  { C: Cat, left: 13, top: 57, s: 40, delay: 1.7 },
  { C: CatLoaf, left: 6, top: 34, s: 42, delay: 0.5 },

  { C: Cupcake, left: 88, top: 10, s: 46, delay: 1.1 },
  { C: Flower, left: 78, top: 22, s: 28, delay: 0.2 },
  { C: Heart, left: 92, top: 38, s: 30, delay: 1.6 },
  { C: Cake, left: 84, top: 58, s: 54, delay: 0.5 },
  { C: Sparkle, left: 76, top: 74, s: 20, delay: 1.0 },
  { C: Flower, left: 90, top: 86, s: 32, delay: 1.4 },
  { C: Cherry, left: 80, top: 95, s: 26, delay: 0.8 },
  { C: Cat, left: 92, top: 66, s: 38, delay: 0.9 },
  { C: CatLoaf, left: 74, top: 44, s: 44, delay: 1.9 },

  /* A few through the middle — hidden behind the cards on desktop, visible in
   * the gaps above and below them. */
  { C: Sparkle, left: 45, top: 3, s: 18, delay: 0.4 },
  { C: Heart, left: 58, top: 97, s: 24, delay: 1.3 },
  { C: Flower, left: 36, top: 95, s: 26, delay: 0.7 },
  { C: Cat, left: 66, top: 2, s: 30, delay: 1.1 },
];

export function PartyBackdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop__sprinkles" />
      {SCATTER.map(({ C, left, top, s, delay }, index) => (
        <span
          /* Positions are the identity here; nothing reorders. */
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="sprite"
          style={{ left: `${left}%`, top: `${top}%`, width: `${s}px`, animationDelay: `${delay}s` }}
        >
          <C />
        </span>
      ))}
    </div>
  );
}

/** A soft wash over the top of everything — keeps the page feeling like one sheet. */
export function PaperOverlay() {
  return (
    <div className="paper-overlay" aria-hidden="true">
      <div className="paper-overlay__vignette" />
    </div>
  );
}
