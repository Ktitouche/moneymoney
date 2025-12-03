const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Si la commande est passée par un utilisateur inscrit, référence vers User
  utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // Informations invité si pas de compte
  clientGuest: {
    nom: String,
    prenom: String,
    email: String,
    telephone: String
  },
  produits: [{
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantite: {
      type: Number,
      required: true,
      min: 1
    },
    prix: {
      type: Number,
      required: true
    }
  }],
  montantTotal: {
    type: Number,
    required: true
  },
  adresseLivraison: {
    nom: String,
    prenom: String,
    rue: String,
    wilaya: String,
    telephone: String
  },
  statut: {
    type: String,
    enum: ['en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'annulee'],
    default: 'en_attente'
  },
  modePaiement: {
    type: String,
    default: 'a_la_livraison'
  },
  typeLivraison: {
    type: String,
    enum: ['domicile', 'point_relais'],
    default: 'domicile'
  },
  fraisLivraison: {
    type: Number,
    default: 0
  },
  dateCommande: {
    type: Date,
    default: Date.now
  },
  dateLivraison: {
    type: Date
  }
});

module.exports = mongoose.model('Order', orderSchema);
