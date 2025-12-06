# 📦 Guide de Déploiement sur Hostinger

## Étape 1: Préparation du Code

### Backend (Node.js)
1. Assurez-vous que `package.json` contient tous les scripts:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

2. Vérifiez le fichier `.env`:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=production
```

### Frontend (React)
1. Le build se fera automatiquement par Hostinger
2. Assurez-vous que `.env.production` existe ou créez-le:
```
REACT_APP_API_URL=https://votre-domaine.com/api
```

## Étape 2: Sur le Panneau Hostinger

### A. Accéder à cPanel
1. Allez sur https://www.hostinger.com
2. Connectez-vous à votre compte
3. Ouvrez le **cPanel** ou **Hostinger Dashboard**

### B. Configuration Node.js
1. Allez dans **Application Manager** ou **Node.js Manager**
2. Cliquez sur **Create Application**
3. Remplissez:
   - **Node.js version**: 18+ recommandé
   - **Application root**: `/home/username/public_html/backend`
   - **Application URL**: `votre-domaine.com/api`
   - **Application startup file**: `server.js`

### C. Configuration MongoDB
1. Si vous n'avez pas de MongoDB distant:
   - Utilisez **MongoDB Atlas** (gratuit): https://www.mongodb.com/cloud/atlas
   - Créez un cluster gratuit
   - Obtenez votre connection string
   - Mettez-la dans votre `.env` MongoDB_URI

2. Ou demandez à Hostinger d'installer MongoDB

### D. Déployer le Backend
1. Via **Git Repository** (recommandé):
   - Allez dans **Git Version Control**
   - Clonez votre repo
   - Ou uploadez via FTP

2. Via **File Manager**:
   - Uploadez les fichiers via FTP
   - Naviguez dans `/public_html/backend`

3. Installez les dépendances:
   ```bash
   cd /path/to/backend
   npm install
   ```

4. Redémarrez l'application Node.js dans l'Application Manager

### E. Déployer le Frontend
1. Buildez localement:
   ```bash
   cd frontend
   npm run build
   ```

2. Uploadez le dossier `/build` vers `/public_html/frontend` via FTP

3. Configurez le **Routing** pour React Router:
   - Créez un `.htaccess` dans `/public_html/frontend`:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## Étape 3: Configuration DNS & SSL

1. **Domaine**:
   - Pointez votre domaine vers Hostinger via DNS
   - Attendez 24-48h de propagation

2. **SSL Certificate** (HTTPS):
   - Hostinger fournit Let's Encrypt gratuit
   - Allez dans **SSL Manager** → **Auto-install** Let's Encrypt
   - Redémarrez les applications

## Étape 4: Variables d'Environnement

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://votre-domaine.com
```

### Frontend (.env.production)
```
REACT_APP_API_URL=https://votre-domaine.com/api
```

## Étape 5: Test

1. Allez sur `https://votre-domaine.com`
2. Testez la connexion utilisateur
3. Testez les créations de produits
4. Testez les commandes

## 🔍 Troubleshooting

### Erreur CORS
- Mettez à jour `server.js`:
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
```

### Node.js crash
- Vérifiez les logs dans cPanel → Metrics
- Vérifiez que MongoDB est accessible
- Assurez-vous que PORT 5000 n'est pas bloqué

### Images ne s'affichent pas
- Les uploads doivent être dans `/public_html/backend/uploads`
- Vérifiez les permissions (chmod 755)
- Mettez à jour les URLs d'images dans le code

## 📱 Alternative: Déploiement via FTP

1. **Téléchargez FileZilla**: https://filezilla-project.org/
2. Connectez-vous avec les identifiants FTP de Hostinger
3. Uploadez:
   - Backend → `/home/username/public_html/backend`
   - Frontend build → `/home/username/public_html/frontend`
4. Redémarrez l'application Node.js

## 🎯 Résumé Rapide
```bash
# Localement, préparez:
npm run build          # Frontend
npm install            # Backend

# Sur Hostinger:
# 1. Upload les fichiers via FTP
# 2. Installez les dépendances backend
# 3. Configurez les variables .env
# 4. Activez SSL (HTTPS)
# 5. Redémarrez l'application Node.js
# 6. Testez sur votre domaine
```

**Bonne chance! 🚀**
