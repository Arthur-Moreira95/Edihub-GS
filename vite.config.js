import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// base relativo: o build funciona em qualquer subpasta (ex.: GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
