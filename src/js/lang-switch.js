/** Interrupteur FR / EN du header : un clic sur une langue l'applique à tout le site, sans rechargement. */
import { lang, setLang, onLangChange } from '../i18n/index.js';

export function initLangSwitch() {
  const switches = [...document.querySelectorAll('[data-lang-switch]')];
  const sync = () => switches.forEach((sw) => {
    sw.dataset.active = lang;
    sw.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  });
  switches.forEach((sw) => sw.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (btn) setLang(btn.dataset.lang);
  }));
  onLangChange(sync);
  sync();
}
