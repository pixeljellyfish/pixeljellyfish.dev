import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    assetsInclude: ['**/*.svg'], // Ensure SVGs are treated as assets
    optimizeDeps: {
      exclude: ['**/*.svg'], // Exclude SVGs from optimization to avoid raw import issues
    },
  },
});