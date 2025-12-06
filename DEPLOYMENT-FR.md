# 🚀 Guide Rapide: Déployer sur Hostinger

## ⚡ Étapes Essentielles (15 minutes)

### 1️⃣ Préparer localement

```bash
# Frontend - Build pour production
cd frontend
npm run build
# ✅ Crée un dossier "build" prêt pour la production

# Backend - Vérifier les dépendances
cd ../backend
npm install
```

### 2️⃣ Sur Hostinger Dashboard

**A. Télécharger les fichiers via FTP**

- Logiciel: **FileZilla** (gratuit)
- Credentials: Dans Hostinger → Account Settings → FTP

```
Serveur: ftp.votre-domaine.com
Utilisateur: votre_utilisateur_ftp
Mot de passe: votre_mot_de_passe
```

**B. Structure à uploader**

```
/public_html/
├── frontend/          (le contenu du dossier "build")
│   ├── index.html
│   ├── .htaccess      (important!)
│   └── ...
└── backend/
    ├── server.js
    ├── package.json
    ├── .env.production
    └── ...
```

### 3️⃣ Configurer Node.js sur Hostinger

1. Allez à **Hostinger Dashboard** → **App Manager**
2. Cliquez **Create Application**
3. Paramètres:
   - **Node Version**: 18 ou 20
   - **Root**: `/home/username/public_html/backend`
   - **Entry Point**: `server.js`
   - **URL**: `api.votre-domaine.com` ou `votre-domaine.com/api`

4. Cliquez **Create**
5. Attendez ~2 minutes

### 4️⃣ Installer les dépendances Backend

Dans l'App Manager, trouvez votre app et cliquez sur **Console** ou **SSH**:

```bash
cd /home/username/public_html/backend
npm install
```

### 5️⃣ Configurer les variables d'environnement

Dans l'App Manager, configurez `.env`:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://votre-domaine.com
```

### 6️⃣ Activer HTTPS (SSL)

1. **Hostinger Dashboard** → **SSL Manager**
2. Sélectionnez votre domaine
3. Cliquez **Auto-install Let's Encrypt**
4. ✅ Gratuit et automatique!

### 7️⃣ Tester

```
https://votre-domaine.com        → Frontend React
https://votre-domaine.com/api    → API Backend
```

---

## 🆘 Problèmes Courants

### ❌ "Cannot GET /"
→ Le `.htaccess` n'est pas correctement uploadé
→ Vérifiez qu'il est dans `/public_html/frontend/.htaccess`

### ❌ "API not found"
→ Vérifiez l'URL dans `.env.production`
→ Redémarrez l'application Node.js

### ❌ "CORS error"
→ Vérifiez `CORS_ORIGIN` dans le backend `.env`
→ Doit être exactement votre domaine avec https://

### ❌ Images ne s'affichent pas
→ Vérifiez le dossier uploads: `/backend/uploads/`
→ Permissions: `chmod 755 uploads/`

---

## 📊 Alternative: Déploiement avec Git (Avancé)

Si Hostinger supporte Git:

```bash
# Sur le serveur
git clone https://github.com/votre-repo.git
cd votre-repo/backend
npm install

# Configurez le webhook pour auto-deploy sur push
```

---

## 💰 Coûts Hostinger (Approximatif)

- **Domaine**: 2-5 USD/an
- **Hébergement**: 2.99-9.99 USD/mois
- **MongoDB Atlas**: Gratuit (jusqu'à 512 MB)
- **Total**: ~40-60 USD/an

---

## ✅ Checklist Final

- [ ] Code pushé sur GitHub
- [ ] Variables `.env.production` configurées
- [ ] Frontend buildé (`npm run build`)
- [ ] Fichiers uploadés via FTP
- [ ] Node.js App créé dans App Manager
- [ ] Dépendances installées (`npm install`)
- [ ] HTTPS activé
- [ ] DNS configuré (24-48h propagation)
- [ ] Tests fonctionnels réussis

---

**Besoin d'aide? Contacte le support Hostinger en live chat!** 💬

Good luck! 🚀
