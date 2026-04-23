import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
//
// Vite burada:
//   - react() plugini ile JSX + fast refresh'i aktif ediyor
//   - tailwindcss() plugini ile Tailwind v4'ü projeye bağlıyor (postcss.config.js gerekmiyor)
//   - '@' alias'ı ile 'src/' dizinine kısayol veriyoruz — derin import'lar artık '@/features/..'
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 5173,
  },
});
