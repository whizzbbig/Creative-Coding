import { fileURLToPath, URL } from 'url'
import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import Eslint from 'vite-plugin-eslint'
import GLSL from 'vite-plugin-glsl'
import Handlebars from 'vite-plugin-handlebars'
import Stylelint from 'vite-plugin-stylelint'
import { handlebarsHelpers } from './src/data/handlebars/helpers.js'

import SpriteHelper from './src/data/sprites/helper.js'

export default async ({ mode }) => {
  process.env = {
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

  // SVG Sprite
  const spriteHelper = new SpriteHelper('src/sprites')
  await spriteHelper.generate()

  // Static Pages
  const input = {
    main: resolve('src/pages/index.html')
  }

  return defineConfig({
    root: 'src/pages',
    build: {
      outDir: '../../dist',
      rollupOptions: {
        input
      }
    },
    plugins: [
      Eslint(),

      GLSL(),

      Handlebars({
        context () {
          return {
            // ...results
          }
        },
        helpers: handlebarsHelpers,
        partialDirectory: resolve('src/views')
      }),

      Stylelint(),

      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          cleanupOutdatedCaches: false
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/app', import.meta.url))
      }
    }
  })
}
