import { e as createComponent, f as createAstro, m as maybeRenderHead, r as renderTemplate, l as renderScript, h as addAttribute, k as renderComponent } from '../chunks/astro/server_DDVgKadx.mjs';
import 'piccolore';
import { $ as $$Layout, a as $$Header, b as $$Footer } from '../chunks/Footer_qI68Jvsv.mjs';
import 'clsx';
import { a as formatBs, f as formatDate, g as getAllRates } from '../chunks/api_Cq8qvWZO.mjs';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro$2 = createAstro();
const $$ExchangeRateCard = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$ExchangeRateCard;
  const { rate } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="rate-card glass-card" data-astro-cid-s7sho54z> <div class="rate-header" data-astro-cid-s7sho54z> <div class="rate-icon" data-astro-cid-s7sho54z>${rate.symbol}</div> <div class="rate-info" data-astro-cid-s7sho54z> <h3 class="rate-name" data-astro-cid-s7sho54z>${rate.name}</h3> <span class="rate-code" data-astro-cid-s7sho54z>${rate.code}</span> </div> </div> <div class="rate-value" data-astro-cid-s7sho54z> ${rate.rate > 0 ? formatBs(rate.rate) : "No disponible"} </div> <div class="rate-footer" data-astro-cid-s7sho54z> <span class="rate-update" data-astro-cid-s7sho54z>
Actualizado: ${formatDate(rate.lastUpdate)} </span> </div> </div> `;
}, "E:/AstroJs/tasas-venezuela/src/components/ExchangeRateCard.astro", void 0);

const $$Astro$1 = createAstro();
const $$CurrencyConverter = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$CurrencyConverter;
  const { rates } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="converter glass-card" data-astro-cid-2k45alni> <h2 class="converter-title" data-astro-cid-2k45alni>Convertidor de Divisas</h2> <p class="converter-description" data-astro-cid-2k45alni>
Convierte entre bolívares y divisas extranjeras
</p> <div class="converter-form" data-astro-cid-2k45alni> <div class="input-group" data-astro-cid-2k45alni> <label for="amount" class="input-label" data-astro-cid-2k45alni>Monto</label> <input type="number" id="amount" class="input-field" placeholder="0.00" value="1" min="0" step="0.01" data-astro-cid-2k45alni> </div> <div class="input-group" data-astro-cid-2k45alni> <label for="currency" class="input-label" data-astro-cid-2k45alni>Divisa</label> <select id="currency" class="input-field" data-astro-cid-2k45alni> ${rates.map((rate) => renderTemplate`<option${addAttribute(`${rate.code}:${rate.rate}`, "value")} data-astro-cid-2k45alni> ${rate.name} (${rate.symbol})
</option>`)} </select> </div> <button id="swap-btn" class="swap-btn" title="Invertir conversión" data-astro-cid-2k45alni> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-astro-cid-2k45alni> <path d="M7 16V4M7 4L3 8M7 4L11 8" data-astro-cid-2k45alni></path> <path d="M17 8V20M17 20L21 16M17 20L13 16" data-astro-cid-2k45alni></path> </svg> </button> <div class="result-group" data-astro-cid-2k45alni> <label class="input-label" data-astro-cid-2k45alni>Resultado</label> <div class="result-display" id="result" data-astro-cid-2k45alni>Bs. 0.00</div> </div> </div> </div> ${renderScript($$result, "E:/AstroJs/tasas-venezuela/src/components/CurrencyConverter.astro?astro&type=script&index=0&lang.ts")} `;
}, "E:/AstroJs/tasas-venezuela/src/components/CurrencyConverter.astro", void 0);

const $$Astro = createAstro();
const $$ProfitCalculator = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$ProfitCalculator;
  const { rates } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div class="calculator glass-card"${addAttribute(JSON.stringify(rates), "data-rates")} data-astro-cid-hqkh3psv> <h2 class="calculator-title" data-astro-cid-hqkh3psv>Calculadora de Precios</h2> <p class="calculator-description" data-astro-cid-hqkh3psv>
Si eres comerciante puedes calcular el precio de venta de tu producto
        con margen de ganancia deseado
