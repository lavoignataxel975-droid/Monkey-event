# Monkey Production : site (version VHS)

Site vitrine de Monkey Production : production de clips (activité principale), événements, conciergerie de luxe. HTML, CSS et JS sans framework, servis par Vite.
Copie du site « Site Web » (V1, port 5230, inchangée), refondue en direction « VHS 2000s × Streetwear × Luxe moderne ».

```bash
npm install
npm run dev       # http://localhost:5250
npm run build     # → dist/
```

Prévisualisation responsive (outil local, `npm run dev` seulement, absent du build) : http://localhost:5250/responsive-preview
Le site dans un iPhone 16 (393 × 852) et un iPad (820 × 1180 ou 1180 × 820), deux iframes au défilement indépendant ;
choix de la page, orientation de l'iPad (auto / portrait / paysage), cadres affichés ou masqués, actualiser, haut de page par appareil.
Fichiers : `responsive-preview.html`, `src/preview/` ; route déclarée dans `vite.config.js` → `devOnly`.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : hero vidéo, trois portes Events / Production / Conciergerie, partenaires |
| `production.html` | Production : hero, projets Aya Nakamura « Chimiyé » et Julien Doré « Nous », invitation « Parlons de votre projet » → /contact (`src/js/slots.js`, `src/css/production.css`) ; page en salle noire (`body.is-night`) |
| `conciergerie.html` | Conciergerie : hero, rôle d'une conciergerie de luxe, 4 exemples de demandes (illustratifs), invitation → /contact (`src/css/conciergerie.css`) ; page claire, pendant de Production |
| `contact.html` | Contact : coordonnées + formulaire (`src/js/contact.js`) |
| `evenements.html` | Événements : texte d'introduction + grille des destinations (`src/js/destinations.js`) |
| `mentions-legales.html` | Page à concevoir (structure de navigation seulement) |
| `partials/header.html`, `partials/footer.html` | Header et footer communs (`<!-- @include header -->`) ; header : nom à gauche, navigation à droite Accueil · Events (`/evenements`) · Production (`/production`) · Conciergerie (`/conciergerie`) · Contact ; même liste dans le menu mobile |
| `src/site.config.js` | **Médias du site** (seul fichier à modifier pour les brancher) |
| `src/css/` | `tokens.css` (palette, typo), `base.css`, `header.css`, `home.css`, `footer.css` |
| `src/js/` | `header.js` (header fixe, menu mobile), `hero-video.js`, `media.js`, `reveal.js` |

URL propres : `/evenements`, `/production`, `/conciergerie`, `/contact`, `/mentions-legales` (dev : `vite.config.js` ; production : `vercel.json` → `cleanUrls`).

## Direction artistique : VHS 2000s × Streetwear × Luxe moderne

