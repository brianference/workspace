# setup.ps1 — Run this once in PowerShell to install the X Search MCP server
# Usage: .\setup.ps1 -BearerToken "YOUR_BEARER_TOKEN_HERE"

param(
    [Parameter(Mandatory=$true)]
    [string]$BearerToken
)

$ErrorActionPreference = "Stop"

# --- 1. Clone repo (skip if already exists) ---
$repoDir = "$env:USERPROFILE\workspace"
if (-Not (Test-Path $repoDir)) {
    Write-Host "Cloning repo..." -ForegroundColor Cyan
    git clone https://github.com/brianference/workspace.git $repoDir
} else {
    Write-Host "Repo already exists, pulling latest..." -ForegroundColor Cyan
    git -C $repoDir pull
}

# --- 2. Install the package ---
$projectDir = "$repoDir\projects\x-search-mcp-server"
Write-Host "Installing package..." -ForegroundColor Cyan
Set-Location $projectDir
python -m venv .venv
.venv\Scripts\pip install -e . --quiet

# --- 3. Verify install ---
$pythonPath = (Resolve-Path ".venv\Scripts\python.exe").Path
Write-Host "Python path: $pythonPath" -ForegroundColor Green

# --- 4. Write Claude Desktop config ---
$configDir = "$env:APPDATA\Claude"
$configFile = "$configDir\claude_desktop_config.json"

if (-Not (Test-Path $configDir)) {
    New-Item -Path $configDir -ItemType Directory -Force | Out-Null
}

# Load existing config or start fresh
if (Test-Path $configFile) {
    $config = Get-Content $configFile -Raw | ConvertFrom-Json
} else {
    $config = [PSCustomObject]@{}
}

# Add/overwrite mcpServers.x-search
if (-Not $config.PSObject.Properties["mcpServers"]) {
    $config | Add-Member -MemberType NoteProperty -Name "mcpServers" -Value ([PSCustomObject]@{})
}

$serverEntry = [PSCustomObject]@{
    command = $pythonPath
    args    = @("-m", "x_search_mcp.main")
    env     = [PSCustomObject]@{
        X_BEARER_TOKEN = $BearerToken
    }
}

if ($config.mcpServers.PSObject.Properties["x-search"]) {
    $config.mcpServers."x-search" = $serverEntry
} else {
    $config.mcpServers | Add-Member -MemberType NoteProperty -Name "x-search" -Value $serverEntry
}

$config | ConvertTo-Json -Depth 10 | Set-Content $configFile -Encoding UTF8
Write-Host "Config written to: $configFile" -ForegroundColor Green

Write-Host ""
Write-Host "Done! Now fully quit and relaunch Claude Desktop." -ForegroundColor Yellow
Write-Host "Then open the Code tab and run: /mcp  to confirm x-search is listed." -ForegroundColor Yellow
