import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    include: "**/*.{js,jsx,ts,tsx}"
  })],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://192.168.100.68',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      }
    }
  }
})