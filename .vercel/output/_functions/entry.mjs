import { renderers } from './renderers.mjs';
import { s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_VFUEmVsm.mjs';
import { manifest } from './manifest_kj1t6w2H.mjs';
import { createExports } from '@astrojs/vercel/entrypoint';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/rates.astro.mjs');
const _page2 = () => import('./pages/descargo-de-responsabilidad.astro.mjs');
const _page3 = () => import('./pages/politica-de-cookies.astro.mjs');
const _page4 = () => import('./pages/politica-de-privacidad.astro.mjs');
const _page5 = () => import('./pages/terminos-de-servicio.astro.mjs');
const _page6 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/rates.ts", _page1],
    ["src/pages/descargo-de-responsabilidad.astro", _page2],
    ["src/pages/politica-de-cookies.astro", _page3],
    ["src/pages/politica-de-privacidad.astro", _page4],
    ["src/pages/terminos-de-servicio.astro", _page5],
    ["src/pages/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "0f6e623b-8228-40ee-a43e-0701de253d6c",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
