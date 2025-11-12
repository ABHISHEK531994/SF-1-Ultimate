# ⚙️ SF-1 Frontend Installation Script
# PowerShell Script für Windows

Write-Host "🌿 SF-1 Ultimate - Frontend Installation" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""

# Prüfe ob Node.js installiert ist
Write-Host "📋 Prüfe Node.js Installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js gefunden: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js nicht gefunden!" -ForegroundColor Red
    Write-Host "Bitte installiere Node.js von https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Wechsel in das Projekt-Verzeichnis
$projectPath = "C:\--Projekte--\sf1-ultimate\apps\web-app"
Write-Host ""
Write-Host "📂 Wechsle in Projekt-Verzeichnis..." -ForegroundColor Cyan
Set-Location $projectPath

# Dependencies installieren
Write-Host ""
Write-Host "📦 Installiere Dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Installation fehlgeschlagen!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies erfolgreich installiert!" -ForegroundColor Green

# Prüfe ob .env.local existiert
Write-Host ""
Write-Host "🔐 Prüfe Environment Variables..." -ForegroundColor Cyan

if (-Not (Test-Path ".env.local")) {
    Write-Host "⚠️  .env.local nicht gefunden!" -ForegroundColor Yellow
    Write-Host "Erstelle .env.local aus Vorlage..." -ForegroundColor Cyan
    
    Copy-Item ".env.local.example" ".env.local"
    
    Write-Host "✅ .env.local erstellt!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  WICHTIG: Bitte .env.local anpassen!" -ForegroundColor Yellow
    Write-Host "Datei: $projectPath\.env.local" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env.local gefunden!" -ForegroundColor Green
}

# Installation erfolgreich
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "✅ Installation erfolgreich abgeschlossen!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Nächste Schritte:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Backend-Services starten (Docker/K8s)" -ForegroundColor White
Write-Host "2. .env.local anpassen (optional)" -ForegroundColor White
Write-Host "3. Development Server starten:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend läuft dann auf: http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Frage ob Dev-Server direkt gestartet werden soll
$response = Read-Host "Development Server jetzt starten? (j/n)"
if ($response -eq "j" -or $response -eq "J") {
    Write-Host ""
    Write-Host "🚀 Starte Development Server..." -ForegroundColor Cyan
    Write-Host ""
    npm run dev
}
