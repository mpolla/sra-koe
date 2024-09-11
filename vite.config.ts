import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,ts,css,html,ico,jpg,png,pdf,svg}']
      },
      manifest: {
        name: 'SRA ampumakokeen pistelaskuri',
        short_name: 'SRA koe',
        description: 'Sovellettu reserviläisammunta (SRA) ampumakokeen pistelaskuri.',
        theme_color: '#a28c67',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  define: {
        '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    },
  //base: '/sra-ampumakoe-laskuri/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
