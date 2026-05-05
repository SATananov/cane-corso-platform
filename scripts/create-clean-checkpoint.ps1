<# 
Creates a clean Cane Corso Platform checkpoint ZIP from the repository root.

Default behavior:
- keeps source files, docs, migrations, public assets, package files, and workspace config;
- excludes local install/build/cache/runtime artifacts;
- excludes local environment files;
- excludes old handoff patch notes from the ZIP output by default.

Usage from repo root:
  pnpm checkpoint:zip
  pnpm checkpoint:zip -- -ZipName cane-corso-platform_clean_after_step9_checkpoint_hygiene.zip
  powershell -ExecutionPolicy Bypass -File scripts/create-clean-checkpoint.ps1 -IncludePatchNotes
#>

[CmdletBinding()]
param(
  [string]$ZipName = "cane-corso-platform_clean_checkpoint.zip",
  [string]$OutputDir = "",
  [switch]$IncludePatchNotes
)

$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Resolve-Path (Join-Path $scriptDir "..")

if ([string]::IsNullOrWhiteSpace($OutputDir)) {
  $OutputDir = Split-Path -Parent $root
}

$outputDirResolved = Resolve-Path $OutputDir
$zipPath = Join-Path $outputDirResolved $ZipName
$stageRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("cane-corso-platform-clean-" + [System.Guid]::NewGuid().ToString("N"))
$stageProject = Join-Path $stageRoot "cane-corso-platform"

$excludedDirectories = @(
  ".git",
  "node_modules",
  ".next",
  ".turbo",
  ".expo",
  ".expo-shared",
  "dist",
  "build",
  "out",
  "coverage",
  ".vercel",
  ".cache",
  ".pnpm-store"
)

$excludedFiles = @(
  ".env",
  ".env.local",
  ".env.*.local",
  "*.tsbuildinfo",
  "*.log",
  "*.zip",
  "package-lock.json",
  "yarn.lock"
)

function Remove-HandoffPatchNotes {
  param([string]$ProjectPath)

  $rootLevelPatterns = @(
    "PATCH*.txt",
    "README_*.txt",
    "STEP*.txt",
    "QA_*.txt",
    "USG_*.txt",
    "PACKAGING_NOTES*.txt"
  )

  foreach ($pattern in $rootLevelPatterns) {
    Get-ChildItem -Path $ProjectPath -File -Filter $pattern -ErrorAction SilentlyContinue | Remove-Item -Force
  }

  $webPath = Join-Path $ProjectPath "apps\web"
  if (Test-Path $webPath) {
    Get-ChildItem -Path $webPath -File -Filter "PATCH*.txt" -ErrorAction SilentlyContinue | Remove-Item -Force
  }
}

function Assert-NoBannedCheckpointContent {
  param([string]$ProjectPath)

  $bannedDirectoryNames = @("node_modules", ".next", ".turbo", ".expo", ".git")
  $bannedFilePatterns = @(".env.local", "*.tsbuildinfo", "*.log", "*.zip")

  foreach ($directoryName in $bannedDirectoryNames) {
    $matches = Get-ChildItem -Path $ProjectPath -Directory -Recurse -Force -ErrorAction SilentlyContinue |
      Where-Object { $_.Name -eq $directoryName }

    if ($matches.Count -gt 0) {
      throw "Clean checkpoint validation failed: found banned directory '$directoryName'."
    }
  }

  foreach ($pattern in $bannedFilePatterns) {
    $matches = Get-ChildItem -Path $ProjectPath -File -Recurse -Force -Filter $pattern -ErrorAction SilentlyContinue
    if ($matches.Count -gt 0) {
      throw "Clean checkpoint validation failed: found banned file pattern '$pattern'."
    }
  }
}

try {
  New-Item -ItemType Directory -Path $stageProject -Force | Out-Null

  $robocopyArgs = @(
    $root,
    $stageProject,
    "/E",
    "/XD"
  ) + $excludedDirectories + @(
    "/XF"
  ) + $excludedFiles + @(
    "/NFL",
    "/NDL",
    "/NJH",
    "/NJS",
    "/NP"
  )

  & robocopy @robocopyArgs | Out-Null
  if ($LASTEXITCODE -gt 7) {
    throw "Robocopy failed with exit code $LASTEXITCODE."
  }

  if (-not $IncludePatchNotes) {
    Remove-HandoffPatchNotes -ProjectPath $stageProject
  }

  Assert-NoBannedCheckpointContent -ProjectPath $stageProject

  if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
  }

  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [System.IO.Compression.ZipFile]::CreateFromDirectory(
    $stageProject,
    $zipPath,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
  )

  Write-Host "Clean checkpoint ZIP created: $zipPath"
  Write-Host "Excluded: node_modules, .next, .turbo, .expo, .git, local env files, logs, cache/build artifacts."
  if (-not $IncludePatchNotes) {
    Write-Host "Old handoff patch-note TXT files were omitted from the ZIP output."
  }
} finally {
  if (Test-Path $stageRoot) {
    Remove-Item $stageRoot -Recurse -Force
  }
}
