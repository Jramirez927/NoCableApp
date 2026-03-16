import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// derive __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        https: isDev ? {
            key: fs.readFileSync(path.resolve(__dirname, 'certs/ssl-cert-snakeoil.key')),
            cert: fs.readFileSync(path.resolve(__dirname, 'certs/ssl-cert-snakeoil.pem'))
        } : undefined,
        proxy: {
            '/api': {
                target: 'https://localhost:7054',
                changeOrigin: true,
                secure: false
            }
        }
    }
})
