/**
 * Vidéo du hero (accueil, Production, Events, Conciergerie) : sources dans src/site.config.js → hero.
 * Une page peut désigner sa propre vidéo : data-hero-video="production.hero" ({ video: { src, mobile?, poster } }) ;
 * tant que cette entrée vaut null, la vidéo de l'accueil sert d'exemple.
 * Lecture automatique, en boucle, sans son ni contrôles ; version légère sur petit écran ;
 * en pause hors écran ; image fixe (poster) si l'utilisateur réduit les animations.
 * Sans vidéo exploitable : fond temporaire (.is-placeholder).
 */
const SMALL = window.matchMedia('(max-width: 900px)');
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initHeroVideo(cfg = {}, config = {}) {
  const host = document.querySelector('[data-hero-video]');
  const video = host?.querySelector('video');
  if (!video) return;

  const own = host.dataset.heroVideo?.split('.').reduce((o, k) => o?.[k], config)?.video;
  if (own?.src) cfg = { video: { desktop: own.src, mobile: own.mobile }, poster: own.poster };

  const { desktop, mobile } = cfg.video ?? {};
  const light = SMALL.matches || navigator.connection?.saveData;
  const src = light ? mobile || desktop : desktop || mobile;

  const placeholder = () => host.classList.add('is-placeholder');
  if (cfg.poster) video.poster = cfg.poster;
  if (!src) { placeholder(); return; }

  video.muted = true;               // indispensable à la lecture automatique (iOS compris)
  video.addEventListener('error', placeholder);
  video.addEventListener('playing', () => host.classList.add('is-playing'), { once: true });

  let visible = true;
  const play = () => { if (visible && !REDUCE.matches) video.play().catch(() => {}); };

  const load = () => {
    if (video.getAttribute('src')) return;
    video.preload = 'auto';
    video.src = src;
    play();
  };

  if (REDUCE.matches) {
    if (!cfg.poster) placeholder();
  } else {
    load();
  }

  REDUCE.addEventListener('change', (e) => (e.matches ? video.pause() : (load(), play())));

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) play(); else video.pause();
  }).observe(host);

  document.addEventListener('visibilitychange', () => (document.hidden ? video.pause() : play()));
}
