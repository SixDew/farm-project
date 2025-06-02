import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: '192.168.0.15',
    https: {
      key: fs.readFileSync('./192.168.0.15-key.pem'),
      cert: fs.readFileSync('./192.168.0.15.pem')
    },
    port: 5173
  }
})
