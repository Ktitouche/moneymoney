# Site E-Commerce Général

Un site e-commerce complet avec frontend React et backend Node.js/Express, entièrement en français. Ce site est conçu pour être flexible et peut vendre n'importe quel type de produit (vêtements, électronique, etc.).

## 🚀 Fonctionnalités

### Frontend
- ✅ Page d'accueil avec produits en vedette
- ✅ Catalogue de produits avec filtres et recherche
- ✅ Pages détaillées des produits
- ✅ Panier d'achat avec gestion des quantités
- ✅ Système d'authentification (inscription/connexion)
- ✅ Processus de commande complet
- ✅ Gestion du profil utilisateur
- ✅ Historique des commandes
- ✅ Panel d'administration
- ✅ Design responsive pour mobile

### Backend
- ✅ API RESTful avec Express
- ✅ Base de données MongoDB avec Mongoose
- ✅ Authentification JWT
- ✅ Gestion des produits et catégories
- ✅ Gestion des commandes
- ✅ Gestion des utilisateurs
- ✅ Upload d'images
- ✅ Protection des routes admin

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le projet
```bash
cd "c:\Users\hamid\Desktop\programing\general e com website"
```

### 2. Configuration du Backend

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=votre_secret_jwt_tres_securise_changez_moi
NODE_ENV=development
```

Créer le dossier pour les uploads:
```bash
mkdir uploads
```

Démarrer le serveur:
```bash
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

### 3. Configuration du Frontend

```bash
cd ../frontend
npm install
```

Le fichier `.env` est déjà créé avec:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Démarrer l'application:
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
general e com website/
├── backend/
│   ├── models/          # Modèles MongoDB
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Category.js
│   │   └── Order.js
│   ├── routes/          # Routes API
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── orders.js
│   │   └── users.js
│   ├── middleware/      # Middlewares
│   │   ├── auth.js
│   │   └── upload.js
│   ├── uploads/         # Dossier pour les images
│   ├── server.js        # Point d'entrée du serveur
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/  # Composants réutilisables
    │   │   ├── Header/
    │   │   ├── Footer/
    │   │   └── ProductCard/
    │   ├── context/     # Contextes React
    │   │   ├── AuthContext.js
    │   │   └── CartContext.js
    │   ├── pages/       # Pages de l'application
    │   │   ├── Home/
    │   │   ├── Products/
    │   │   ├── ProductDetail/
    │   │   ├── Cart/
    │   │   ├── Checkout/
    │   │   ├── Login/
    │   │   ├── Profile/
    │   │   ├── MyOrders/
    │   │   ├── OrderConfirmation/
    │   │   └── Admin/
    │   ├── utils/       # Utilitaires
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── package.json
    └── .env
```

## 🎯 Utilisation

### Créer un compte administrateur

Pour créer un compte admin, vous devez d'abord créer un utilisateur normal, puis modifier son rôle dans MongoDB:

1. Inscrivez-vous sur le site
2. Dans MongoDB, trouvez l'utilisateur et changez le champ `role` de `client` à `admin`

Ou utilisez MongoDB Compass ou la console MongoDB:
```javascript
db.users.updateOne(
  { email: "votre@email.com" },
  { $set: { role: "admin" } }
)
```

### Ajouter des produits

1. Connectez-vous avec un compte admin
2. Accédez au panel d'administration
3. Utilisez les sections de gestion pour ajouter des catégories et produits
4. Images produits : idéal 1000×1000 px (carré), JPG qualité ~80, poids 150–250 Ko. Max utile 1200×1200 si zoom. Compressez avant upload.

### API Endpoints

#### Authentification
- `POST /api/auth/inscription` - Créer un compte
- `POST /api/auth/connexion` - Se connecter

#### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

#### Catégories
- `GET /api/categories` - Liste des catégories
- `POST /api/categories` - Créer une catégorie (admin)
- `PUT /api/categories/:id` - Modifier une catégorie (admin)
- `DELETE /api/categories/:id` - Supprimer une catégorie (admin)

#### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders/mes-commandes` - Mes commandes
- `GET /api/orders/:id` - Détails d'une commande
- `GET /api/orders` - Toutes les commandes (admin)
- `PUT /api/orders/:id/statut` - Changer le statut (admin)

