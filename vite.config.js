import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/Vibe_korea-festival-dashboard/',
  build: {
    outDir: 'docs',
  },
})