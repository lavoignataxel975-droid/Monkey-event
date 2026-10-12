/**
 * Page Événements : grille des destinations (src/site.config.js → destinations)
 * et numéro de l'agence dans le texte d'introduction (contact.phone).
 * Texte alternatif : chaîne, ou { fr, en } pour suivre la langue active.
 */
import { lang, onLangChange } from '../i18n/index.js';

export function initDestinations(list = [], phone = null) {
  fillPhone(phone);
  const host = document.querySelector('[data-destinations]');
  if (!host) return;
  host.innerHTML = list.map(card).join('');
  onLangChange(() => host.querySelectorAll('img').forEach((img, i) => { img.alt = altOf(list[i]); }));
}

const altOf = ({ alt = '' }) => (typeof alt === 'string' ? alt : alt[lang] ?? alt.fr ?? '');

function card(dest) {
  const { name, image } = dest;
  const alt = altOf(dest);
  const widths = Object.entries(image.sizes ?? {});
  const set = (base) => widths.map(([w, sfx]) => `${base.replace(/(\.\w+)$/, `${sfx}$1`)} ${w}w`).join(', ');
  // 2 cartes par rangée dès 720 px, 1 en dessous
  const sizes = '(min-width: 720px) 50vw, 100vw';
  const style = image.position ? ` style="object-position:${esc(image.position)}"` : '';
  return `<li class="dest" data-reveal>
    <figure class="dest__fig">
      <picture>
        ${image.webp ? `<source type="image/webp" srcset="${widths.length ? set(image.webp) : image.webp}" sizes="${sizes}">` : ''}
        <img src="${esc(image.src)}"${widths.length ? ` srcset="${set(image.src)}" sizes="${sizes}"` : ''} alt="${esc(alt)}" loading="lazy" decoding="async"${style}>
      </picture>
      <figcaption class="dest__name">${esc(name)}</figcaption>
    </figure>
  </li>`;
}

function fillPhone(phone) {
  if (!phone) return;
  for (const el of document.querySelectorAll('[data-agency-phone]')) {
    el.innerHTML = `<a href="tel:${esc(phone.replace(/[^\d+]/g, ''))}">${esc(phone)}</a>`;
    el.classList.remove('is-empty');
    delete el.dataset.i18n;          // le numéro remplace le libellé « à compléter » dans toutes les langues
  }
}

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
