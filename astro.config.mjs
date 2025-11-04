import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

let not_sensitive_data = { a: 1, b : 2} 
// GOOD: it is fine to log data that is not sensitive
console.info(`[INFO] Some object contains: ${JSON.stringify(not_sensitive_data)}`);

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