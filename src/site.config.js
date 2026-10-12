/**
 * Médias du site : seul fichier à modifier pour brancher les visuels définitifs.
 * Les fichiers se déposent dans public/media/ (servis à la racine : public/media/x.jpg → '/media/x.jpg').
 * `null` (ou tableau vide) = emplacement réservé : fond temporaire neutre, aucun visuel inventé.
 * Détail des formats conseillés : README.md → « Médias ».
 */
export default {
  // Hero (accueil, et pages Production, Events, Conciergerie en exemple) : lecture automatique, en boucle, sans son ; `mobile` est servie sous 900 px de large (ou en mode économie de données).
  hero: {
    video: {
      desktop: '/media/hero/monkey-events-hero.mp4',      // 1920 px de large
      mobile: '/media/hero/monkey-events-hero-720.mp4',   // 1280 px de large, plus légère
    },
    poster: '/media/hero/monkey-events-hero-poster.jpg',  // première image de la vidéo
  },

  // Les trois portes sous le hero : { src, srcset?, position? } (position = object-position CSS, ex. '50% 30%')
  // `null` = emplacement réservé (fond temporaire « Visuel à venir »). Recadrage automatique (cover) selon l'écran :
  //   production   : ordinateur ≈ carré (grand bloc gauche), tablette ≈ 16:10, mobile 4:5 → visuel ≥ 2000 × 2000 px, sujet centré
  //   events       : ordinateur ≈ 3:2 (paysage), tablette et mobile 4:5 / 4:3 → visuel ≥ 1800 × 1800 px, sujet centré
  //   conciergerie : idem events
  blocks: {
    // photo des Seychelles (même fichier que la destination) ; srcset = versions par largeur
    events: { src: '/media/destinations/seychelles.jpg', srcset: '/media/destinations/seychelles-640.jpg 640w, /media/destinations/seychelles.jpg 1046w', position: '50% 55%' },
    production: null,     // ex. { src: '/media/blocks/production.jpg' }
    conciergerie: null,   // ex. { src: '/media/blocks/conciergerie.jpg' }
  },

  // Logo Monkey Production (pied de page) : { src, alt }
  logo: null,       // ex. { src: '/media/logo/monkey-production.svg', alt: 'Monkey Production' }

  // Partenaires : [{ name, logo, url? }] ; tant que la liste est vide, `partnerSlots` emplacements vides sont affichés.
  partners: [],     // ex. { name: 'Nom du partenaire', logo: '/media/partners/nom.svg', url: 'https://…' }
  partnerSlots: 5,

  // Page Événements : destinations où l'agence a déjà organisé des événements (ordre = ordre d'affichage).
  // image : { src (JPG), webp?, srcset? (largeurs), position? (cadrage object-position) } ; alt = description de la photo ({ fr, en } : suit la langue du site).
  destinations: [
    {
      name: 'Seychelles',
      image: { src: '/media/destinations/seychelles.jpg', webp: '/media/destinations/seychelles.webp', sizes: { 640: '-640', 1046: '' }, position: '50% 42%' },
      alt: { fr: 'Vue aérienne d’une côte de rochers de granit et de sable blanc aux Seychelles', en: 'Aerial view of a coastline of granite boulders and white sand in the Seychelles' },
    },
    {
      name: 'Bali',
      image: { src: '/media/destinations/bali.jpg', webp: '/media/destinations/bali.webp', sizes: { 640: '-640', 1032: '' }, position: '50% 58%' },
      alt: { fr: 'Piscine à débordement face aux rizières en terrasses et aux montagnes de Bali', en: 'Infinity pool overlooking terraced rice fields and the mountains of Bali' },
    },
    {
      name: 'Corse',
      image: { src: '/media/destinations/corse.jpg', webp: '/media/destinations/corse.webp', sizes: { 640: '-640', 1038: '' }, position: '50% 45%' },
      alt: { fr: 'Aiguilles de granit et forêt de pins au coucher du soleil en Corse', en: 'Granite peaks and pine forest at sunset in Corsica' },
    },
    {
      name: 'Marrakech',
      image: { src: '/media/destinations/marrakech.jpg', webp: '/media/destinations/marrakech.webp', sizes: { 640: '-640', 1041: '' }, position: '50% 62%' },
      alt: { fr: 'Façade ocre aux arches sculptées se reflétant dans un bassin à Marrakech', en: 'Ochre façade with carved arches reflected in a pool in Marrakech' },
    },
    {
      name: 'Mykonos',
      image: { src: '/media/destinations/mykonos.jpg', webp: '/media/destinations/mykonos.webp', sizes: { 640: '-640', 1058: '' }, position: '50% 55%' },
      alt: { fr: 'Terrasse avec bassin ouverte sur la mer au coucher du soleil à Mykonos', en: 'Terrace with a plunge pool opening onto the sea at sunset in Mykonos' },
    },
    {
      name: 'Saint-Barthélemy',
      image: { src: '/media/destinations/saint-barthelemy.jpg', webp: '/media/destinations/saint-barthelemy.webp', sizes: { 640: '-640', 1037: '' }, position: '50% 62%' },
      alt: { fr: 'Baie turquoise et collines verdoyantes à Saint-Barthélemy', en: 'Turquoise bay and green hills in Saint-Barthélemy' },
    },
    {
      name: 'Ibiza',
      image: { src: '/media/destinations/ibiza.jpg', webp: '/media/destinations/ibiza.webp', sizes: { 640: '-640', 844: '' }, position: '50% 55%' },
      alt: { fr: 'Crique aux eaux turquoise bordée de falaises calcaires à Ibiza', en: 'Turquoise cove framed by limestone cliffs in Ibiza' },
    },
  ],

  // Page Production : emplacements photo / vidéo (null = réservé, rien n'est chargé). Fichiers dans public/media/production/.
  //   { video: { src: '/media/production/x.mp4', mobile?: '…-720.mp4', poster: '/media/production/x.jpg' }, alt?: '…' }
  //   { image: { src: '/media/production/x.jpg', srcset?, position? }, alt: 'description de la photo' }
  // Formats d'affichage (recadrage automatique, sujet centré) :
  production: {
    hero: null,                        // vidéo du hero de la page (plein écran, recadrée) : { video: { src, mobile?, poster } } ; null = vidéo de l'accueil
    aya: {
      main: null,                      // extrait du clip « Chimiyé » : 16:9
      side1: null,                     // image : portrait 4:5
      side2: null,                     // coulisses : portrait 3:4
    },
    dore: {
      main: null,                      // extrait du clip : 4:3 (16:9 sur mobile)
      side1: null,                     // photographie : carré 1:1
      side2: null,                     // visuel : paysage 3:2
    },
  },

  // Page Conciergerie : photographies (même syntaxe que production ; null = réservé). Fichiers dans public/media/conciergerie/.
  conciergerie: {
    hero: null,                        // ≈ 4:5 (portrait), hauteur d'écran sur ordinateur
    wide: null,                        // 21:9 sur ordinateur, 4:3 sur mobile
    detail: null,                      // 4:5
    services: {
      travel: null,                    // Déplacements & séjours : 4:5
      access: null,                    // Expériences & accès privilégiés : 1:1
      artists: null,                   // Accompagnement des artistes : 3:2
      custom: null,                    // Demandes sur mesure : 3:4
    },
  },

  // Page Contact : `null` = « À compléter » (e-mail, téléphone) ou ligne masquée (adresse, réseaux sociaux).
  contact: {
    email: null,      // ex. 'contact@…'
    phone: null,      // ex. '+33 6 00 00 00 00' (affiché tel quel, lien tel: généré automatiquement)
    address: null,    // ex. ['Rue…', '07800 Ibiza'] : une entrée par ligne ; masquée tant que `null`
    socials: [],      // ex. { name: 'Instagram', url: 'https://instagram.com/…' }
    // Service d'envoi du formulaire : URL qui reçoit un POST (FormData : nom, email, telephone, message)
    // et répond 2xx en cas de succès (ex. Formspree, ou une fonction serveur). `null` = envoi non activé.
    formEndpoint: null,
  },
};
