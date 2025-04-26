import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    assetsInclude: ['*.svg'], // Use single wildcard
    optimizeDeps: {
      exclude: ['*.svg'], // Use single wildcard
    },
  },
});