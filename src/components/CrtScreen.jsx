/**
 * The monitor itself.
 *
 * Two fixed layers that sandwich the app: a backdrop with the sliced sun and the
 * scrolling perspective grid, and an overlay with scanlines, a vignette and a slow
 * flicker. The overlay sits above everything — modals included — because the conceit is
 * that the whole screen is one tube, not that the page has a decorative border.
 *
 * Both are inert (`pointer-events: none`) and hidden from assistive tech. The grid and
 * flicker animations are switched off under `prefers-reduced-motion`.
 */

export function CrtBackdrop() {
  return (
    <div className="crt-backdrop" aria-hidden="true">
      <div className="crt-sun" />
      <div className="crt-grid">
        <div className="crt-grid__inner" />
      </div>
    </div>
  );
}

export function CrtOverlay() {
  return (
    <div className="crt-overlay" aria-hidden="true">
      <div className="crt-scanlines" />
      <div className="crt-vignette" />
      <div className="crt-flicker" />
    </div>
  );
}
