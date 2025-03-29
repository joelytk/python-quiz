import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/python-quiz/',
  plugins: [react(), tailwindcss()],
  server: {
    open: true,
    port: 3000
  }
});
