const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, isAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Obtenir le profil de l'utilisateur connecté
router.get('/profil', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-motDePasse');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Mettre à jour le profil
router.put('/profil', auth, async (req, res) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nom, prenom, telephone, adresse },
      { new: true, runValidators: true }
    ).select('-motDePasse');
    
    res.json({ message: 'Profil mis à jour', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Changer le mot de passe
router.put('/mot-de-passe', auth, async (req, res) => {
  try {
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
    
    await user.save();
    
    res.json({ message: 'Mot de passe changé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Obtenir tous les utilisateurs (admin uniquement)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-motDePasse').sort({ dateCreation: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
