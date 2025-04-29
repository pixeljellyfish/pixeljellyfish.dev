import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

console.log('Loaded OPENWEATHER_API_KEY in astro.config.mjs:', process.env.OPENWEATHER_API_KEY); // Debug log

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
    logLevel: 'error',
  },
});