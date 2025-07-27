import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        // Main-Process entry file of the Electron App.
        entry: 'src/main.ts',
        onstart(options) {
          options.startup()
        },
        vite: {
          build: {
            sourcemap: false,
            minify: false,
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron', 'sequelize', 'sqlite3', 'data-model'],
              output: {
                format: 'es',
                entryFileNames: '[name].js',
                exports: 'named'
              }
            }
          }
        }
      },
      {
        entry: 'src/preload.ts',
        onstart(options) {
          // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
          // instead of restarting the entire Electron App.
          options.reload()
        },
        vite: {
          build: {
            sourcemap: false,
            minify: false,
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron'],
              output: {
                format: 'es',
                entryFileNames: '[name].js',
                exports: 'named'
              }
            }
          }
        }
      }
    ]),
    // Use Node.js API in the Renderer-process
    renderer()
  ],
  optimizeDeps: {
    exclude: ['data-model']
  },
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['data-model']
    }
  }
})