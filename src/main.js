import '@fontsource-variable/cormorant';
import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/anton/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import './css/tokens.css';
import './css/base.css';
import './css/header.css';
import './css/home.css';
import './css/footer.css';
import './css/contact.css';
import './css/events.css';
import './css/production.css';
import './css/conciergerie.css';
import './css/vhs.css';

import config from './site.config.js';
import { initHeader } from './js/header.js';
import { initHeroVideo } from './js/hero-video.js';
import { initMedia } from './js/media.js';
import { initReveal } from './js/reveal.js';
import { initContact } from './js/contact.js';
import { initDestinations } from './js/destinations.js';
import { initSlots } from './js/slots.js';
import './js/vhs.js';

initHeader();
initHeroVideo(config.hero, config);
initMedia(config);
initDestinations(config.destinations, config.contact?.phone);
initSlots(config);
initReveal();
initContact(config.contact);

for (const el of document.querySelectorAll('[data-year]')) el.textContent = new Date().getFullYear();
