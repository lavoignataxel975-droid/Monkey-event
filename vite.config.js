/**
 * Monkey Production — Vite multi-pages.
 *
 *   <!-- @include header -->  → partials/header.html (idem footer)
 *   <body data-page="contact"> → le lien de navigation [data-nav="contact"] reçoit aria-current="page"
 *   /evenements, /contact…     → servis par evenements.html, contact.html… (URL propres, comme vercel.json → cleanUrls)
 *   /events (ancienne rubrique) → redirigée vers /evenements
 *   /responsive-preview         → outil local (dev seulement) : site dans un iPhone 16 et un iPad côte à côte
 */
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const pages = ['index', 'evenements', 'production', 'conciergerie', 'contact', 'mentions-legales'];
const redirects = { events: '/evenements' };
// outils locaux : servis par `npm run dev` uniquement, absents du build (donc jamais publiés)
const devOnly = ['responsive-preview'];

const partial = (name) => readFileSync(`${root}partials/${name}.html`, 'utf8');

function partials() {
  return {
    name: 'monkey-partials',
    transformIndexHtml(html) {
      const page = html.match(/<body[^>]*data-page="([^"]+)"/)?.[1];
      let out = html.replace(/<!--\s*@include (\w+)\s*-->/g, (_, name) => partial(name));
      if (page) out = out.replaceAll(`data-nav="${page}"`, `data-nav="${page}" aria-current="page"`);
      return out;
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/partials/')) server.ws.send({ type: 'full-reload' });
    },
  };
}

// /contact → /contact.html (dev et preview)
function cleanUrls() {
  const rewriter = (served) => (req, res, next) => {
    const [path, query = ''] = req.url.split('?');
    const name = path.replace(/^\/|\/$/g, '');
    if (redirects[name]) { res.writeHead(301, { Location: redirects[name] }); res.end(); return; }
    if (served.includes(name) && name !== 'index') req.url = `/${name}.html${query ? `?${query}` : ''}`;
    next();
  };
  const rewrite = rewriter(pages);
  return {
    name: 'monkey-clean-urls',
    configureServer(server) { server.middlewares.use(rewriter([...pages, ...devOnly])); },
    configurePreviewServer(server) { server.middlewares.use(rewrite); },
  };
}

export default defineConfig({
  plugins: [partials(), cleanUrls()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, `${root}${p}.html`])),
    },
  },
});
