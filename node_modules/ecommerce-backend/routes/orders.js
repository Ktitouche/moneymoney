const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, isAdmin } = require('../middleware/auth');
const { getShippingFee } = require('../utils/shippingRates');

const guestOrderLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives. Réessayez plus tard.' }
});

let transactionSupportPromise;

const canUseTransactions = async () => {
  if (!transactionSupportPromise) {
    transactionSupportPromise = (async () => {
      try {
        const admin = mongoose.connection?.db?.admin?.();
        if (!admin) {
          return false;
        }

        const hello = await admin.command({ hello: 1 });
        return Boolean(hello?.setName || hello?.msg === 'isdbgrid');
      } catch (error) {
        return false;
      }
    })();
  }

  return transactionSupportPromise;
};

const startOptionalTransaction = async () => {
  let session = null;
  let transactional = false;

  try {
    const supportsTransactions = await canUseTransactions();
    if (!supportsTransactions) {
      return { session: null, transactional: false };
    }

    session = await mongoose.startSession();
    session.startTransaction();
    transactional = true;
  } catch (error) {
    if (session) {
      session.endSession();
      session = null;
    }
  }

  return { session, transactional };
};

const orderValidation = [
  body('produits').isArray({ min: 1 }).withMessage('Produits manquants'),
  body('produits.*.produit').isMongoId().withMessage('Produit invalide'),
  body('produits.*.quantite').isInt({ min: 1, max: 100 }).withMessage('Quantité invalide'),
  body('adresseLivraison.wilaya').isString().trim().notEmpty().withMessage('Wilaya invalide'),
  body('typeLivraison').optional().isIn(['domicile', 'point_relais'])
];

// Créer une commande (utilisateur connecté)
router.post('/', auth, orderValidation, async (req, res) => {
  const { session, transactional } = await startOptionalTransaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (transactional) {
        await session.abortTransaction();
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { produits, adresseLivraison, modePaiement, typeLivraison } = req.body;

    // Calculer le montant total et vérifier le stock avec transaction
    let montantTotal = 0;
    const produitsCommande = [];

    for (const item of produits) {
      const query = Product.findById(item.produit);
      if (session) {
        query.session(session);
      }
      const produit = await query;

      if (!produit) {
        if (transactional) {
          await session.abortTransaction();
        }
        return res.status(404).json({ message: `Produit ${item.produit} non trouvé` });
      }

      if (produit.stock < item.quantite) {
        if (transactional) {
          await session.abortTransaction();
        }
        return res.status(400).json({ message: `Stock insuffisant pour ${produit.nom}` });
      }

      const prix = produit.prixPromo || produit.prix;
      montantTotal += prix * item.quantite;

      produitsCommande.push({
        produit: item.produit,
        quantite: item.quantite,
        prix: prix
      });
    }

    // Réduire le stock de manière atomique avec $inc
    for (const item of produits) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.produit, stock: { $gte: item.quantite } },
        { $inc: { stock: -item.quantite } },
        { new: true, ...(session ? { session } : {}), runValidators: true }
      );

      if (!updatedProduct) {
        if (transactional) {
          await session.abortTransaction();
        }
        return res.status(400).json({ message: `Stock insuffisant pour ${item.produit}` });
      }
    }

    const deliveryType = typeLivraison === 'point_relais' ? 'point_relais' : 'domicile';
    const fees = getShippingFee(adresseLivraison?.wilaya, deliveryType);

    const orderData = {
      utilisateur: req.user.id,
      produits: produitsCommande,
      montantHT: montantTotal,
      montantTotal: montantTotal + fees,
      adresseLivraison,
      modePaiement: modePaiement || 'a_la_livraison',
      typeLivraison: deliveryType,
      fraisLivraison: fees
    };

    const commande = new Order(orderData);
    await commande.save(session ? { session } : undefined);

    if (transactional) {
      await session.commitTransaction();
    }
    res.status(201).json({ message: 'Commande créée avec succès', commande });
  } catch (error) {
    if (transactional) {
      await session.abortTransaction();
    }
    console.error('Erreur création commande utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    if (session) {
      session.endSession();
    }
  }
});

// Créer une commande invité (sans compte)
router.post('/guest', guestOrderLimiter, [
  ...orderValidation,
  body('clientGuest.nom').optional().isString().trim().isLength({ max: 80 }),
  body('clientGuest.prenom').optional().isString().trim().isLength({ max: 80 }),
  body('clientGuest.email').optional({ checkFalsy: true }).isEmail(),
  body('clientGuest.telephone').optional().isString().trim().isLength({ max: 25 })
], async (req, res) => {
  const { session, transactional } = await startOptionalTransaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (transactional) {
        await session.abortTransaction();
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { produits, clientGuest, adresseLivraison, modePaiement, typeLivraison } = req.body;

    if (!clientGuest) {
      if (transactional) {
        await session.abortTransaction();
      }
      return res.status(400).json({ message: 'Informations invité manquantes' });
    }

    if (!Array.isArray(produits) || produits.length === 0) {
      if (transactional) {
        await session.abortTransaction();
      }
      return res.status(400).json({ message: 'Produits manquants' });
    }

    let montantTotal = 0;
    const produitsCommande = [];

    // Vérifier le stock et calculer le montant
    for (const item of produits) {
      const query = Product.findById(item.produit);
      if (session) {
        query.session(session);
      }
      const produit = await query;
      if (!produit) {
        if (transactional) {
          await session.abortTransaction();
        }
        return res.status(404).json({ message: `Produit ${item.produit} non trouvé` });
      }
      if (produit.stock < item.quantite) {
        if (transactional) {
          await session.abortTransaction();
        }
        return res.status(400).json({ message: `Stock insuffisant pour ${produit.nom}` });
      }
      const prix = produit.prixPromo || produit.prix;
      montantTotal += prix * item.quantite;
      produitsCommande.push({ produit: item.produit, quantite: item.quantite, prix });
    }

    // Réduire le stock de manière atomique avec $inc
    for (const item of produits) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.produit, stock: { $gte: item.quantite } },
        { $inc: { stock: -item.quantite } },
        { new: true, ...(session ? { session } : {}), runValidators: true }
      );

      if (!updatedProduct) {
        if (transactional) {
          await session.abortTransaction();
        }
        return res.status(400).json({ message: `Stock insuffisant pour ${item.produit}` });
      }
    }

    const deliveryType = typeLivraison === 'point_relais' ? 'point_relais' : 'domicile';
    const fees = getShippingFee(adresseLivraison?.wilaya, deliveryType);

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
      modePaiement: modePaiement || 'a_la_livraison',
      typeLivraison: deliveryType,
      fraisLivraison: fees
    });

    await commande.save(session ? { session } : undefined);
    if (transactional) {
      await session.commitTransaction();
    }
    res.status(201).json({ message: 'Commande invitée créée avec succès', commande });
  } catch (error) {
    if (transactional) {
      await session.abortTransaction();
    }
    console.error('Erreur création commande invité:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  } finally {
    if (session) {
      session.endSession();
    }
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
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir toutes les commandes (admin uniquement)
router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const { statut } = req.query;
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limite = Math.min(Math.max(parseInt(req.query.limite, 10) || 20, 1), 100);

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
    res.status(500).json({ message: 'Erreur serveur' });
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
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour le statut d'une commande (admin uniquement)
router.put('/:id/statut', auth, isAdmin, [
  body('statut').isIn(['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { statut } = req.body;

    const commande = await Order.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true, runValidators: true }
    );

    if (!commande) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json({ message: 'Statut mis à jour', commande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
