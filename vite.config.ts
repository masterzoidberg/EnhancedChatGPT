// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'src/assets/*', dest: 'assets' },
        { src: 'manifest.json', dest: '.' }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
  rollupOptions: {
    input: {
      content: 'src/content/content.tsx',
      // ...other entries like popup/index.html
    },
    output: {
      entryFileNames: 'scripts/[name].js',
      format: 'iife', // Important for Chrome content script compatibility
      inlineDynamicImports: true
    }
  }
}});
