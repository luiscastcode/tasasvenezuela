import { g as getAllRates, f as formatDate, a as formatBs } from '../../chunks/api_0QOGGRCO.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ request }) => {
  const startTime = Date.now();
  try {
    console.log("[API Endpoint] Fetching exchange rates...");
    const rates = await getAllRates();
    if (!rates || rates.length === 0) {
      console.error("[API Endpoint] No rates returned from getAllRates");
      return new Response(
        JSON.stringify({
          error: "No exchange rates available",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }),
        {
          status: 503,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate"
          }
        }
      );
    }
    const formattedRates = rates.map((rate) => ({
      ...rate,
      formattedRate: formatBs(rate.rate),
      formattedDate: formatDate(rate.lastUpdate)
    }));
    const duration = Date.now() - startTime;
    console.log(`[API Endpoint] Successfully fetched ${rates.length} rates in ${duration}ms`);
    return new Response(JSON.stringify(formattedRates), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 5 minutes, serve stale for up to 10 minutes while revalidating
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600"
      }
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API Endpoint] Error after ${duration}ms:`, error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch exchange rates",
        message: error instanceof Error ? error.message : "Unknown error",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate"
        }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
