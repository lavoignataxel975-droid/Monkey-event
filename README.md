# Monkey Events V2

Site vitrine de Monkey Events (événements et séjours d'exception). HTML, CSS et JS sans framework, servis par Vite.

```bash
npm install
npm run dev       # http://localhost:5240
npm run build     # → dist/
```

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : hero vidéo, blocs Événements / Contact, partenaires |
| `contact.html` | Contact : coordonnées + formulaire (`src/js/contact.js`) |
| `evenements.html` | Événements : texte d'introduction + grille des destinations (`src/js/destinations.js`) |
| `mentions-legales.html` | Page à concevoir (structure de navigation seulement) |
| `partials/header.html`, `partials/footer.html` | Header et footer communs (`<!-- @include header -->`) |
| `src/site.config.js` | **Médias du site** (seul fichier à modifier pour les brancher) |
| `src/css/` | `tokens.css` (palette, typo), `base.css`, `header.css`, `home.css`, `footer.css` |
| `src/js/` | `header.js` (header fixe, menu mobile), `hero-video.js`, `media.js`, `reveal.js` |

URL propres : `/evenements`, `/contact`, `/mentions-legales` (dev : `vite.config.js` ; production : `vercel.json` → `cleanUrls`).

## Médias

Tout se dépose dans `public/media/` puis se déclare dans `src/site.config.js` (chemin public = sans `public/`).
Tant qu'un média vaut `null`, son emplacement affiche un fond temporaire neutre.

| Média | Dossier | Déclaration (`src/site.config.js`) | Format conseillé |
|---|---|---|---|
| Vidéo du hero | `public/media/hero/` | `hero.video.desktop`, `hero.video.mobile`, `hero.poster` | MP4 H.264 sans son, 16:9 ; 1920 px (≈ 8 Mo) + 1280 px pour mobile (≈ 3,5 Mo) ; poster JPG 1920 px |
| Image du bloc Événements | `public/media/blocks/` | `blocks.evenements = { src: '/media/blocks/evenements.jpg' }` | JPG/WebP, portrait ou carré, ≥ 1600 px de haut |
| Image du bloc Contact | `public/media/blocks/` | `blocks.contact = { src: '/media/blocks/contact.jpg' }` | idem |
| Logo Monkey Events | `public/media/logo/` | `logo = { src: '/media/logo/monkey-events.svg', alt: 'Monkey Events' }` | SVG clair (affiché sur fond noir) |
| Photos des destinations | `public/media/destinations/` | `destinations = [{ name, image: { src, webp, sizes, position }, alt }]` | JPG + WebP, ≥ 1000 px de large ; recadrée en paysage sur ordinateur, en portrait (4:5) sur mobile |
| Logos partenaires | `public/media/partners/` | `partners = [{ name, logo, url? }, …]` | SVG ou PNG transparent, recadré au plus près |

Option `position` pour les images des blocs (ex. `{ src, position: '50% 30%' }`) : point de cadrage du recadrage `cover`.

La vidéo actuelle (`public/media/hero/`) est une version web de `../Pics /monkey-events-hero.mp4` (original non modifié).

## V2 : direction artistique

Copie indépendante de `../Site Web` (V1, port 5230), même contenu et mêmes fonctionnalités ; seule l'identité visuelle change.

- **Typographie** : Geist (licence OFL, `@fontsource-variable/geist`), seule police du site : titres en graisse 300 et approche resserrée, accents en vraie italique, libellés en capitales espacées. Remplace Bodoni Moda + Manrope (Sequel Sans demandée, non disponible sans licence).
- **Couleurs** (`src/css/tokens.css`) : beige `#eee8dc`, noir doux légèrement vert `#1b1e1a`, gamme sauge de `--sage-50` (fonds clairs) à `--sage-900` (pied de page). Contrastes WCAG AA vérifiés.
- **Rythme des fonds à l'accueil** : vidéo, beige, sauge clair (partenaires), sauge profond (pied de page).
- **Angles droits partout**, icônes Phosphor (`{{icon:nom}}` dans le HTML, graisse light).
- **Événements** : grille de 12 colonnes, motif de 7 cartes qui se répète (paysage + portrait décalé, portrait + paysage, trois portraits en escalier).
- **Bloc Contact de l'accueil** : aplat sauge profond tant que `blocks.contact` vaut `null`.

## Langues (FR / EN)

- Dictionnaires : `src/i18n/fr.js` et `src/i18n/en.js` (mêmes clés) ; moteur : `src/i18n/index.js`.
- HTML : `data-i18n="clé"` (texte) et `data-i18n-attr="aria-label:clé; content:clé"` (attributs, titre, description).
- JS : `t('clé')` et `onLangChange(fn)` pour re-traduire un composant (formulaire, menu, partenaires, textes alternatifs).
- Sélecteur : coin supérieur gauche du header (`partials/header.html`, `src/js/lang-switch.js`).
- Langue mémorisée dans le navigateur (`localStorage`, clé `monkey-events-lang`) ; `partials/head.html` l'applique avant l'affichage.
- Textes alternatifs des destinations : `alt: { fr, en }` dans `src/site.config.js`.
