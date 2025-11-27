import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_DS6w16Ou.mjs';
import { manifest } from './manifest_FdggUsoj.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/descargo-de-responsabilidad.astro.mjs');
const _page2 = () => import('./pages/politica-de-cookies.astro.mjs');
const _page3 = () => import('./pages/politica-de-privacidad.astro.mjs');
const _page4 = () => import('./pages/terminos-de-servicio.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/descargo-de-responsabilidad.astro", _page1],
    ["src/pages/politica-de-cookies.astro", _page2],
    ["src/pages/politica-de-privacidad.astro", _page3],
    ["src/pages/terminos-de-servicio.astro", _page4],
    ["src/pages/index.astro", _page5]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "bd1a894a-6c2b-4f31-a4bc-aa54a4c48454",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
