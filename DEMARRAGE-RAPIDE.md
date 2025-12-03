# Guide de Démarrage Rapide

## 🚀 Installation

### Prérequis Obligatoires

1. **Node.js** (v14 ou supérieur)
   - Téléchargez sur: https://nodejs.org/

2. **MongoDB** - Choisissez UNE option:
   
   **Option A - MongoDB Local (Recommandé pour développement)**
   - Téléchargez: https://www.mongodb.com/try/download/community
   - Installez et démarrez le service MongoDB
   
   **Option B - MongoDB Atlas (Cloud - Gratuit)**
   - Créez un compte sur: https://www.mongodb.com/cloud/atlas
   - Créez un cluster gratuit
   - Obtenez l'URI de connexion
   - Mettez à jour `MONGODB_URI` dans le fichier `.env`

---

## 📦 Installation Backend

```powershell
cd backend
npm install
```

### Configuration

Le fichier `.env` a été créé automatiquement avec ces valeurs par défaut:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi_en_production_12345
NODE_ENV=development
```

**Si vous utilisez MongoDB Atlas**, modifiez `MONGODB_URI`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### Démarrage

**Option 1 - Avec vérifications (Recommandé):**
```powershell
.\start.ps1
```

**Option 2 - Direct:**
```powershell
npm run dev
```

Le serveur sera accessible sur: http://localhost:5000

---

## 🎨 Installation Frontend

```powershell
cd frontend
npm install
```

⚠️ **Note sur les warnings npm:**
Les avertissements de dépréciations sont normaux et proviennent de `react-scripts`. 
Ils n'affectent pas le fonctionnement de l'application.

### Démarrage

```powershell
npm start
```

L'application sera accessible sur: http://localhost:3000

---

## ✅ Vérification de l'Installation

1. **Backend**: Ouvrez http://localhost:5000
   - Vous devriez voir: `{"message": "Bienvenue sur l'API E-Commerce"}`

2. **Frontend**: Ouvrez http://localhost:3000
   - Vous devriez voir la page d'accueil du site

---

## 🔧 Résolution des Problèmes

### Erreur MongoDB "uri parameter must be a string"
✅ **Solution**: Le fichier `.env` a été créé. Redémarrez le serveur.

### MongoDB n'est pas connecté
1. Vérifiez que MongoDB est installé et démarré
2. Ou utilisez MongoDB Atlas (cloud)
3. Vérifiez que le port 27017 est libre

### Port déjà utilisé (EADDRINUSE)
- Changez le port dans `.env`: `PORT=5001`
- Ou tuez le processus: `Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process`

### Les images ne s'affichent pas
- Assurez-vous que le dossier `backend/uploads` existe
- Vérifiez que les URLs des images pointent vers le bon serveur

---

## 🎯 Premiers Pas

### 1. Créer un compte administrateur

Une fois le backend démarré:

1. Inscrivez-vous sur le site via l'interface
2. Dans MongoDB, changez le rôle de votre utilisateur:

**MongoDB Compass:**
- Connectez-vous à votre base de données
- Base: `ecommerce` → Collection: `users`
- Trouvez votre utilisateur
- Modifiez le champ `role`: `"client"` → `"admin"`

**MongoDB Shell:**
```javascript
use ecommerce
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

### 2. Ajouter des catégories et produits

1. Connectez-vous avec votre compte admin
2. Accédez à: http://localhost:3000/admin
3. Ajoutez vos catégories
4. Ajoutez vos produits

---

## 📚 Documentation Complète

Consultez le fichier `README.md` pour la documentation complète incluant:
- Structure détaillée du projet
- API endpoints complets
- Guide de déploiement
- Personnalisation

---

## 💡 Aide Rapide

**Backend ne démarre pas?**
```powershell
cd backend
.\start.ps1  # Utilise le script de vérification
```

**Réinstaller les dépendances:**
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

**Voir les logs détaillés:**
```powershell
# Backend - le serveur affiche les logs en temps réel
# Frontend - Ouvrez la console du navigateur (F12)
```

---

**Besoin d'aide? Consultez les issues GitHub ou la documentation MongoDB.**
