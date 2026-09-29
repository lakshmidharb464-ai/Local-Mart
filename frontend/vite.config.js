import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    visualizer({
      open: false,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  esbuild: {
    // Note: 'drop' is intentionally NOT set here — console logs are preserved in dev.
    // Drop only happens inside build.esbuild below.
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    esbuild: {
      // Strip console/debugger only in production builds
      drop: ['console', 'debugger'],
    },
    cssMinify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      treeshake: {
        preset: 'recommended',
        moduleSideEffects: 'no-external'
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('leaflet')) {
              return 'vendor-maps';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler')) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  }
});
