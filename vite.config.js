import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //create proxy
  server: {
    proxy: {
      'urbannest-frontend.vercel.app/api': {
        target: 'https://urban-nest-backend.vercel.app',
        secure: false,
      },
    },
  },
})
