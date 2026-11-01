import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  build: {
    sourcemap: false,
    rolldownOptions: { input: { portfolio: 'index.html', lap: 'lab/lap-compare/index.html' } },
  },
})
