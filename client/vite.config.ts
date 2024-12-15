import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest', // Use injectManifest for custom service worker
      srcDir: 'src',
      filename: 'service-worker.js', // Custom service worker file
      manifest: {
        name: 'SkyOpt App',
        short_name: 'SkyOpt',
        description: 'Book flights easily with SkyOpt',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/media/logos/airplane.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/media/logos/airplane.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: false
      }
    }),
  ],
  server: {
    port: 3000,
  },
});