</p> <div class="calculator-form" data-astro-cid-hqkh3psv> <div class="input-row" data-astro-cid-hqkh3psv> <div class="input-group flex-1" data-astro-cid-hqkh3psv> <label for="cost" class="input-label" data-astro-cid-hqkh3psv>Costo del Producto</label> <input type="number" id="cost" class="input-field" placeholder="0.00" value="100" min="0" step="0.01" data-astro-cid-hqkh3psv> </div> <div class="input-group" style="min-width: 150px;" data-astro-cid-hqkh3psv> <label for="cost-currency" class="input-label" data-astro-cid-hqkh3psv>Divisa del Costo</label> <select id="cost-currency" class="input-field" data-astro-cid-hqkh3psv> <option value="VES:1" data-astro-cid-hqkh3psv>Bolívares (Bs)</option> ${rates.map((rate) => renderTemplate`<option${addAttribute(`${rate.code}:${rate.rate}`, "value")} data-astro-cid-hqkh3psv> ${rate.code} (${rate.symbol})
</option>`)} </select> </div> </div> <div class="input-group" data-astro-cid-hqkh3psv> <div class="margin-header" data-astro-cid-hqkh3psv> <label for="margin" class="input-label" data-astro-cid-hqkh3psv>Margen de Ganancia Deseado (%)</label> <span class="margin-value" id="margin-display" data-astro-cid-hqkh3psv>30%</span> </div> <input type="range" id="margin" class="slider" min="0" max="35" value="30" step="1" data-astro-cid-hqkh3psv> <div class="slider-labels" data-astro-cid-hqkh3psv> <span data-astro-cid-hqkh3psv>0%</span> <span data-astro-cid-hqkh3psv>35%</span> </div> </div> <div class="results" data-astro-cid-hqkh3psv> <div class="result-item" data-astro-cid-hqkh3psv> <span class="result-label" data-astro-cid-hqkh3psv>Costo en Bs:</span> <span class="result-value" id="cost-bs" data-astro-cid-hqkh3psv>Bs. 100.00</span> </div> <div class="result-item" data-astro-cid-hqkh3psv> <span class="result-label" data-astro-cid-hqkh3psv>Ganancia:</span> <span class="result-value success" id="profit" data-astro-cid-hqkh3psv>Bs. 42.86</span> </div> <div class="result-item highlight" data-astro-cid-hqkh3psv> <span class="result-label" data-astro-cid-hqkh3psv>Precio de Venta en Bs:</span> <span class="result-value large" id="sale-price-bs" data-astro-cid-hqkh3psv>Bs. 142.86</span> </div> <div class="currency-prices" data-astro-cid-hqkh3psv> <h3 class="currency-prices-title" data-astro-cid-hqkh3psv>
Precios a Publicar por Divisa
</h3> <div class="currency-grid" id="currency-grid" data-astro-cid-hqkh3psv> <!-- Currency prices will be inserted here --> </div> </div> </div> </div> </div> ${renderScript($$result, "E:/AstroJs/tasas-venezuela/src/components/ProfitCalculator.astro?astro&type=script&index=0&lang.ts")} `;
}, "E:/AstroJs/tasas-venezuela/src/components/ProfitCalculator.astro", void 0);

const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const rates = await getAllRates();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tasas Al D\xEDa en Venezuela - Consulta de Tasas", "data-astro-cid-j7pv25f6": true }, { "default": async ($$result2) => renderTemplate` ${renderComponent($$result2, "Header", $$Header, { "data-astro-cid-j7pv25f6": true })} ${maybeRenderHead()}<main data-astro-cid-j7pv25f6> <!-- Hero Section --> <section class="hero" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <h1 class="hero-title fade-in" data-astro-cid-j7pv25f6>Tasas Al Día en Venezuela</h1> <p class="hero-subtitle fade-in" data-astro-cid-j7pv25f6>
Consulta las tasas actualizadas del Dólar BCV, Euro BCV y USDT en
          tiempo real
</p> </div> </section> <!-- Exchange Rates Section --> <section class="rates-section" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <div class="grid grid-cols-3" data-astro-cid-j7pv25f6> ${rates.map((rate) => renderTemplate`${renderComponent($$result2, "ExchangeRateCard", $$ExchangeRateCard, { "rate": rate, "data-astro-cid-j7pv25f6": true })}`)} </div> </div> </section> <!-- Currency Converter Section --> <section class="converter-section" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "CurrencyConverter", $$CurrencyConverter, { "rates": rates, "data-astro-cid-j7pv25f6": true })} </div> </section> <section class="info-banner" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <div class="cta-section" data-astro-cid-j7pv25f6> <div class="cta-box" data-astro-cid-j7pv25f6> <img src="img/bybit.png" alt="Bybit" data-astro-cid-j7pv25f6> <p data-astro-cid-j7pv25f6>
Unete a Bybit y compra USDT a un precio excelente para resgurdar
              tus bolivares.
</p> <a href="https://www.bybit.com/invite?ref=Y8MB0PP" class="btn btn-primary" target="_blank" data-astro-cid-j7pv25f6>
Unete a Bybit
</a> </div> </div> </div> </section> <!-- Profit Calculator Section --> <section class="calculator-section" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "ProfitCalculator", $$ProfitCalculator, { "rates": rates, "data-astro-cid-j7pv25f6": true })} </div> </section> <!-- Info Banner --> <section class="info-banner" data-astro-cid-j7pv25f6> <div class="container" data-astro-cid-j7pv25f6> <div class="banner-content glass-card" data-astro-cid-j7pv25f6> <div class="banner-icon" data-astro-cid-j7pv25f6>⚠️</div> <div class="banner-text" data-astro-cid-j7pv25f6> <h3 data-astro-cid-j7pv25f6>Información Importante</h3> <p data-astro-cid-j7pv25f6>
Los datos mostrados son de carácter informativo y provienen de
              fuentes públicas. No constituyen información oficial ni asesoría
              financiera.
<a href="/descargo-de-responsabilidad" data-astro-cid-j7pv25f6>Leer más</a> </p> </div> </div> </div> </section> </main> ${renderComponent($$result2, "Footer", $$Footer, { "data-astro-cid-j7pv25f6": true })} ` })} `;
}, "E:/AstroJs/tasas-venezuela/src/pages/index.astro", void 0);

const $$file = "E:/AstroJs/tasas-venezuela/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$Index,
    file: $$file,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
