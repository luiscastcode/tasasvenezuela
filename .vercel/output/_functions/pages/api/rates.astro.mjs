import { g as getAllRates, f as formatDate, a as formatBs } from '../../chunks/api_Cq8qvWZO.mjs';
export { renderers } from '../../renderers.mjs';

const GET = async ({ url }) => {
  try {
    const rates = await getAllRates();
    const formattedRates = rates.map((rate) => ({
      ...rate,
      formattedRate: formatBs(rate.rate),
      formattedDate: formatDate(rate.lastUpdate)
    }));
    return new Response(JSON.stringify(formattedRates), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600"
        // cache 5 min en Vercel
      }
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch exchange rates" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
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
