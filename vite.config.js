import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  /* Relative asset paths mean the built `dist/` folder works from any location:
   * a Netlify drop, a Vercel deploy, a subdirectory on your own domain, or just
   * opened off a USB stick. Nothing to reconfigure. */
  base: './',

  build: {
    outDir: 'dist',
    /* Small enough to inline every asset; no separate requests on a phone. */
    assetsInlineLimit: 8192,
  },

  server: {
    host: true, // so you can open the dev server on your phone over LAN
    port: 5173,
  },
});
