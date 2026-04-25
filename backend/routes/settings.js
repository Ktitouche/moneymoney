const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { auth, isAdmin } = require('../middleware/auth');

const DEFAULT_HERO_TEXT = 'Decouvrez nos produits de qualite a prix imbattables';

// Public: get hero text content
router.get('/hero', async (req, res) => {
    try {
        const settings = await SiteSettings.findOne().sort({ updatedAt: -1 });
        res.json({ heroText: settings?.heroText || DEFAULT_HERO_TEXT });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Admin only: update hero text content
router.put('/hero', auth, isAdmin, async (req, res) => {
    try {
        const incomingHeroText = String(req.body?.heroText || '').trim();

        if (!incomingHeroText) {
            return res.status(400).json({ message: 'Le texte hero est obligatoire.' });
        }

        if (incomingHeroText.length > 500) {
            return res.status(400).json({ message: 'Le texte hero ne doit pas depasser 500 caracteres.' });
        }

        const settings = await SiteSettings.findOneAndUpdate(
            {},
            {
                heroText: incomingHeroText,
                updatedBy: req.user.id,
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true,
            }
        );

        res.json({ message: 'Texte hero mis a jour avec succes', heroText: settings.heroText });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

module.exports = router;
