import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      {
        name: 'rusutsu-token-middleware',
        configureServer(server) {
          server.middlewares.use('/rusutsu/config', (_req, res) => {
            const token = env.VITE_MAPBOX_TOKEN || ''
            res.setHeader('Content-Type', 'application/javascript')
            res.end(`window.MAPBOX_TOKEN='${token}';`)
          })
        }
      }
    ]
  }
})
