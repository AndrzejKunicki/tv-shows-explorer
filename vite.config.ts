/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/tv-shows-explorer/',
  plugins: [react()],
  resolve: {
    // Alias: import from "@src/store/hooks" instead of "../../../store/hooks" (see tsconfig.app.json)
    alias: { '@src': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
})
