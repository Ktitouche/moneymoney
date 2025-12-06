const mongoose = require('mongoose');
const Category = require('./models/Category');
const Product = require('./models/Product');
require('dotenv').config();

const categories = [
  {
    nom: 'Smartphones',
    description: 'Derniers smartphones et accessoires',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
  },
  {
    nom: 'Ordinateurs',
    description: 'PC portables et ordinateurs de bureau',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
  },
  {
    nom: 'Audio',
    description: 'Écouteurs, casques et enceintes',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
  },
  {
    nom: 'Accessoires',
    description: 'Câbles, chargeurs et autres accessoires',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'
  },
  {
    nom: 'Montres connectées',
    description: 'Smartwatches et trackers de fitness',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
  }
];

const products = [
  // Smartphones
  {
    nom: 'iPhone 15 Pro',
    description: 'Le dernier iPhone avec puce A17 Pro, appareil photo 48MP et design en titane',
    prix: 145000,
    prixPromo: 135000,
    categorie: 'Smartphones',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1696446702288-9463c22098bb?w=500',
    marque: 'Apple',
    nouveau: true
  },
  {
    nom: 'Samsung Galaxy S24 Ultra',
    description: 'Écran AMOLED 6.8", Snapdragon 8 Gen 3, caméra 200MP',
    prix: 128000,
    prixPromo: 119000,
    categorie: 'Smartphones',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
    marque: 'Samsung',
    nouveau: true
  },
  {
    nom: 'Google Pixel 8 Pro',
    description: 'Intelligence artificielle avancée, appareil photo exceptionnel',
    prix: 98000,
    categorie: 'Smartphones',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
    marque: 'Google'
  },
  {
    nom: 'Xiaomi 14 Pro',
    description: 'Écran AMOLED 120Hz, Snapdragon 8 Gen 3, charge rapide 120W',
    prix: 75000,
    prixPromo: 68000,
    categorie: 'Smartphones',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1592286927505-b0527fab93c8?w=500',
    marque: 'Xiaomi'
  },
  
  // Ordinateurs
  {
    nom: 'MacBook Pro 16"',
    description: 'Puce M3 Max, 36GB RAM, 1TB SSD, écran Liquid Retina XDR',
    prix: 385000,
    categorie: 'Ordinateurs',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    marque: 'Apple',
    nouveau: true
  },
  {
    nom: 'Dell XPS 15',
    description: 'Intel i9, 32GB RAM, RTX 4060, écran OLED 4K',
    prix: 265000,
    prixPromo: 245000,
    categorie: 'Ordinateurs',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
    marque: 'Dell'
  },
  {
    nom: 'ASUS ROG Zephyrus G14',
    description: 'PC gaming portable, Ryzen 9, RTX 4070, 165Hz',
    prix: 225000,
    categorie: 'Ordinateurs',
    stock: 12,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
    marque: 'ASUS'
  },
  {
    nom: 'Lenovo ThinkPad X1 Carbon',
    description: 'Ultraportable professionnel, Intel i7, 16GB RAM',
    prix: 185000,
    prixPromo: 169000,
    categorie: 'Ordinateurs',
    stock: 18,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
    marque: 'Lenovo'
  },
  
  // Audio
  {
    nom: 'AirPods Pro (2ème génération)',
    description: 'Réduction de bruit active, audio spatial, résistance à l\'eau',
    prix: 32000,
    prixPromo: 28000,
    categorie: 'Audio',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=500',
    marque: 'Apple',
    nouveau: true
  },
  {
    nom: 'Sony WH-1000XM5',
    description: 'Meilleure réduction de bruit, autonomie 30h',
    prix: 45000,
    categorie: 'Audio',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
    marque: 'Sony'
  },
  {
    nom: 'JBL Charge 5',
    description: 'Enceinte Bluetooth portable, étanche IP67, autonomie 20h',
    prix: 22000,
    prixPromo: 18000,
    categorie: 'Audio',
    stock: 45,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    marque: 'JBL'
  },
  {
    nom: 'Bose QuietComfort Earbuds II',
    description: 'Écouteurs sans fil avec réduction de bruit personnalisée',
    prix: 38000,
    categorie: 'Audio',
    stock: 28,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
    marque: 'Bose'
  },
  
  // Accessoires
  {
    nom: 'Anker PowerBank 20000mAh',
    description: 'Charge rapide USB-C PD, 3 ports, compact',
    prix: 8500,
    categorie: 'Accessoires',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    marque: 'Anker'
  },
  {
    nom: 'Chargeur USB-C 65W GaN',
    description: 'Charge rapide multi-appareils, technologie GaN',
    prix: 5500,
    prixPromo: 4800,
    categorie: 'Accessoires',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1625651398161-5d2dc2c4e1d9?w=500',
    marque: 'Anker'
  },
  {
    nom: 'Support ordinateur portable réglable',
    description: 'Aluminium, ergonomique, compatible tous laptops',
    prix: 4200,
    categorie: 'Accessoires',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    marque: 'Generic'
  },
  {
    nom: 'Câble USB-C vers USB-C (2m)',
    description: 'Charge rapide 100W, transfert données 10Gbps',
    prix: 1800,
    categorie: 'Accessoires',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    marque: 'Anker'
  },
  
  // Montres connectées
  {
    nom: 'Apple Watch Series 9',
    description: 'GPS, suivi santé avancé, écran Always-On Retina',
    prix: 58000,
    prixPromo: 52000,
    categorie: 'Montres connectées',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
    marque: 'Apple',
    nouveau: true
  },
  {
    nom: 'Samsung Galaxy Watch 6',
    description: 'Écran AMOLED, suivi sommeil, autonomie 40h',
    prix: 42000,
    categorie: 'Montres connectées',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1617625802912-cad62876c0a0?w=500',
    marque: 'Samsung'
  },
  {
    nom: 'Garmin Forerunner 265',
    description: 'Montre GPS running, AMOLED, autonomie 13 jours',
    prix: 55000,
    categorie: 'Montres connectées',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=500',
    marque: 'Garmin'
  },
  {
    nom: 'Fitbit Charge 6',
    description: 'Tracker fitness, GPS intégré, suivi fréquence cardiaque',
    prix: 18000,
    prixPromo: 15500,
    categorie: 'Montres connectées',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500',
    marque: 'Fitbit'
  }
];

async function seedDatabase() {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connecté à MongoDB');

    // Supprimer les données existantes
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Anciennes données supprimées');

    // Insérer les catégories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ ${insertedCategories.length} catégories ajoutées`);

    // Créer un map des catégories par nom
    const categoryMap = {};
    insertedCategories.forEach(cat => {
      categoryMap[cat.nom] = cat._id;
    });

    // Associer les produits aux catégories et insérer
    const productsWithCategories = products.map(product => ({
      ...product,
      categorie: categoryMap[product.categorie]
    }));

    const insertedProducts = await Product.insertMany(productsWithCategories);
    console.log(`✅ ${insertedProducts.length} produits ajoutés`);

    console.log('\n🎉 Base de données peuplée avec succès !');
    console.log('\n📊 Résumé:');
    console.log(`   - Catégories: ${insertedCategories.length}`);
    console.log(`   - Produits: ${insertedProducts.length}`);
    console.log(`   - Produits en promotion: ${products.filter(p => p.prixPromo).length}`);
    console.log(`   - Nouveautés: ${products.filter(p => p.nouveau).length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

seedDatabase();