- **Source unique** : `src/css/tokens.css` (palette, polices) et `src/css/vhs.css` (effets et composants communs). Les anciens noms de variables (`--beige`, `--ink`…) y pointent vers la palette VHS.
- **Palette** : noir bande `#0B0B0A`, off-white `#F2EFE8`, gris cassette `#8C8982`, surfaces `#171615` / `#211F1D`, accent unique rouge REC `#E8382F`.
- **Polices** : Anton (titres, `--font-wide`), Archivo (texte), IBM Plex Mono (OSD, tags, libellés, `--font-mono`), Cormorant italique (accroches, `--font-display`).
- **Effets** : grain et scanlines fixes ; décalage RGB au survol des grands titres ; OSD caméscope (REC, date, timecode réels : `src/js/vhs.js`, attributs `data-osd-tc`, `data-osd-date`, `data-osd-time`) dans les heros, les vidéos de Production et la bande `.osd-strip` (Contact, Mentions légales) ; bande de tracking à l'arrivée sur chaque page ; tags `.vhs-tag` (DROP 01…). Tout est coupé si l'utilisateur réduit les animations.
- **Hero vidéo commun** (`.hero.vhs-hero`, styles dans `vhs.css`) : accueil, Production, Events, Conciergerie (pas Contact). Vidéo `hero` de `src/site.config.js` partout (Production : `production.hero` la remplace si renseigné). Titre monumental toujours entier : taille = largeur utile ÷ `--fit` (largeur du mot en em sur Anton), plafonnée par `--cap` ; « MONKEY PRODUCTION » passe sur deux lignes en portrait. Nouveau titre : ajouter une variante `.vhs-hero__t--x { --fit: … }`.
- **Navigation** (header, menu mobile, footer, portes de l'accueil) : Accueil · Production · Events · Conciergerie · Contact. Curseur du navigateur, aucun curseur personnalisé.


## Traduction FR / EN

- Sélecteur FR / EN dans le header (`src/js/lang-switch.js`) ; langue mémorisée dans le navigateur (`monkey-production-lang`), appliquée avant l'affichage (`partials/head.html`, inclus en tête de chaque page).
- Textes : `src/i18n/fr.js` (référence, identique aux textes écrits dans les pages) et `src/i18n/en.js`. **Toute clé ajoutée dans l'un doit exister dans l'autre.**
- Dans le HTML : `data-i18n="clé"` (texte), `data-i18n-html="clé"` (texte avec `<em>`), `data-i18n-attr="aria-label:clé; data-label:clé"` (attributs, libellés des emplacements « à venir »).
- Dans le JS : `t('clé')` et `onLangChange(fn)` (`src/i18n/index.js`). Textes alternatifs des destinations : `alt: { fr, en }` dans `src/site.config.js`.
- Noms propres et titres d'œuvres non traduits (Monkey Production, Aya Nakamura, « Chimiyé », Julien Doré, « Nous », destinations) ; guillemets anglais “ ” en EN.

## Médias

Tout se dépose dans `public/media/` puis se déclare dans `src/site.config.js` (chemin public = sans `public/`).
Tant qu'un média vaut `null`, son emplacement affiche un fond temporaire neutre.

| Média | Dossier | Déclaration (`src/site.config.js`) | Format conseillé |
|---|---|---|---|
| Vidéo du hero | `public/media/hero/` | `hero.video.desktop`, `hero.video.mobile`, `hero.poster` | MP4 H.264 sans son, 16:9 ; 1920 px (≈ 8 Mo) + 1280 px pour mobile (≈ 3,5 Mo) ; poster JPG 1920 px |
| Image de la porte Events | `public/media/blocks/` | `blocks.events = { src: '/media/blocks/events.jpg' }` | JPG/WebP ≥ 2000 × 2000 px, sujet centré (affichée ≈ carrée sur ordinateur, 16:10 sur tablette, 4:5 sur mobile) |
| Image de la porte Production | `public/media/blocks/` | `blocks.production = { src: '/media/blocks/production.jpg' }` | JPG/WebP ≥ 1800 × 1800 px, sujet centré (≈ 3:2 sur ordinateur, 4:5 sur tablette, 4:3 sur mobile) |
| Image de la porte Conciergerie | `public/media/blocks/` | `blocks.conciergerie = { src: '/media/blocks/conciergerie.jpg' }` | idem Production |
| Logo Monkey Production | `public/media/logo/` | `logo = { src: '/media/logo/monkey-production.svg', alt: 'Monkey Production' }` | SVG clair (affiché sur fond noir) |
| Photos des destinations | `public/media/destinations/` | `destinations = [{ name, image: { src, webp, sizes, position }, alt }]` | JPG + WebP, ≥ 1000 px de large ; recadrée en paysage sur ordinateur, en portrait (4:5) sur mobile |
| Médias de la page Production | `public/media/production/` | `production.hero` (vidéo du hero de la page ; `null` = vidéo de l'accueil), `production.aya.{main, side1, side2}`, `production.dore.{main, side1, side2}` = `{ video: { src, mobile?, poster } }` ou `{ image: { src }, alt }` | hero : vidéo plein écran recadrée ; Aya : extrait 16:9, images 4:5 et 3:4 ; Doré : extrait 4:3 (16:9 mobile), images 1:1 et 3:2. Vidéos MP4 H.264 sans son : chargées seulement à l'approche de l'écran |
| Photos de la page Conciergerie | `public/media/conciergerie/` | `conciergerie.hero`, `.wide`, `.detail`, `.services.{travel, access, artists, custom}` (même syntaxe que Production) | hero ≈ 4:5 ; wide 21:9 (4:3 mobile) ; detail 4:5 ; demandes 4:5, 1:1, 3:2, 3:4 |
| Logos partenaires | `public/media/partners/` | `partners = [{ name, logo, url? }, …]` | SVG ou PNG transparent, recadré au plus près |

Option `position` pour les images des blocs (ex. `{ src, position: '50% 30%' }`) : point de cadrage du recadrage `cover`.

La vidéo actuelle (`public/media/hero/`) est une version web de `../Pics /monkey-events-hero.mp4` (original non modifié).
