import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Capacitor requires relative paths in the built output
  base: './',
  build: {
    outDir: 'dist',
  },
})
