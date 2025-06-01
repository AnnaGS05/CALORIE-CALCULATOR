import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: '/CALORIE-CALCULATOR/', // Установлено имя вашего репозитория
  build: {
    outDir: 'dist', // Указывает папку для собранного проекта
  },
});