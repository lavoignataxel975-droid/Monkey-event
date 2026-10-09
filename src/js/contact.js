/**
 * Page Contact : coordonnées (src/site.config.js → contact) et formulaire.
 * Validation à la saisie et à l'envoi ; envoi vers `contact.formEndpoint` (POST, FormData).
 * Sans service d'envoi configuré, le formulaire le dit : aucun envoi n'est simulé.
 * Textes : src/i18n (re-traduits à chaud, erreurs et messages affichés compris).
 */
import { t, onLangChange } from '../i18n/index.js';

export function initContact(cfg = {}) {
  fillCoords(cfg);
  onLangChange(() => fillCoords(cfg));
  const form = document.querySelector('[data-contact-form]');
  if (form) initForm(form, cfg);
}

/* ---------- Coordonnées ---------- */
function fillCoords({ email, phone, address, socials = [] }) {
  const row = (key) => document.querySelector(`[data-coord="${key}"]`);
  const value = (key) => row(key)?.querySelector('[data-coord-value]');

  if (email && value('email')) setValue(value('email'), `<a href="mailto:${attr(email)}">${esc(email)}</a>`);
  if (phone && value('phone')) setValue(value('phone'), `<a href="tel:${attr(phone.replace(/[^\d+]/g, ''))}">${esc(phone)}</a>`);

  if (address?.length && row('address')) {
    const lines = Array.isArray(address) ? address : [address];
    setValue(value('address'), lines.map(esc).join('<br>'));
    row('address').hidden = false;
  }
  if (socials.length && row('socials')) {
    setValue(value('socials'), socials.map((s) =>
      `<a href="${attr(s.url)}" target="_blank" rel="noopener">${esc(s.name)}<span class="sr-only"> ${esc(t('newtab'))}</span></a>`).join(''));
    row('socials').hidden = false;
  }
}

function setValue(el, html) {
  el.innerHTML = html;
  el.classList.remove('is-empty');
  el.removeAttribute('data-i18n');   // valeur réelle : plus de texte provisoire à traduire
}

/* ---------- Formulaire ---------- */
function initForm(form, cfg) {
  const fields = [...form.querySelectorAll('input:not([name="site"]), textarea')];
  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[data-submit]');
  const submitLabel = form.querySelector('[data-submit-label]');
  let busy = false;
  let lastStatus = null;   // { type, key } : le message affiché, re-traduit si la langue change

  // e-mail : exige un domaine avec extension (le contrôle natif accepte « a@b ») ; téléphone : chiffres et séparateurs
  form.elements.email.pattern = '[^@\\s]+@[^@\\s]+\\.[^@\\s]{2,}';
  form.elements.telephone.pattern = '[+]?[\\d\\s\\(\\)\\.\\-]{6,25}';   // parenthèses et tirets échappés (motifs compilés avec le drapeau v)

  const check = (field) => {
    field.value = field.value.replace(/^\s+$/, '');   // un champ rempli d'espaces compte comme vide
    const v = field.validity;
    // longueur minimale vérifiée à la main : Safari ne signale pas toujours `tooShort`
    const min = Number(field.getAttribute('minlength')) || 0;
    const tooShort = field.value.trim() && field.value.trim().length < min;
    const key = ['valueMissing', 'typeMismatch', 'patternMismatch'].find((k) => v[k]) ?? (tooShort ? 'tooShort' : undefined);
    const err = document.getElementById(`${field.id}-err`);
    field.setAttribute('aria-invalid', String(Boolean(key)));
    if (err) {
      const msgKey = `err.${field.name}.${key}`;
      err.textContent = key ? (t(msgKey) === msgKey ? t('err.generic') : t(msgKey)) : '';
      err.hidden = !key;
    }
    return !key;
  };

  for (const field of fields) {
    field.addEventListener('blur', () => { if (field.value || field.dataset.touched) check(field); field.dataset.touched = '1'; });
    field.addEventListener('input', () => { if (field.getAttribute('aria-invalid') === 'true') check(field); });
  }

  const renderStatus = () => {
    if (!lastStatus) { status.hidden = true; return; }
    const mail = cfg.email ? `<a href="mailto:${attr(cfg.email)}">${esc(cfg.email)}</a>` : '';
    const extra = { disabled: 'status.disabled.email', error: 'status.error.email' }[lastStatus.key];
    status.className = `form__status is-${lastStatus.type}`;
    status.innerHTML = esc(t(`status.${lastStatus.key}`)) + (mail && extra ? esc(t(extra)).replace('{email}', mail) : '');
    status.hidden = false;
  };
  const show = (type, key) => { lastStatus = { type, key }; renderStatus(); };

  const setBusy = (state) => {
    busy = state;
    submit.disabled = state;
    form.setAttribute('aria-busy', String(state));
    submitLabel.textContent = t(state ? 'form.sending' : 'form.send');
  };

  // changement de langue : erreurs affichées, message d'envoi et bouton suivent
  onLangChange(() => {
    fields.filter((f) => f.getAttribute('aria-invalid') === 'true').forEach(check);
    renderStatus();
    submitLabel.textContent = t(busy ? 'form.sending' : 'form.send');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    lastStatus = null;
    status.hidden = true;

    const invalid = fields.filter((f) => !check(f));
    if (invalid.length) { invalid[0].focus(); return; }
    if (form.elements.site.value) return;              // robot : rien n'est envoyé

    if (!cfg.formEndpoint) { show('info', 'disabled'); return; }

    setBusy(true);
    const abort = new AbortController();
    const timer = setTimeout(() => abort.abort(), 15000);
    try {
      const data = new FormData(form);
      data.delete('site');
      const res = await fetch(cfg.formEndpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: abort.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      fields.forEach((f) => { f.removeAttribute('aria-invalid'); delete f.dataset.touched; });
      show('success', 'success');
    } catch {
      show('error', 'error');
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  });
}

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const attr = esc;
