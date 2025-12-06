const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');

// Créer une commande (utilisateur connecté)
router.post('/', auth, async (req, res) => {
  try {
    const { produits, adresseLivraison, modePaiement, typeLivraison, fraisLivraison } = req.body;

    // Calculer le montant total
    let montantTotal = 0;
    const produitsCommande = [];

    for (const item of produits) {
      const produit = await Product.findById(item.produit);

      if (!produit) {
        return res.status(404).json({ message: `Produit ${item.produit} non trouvé` });
      }

      if (produit.stock < item.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour ${produit.nom}` });
      }

      const prix = produit.prixPromo || produit.prix;
      montantTotal += prix * item.quantite;

      produitsCommande.push({
        produit: item.produit,
        quantite: item.quantite,
        prix: prix
      });

      // Réduire le stock
      produit.stock -= item.quantite;
      await produit.save();
    }

    const fees = typeof fraisLivraison === 'number' ? fraisLivraison : 0;

    const orderData = {
      utilisateur: req.user.id,
      produits: produitsCommande,
      montantHT: montantTotal,
      montantTotal: montantTotal + fees,
      adresseLivraison,
      modePaiement: modePaiement || 'a_la_livraison',
      fraisLivraison: fees
    };

    // Assigner typeLivraison seulement si défini
    if (typeLivraison) {
      orderData.typeLivraison = typeLivraison;
    }

    const commande = new Order(orderData);

    await commande.save();

    res.status(201).json({ message: 'Commande créée avec succès', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Créer une commande invité (sans compte)
router.post('/guest', async (req, res) => {
  try {
    const { produits, clientGuest, adresseLivraison, modePaiement, typeLivraison, fraisLivraison } = req.body;

    if (!clientGuest) {
      return res.status(400).json({ message: 'Informations invité manquantes' });
    }

    if (!Array.isArray(produits) || produits.length === 0) {
      return res.status(400).json({ message: 'Produits manquants' });
    }

    let montantTotal = 0;
    const produitsCommande = [];

    for (const item of produits) {
      const produit = await Product.findById(item.produit);
      if (!produit) {
        return res.status(404).json({ message: `Produit ${item.produit} non trouvé` });
      }
      if (produit.stock < item.quantite) {
        return res.status(400).json({ message: `Stock insuffisant pour ${produit.nom}` });
      }
      const prix = produit.prixPromo || produit.prix;
      montantTotal += prix * item.quantite;
      produitsCommande.push({ produit: item.produit, quantite: item.quantite, prix });
      produit.stock -= item.quantite;
      await produit.save();
    }

    const fees = typeof fraisLivraison === 'number' ? fraisLivraison : 0;

    const commande = new Order({
      produits: produitsCommande,
      montantHT: montantTotal,
      montantTotal: montantTotal + fees,
      clientGuest: {
        nom: clientGuest.nom || '',
        prenom: clientGuest.prenom || '',
        email: clientGuest.email || '',
        telephone: clientGuest.telephone || ''
      },
      adresseLivraison,
      modePaiement: 'a_la_livraison',
      typeLivraison: typeLivraison || 'domicile',
      fraisLivraison: fees
    });

    await commande.save();
    res.status(201).json({ message: 'Commande invitée créée avec succès', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Obtenir les commandes de l'utilisateur connecté
router.get('/mes-commandes', auth, async (req, res) => {
  try {
    const commandes = await Order.find({ utilisateur: req.user.id })
      .populate('produits.produit', 'nom images prix')
      .sort({ dateCommande: -1 });

    res.json(commandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Obtenir toutes les commandes (admin uniquement)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const { statut, page = 1, limite = 20 } = req.query;

    const query = statut ? { statut } : {};

    const commandes = await Order.find(query)
      .populate('utilisateur', 'nom prenom email')
      .populate('produits.produit', 'nom')
      .limit(limite * 1)
      .skip((page - 1) * limite)
      .sort({ dateCommande: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      commandes,
      totalPages: Math.ceil(total / limite),
      pageActuelle: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Obtenir une commande par ID
router.get('/:id', auth, async (req, res) => {
  try {
    const commande = await Order.findById(req.params.id)
      .populate('utilisateur', 'nom prenom email telephone')
      .populate('produits.produit', 'nom images prix');

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur a le droit de voir cette commande
    if (commande.utilisateur) {
      if (req.user.role !== 'admin' && commande.utilisateur._id.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Mettre à jour le statut d'une commande (admin uniquement)
router.put('/:id/statut', auth, isAdmin, async (req, res) => {
  try {
    const { statut } = req.body;

    const commande = await Order.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    );

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json({ message: 'Statut mis à jour', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
