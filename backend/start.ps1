# Script de démarrage du serveur backend
# Ce script vérifie les prérequis avant de démarrer

Write-Host "🔍 Vérification des prérequis..." -ForegroundColor Cyan

# Vérifier si le fichier .env existe
if (!(Test-Path ".env")) {
    Write-Host "❌ Erreur: Le fichier .env n'existe pas!" -ForegroundColor Red
    Write-Host "📝 Création du fichier .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Fichier .env créé. Veuillez le configurer avec vos paramètres." -ForegroundColor Green
    exit 1
}

# Vérifier si node_modules existe
if (!(Test-Path "node_modules")) {
    Write-Host "❌ Les dépendances ne sont pas installées!" -ForegroundColor Red
    Write-Host "📦 Exécutez 'npm install' d'abord" -ForegroundColor Yellow
    exit 1
}

# Vérifier si MongoDB est accessible
Write-Host "🔍 Vérification de MongoDB..." -ForegroundColor Cyan
try {
    $mongoCheck = Test-NetConnection -ComputerName localhost -Port 27017 -InformationLevel Quiet -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if (!$mongoCheck) {
        Write-Host "⚠️  MongoDB ne semble pas être en cours d'exécution sur le port 27017" -ForegroundColor Yellow
        Write-Host "💡 Assurez-vous que MongoDB est installé et démarré" -ForegroundColor Yellow
        Write-Host "   - Installation: https://www.mongodb.com/try/download/community" -ForegroundColor Gray
        Write-Host "   - Ou utilisez MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas" -ForegroundColor Gray
        Write-Host "" -ForegroundColor Gray
        Write-Host "⏩ Le serveur va démarrer mais échouera à se connecter à MongoDB..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ MongoDB est accessible" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Impossible de vérifier MongoDB" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🚀 Démarrage du serveur..." -ForegroundColor Cyan
Write-Host ""

# Démarrer le serveur
npm run dev
