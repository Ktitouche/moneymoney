const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const csrfCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const authClearCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
};

const csrfClearCookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
};

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
const generateCsrfToken = () => crypto.randomBytes(32).toString('hex');

const setCsrfCookie = (res) => {
  const csrfToken = generateCsrfToken();
  res.cookie('csrf_token', csrfToken, csrfCookieOptions);
  return csrfToken;
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives de connexion. Réessayez plus tard.' }
});

// Inscription
router.post('/inscription', authLimiter, [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('motDePasse').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('prenom').trim().notEmpty().withMessage('Le prénom est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { motDePasse, nom, prenom, telephone } = req.body;
    const email = normalizeEmail(req.body.email);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(motDePasse, salt);

    // Créer l'utilisateur
    const user = new User({
      email,
      motDePasse: hashedPassword,
      nom,
      prenom,
      telephone
    });

    await user.save();

    // Créer le token
    const token = jwt.sign(
      { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, authCookieOptions);
    const csrfToken = setCsrfCookie(res);

    res.status(201).json({
      message: 'Inscription réussie',
      csrfToken,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Connexion
router.post('/connexion', authLimiter, [
  body('email').isEmail().withMessage('Email invalide').normalizeEmail(),
  body('motDePasse').notEmpty().withMessage('Le mot de passe est requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { motDePasse } = req.body;
    const email = normalizeEmail(req.body.email);

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Créer le token
    const token = jwt.sign(
      { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('auth_token', token, authCookieOptions);
    const csrfToken = setCsrfCookie(res);

    res.json({
      message: 'Connexion réussie',
      csrfToken,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/deconnexion', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $inc: { tokenVersion: 1 } });

    res.clearCookie('auth_token', authClearCookieOptions);
    res.clearCookie('csrf_token', csrfClearCookieOptions);
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/csrf-token', (req, res) => {
  const csrfToken = setCsrfCookie(res);
  res.json({ csrfToken });
});

module.exports = router;
