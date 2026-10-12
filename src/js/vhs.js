/**
 * OSD caméscope commun à toutes les pages : date et heure au format 2000s, timecodes réels ([data-osd-tc]),
 * bande de tracking à l'arrivée sur chaque page. Animations réduites : timecodes figés, pas de bande.
 */
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)');
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const pad = (n) => String(n).padStart(2, '0');

/* ---------- Date et heure au format caméscope 2000s ---------- */
function clock() {
  const d = new Date();
  const date = `${MONTHS[d.getMonth()]}.${pad(d.getDate())} ${d.getFullYear()}`;
  const time = `${d.getHours() < 12 ? 'AM' : 'PM'} ${d.getHours() % 12 || 12}:${pad(d.getMinutes())}`;
  for (const el of document.querySelectorAll('[data-osd-date]')) el.textContent = date;
  for (const el of document.querySelectorAll('[data-osd-time]')) el.textContent = time;
}
clock();
setInterval(clock, 15000);

/* ---------- Timecodes (25 images/s) : chacun défile tant qu'il est visible ---------- */
const start = performance.now();
for (const tc of document.querySelectorAll('[data-osd-tc]')) {
  let visible = false, raf = 0;
  const render = (t) => {
    const f = Math.floor(((t - start) / 1000) * 25);
    tc.textContent = `${pad(Math.floor(f / 90000))}:${pad(Math.floor(f / 1500) % 60)}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`;
  };
  const loop = (t) => { render(t); raf = requestAnimationFrame(loop); };
  const sync = () => {
    cancelAnimationFrame(raf);
    if (REDUCE.matches) { tc.textContent = '00:00:14:22'; return; }
    if (visible && !document.hidden) raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }).observe(tc);
  document.addEventListener('visibilitychange', sync);
  REDUCE.addEventListener('change', sync);
  sync();
}

/* ---------- Bande de tracking : un passage à l'arrivée sur chaque page (l'accueil a la sienne, dans le hero) ---------- */
if (!REDUCE.matches && !document.querySelector('.hero')) {
  const band = Object.assign(document.createElement('span'), { className: 'page-track' });
  band.setAttribute('aria-hidden', 'true');
  document.body.append(band);
  band.addEventListener('animationend', () => band.remove());
}
