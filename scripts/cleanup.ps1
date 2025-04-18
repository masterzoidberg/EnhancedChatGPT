Write-Host "Starting final cleanup and organization..."

# Step 1: Remove empty directories
$emptyDirs = @("assets", "tests")
foreach ($dir in $emptyDirs) {
    if ((Test-Path $dir) -and ((Get-ChildItem -Path $dir -Recurse | Measure-Object).Count -eq 0)) {
        Remove-Item -Recurse -Force -ErrorAction SilentlyContinue $dir
        Write-Host "Deleted empty: $dir/"
    }
}

# Step 2: Move utility scripts to /scripts
$scriptsToMove = @(
    @{ Source = "generate-icons.ps1"; Target = "scripts/generate-icons.ps1" },
    @{ Source = "svg-to-png.ps1"; Target = "scripts/svg-to-png.ps1" },
    @{ Source = "cleanup.ps1"; Target = "scripts/cleanup.ps1" }
)
foreach ($script in $scriptsToMove) {
    if (Test-Path $script.Source) {
        Move-Item $script.Source $script.Target -Force
        Write-Host "Moved: $($script.Source) -> $($script.Target)"
    }
}

# Step 3: Move README.md to /docs and replace with pointer
if (Test-Path "README.md") {
    Move-Item "README.md" "docs/README.md" -Force
    Write-Host "Moved: README.md -> docs/README.md"
    Set-Content -Path "README.md" -Value "# Project Overview`nSee [docs/README.md](docs/README.md) for full documentation."
    Write-Host "Created new root README.md"
}

# Step 4: Ensure .gitignore exists and is updated
$gitignorePath = ".gitignore"
$linesToAdd = @(
    "# Build outputs",
    "/dist/",
    "/web-ext-artifacts/",
    "",
    "# Dependencies",
    "/node_modules/",
    "",
    "# Editor configs",
    ".cursor/",
    ".roo/",
    ".roomodes/",
    ".vscode/",
    "",
    "# Environment files",
    ".env",
    ".env.local",
    "",
    "# Logs",
    "*.log",
    "",
    "# Coverage",
    "/coverage/"
)

if (!(Test-Path $gitignorePath)) {
    Set-Content -Path $gitignorePath -Value ($linesToAdd -join "`n")
    Write-Host "Created .gitignore"
} else {
    $existingLines = Get-Content $gitignorePath
    $combinedLines = $existingLines + $linesToAdd | Sort-Object -Unique
    Set-Content -Path $gitignorePath -Value ($combinedLines -join "`n")
    Write-Host "Updated .gitignore"
}

Write-Host "`nFinalization complete. Project is organized and ready."
