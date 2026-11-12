# Creates deploy/hidayatulquran-hostinger-<date>.zip for the Hostinger Node.js "Upload your app files" flow.
# Hostinger builds the app itself (npm install + next build), so the zip contains SOURCE only:
# package.json at the archive root, no node_modules, no .next, no .env files.
#   npm run package:hostinger
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$include = @("package.json", "package-lock.json", "next.config.ts", "tsconfig.json", "eslint.config.mjs", ".env.example",
             ".gitignore", "README.md", "src", "public", "db", "scripts", "docs")
$skip = @("node_modules", ".next", "backups", "deploy")
$skipFiles = @(".env", ".env.local", "tsconfig.tsbuildinfo", "next-env.d.ts")

$outDir = Join-Path $root "deploy"
New-Item -ItemType Directory -Force $outDir | Out-Null
$zipPath = Join-Path $outDir ("hidayatulquran-hostinger-{0}.zip" -f (Get-Date -Format "yyyyMMdd"))
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Create)
$count = 0
try {
  foreach ($item in $include) {
    $full = Join-Path $root $item
    if (-not (Test-Path $full)) { throw "Missing $item" }
    $files = if ((Get-Item $full -Force).PSIsContainer) { Get-ChildItem $full -Recurse -File -Force } else { @(Get-Item $full -Force) }
    foreach ($f in $files) {
      $rel = $f.FullName.Substring($root.Length + 1).Replace("\", "/")   # forward slashes for Linux
      if ($skipFiles -contains $f.Name) { continue }
      if ($rel.Split("/") | Where-Object { $skip -contains $_ }) { continue }
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, $rel,
        [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
      $count++
    }
  }
} finally { $zip.Dispose() }

"{0} files -> {1} ({2:N1} MB)" -f $count, $zipPath, ((Get-Item $zipPath).Length / 1MB)
