import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import proxyOptions from './proxyOptions';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: proxyOptions,
  },
  base:'/parlo',
  build: {
    outDir: '../parlo/public/parlo',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      treeshake: true,
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return;
        }
        warn(warning);
      },
    }
  },
});
