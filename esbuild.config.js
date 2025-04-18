import * as esbuild from 'esbuild';

const config = {
  entryPoints: [
    'src/content/contentScript.ts',
    'src/background/background.ts',
    'src/popup/popup.ts',
    'src/options/options.ts'
  ],
  bundle: true,
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
  target: ['chrome90'],
  outdir: 'dist',
  format: 'esm',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.css': 'css',
  },
  plugins: [
    // Add any custom plugins here
  ],
};

try {
  await esbuild.build(config);
  console.log('⚡ Build complete! ⚡');
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
} 