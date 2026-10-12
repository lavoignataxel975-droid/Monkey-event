/**
 * Prévisualisation responsive (outil local, responsive-preview.html).
 * Deux iframes du vrai site, chacune avec son propre défilement et un viewport fixe :
 *   iPhone 16 393 × 852 · iPad 820 × 1180 (portrait) ou 1180 × 820 (paysage).
 * Les appareils sont réduits par transform (le viewport du site ne change pas) pour tenir dans la fenêtre.
 */
import '@fontsource-variable/archivo/wdth.css';
import './preview.css';

const VIEW = { phone: [393, 852], tablet: [820, 1180] };
const BEZEL = { phone: 12, tablet: 20 };
const STATUS = { phone: 54, tablet: 24 };   // barre d'état au-dessus du viewport (cadres affichés)
const GAP = 40;
const MIN_SIDE_SCALE = 0.34;          // en dessous, les appareils s'empilent (petits écrans)

const stage = document.querySelector('[data-stage]');
const devs = Object.fromEntries([...document.querySelectorAll('[data-dev]')].map((el) => [el.dataset.dev, {
  el,
  box: el.querySelector('[data-box]'),
  device: el.querySelector('[data-device]'),
  frame: el.querySelector('[data-view]'),
  size: el.querySelector('[data-size]'),
  scale: el.querySelector('[data-scale]'),
  path: el.querySelector('[data-path]'),
}]));

const store = {
  get: (k, d) => { try { return localStorage.getItem(`pv-${k}`) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(`pv-${k}`, v); } catch {} },
};
let orient = store.get('orient', 'auto');      // auto | portrait | landscape
let frames = store.get('frames', '1') === '1';

/* ---------- Mise en page ---------- */
const outer = (key, landscape) => {
  let [w, h] = VIEW[key];
  if (key === 'tablet' && landscape) [w, h] = [h, w];
  const b = frames ? BEZEL[key] * 2 : 0;
  return { vw: w, vh: h, w: w + b, h: h + b + (frames ? STATUS[key] : 0) };
};

function layout() {
  const cs = getComputedStyle(stage);
  const availW = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const metaH = devs.phone.el.querySelector('.pv-meta').offsetHeight + 12;
  const availH = window.innerHeight - stage.getBoundingClientRect().top + window.scrollY
    - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - metaH;

  const sideScale = (landscape) => {
    const p = outer('phone'), t = outer('tablet', landscape);
    const k = Math.min(1, (availW - GAP) / (p.w + t.w), availH / Math.max(p.h, t.h));
    return p.w * k < 200 ? Math.min(k, (availW - GAP - 200) / t.w) : k;
  };
  // Auto : l'orientation qui permet d'afficher les deux appareils le plus grand
  const landscape = orient === 'auto' ? sideScale(true) > sideScale(false) : orient === 'landscape';
  const s = sideScale(landscape);
  const stacked = s < MIN_SIDE_SCALE;
  stage.classList.toggle('is-stacked', stacked);
  document.body.classList.toggle('is-landscape', landscape);
  document.body.classList.toggle('no-frames', !frames);

  for (const key of ['phone', 'tablet']) {
    const d = devs[key], o = outer(key, landscape);
    const k = stacked ? Math.min(1, availW / o.w) : s;
    d.frame.width = o.vw; d.frame.height = o.vh;
    d.frame.style.width = `${o.vw}px`; d.frame.style.height = `${o.vh}px`;
    d.device.style.transform = `scale(${k})`;
    d.box.style.width = `${Math.floor(o.w * k)}px`;
    d.box.style.height = `${Math.floor(o.h * k)}px`;
    d.el.style.width = `${Math.max(Math.floor(o.w * k), 200)}px`;   // la ligne d'infos se replie à la largeur de l'appareil
    d.size.textContent = `${o.vw} × ${o.vh}`;
    d.scale.textContent = k < 1 ? `affiché à ${Math.round(k * 100)} %` : 'taille réelle';
    if (key === 'tablet') d.frame.title = `Monkey Production sur iPad (${o.vw} × ${o.vh}, ${landscape ? 'paysage' : 'portrait'})`;
  }
}

/* ---------- Commandes ---------- */
const press = (sel, test) => document.querySelectorAll(sel).forEach((b) => b.setAttribute('aria-pressed', String(test(b))));

document.querySelectorAll('[data-goto]').forEach((btn) => btn.addEventListener('click', () => {
  for (const d of Object.values(devs)) d.frame.src = btn.dataset.goto;
  press('[data-goto]', (b) => b === btn);
}));

document.querySelectorAll('[data-orient]').forEach((btn) => btn.addEventListener('click', () => {
  orient = btn.dataset.orient; store.set('orient', orient);
  press('[data-orient]', (b) => b.dataset.orient === orient);
  layout();
}));
press('[data-orient]', (b) => b.dataset.orient === orient);

const framesBtn = document.querySelector('[data-frames]');
framesBtn.addEventListener('click', () => {
  frames = !frames; store.set('frames', frames ? '1' : '0');
  framesBtn.setAttribute('aria-pressed', String(frames));
  layout();
});
framesBtn.setAttribute('aria-pressed', String(frames));

document.querySelector('[data-reload-all]').addEventListener('click', () => {
  for (const d of Object.values(devs)) d.frame.contentWindow?.location.reload();
});

for (const d of Object.values(devs)) {
  d.el.querySelector('[data-top]').addEventListener('click', () => d.frame.contentWindow?.scrollTo({ top: 0, behavior: 'smooth' }));
  // chemin affiché = page réellement chargée dans l'appareil (même origine : lisible)
  const sync = () => {
    try {
      const loc = d.frame.contentWindow.location;
      d.path.textContent = loc.pathname + loc.hash;
      press('[data-goto]', (b) => b.dataset.goto === loc.pathname && devs.phone.frame.contentWindow?.location.pathname === devs.tablet.frame.contentWindow?.location.pathname);
    } catch { d.path.textContent = '?'; }
  };
  d.frame.addEventListener('load', () => {
    sync();
    d.frame.contentWindow?.addEventListener('hashchange', sync);
  });
}

new ResizeObserver(layout).observe(stage);
window.addEventListener('resize', layout);
layout();
