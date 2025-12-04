const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Obtenir tous les produits (public)
router.get('/', async (req, res) => {
  try {
    const { categorie, recherche, page = 1, limite = 12, enVedette } = req.query;

    const query = { actif: true };

    if (categorie) {
      query.categorie = categorie;
    }

    if (recherche) {
      query.$or = [
        { nom: { $regex: recherche, $options: 'i' } },
        { description: { $regex: recherche, $options: 'i' } },
        { marque: { $regex: recherche, $options: 'i' } }
      ];
    }

    if (enVedette === 'true') {
      query.enVedette = true;
    }

    const produits = await Product.find(query)
      .populate('categorie', 'nom')
      .limit(limite * 1)
      .skip((page - 1) * limite)
      .sort({ dateCreation: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      produits,
      totalPages: Math.ceil(total / limite),
      pageActuelle: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Obtenir un produit par ID (public)
router.get('/:id', async (req, res) => {
  try {
    const produit = await Product.findById(req.params.id).populate('categorie', 'nom description');

    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json(produit);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Créer un produit (admin uniquement)
router.post('/', auth, isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { nom, description, prix, prixPromo, categorie, stock, marque, caracteristiques, enVedette } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    const produit = new Product({
      nom,
      description,
      prix,
      prixPromo,
      categorie,
      images,
      stock,
      marque,
      caracteristiques: caracteristiques ? JSON.parse(caracteristiques) : [],
      enVedette: enVedette === 'true'
    });

    await produit.save();

    res.status(201).json({ message: 'Produit créé avec succès', produit });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Mettre à jour un produit (admin uniquement)
router.put('/:id', auth, isAdmin, upload.array('images', 5), async (req, res) => {
  try {
    const { nom, description, prix, prixPromo, categorie, stock, marque, caracteristiques, enVedette } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];

    const updateData = {
      nom,
      description,
      prix,
      prixPromo,
      categorie,
      stock,
      marque,
      enVedette: enVedette === 'true'
    };

    if (caracteristiques) {
      try {
        updateData.caracteristiques = JSON.parse(caracteristiques);
      } catch (err) {
        return res.status(400).json({ message: 'Format des caractéristiques invalide' });
      }
    }

    if (images.length > 0) {
      updateData.images = images;
    }

    // Nettoyage: retirer les champs undefined pour ne pas écraser les valeurs existantes
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    const produit = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit mis à jour', produit });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Supprimer un produit (admin uniquement)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const produit = await Product.findByIdAndDelete(req.params.id);

    if (!produit) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
