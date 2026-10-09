/**
 * Monkey Events — Vite multi-pages.
 *
 *   <!-- @include header -->  → partials/header.html (idem footer)
 *   <body data-page="contact"> → le lien de navigation [data-nav="contact"] reçoit aria-current="page"
 *   /evenements, /contact…     → servis par evenements.html, contact.html… (URL propres, comme vercel.json → cleanUrls)
 *   /events (ancienne rubrique) → redirigée vers /evenements
 *   {{icon:nom}}                → icône Phosphor (node_modules/@phosphor-icons/core, graisse light)
 */
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const pages = ['index', 'evenements', 'contact', 'mentions-legales'];
const redirects = { events: '/evenements' };

const partial = (name) => readFileSync(`${root}partials/${name}.html`, 'utf8');
// {{icon:arrow-down}} → icône Phosphor (graisse « light »), décorative
const icon = (name) => readFileSync(`${root}node_modules/@phosphor-icons/core/assets/light/${name}-light.svg`, 'utf8')
  .replace('<svg ', '<svg class="icon" aria-hidden="true" focusable="false" ');

function partials() {
  return {
    name: 'monkey-partials',
    transformIndexHtml(html) {
      const page = html.match(/<body[^>]*data-page="([^"]+)"/)?.[1];
      let out = html.replace(/<!--\s*@include (\w+)\s*-->/g, (_, name) => partial(name));
      out = out.replace(/\{\{icon:([a-z-]+)\}\}/g, (_, name) => icon(name));
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
  const rewrite = (req, res, next) => {
    const [path, query = ''] = req.url.split('?');
    const name = path.replace(/^\/|\/$/g, '');
    if (redirects[name]) { res.writeHead(301, { Location: redirects[name] }); res.end(); return; }
    if (pages.includes(name) && name !== 'index') req.url = `/${name}.html${query ? `?${query}` : ''}`;
    next();
  };
  return {
    name: 'monkey-clean-urls',
    configureServer(server) { server.middlewares.use(rewrite); },
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
