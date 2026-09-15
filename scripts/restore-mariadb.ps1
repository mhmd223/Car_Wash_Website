$ErrorActionPreference = "Stop"

$required = @("DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME", "BACKUP_FILE")
foreach ($name in $required) {
  if (-not (Get-Item "Env:$name" -ErrorAction SilentlyContinue).Value) {
    throw "$name must be set before restoring a backup"
  }
}

if (-not (Test-Path $env:BACKUP_FILE)) {
  throw "Backup file was not found: $($env:BACKUP_FILE)"
}

Write-Output "Restoring $($env:BACKUP_FILE) into $($env:DB_NAME)"
& mariadb `
  "--host=$($env:DB_HOST)" `
  "--port=$($env:DB_PORT)" `
  "--user=$($env:DB_USER)" `
  "--password=$($env:DB_PASSWORD)" `
  $env:DB_NAME < $env:BACKUP_FILE

Write-Output "Restore completed"