#### Utilisateurs
- `GET /api/users/profil` - Mon profil
- `PUT /api/users/profil` - Modifier mon profil
- `PUT /api/users/mot-de-passe` - Changer le mot de passe
- `GET /api/users` - Tous les utilisateurs (admin)

## 🎨 Personnalisation

### Couleurs
Les couleurs principales peuvent être modifiées dans `frontend/src/index.css`:
- Primaire: `#007bff`
- Secondaire: `#6c757d`
- Succès: `#28a745`
- Danger: `#dc3545`

### Logo et Nom
Modifiez le nom dans `frontend/src/components/Header/Header.js`:
```javascript
<h1>Ma Boutique</h1>  // Changez ici
```

## 🔧 Technologies Utilisées

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Multer (upload de fichiers)
- CORS

### Frontend
- React 18
- React Router DOM
- Axios
- React Icons
- React Toastify
- Context API

## 📝 Notes Importantes

1. **Sécurité**: Changez le `JWT_SECRET` dans le fichier `.env` pour la production
2. **Base de données**: Assurez-vous que MongoDB est en cours d'exécution
3. **Images**: Les images sont stockées dans le dossier `backend/uploads/`
4. **Production**: Pour la production, configurez les variables d'environnement appropriées

## 🚀 Déploiement

### VPS (Ubuntu + Nginx + PM2)

Ce scénario héberge le frontend (React build) via Nginx et le backend (Node/Express) via PM2.

1) Préparer le serveur (en SSH sur la VPS):

```bash
# Installer Node LTS et PM2
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm i -g pm2

# Installer Nginx
sudo apt-get install -y nginx

# Répertoire d'hébergement (exemple)
sudo mkdir -p /var/www/moneymoney
sudo chown -R $USER:$USER /var/www/moneymoney
```

2) Déployer le code sur la VPS (git clone ou rsync):

```bash
cd /var/www/moneymoney
git clone <votre-repo.git> .
```

3) Configurer le backend:

```bash
cd backend
cp .env.example .env
# Éditer .env avec vos valeurs (MongoDB, JWT_SECRET, PORT=5000)
npm install
mkdir -p uploads
```

4) Construire le frontend (en pointant vers votre domaine):

```bash
cd ../frontend
# Mettre votre domaine dans .env.production
# REACT_APP_API_URL=https://votre-domaine.com/api
npm install
npm run build
```

5) PM2 pour démarrer l'API:

```bash
cd ..
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup  # puis exécuter la commande affichée pour activer au boot
```

6) Nginx pour servir le frontend et proxy l'API:

```bash
sudo cp deployment/nginx.conf.example /etc/nginx/sites-available/moneymoney
sudo sed -i 's/your-domain.com/votre-domaine.com/g' /etc/nginx/sites-available/moneymoney
sudo ln -s /etc/nginx/sites-available/moneymoney /etc/nginx/sites-enabled/moneymoney
sudo nginx -t && sudo systemctl reload nginx
```

Structure de fichiers sur la VPS:

```
/var/www/moneymoney/
  backend/            # API Node (PM2)
    .env
    uploads/          # images uploadées (persistant)
  frontend/
    build/            # fichiers statiques servis par Nginx
  ecosystem.config.js
  deployment/nginx.conf.example
```

Notes importantes VPS:
- Mettez à jour `frontend/.env.production` avec l’URL publique du backend (même domaine recommandé) avant `npm run build`.
- Assurez-vous que `backend/uploads/` existe et est accessible en écriture.
- Les routes `/api/*` et `/uploads/*` sont proxifiées vers le backend sur `127.0.0.1:5000`.
- Logs PM2: `pm2 logs`, redémarrage: `pm2 restart moneymoney-api`.

## 📄 Licence

Ce projet est libre d'utilisation pour vos propres projets.

## 🤝 Support

Pour toute question ou problème, n'hésitez pas à créer une issue dans le dépôt.

---

**Bon développement ! 🎉**
