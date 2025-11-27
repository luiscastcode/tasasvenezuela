import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
    console.log('[Health Check] Endpoint hit');
    return new Response(
        JSON.stringify({
            status: 'ok',
            timestamp: new Date().toISOString(),
            message: 'Health check passed'
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
};
