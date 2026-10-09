/**
 * Traduction FR / EN : dictionnaires centralisés (fr.js, en.js), langue mémorisée (localStorage).
 *
 * Dans le HTML :
 *   data-i18n="clé"                    → texte de l'élément
 *   data-i18n-attr="aria-label:clé; content:clé" → attributs
 * Dans le JS : t('clé', { variable }) ; onLangChange(fn) pour re-traduire un composant.
 */
import fr from './fr.js';
import en from './en.js';

const DICTS = { fr, en };
const STORAGE_KEY = 'monkey-events-lang';
const listeners = new Set();

const stored = () => { try { return localStorage.getItem(STORAGE_KEY); } catch { return null; } };
export let lang = DICTS[stored()] ? stored() : 'fr';

export const t = (key, vars) => {
  let s = DICTS[lang][key] ?? DICTS.fr[key] ?? key;
  if (vars) s = s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  return s;
};

/** Traduit tous les éléments marqués sous `root` (document par défaut). */
export function applyI18n(root = document) {
  for (const el of root.querySelectorAll('[data-i18n]')) el.textContent = t(el.dataset.i18n);
  for (const el of root.querySelectorAll('[data-i18n-attr]')) {
    for (const pair of el.dataset.i18nAttr.split(';')) {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    }
  }
  if (root === document) {
    document.documentElement.lang = lang;
    document.documentElement.classList.remove('i18n-pending');   // voir partials/head.html
  }
}

export function setLang(next) {
  if (!DICTS[next] || next === lang) return;
  lang = next;
  try { localStorage.setItem(STORAGE_KEY, next); } catch { /* navigation privée : la langue vaut pour la page */ }
  applyI18n();
  for (const fn of listeners) fn(lang);
}

export const onLangChange = (fn) => listeners.add(fn);
