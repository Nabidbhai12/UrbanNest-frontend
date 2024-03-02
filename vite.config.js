import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //create proxy
  server: {
    proxy: {
      '/api': {
        target: 'http://urban-nest-backend.vercel.app/:3000',
        secure: false,
      },
    },
  },
})
