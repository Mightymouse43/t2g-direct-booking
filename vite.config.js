import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // In dev, run `vercel dev` (port 3000) alongside vite so /api/* routes hit
    // the real Vercel serverless functions with OWNERREZ_API_TOKEN available.
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
