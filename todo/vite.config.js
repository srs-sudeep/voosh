import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    loader: 'jsx', // Treat .js files as .jsx
    include: /src\/.*\.js$/, // Include only the files from src with .js extension
  },
  plugins: [react()],
})
