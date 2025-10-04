import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', "adce297046f9.ngrok-free.app", "*"],
  },
})