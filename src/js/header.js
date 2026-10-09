/**
 * Header fixe : transparent sur le hero (texte clair), plein (fond beige) dès que le hero est dépassé
 * et sur les autres pages. Menu compact sous 1024 px.
 */
import { t, onLangChange } from '../i18n/index.js';

const DESKTOP = window.matchMedia('(min-width: 1024px)');

export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  const hero = document.querySelector('.hero');
  if (hero) {
    const io = new IntersectionObserver(
      ([e]) => header.classList.toggle('is-solid', !e.isIntersecting),
      { rootMargin: `-${header.offsetHeight + 1}px 0px 0px 0px` },
    );
    io.observe(hero);
  } else {
    header.classList.add('is-solid');
  }

  initMenu(header);
}

function initMenu(header) {
  const toggle = header.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const label = toggle?.querySelector('[data-menu-label]');
  if (!toggle || !menu) return;

  const links = () => [...menu.querySelectorAll('a')];

  const setOpen = (open, { restoreFocus = true } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    if (label) { label.dataset.i18n = open ? 'menu.close' : 'menu.open'; label.textContent = t(label.dataset.i18n); }
    header.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('is-locked', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => menu.classList.add('is-open'));
      links()[0]?.focus({ preventScroll: true });
    } else {
      menu.classList.remove('is-open');
      menu.hidden = true;
      if (restoreFocus) toggle.focus({ preventScroll: true });
    }
  };
  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  toggle.addEventListener('click', () => setOpen(!isOpen()));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false, { restoreFocus: false }); });

  document.addEventListener('keydown', (e) => {
    if (!isOpen()) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    // focus gardé entre le bouton du menu et les liens
    const items = [toggle, ...links()];
    const i = items.indexOf(document.activeElement);
    const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === items.length - 1 ? 0 : i + 1);
    e.preventDefault();
    items[next].focus();
  });

  DESKTOP.addEventListener('change', (e) => { if (e.matches && isOpen()) setOpen(false, { restoreFocus: false }); });
}
