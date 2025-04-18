# build-and-package.ps1
Write-Host "Starting build and packaging process..."

# Step 1: Run Vite build
Write-Host "Running Vite build..."
npm run build

# Step 2: Copy manifest.json into dist/
$sourceManifest = "manifest.json"
$destManifest = "dist/manifest.json"
if (Test-Path $sourceManifest) {
    Copy-Item $sourceManifest $destManifest -Force
    Write-Host "Copied manifest.json to dist/"
} else {
    Write-Host "ERROR: manifest.json not found in project root."
    exit 1
}

# Step 3: Patch manifest.json paths
if (Test-Path $destManifest) {
    $json = Get-Content $destManifest -Raw | ConvertFrom-Json

    # Update paths
    if ($json.content_scripts -and $json.content_scripts.Count -gt 0) {
        $json.content_scripts[0].js = @("content.js")
        $json.content_scripts[0].css = @("contentStyle.css")
    }

    if ($json.background) {
        $json.background.service_worker = "background.js"
    }

    if ($json.action) {
        $json.action.default_popup = "popup/index.html"
    }

    # Write patched file
    $json | ConvertTo-Json -Depth 5 | Set-Content $destManifest -Encoding UTF8
    Write-Host "Patched manifest.json paths"
} else {
    Write-Host "ERROR: Could not find manifest.json in dist/"
    exit 1
}

# Step 4: Zip the dist/ folder
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$zipName = "extension_build_$timestamp.zip"
$outputDir = "builds"
$outputZip = "$outputDir\$zipName"

if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Compress-Archive -Path "dist/*" -DestinationPath $outputZip -Force
Write-Host "Package created at $outputZip"
