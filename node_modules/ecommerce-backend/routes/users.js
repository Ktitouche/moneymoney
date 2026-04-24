const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// Obtenir le profil de l'utilisateur connecté
router.get('/profil', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-motDePasse');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour le profil
router.put('/profil', auth, [
  body('nom').optional().isString().trim().isLength({ min: 1, max: 80 }),
  body('prenom').optional().isString().trim().isLength({ min: 1, max: 80 }),
  body('telephone').optional().isString().trim().isLength({ max: 25 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, prenom, telephone, adresse } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nom, prenom, telephone, adresse },
      { new: true, runValidators: true }
    ).select('-motDePasse');

    res.json({ message: 'Profil mis à jour', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Changer le mot de passe
router.put('/mot-de-passe', auth, [
  body('ancienMotDePasse').isString().notEmpty(),
  body('nouveauMotDePasse').isString().isLength({ min: 8 }).withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    const user = await User.findById(req.user.id);

    // Vérifier l'ancien mot de passe
    const isMatch = await bcrypt.compare(ancienMotDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: 'Ancien mot de passe incorrect' });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.motDePasse = await bcrypt.hash(nouveauMotDePasse, salt);
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();

    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir tous les utilisateurs (admin uniquement)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-motDePasse').sort({ dateCreation: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
