$ErrorActionPreference = "Stop"

$required = @("DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME", "BACKUP_DIR")
foreach ($name in $required) {
  if (-not (Get-Item "Env:$name" -ErrorAction SilentlyContinue).Value) {
    throw "$name must be set before creating a backup"
  }
}

New-Item -ItemType Directory -Force -Path $env:BACKUP_DIR | Out-Null
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$output = Join-Path $env:BACKUP_DIR "$($env:DB_NAME)-$timestamp.sql"

& mariadb-dump `
  "--host=$($env:DB_HOST)" `
  "--port=$($env:DB_PORT)" `
  "--user=$($env:DB_USER)" `
  "--password=$($env:DB_PASSWORD)" `
  --single-transaction `
  --routines `
  --triggers `
  $env:DB_NAME | Out-File -FilePath $output -Encoding utf8

Write-Output "Backup written to $output"
