import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_astro/
Disallow: /admin/
Disallow: /*?*utm_
Disallow: /*?*fbclid=
Disallow: /*?*gclid=
# Bloquear la página 404 (no aporta)
Disallow: /404

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};