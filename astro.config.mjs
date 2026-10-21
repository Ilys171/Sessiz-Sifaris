// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ilys171.github.io',
  base: '/Sessiz-Sifaris/',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
