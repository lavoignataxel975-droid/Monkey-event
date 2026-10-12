/**
 * Emplacements médias des pages Production et Conciergerie : [data-slot-media="production.aya.main"] → src/site.config.js → production.aya.main
 *   null                          → emplacement réservé (fond temporaire, libellé data-label), rien n'est téléchargé
 *   { image: { src, srcset?, position? }, alt }
 *   { video: { src, mobile?, poster? }, alt? }  → sans son, en boucle ; source chargée seulement à l'approche de l'écran,
 *                                                  en pause hors écran ; image fixe (poster) si animations réduites.
 */
const SMALL = window.matchMedia('(max-width: 900px)');
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initSlots(cfg = {}) {
  const slots = document.querySelectorAll('[data-slot-media]');
  if (!slots.length) return;

  const near = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      near.unobserve(e.target);
      loadVideo(e.target);
    }
  }, { rootMargin: '300px 0px' });

  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target.querySelector('video');
      if (!v) continue;
      if (e.isIntersecting && !REDUCE.matches) v.play().catch(() => {}); else v.pause();
    }
  }, { threshold: 0.2 });

  for (const slot of slots) {
    const media = slot.dataset.slotMedia.split('.').reduce((o, k) => o?.[k], cfg);
    if (media?.image?.src) { slot.append(image(media)); slot.classList.add('has-media'); continue; }
    if (media?.video?.src) {
      slot._video = media;
      slot.classList.add('has-media');
      near.observe(slot);
      seen.observe(slot);
      continue;
    }
    slot.classList.add('is-placeholder');
  }
}

function image({ image: m, alt = '' }) {
  const img = new Image();
  img.src = m.src;
  if (m.srcset) { img.srcset = m.srcset; img.sizes = '(min-width: 1024px) 70vw, 100vw'; }
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  if (m.position) img.style.objectPosition = m.position;
  return img;
}

function loadVideo(slot) {
  const { video: m, alt = '' } = slot._video;
  const v = document.createElement('video');
  v.muted = true; v.loop = true; v.playsInline = true;
  v.setAttribute('playsinline', '');
  v.setAttribute('disablepictureinpicture', '');
  v.preload = REDUCE.matches ? 'none' : 'auto';
  if (m.poster) v.poster = m.poster;
  if (alt) v.setAttribute('aria-label', alt); else v.setAttribute('aria-hidden', 'true');
  if (!REDUCE.matches) v.src = (SMALL.matches && m.mobile) || m.src;   // animations réduites : poster seul
  v.addEventListener('error', () => slot.classList.add('is-placeholder'));
  slot.append(v);
}
