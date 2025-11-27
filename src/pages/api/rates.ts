// src/pages/api/rates.ts
import type { APIRoute } from 'astro';
import { getAllRates, formatBs, formatDate } from '../../utils/api';

export const GET: APIRoute = async ({ request }) => {
  const startTime = Date.now();

  try {
    console.log('[API Endpoint] Fetching exchange rates...');
    const rates = await getAllRates();

    // Check if we got valid rates
    if (!rates || rates.length === 0) {
      console.error('[API Endpoint] No rates returned from getAllRates');
      return new Response(
        JSON.stringify({
          error: 'No exchange rates available',
          timestamp: new Date().toISOString()
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
          },
        }
      );
    }

    // Format rates for response
    const formattedRates = rates.map(rate => ({
      ...rate,
      formattedRate: formatBs(rate.rate),
      formattedDate: formatDate(rate.lastUpdate),
    }));

    const duration = Date.now() - startTime;
    console.log(`[API Endpoint] Successfully fetched ${rates.length} rates in ${duration}ms`);

    return new Response(JSON.stringify(formattedRates), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // Cache for 5 minutes, serve stale for up to 10 minutes while revalidating
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API Endpoint] Error after ${duration}ms:`, error);

    return new Response(
      JSON.stringify({
        error: 'Failed to fetch exchange rates',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  }
};