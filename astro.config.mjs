// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Set this to the production URL once the site is deployed.
  site: 'https://sessiz-sifaris.example.org',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
