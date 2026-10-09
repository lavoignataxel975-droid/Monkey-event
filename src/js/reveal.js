/** Apparition douce des blocs [data-reveal] à l'entrée dans l'écran (désactivée si animations réduites). */
export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('has-reveal');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
}
