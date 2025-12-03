# 🗄️ Guide d'Installation MongoDB

MongoDB n'est pas détecté sur votre système. Voici comment l'installer et le configurer.

## Option 1: MongoDB Local (Recommandé pour le développement)

### Téléchargement et Installation

1. **Téléchargez MongoDB Community Server:**
   - Visitez: https://www.mongodb.com/try/download/community
   - Sélectionnez votre version Windows
   - Téléchargez et installez

2. **Pendant l'installation:**
   - ✅ Cochez "Install MongoDB as a Service"
   - ✅ Gardez le port par défaut: 27017
   - ✅ Installez MongoDB Compass (interface graphique - optionnel mais recommandé)

### Vérification de l'Installation

Ouvrez PowerShell et exécutez:

```powershell
# Vérifier que MongoDB est en cours d'exécution
Get-Service MongoDB

# Démarrer MongoDB si nécessaire
Start-Service MongoDB
```

### Test de Connexion

```powershell
# Tester la connexion
Test-NetConnection -ComputerName localhost -Port 27017
```

Si le test réussit, vous êtes prêt à démarrer le backend!

---

## Option 2: MongoDB Atlas (Cloud - Gratuit)

Si vous préférez ne pas installer MongoDB localement, utilisez MongoDB Atlas (version cloud gratuite).

### Étapes:

1. **Créez un compte:**
   - Allez sur: https://www.mongodb.com/cloud/atlas/register
   - Inscrivez-vous gratuitement

2. **Créez un cluster:**
   - Cliquez sur "Build a Database"
   - Sélectionnez "FREE" (M0 Sandbox)
   - Choisissez une région proche (ex: Europe - Paris)
   - Cliquez sur "Create"

3. **Configurez l'accès:**
   - **Authentification:** Créez un nom d'utilisateur et mot de passe
   - ⚠️ **Important:** Notez ces informations!
   - **Adresse IP:** Cliquez sur "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)

4. **Obtenez l'URI de connexion:**
   - Cliquez sur "Connect" sur votre cluster
   - Choisissez "Connect your application"
   - Copiez l'URI (exemple: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)

5. **Mettez à jour le fichier `.env`:**

```env
# Remplacez cette ligne:
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Par votre URI Atlas (remplacez <password> par votre mot de passe):
MONGODB_URI=mongodb+srv://username:VOTRE_MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

---

## 🚀 Démarrer le Backend

Une fois MongoDB configuré (local ou Atlas):

### Méthode 1: Avec vérifications automatiques

```powershell
cd backend
.\start.ps1
```

### Méthode 2: Directement

```powershell
cd backend
npm run dev
```

Vous devriez voir:
```
✓ Serveur démarré sur le port 5000
✓ Connecté à MongoDB
```

---

## ❓ Dépannage MongoDB

### MongoDB Local ne démarre pas

```powershell
# Vérifier le statut
Get-Service MongoDB

# Démarrer le service
Start-Service MongoDB

# Si le service n'existe pas, réinstallez MongoDB en cochant "Install as Service"
```

### Erreur "Connection refused" ou "ECONNREFUSED"

**Local:**
- Vérifiez que MongoDB est bien démarré: `Get-Service MongoDB`
- Vérifiez le port: MongoDB doit être sur le port 27017

**Atlas:**
- Vérifiez que vous avez autorisé votre adresse IP
- Vérifiez que l'URI dans `.env` est correcte
- Vérifiez que vous avez remplacé `<password>` par votre vrai mot de passe

### Erreur "Authentication failed"

**Atlas uniquement:**
- Vérifiez le nom d'utilisateur et mot de passe dans l'URI
- Le mot de passe peut contenir des caractères spéciaux qui doivent être encodés
  - Utilisez: https://www.urlencoder.org/ pour encoder votre mot de passe

---

## 🛠️ Commandes Utiles

### MongoDB Local

```powershell
# Démarrer MongoDB
Start-Service MongoDB

# Arrêter MongoDB
Stop-Service MongoDB

# Statut de MongoDB
Get-Service MongoDB

# Se connecter avec le shell MongoDB (si installé)
mongosh
```

### MongoDB Compass (Interface Graphique)

1. Ouvrez MongoDB Compass
2. Connexion locale: `mongodb://localhost:27017`
3. Vous pouvez voir toutes vos bases de données
4. La base `ecommerce` apparaîtra après le premier démarrage du backend

---

## ✅ Vérification Finale

Une fois tout configuré:

1. **MongoDB est accessible** (local ou Atlas)
2. **Le fichier `.env` est configuré** avec la bonne URI
3. **Le backend démarre sans erreur:**

```powershell
cd backend
npm run dev
```

Vous devriez voir:
```
✓ Serveur démarré sur le port 5000
✓ Connecté à MongoDB
```

4. **Testez l'API:** Ouvrez http://localhost:5000 dans votre navigateur
   - Résultat attendu: `{"message":"Bienvenue sur l'API E-Commerce"}`

---

## 🎉 Prêt!

Maintenant vous pouvez:
1. Démarrer le frontend: `cd frontend && npm start`
2. Créer votre premier compte sur http://localhost:3000
3. Commencer à utiliser l'application!

Pour créer un compte administrateur, consultez le fichier `DEMARRAGE-RAPIDE.md`.
