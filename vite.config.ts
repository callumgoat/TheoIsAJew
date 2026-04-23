import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    middlewareMode: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    reportCompressedSize: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
