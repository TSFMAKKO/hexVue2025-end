import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/hexVue2025-end/',
  css: {
    devSourcemap: false
  },
  server: {
    // host: '0.0.0.0', // 設定主機為 '0.0.0.0'
    host: true,
    allowedHosts: [
      '0d922c98085a.ngrok-free.app'
    ]
  }
})
