import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Don't hardcode environment variables in define
// Vite will automatically expose VITE_* prefixed env vars to client
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
