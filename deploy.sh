#!/bin/bash

# 🚀 Script de déploiement pour Hostinger

echo "📦 Démarrage du déploiement..."

# 1. Build du frontend
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

if [ ! -d "frontend/build" ]; then
    echo "❌ Build frontend échoué!"
    exit 1
fi

echo "✅ Frontend built avec succès"

# 2. Vérifier les dépendances backend
echo "🔨 Vérification backend..."
cd backend
npm install
cd ..

echo "✅ Backend ready"

# 3. Fichiers à uploader
echo ""
echo "📋 Fichiers à uploader via FTP:"
echo ""
echo "BACKEND:"
echo "  - Tout le dossier: /backend"
echo "  - Commande: npm install dans le dossier"
echo ""
echo "FRONTEND:"
echo "  - Dossier build: /frontend/build -> /public_html/frontend"
echo "  - Fichier: /.htaccess -> /public_html/frontend/.htaccess"
echo ""
echo "✅ Prêt pour le déploiement!"
