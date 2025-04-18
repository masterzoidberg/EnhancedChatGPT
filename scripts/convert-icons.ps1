# Install ImageMagick if not already installed
if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Host "ImageMagick is required. Please install it from https://imagemagick.org/script/download.php"
    exit 1
}

# Convert SVG to different PNG sizes
$sizes = @(16, 32, 48, 128)
foreach ($size in $sizes) {
    magick convert -background none -resize ${size}x${size} icon.svg icon${size}.png
    Write-Host "Created icon${size}.png"
} 