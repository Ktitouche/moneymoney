const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Obtenir toutes les catégories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ nom: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Obtenir une catégorie par ID (public)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Créer une catégorie (admin uniquement)
router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { nom, description } = req.body;
    const image = req.file ? req.file.path : null;
    
    const category = new Category({
      nom,
      description,
      image
    });
    
    await category.save();
    
    res.status(201).json({ message: 'Catégorie créée avec succès', category });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Mettre à jour une catégorie (admin uniquement)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    res.json({ message: 'Catégorie mise à jour', category });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Supprimer une catégorie (admin uniquement)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    
    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
