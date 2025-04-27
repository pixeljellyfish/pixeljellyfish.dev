import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    plugins: [
      {
        name: 'vite-raw-plugin-fix',
        enforce: 'pre',
        transform(code, id) {
          if (id.includes('?raw')) {
            return { code: `export default ${JSON.stringify(code)}`, map: null };
          }
        },
      },
    ],
    logLevel: 'error', // Suppress warnings
  },
});