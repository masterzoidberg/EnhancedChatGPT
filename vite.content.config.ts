import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Content scripts must use IIFE format and cannot use code-splitting or dynamic imports.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      process: 'process/browser'
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content: 'src/content/content.tsx'
      },
      output: {
        entryFileNames: 'scripts/[name].js',
        format: 'iife', // Content scripts require IIFE format
        inlineDynamicImports: true // required when using format: 'iife'
      }
    }
  }
});
