// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Temporary: served from GitHub Pages until the www.sessizsifaris.com certificate is ready.
  // To switch to the custom domain: set site to 'https://www.sessizsifaris.com' and remove base.
  site: 'https://ilys171.github.io',
  base: '/Sessiz-Sifaris/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
