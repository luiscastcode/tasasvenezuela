import { e as createComponent, f as createAstro, k as renderComponent, l as renderScript, r as renderTemplate, h as addAttribute, n as renderHead, o as renderSlot, m as maybeRenderHead } from './astro/server_BgU6a7cG.mjs';
import 'piccolore';
/* empty css                                               */
import 'clsx';

const $$Astro$1 = createAstro();
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Index;
  const propsStr = JSON.stringify(Astro2.props);
  const paramsStr = JSON.stringify(Astro2.params);
  return renderTemplate`${renderComponent($$result, "vercel-analytics", "vercel-analytics", { "data-props": propsStr, "data-params": paramsStr, "data-pathname": Astro2.url.pathname })} ${renderScript($$result, "E:/AstroJs/tasas-venezuela/node_modules/@vercel/analytics/dist/astro/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "E:/AstroJs/tasas-venezuela/node_modules/@vercel/analytics/dist/astro/index.astro", void 0);

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const {
    title,
    description = "Consulta las tasas de cambio del d\xEDa en Venezuela: D\xF3lar BCV, Euro BCV y USDT. Convierte divisas y calcula precios con margen de ganancia."
  } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="description"${addAttribute(description, "content")}><meta name="generator"${addAttribute(Astro2.generator, "content")}><!-- SEO Meta Tags --><meta name="author" content="Tasas Venezuela"><meta name="keywords" content="dólar, euro, USDT, BCV, Venezuela, tasas de cambio, bolívares, conversión de divisas"><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:title"${addAttribute(title, "content")}><meta property="og:description"${addAttribute(description, "content")}><!-- Twitter --><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title"${addAttribute(title, "content")}><meta name="twitter:description"${addAttribute(description, "content")}><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Analytics", $$Index, {})} </body></html>`;
}, "E:/AstroJs/tasas-venezuela/src/layouts/Layout.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="header" data-astro-cid-3ef6ksr2> <div class="container" data-astro-cid-3ef6ksr2> <nav class="nav" data-astro-cid-3ef6ksr2> <a href="/" class="logo" data-astro-cid-3ef6ksr2> <span class="logo-icon" data-astro-cid-3ef6ksr2>💱</span> <span class="logo-text" data-astro-cid-3ef6ksr2>Tasas Venezuela</span> </a> <div class="nav-links" data-astro-cid-3ef6ksr2> <a href="/" class="nav-link" data-astro-cid-3ef6ksr2>Inicio</a> <a href="/terminos-de-servicio" class="nav-link" data-astro-cid-3ef6ksr2>Términos</a> <a href="/politica-de-privacidad" class="nav-link" data-astro-cid-3ef6ksr2>Privacidad</a> <a href="/descargo-de-responsabilidad" class="nav-link" data-astro-cid-3ef6ksr2>Descargo</a> </div> </nav> </div> </header> `;
}, "E:/AstroJs/tasas-venezuela/src/components/Header.astro", void 0);

const $$Footer = createComponent(($$result, $$props, $$slots) => {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${maybeRenderHead()}<footer class="footer" data-astro-cid-sz7xmlte> <div class="container" data-astro-cid-sz7xmlte> <div class="footer-content" data-astro-cid-sz7xmlte> <div class="footer-section" data-astro-cid-sz7xmlte> <h3 class="footer-title" data-astro-cid-sz7xmlte>Tasas Al Día en Venezuela</h3> <p class="footer-text" data-astro-cid-sz7xmlte>
Información actualizada sobre las tasas de cambio en
                    Venezuela.
</p> </div> <div class="footer-section" data-astro-cid-sz7xmlte> <h4 class="footer-subtitle" data-astro-cid-sz7xmlte>Legal</h4> <ul class="footer-links" data-astro-cid-sz7xmlte> <li data-astro-cid-sz7xmlte> <a href="/terminos-de-servicio" data-astro-cid-sz7xmlte>Términos de Servicio</a> </li> <li data-astro-cid-sz7xmlte> <a href="/politica-de-privacidad" data-astro-cid-sz7xmlte>Política de Privacidad</a> </li> <li data-astro-cid-sz7xmlte> <a href="/politica-de-cookies" data-astro-cid-sz7xmlte>Política de Cookies</a> </li> <li data-astro-cid-sz7xmlte> <a href="/descargo-de-responsabilidad" data-astro-cid-sz7xmlte>Descargo de Responsabilidad</a> </li> </ul> </div> <div class="footer-section" data-astro-cid-sz7xmlte> <h4 class="footer-subtitle" data-astro-cid-sz7xmlte>Información</h4> <p class="footer-text small" data-astro-cid-sz7xmlte>
Los datos mostrados son de carácter informativo y provienen
                    de fuentes públicas. No constituyen información oficial ni
                    asesoría financiera.
</p> </div> </div> <div class="footer-bottom" data-astro-cid-sz7xmlte> <p class="copyright" data-astro-cid-sz7xmlte>
© ${currentYear} Tasas Venezuela. Todos los derechos reservados.
</p> </div> </div> </footer> `;
}, "E:/AstroJs/tasas-venezuela/src/components/Footer.astro", void 0);

export { $$Layout as $, $$Header as a, $$Footer as b };
