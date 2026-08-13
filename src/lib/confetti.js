/**
 * Confetti for the final reveal only.
 *
 * Hand-rolled on a canvas rather than pulled from a library: it's ~80 lines, it matches
 * the palette exactly, and it keeps the bundle tiny so the page still opens instantly on
 * a phone with two bars of signal.
 *
 * Honours `prefers-reduced-motion` by simply not running.
 */

const PALETTE = ['#e8558d', '#ff9ec4', '#b295f5', '#ffd98e', '#6fd3b0', '#ffffff'];

export function burstConfetti(canvas, { pieces = 150, duration = 3000 } = {}) {
  if (!canvas) return () => {};
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {};

  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0;
  let height = 0;

  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  /* Two kinds of piece, because a corner burst on its own is over in under two
   * seconds and leaves the rest of the animation staring at an empty canvas:
   *
   *   - burst: fired inward from the lower corners, the initial "pop"
   *   - drift: released above the top edge on a stagger, falling for the duration
   */
  const makePiece = (extra) => ({
    /* Sizes snap to 4px steps so every piece reads as whole pixels. */
    size: 4 + Math.floor(Math.random() * 3) * 4,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    wobble: Math.random() * Math.PI * 2,
    gravity: 0.16,
    ...extra,
  });

  const particles = Array.from({ length: pieces }, (_, index) => {
    if (index % 2 === 0) {
      const fromLeft = index % 4 === 0;
      const speed = 8 + Math.random() * 7;
      const angle = (fromLeft ? -62 : -118) * (Math.PI / 180) + (Math.random() - 0.5) * 0.6;
      return makePiece({
        x: fromLeft ? width * 0.08 : width * 0.92,
        y: height * 0.98,
        vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1) * -1,
        vy: Math.sin(angle) * speed,
      });
    }

    return makePiece({
      x: Math.random() * width,
      /* Staggered above the fold so they keep arriving, not all at once. */
      y: -Math.random() * height - 20,
      vx: (Math.random() - 0.5) * 1.6,
      vy: 2 + Math.random() * 2,
      gravity: 0.06,
      drift: true,
    });
  });

  let frame = 0;
  const started = performance.now();

  const tick = (now) => {
    const elapsed = now - started;
    const fade = Math.max(0, 1 - Math.max(0, elapsed - duration * 0.6) / (duration * 0.4));

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.vy += particle.gravity;
      particle.vx *= 0.994; // drag
      particle.wobble += 0.1;
      particle.x += particle.vx + Math.sin(particle.wobble) * 0.6;
      particle.y += particle.vy;

      /* Recycle anything that falls out of frame while the burst is still meant to
       * be going. Tuning launch velocities to exactly fill the window is fragile;
       * respawning is self-correcting and keeps the canvas populated until the
       * fade-out begins. */
      if (particle.y > height + particle.size && elapsed < duration * 0.62) {
        particle.x = Math.random() * width;
        particle.y = -particle.size - Math.random() * 60;
        particle.vx = (Math.random() - 0.5) * 1.6;
        particle.vy = 2 + Math.random() * 2;
        particle.gravity = 0.06;
      }

      /* No rotation and no subpixel positions: sprite-era confetti is made of
       * axis-aligned blocks that snap from cell to cell. */
      ctx.globalAlpha = fade;
      ctx.fillStyle = particle.color;
      ctx.fillRect(
        Math.round(particle.x / 2) * 2,
        Math.round(particle.y / 2) * 2,
        particle.size,
        particle.size,
      );
    });

    if (elapsed < duration) {
      frame = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  };

  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
    ctx.clearRect(0, 0, width, height);
  };
}
