const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');
const { upload, validateUploadedImages } = require('../middleware/upload');

const escapeRegex = (input = '') => String(input).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Obtenir tous les produits (public)
router.get('/', async (req, res) => {
  try {
    const { categorie, recherche, enVedette } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 12, 1), 50);

    const query = { actif: true };

    if (categorie) {
      query.categorie = categorie;
    }

    if (recherche) {
      const safeSearch = escapeRegex(String(recherche).slice(0, 80));
      query.$or = [
        { nom: { $regex: safeSearch, $options: 'i' } },
        { description: { $regex: safeSearch, $options: 'i' } },
        { marque: { $regex: safeSearch, $options: 'i' } }
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
    res.status(500).json({ message: 'Erreur serveur' });
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
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer un produit (admin uniquement)
router.post('/', auth, isAdmin, upload.array('images', 5), validateUploadedImages, async (req, res) => {
  try {
    const { nom, description, prix, prixPromo, categorie, stock, marque, caracteristiques, enVedette } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    let parsedCaracteristiques = [];
    if (caracteristiques) {
      try {
        parsedCaracteristiques = JSON.parse(caracteristiques);
      } catch (err) {
        return res.status(400).json({ message: 'Format des caractéristiques invalide' });
      }
    }

    const produit = new Product({
      nom,
      description,
      prix,
      prixPromo,
      categorie,
      images,
      stock,
      marque,
      caracteristiques: parsedCaracteristiques,
      enVedette: enVedette === 'true'
    });

    await produit.save();

    res.status(201).json({ message: 'Produit créé avec succès', produit });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour un produit (admin uniquement)
router.put('/:id', auth, isAdmin, upload.array('images', 5), validateUploadedImages, async (req, res) => {
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
    res.status(500).json({ message: 'Erreur serveur' });
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
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
