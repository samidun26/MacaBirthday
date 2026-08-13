/**
 * Confetti for the final reveal only.
 *
 * Hand-rolled on a canvas rather than pulled from a library: it's ~80 lines, it matches
 * the palette exactly, and it keeps the bundle tiny so the page still opens instantly on
 * a phone with two bars of signal.
 *
 * Honours `prefers-reduced-motion` by simply not running.
 */

const PALETTE = ['#FF7EB6', '#B79CFF', '#6FE3FF', '#FFFFFF', '#FFD6E8'];

export function burstConfetti(canvas, { pieces = 140, duration = 4200 } = {}) {
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

  /* Two launch points at the lower corners, angled inward — reads as "celebration",
   * not "snowstorm". */
  const particles = Array.from({ length: pieces }, (_, index) => {
    const fromLeft = index % 2 === 0;
    const speed = 9 + Math.random() * 9;
    const angle = (fromLeft ? -60 : -120) * (Math.PI / 180) + (Math.random() - 0.5) * 0.7;
    return {
      x: fromLeft ? width * 0.08 : width * 0.92,
      y: height * 0.98,
      vx: Math.cos(angle) * speed * (fromLeft ? 1 : -1) * -1,
      vy: Math.sin(angle) * speed,
      size: 4 + Math.random() * 6,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.28,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      wobble: Math.random() * Math.PI * 2,
    };
  });

  let frame = 0;
  const started = performance.now();

  const tick = (now) => {
    const elapsed = now - started;
    const fade = Math.max(0, 1 - Math.max(0, elapsed - duration * 0.6) / (duration * 0.4));

    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.vy += 0.32; // gravity
      particle.vx *= 0.992; // drag
      particle.wobble += 0.1;
      particle.x += particle.vx + Math.sin(particle.wobble) * 0.6;
      particle.y += particle.vy;
      particle.rotation += particle.spin;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.globalAlpha = fade;
      ctx.fillStyle = particle.color;
      /* Squashing the height as it spins fakes a paper flutter convincingly. */
      ctx.fillRect(
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size * Math.abs(Math.cos(particle.wobble)) * 0.8 + 1,
      );
      ctx.restore();
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
