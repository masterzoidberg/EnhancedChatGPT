Write-Host "Starting build and packaging process..."

# Ensure required directories exist
if (!(Test-Path -Path "./dist")) {
  New-Item -ItemType Directory -Path "./dist" | Out-Null
}
if (!(Test-Path -Path "./builds")) {
  New-Item -ItemType Directory -Path "./builds" | Out-Null
}

# Clean old build
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue ./dist/*

# Transpile TypeScript
Write-Host "Running TypeScript compiler..."
tsc

# Build the content script separately using vite.content.config.ts
Write-Host "Building content script with Vite (IIFE)..."
npx vite build --config vite.content.config.ts

# Then build the rest of the extension using vite.config.ts
Write-Host "Building extension scripts and popup UI..."
npx vite build --config vite.config.ts

# Copy manifest.json to dist
Write-Host "Copying manifest.json to dist..."
Copy-Item -Path "manifest.json" -Destination "dist/manifest.json" -Force

# Zip the dist folder into builds
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$zipPath = "builds/extension_build_$timestamp.zip"

Write-Host "Creating ZIP package at $zipPath..."
Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
[System.IO.Compression.ZipFile]::CreateFromDirectory("dist", $zipPath)

Write-Host "Build and packaging complete!"
Write-Host "Package created at $zipPath"
