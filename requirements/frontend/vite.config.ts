import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    https: {
		key: fs.readFileSync('/certs/backend.key'),
		cert: fs.readFileSync('/certs/backend.crt'),
	},
    host: true,
    port: 5173,
    proxy: {
      "/auth": {
        target: "https://backend:3000",
        changeOrigin: true,
        secure: false,
      },
      "/users": {
        target: "https://backend:3000",
        changeOrigin: true,
        secure: false,
      },
      "/socket.io": {
        target: "https://backend:3000",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  }
})