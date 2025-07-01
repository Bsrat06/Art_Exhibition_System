import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` (dev/prod)
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    plugins: [react()],
    // Explicitly define env variables (optional but recommended)
    define: {
      'process.env': env
    },
    // Production-specific settings
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode === 'development' // Enable sourcemaps only in dev
    },
    server: {
      proxy: {
        // Only needed for local dev (avoids CORS issues)
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});