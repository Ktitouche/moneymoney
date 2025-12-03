import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    rue: user?.adresse?.rue || '',
    wilaya: '',
    telephone: user?.telephone || '',
    typeLivraison: 'domicile'
  });
  const WILAYAS = [
    { code: '01', nom: 'Adrar', prix: 600 },
    { code: '16', nom: 'Alger', prix: 400 },
    { code: '09', nom: 'Blida', prix: 450 },
    { code: '31', nom: 'Oran', prix: 550 },
    { code: '40', nom: 'Khenchela', prix: 700 }
  ];
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/panier');
    }
    // Si utilisateur connecté, pré-remplir
    if (user) {
      setFormData((d) => ({
        ...d,
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: user.telephone || ''
      }));
    }
  }, [user, cart, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const produitsPayload = cart.map(item => ({ produit: item._id, quantite: item.quantity }));
      let response;
      if (user) {
        // Commande standard
        response = await api.post('/orders', {
          produits: produitsPayload,
          adresseLivraison: {
            nom: formData.nom,
            prenom: formData.prenom,
            rue: formData.rue,
            wilaya: formData.wilaya,
            telephone: formData.telephone
          },
          typeLivraison: formData.typeLivraison,
          fraisLivraison: (WILAYAS.find(w => w.nom === formData.wilaya)?.prix || 0)
        });
      } else {
        // Commande invité
        response = await api.post('/orders/guest', {
          produits: produitsPayload,
            clientGuest: {
              nom: formData.nom,
              prenom: formData.prenom,
              email: '',
              telephone: formData.telephone
            },
            adresseLivraison: {
              nom: formData.nom,
              prenom: formData.prenom,
              rue: formData.rue,
              wilaya: formData.wilaya,
              telephone: formData.telephone
            },
            typeLivraison: formData.typeLivraison,
            fraisLivraison: (WILAYAS.find(w => w.nom === formData.wilaya)?.prix || 0)
        });
      }
      
      toast.success('Commande passée avec succès !');
      clearCart();
      navigate(`/commande-confirmee/${response.data.commande._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal >= 50 ? 0 : 5;
  const total = subtotal + shipping;

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">{user ? 'Finaliser la commande' : 'Commande invité (sans compte)'}</h1>

        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="checkout-layout">
            <div className="checkout-main">
              {/* Adresse de livraison */}
              <section className="checkout-section">
                <h2>Adresse de livraison</h2>
                
                {/* Email supprimé pour commande invité */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom *</label>
                    <input
                      type="text"
                      name="nom"
                      className="form-input"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prénom *</label>
                    <input
                      type="text"
                      name="prenom"
                      className="form-input"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Adresse *</label>
                  <input
                    type="text"
                    name="rue"
                    className="form-input"
                    value={formData.rue}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Wilaya *</label>
                    <select name="wilaya" className="form-input" value={formData.wilaya} onChange={handleChange} required>
                      <option value="">Choisir…</option>
                      {WILAYAS.map((w) => (
                        <option key={w.code} value={w.nom}>{w.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Téléphone *</label>
                    <input
                      type="tel"
                      name="telephone"
                      className="form-input"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Pays *</label>
                    <input
                      type="text"
                      name="pays"
                      className="form-input"
                      value={formData.pays}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone *</label>
                    <input
                      type="tel"
                      name="telephone"
                      className="form-input"
                      value={formData.telephone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </section>

              {/* Mode de paiement */}
              <section className="checkout-section">
                <h2>Type de livraison</h2>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="typeLivraison"
                      value="domicile"
                      checked={formData.typeLivraison === 'domicile'}
                      onChange={handleChange}
                    />
                    <span>🏠 À domicile</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="typeLivraison"
                      value="point_relais"
                      checked={formData.typeLivraison === 'point_relais'}
                      onChange={handleChange}
                    />
                    <span>🏤 Point relais</span>
                  </label>
                </div>
              </section>
            </div>

            {/* Résumé de commande */}
            <aside className="checkout-sidebar">
              <div className="order-summary">
                <h2>Résumé de la commande</h2>

                <div className="order-items">
                  {cart.map((item) => {
                    const price = item.prixPromo || item.prix;
                    return (
                      <div key={item._id} className="order-item">
                        <div className="order-item-info">
                          <span className="order-item-name">{item.nom}</span>
                          <span className="order-item-qty">x {item.quantity}</span>
                        </div>
                        <span className="order-item-price">
                          {(price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="order-totals">
                  <div className="order-line">
                    <span>Sous-total:</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="order-line">
                    <span>Livraison:</span>
                    <span>{(WILAYAS.find(w => w.nom === formData.wilaya)?.prix || 0).toFixed(2)} €</span>
                  </div>
                  <div className="order-line total">
                    <span>Total:</span>
                    <span>{(subtotal + (WILAYAS.find(w => w.nom === formData.wilaya)?.prix || 0)).toFixed(2)} €</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? 'Traitement...' : user ? 'Confirmer la commande' : 'Commander en tant qu\'invité'}
                </button>

                <p className="security-note">
                  🔒 Paiement 100% sécurisé
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
