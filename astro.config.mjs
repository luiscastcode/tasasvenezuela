// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: vercel({
        webAnalytics: {
            enabled: true
        },
        maxDuration: 10,
        isr: {
            // Cache pages for 5 minutes
            expiration: 300,
        }
    }),
    vite: {
        ssr: {
            external: ['@astrojs/vercel']
        }
    }
});
