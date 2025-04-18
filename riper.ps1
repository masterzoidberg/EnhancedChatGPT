# riper.ps1 — RIPER Mode Switcher for Windows (PowerShell)

param (
    [Parameter(Position = 0, Mandatory = $true)]
    [ValidateSet("research", "innovate", "plan", "execute", "review")]
    [string]$mode
)

$modeSymbols = @{ 
    research = "🔍O₁: RESEARCH"
    innovate = "💡O₂: INNOVATE"
    plan     = "✍️O₃: PLAN"
    execute  = "⚙️O₄: EXECUTE"
    review   = "🔎O₅: REVIEW"
}

if (!(Test-Path ".cursor")) {
    New-Item -ItemType Directory -Path ".cursor" | Out-Null
}

$symbol = $modeSymbols[$mode]
Set-Content ".cursor\MODE.md" $symbol

Write-Host "✅ RIPER mode set to: $symbol" -ForegroundColor Green