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
  server: {
    // Locally the API runs on its own port (`npm run dev:server`); the client calls it as /api/...
    proxy: { '/api': 'http://localhost:3000' },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: 'client',
          include: ['src/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['./vitest.setup.ts'],
        },
      },
      {
        test: {
          name: 'server',
          include: ['server/src/**/*.test.ts'],
          environment: 'node',
        },
      },
    ],
  },
})
