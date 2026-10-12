/**
 * Branche les médias déclarés dans src/site.config.js : images des trois portes de l'accueil, logo, partenaires.
 * Emplacement sans média = fond temporaire neutre (CSS), jamais de visuel inventé.
 */
import { t, onLangChange } from '../i18n/index.js';

export function initMedia(config) {
  blocks(config.blocks ?? {});
  logo(config.logo);
  const renderPartners = () => partners(config.partners ?? [], config.partnerSlots ?? 5);
  renderPartners();
  onLangChange(renderPartners);   // libellés des emplacements et « (nouvel onglet) »
}

function blocks(map) {
  for (const slot of document.querySelectorAll('[data-block-media]')) {
    const media = map[slot.dataset.blockMedia];
    if (!media?.src) { slot.classList.add('is-placeholder'); continue; }
    const img = new Image();
    img.src = media.src;
    if (media.srcset) { img.srcset = media.srcset; img.sizes = slot.dataset.sizes || '100vw'; }   // largeur affichée : index.html → data-sizes
    img.alt = '';                    // décorative : le libellé du bloc porte l'information
    img.decoding = 'async';
    img.loading = 'lazy';
    if (media.position) img.style.objectPosition = media.position;
    slot.append(img);
  }
}

function logo(cfg) {
  if (!cfg?.src) return;
  for (const slot of document.querySelectorAll('[data-logo-slot]')) {
    const img = new Image();
    img.src = cfg.src;
    img.alt = '';                    // le nom « Monkey Production » est déjà écrit à côté
    img.decoding = 'async';
    slot.append(img);
    slot.hidden = false;
  }
}

function partners(list, slots) {
  const host = document.querySelector('[data-partners]');
  if (!host) return;
  const items = list.length ? list : Array.from({ length: slots }, () => null);
  host.classList.toggle('is-placeholder', !list.length);

  host.innerHTML = items.map((p) => {
    if (!p) return `<li class="partner partner--empty" aria-hidden="true"><span>${escape(t('partners.slot'))}</span></li>`;
    const img = `<img src="${p.logo}" alt="${escape(p.name)}" loading="lazy" decoding="async">`;
    return `<li class="partner">${p.url
      ? `<a href="${p.url}" target="_blank" rel="noopener">${img}<span class="sr-only"> ${escape(t('newtab'))}</span></a>`
      : img}</li>`;
  }).join('');
  if (!list.length) host.setAttribute('aria-label', t('partners.slots'));
}

const escape = (s = '') => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
