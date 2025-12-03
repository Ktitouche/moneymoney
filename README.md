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

### Backend (exemple avec Heroku)
1. Créez une application Heroku
2. Ajoutez MongoDB Atlas comme base de données
3. Configurez les variables d'environnement
4. Déployez avec Git

### Frontend (exemple avec Vercel/Netlify)
1. Buildez l'application: `npm run build`
2. Déployez le dossier `build/`
3. Configurez la variable `REACT_APP_API_URL` avec l'URL du backend

## 📄 Licence

Ce projet est libre d'utilisation pour vos propres projets.

## 🤝 Support

Pour toute question ou problème, n'hésitez pas à créer une issue dans le dépôt.

---

**Bon développement ! 🎉**
