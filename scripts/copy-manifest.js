const fs = require('fs');
const path = require('path');

// Get the root directory
const rootDir = path.resolve(__dirname, '..');
const manifestPath = path.join(rootDir, 'manifest.json');
const distPath = path.join(rootDir, 'dist', 'manifest.json');

// Create dist directory if it doesn't exist
if (!fs.existsSync(path.dirname(distPath))) {
  fs.mkdirSync(path.dirname(distPath), { recursive: true });
}

// Copy the file
fs.copyFileSync(manifestPath, distPath);
console.log('Successfully copied manifest.json to dist/'); 