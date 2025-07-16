import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure this is the port your frontend runs on
    proxy: {
      // Proxy requests that start with '/api' to your backend server
      '/api': {
        target: 'http://localhost:5000', // Your backend URL
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove '/api' prefix when forwarding
      },
    },
  },
})