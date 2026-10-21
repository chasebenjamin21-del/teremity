import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/teremity/',
  build: { outDir: 'docs', emptyOutDir: true, assetsInlineLimit: 0 },
  plugins: [
    preact(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icon.svg', 'apple-touch-icon.png', '.nojekyll'],
      manifest: {
        name: 'Teremity',
        short_name: 'Teremity',
        description: 'Our Elden Ring field guide: where we are, what is nearby, and what to do next.',
        start_url: '/teremity/',
        scope: '/teremity/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#0f1218',
        theme_color: '#0f1218',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,json}', 'assets/*latin-[0-9]*.woff2', 'assets/*latin-ext-[0-9]*.woff2'],
        navigateFallback: '/teremity/index.html',
      },
    }),
  ],
})
