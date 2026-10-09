import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/geist/wght-italic.css';
import './css/tokens.css';
import './css/base.css';
import './css/header.css';
import './css/home.css';
import './css/footer.css';
import './css/contact.css';
import './css/events.css';

import config from './site.config.js';
import { initHeader } from './js/header.js';
import { initHeroVideo } from './js/hero-video.js';
import { initMedia } from './js/media.js';
import { initReveal } from './js/reveal.js';
import { initContact } from './js/contact.js';
import { initDestinations } from './js/destinations.js';
import { initLangSwitch } from './js/lang-switch.js';
import { applyI18n } from './i18n/index.js';

initHeader();
initHeroVideo(config.hero);
initMedia(config);
initDestinations(config.destinations, config.contact?.phone);
initReveal();
initContact(config.contact);

for (const el of document.querySelectorAll('[data-year]')) el.textContent = new Date().getFullYear();

// langue active (FR par défaut, ou celle mémorisée) : appliquée une fois tous les composants en place
initLangSwitch();
applyI18n();
