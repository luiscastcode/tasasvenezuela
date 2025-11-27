// src/pages/api/rates.ts
import type { APIRoute } from 'astro';
import { getAllRates, formatBs, formatCurrency, formatDate } from '../../utils/api';

export const GET: APIRoute = async ({ url }) => {
  try {
    const rates = await getAllRates();

    // Opcional: aplica formato si lo necesitas en el API
    const formattedRates = rates.map(rate => ({
      ...rate,
      formattedRate: formatBs(rate.rate),
      formattedDate: formatDate(rate.lastUpdate),
    }));

    return new Response(JSON.stringify(formattedRates), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=300, stale-while-revalidate=600', // cache 5 min en Vercel
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch exchange rates' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};