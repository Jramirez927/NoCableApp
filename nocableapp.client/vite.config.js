import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// derive __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173, //port where your React app runs during development
        https: {
            key: fs.readFileSync(path.resolve(__dirname, 'certs/localhost-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, 'certs/localhost.pem'))
        },
        // this is the key part - forwarding API request to backend
        proxy: {
            '/WeatherForecast': {
                target: 'https://localhost:7054', // your ASP.NET core backend address
                changeOrigin: true,
                secure: false // Set to false if using self-signed certificates in dev
            }
        }
    }
})
