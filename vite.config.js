import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Generate relative paths for assets (better for Netlify)
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        // Use deterministic names for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      }
    }
  },
  // Ensure proper MIME types
  server: {
    headers: {
      'Content-Type': 'application/javascript'
    }
  }
})