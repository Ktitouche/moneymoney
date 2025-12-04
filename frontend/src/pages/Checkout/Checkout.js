import React, { useState, useContext, useEffect, useRef } from 'react';
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
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    rue: user?.adresse?.rue || '',
    wilaya: '',
    telephone: user?.telephone || '',
    typeLivraison: 'domicile',
    pointRelais: ''
  });
  const WILAYAS = [
    { code: '01', nom: 'Adrar', prix: 600 },
    { code: '16', nom: 'Alger', prix: 400 },
    { code: '09', nom: 'Blida', prix: 450 },
    { code: '31', nom: 'Oran', prix: 550 },
    { code: '40', nom: 'Khenchela', prix: 700 }
  ];

  const POINTS_RELAIS = {
    'Alger': [
      'Alger Centre - Rue Didouche Mourad',
      'Bab Ezzouar - Centre Commercial Ardis',
      'Hydra - Place du 1er Mai'
    ],
    'Oran': [
      'Oran Centre - Boulevard de la Soummam',
      'Es Senia - Zone Industrielle',
      'Bir El Djir - Centre Commercial'
    ],
    'Blida': [
      'Blida Centre - Rue Larbi Ben M\'hidi',
      'Boufarik - Avenue de l\'Indépendance'
    ],
    'Adrar': [
      'Adrar Centre - Place du Marché'
    ],
    'Khenchela': [
      'Khenchela Centre - Avenue de la République'
    ]
  };

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [phoneStatus, setPhoneStatus] = useState({
    message: 'Format attendu : 05 50 12 34 56',
    type: 'info'
  });

  const sanitizePhone = (phone) => phone.replace(/\D/g, '').slice(0, 10);

  const formatPhone = (digits) => {
    const parts = digits.match(/.{1,2}/g) || [];
    return parts.join(' ').trim();
  };

  const validatePhone = (phone) => {
    // Format algérien: 0X XX XX XX XX (X = 5, 6, 7)
    const phoneRegex = /^(0)(5|6|7)[0-9]{8}$/;
    return phoneRegex.test(sanitizePhone(phone));
  };

  const getFieldLabel = (el) => el?.dataset?.label || el?.name || 'Ce champ';

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
        telephone: formatPhone(sanitizePhone(user.telephone || ''))
      }));
    }
  }, [user, cart, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telephone') {
      const digits = sanitizePhone(value);
      const formatted = formatPhone(digits);
      const isValid = validatePhone(digits);

      setFormData({ ...formData, telephone: formatted });

      if (digits.length === 0) {
        setPhoneError('');
        setPhoneStatus({ message: 'Format attendu : 05 50 12 34 56', type: 'info' });
      } else if (!isValid) {
        setPhoneError('Doit commencer par 05, 06 ou 07 et contenir 10 chiffres.');
        setPhoneStatus({ message: 'Exemple valide : 0550 12 34 56', type: 'error' });
      } else {
        setPhoneError('');
        setPhoneStatus({ message: 'Numéro valide ✅', type: 'success' });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation requise : scrolle/focus sans bulle native
    if (formRef.current && !formRef.current.checkValidity()) {
      const firstInvalid = formRef.current.querySelector(':invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus({ preventScroll: true });
        const label = getFieldLabel(firstInvalid);
        toast.error(`${label} est requis.`);
      }
      return;
    }

    // Valider le téléphone avant soumission
    if (!validatePhone(formData.telephone)) {
      setPhoneError('Numéro de téléphone invalide. Format: 0550123456');
      toast.error('Veuillez vérifier votre numéro de téléphone');
      const phoneInput = formRef.current?.querySelector('input[name="telephone"]');
      if (phoneInput) {
        phoneInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        phoneInput.focus({ preventScroll: true });
      }
      return;
    }

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
            telephone: sanitizePhone(formData.telephone)
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
            telephone: sanitizePhone(formData.telephone)
          },
          adresseLivraison: {
            nom: formData.nom,
            prenom: formData.prenom,
            rue: formData.rue,
            wilaya: formData.wilaya,
            telephone: sanitizePhone(formData.telephone)
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

        <form ref={formRef} onSubmit={handleSubmit} className="checkout-form" noValidate>
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
                      data-label="Le nom"
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
                      data-label="Le prénom"
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
                    data-label="L'adresse"
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
                      data-label="Le téléphone"
                      className="form-input"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="Ex: 0550123456"
                      required
                    />
                    <p className={`field-helper ${phoneStatus.type}`}>
                      {phoneError || phoneStatus.message}
                    </p>
                  </div>
                </div>
              </section>

              {/* Mode de livraison */}
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

                {/* Sélection du point relais si ce type est choisi */}
                {formData.typeLivraison === 'point_relais' && formData.wilaya && (
                  <div className="form-group" style={{ marginTop: '20px' }}>
                    <label className="form-label">Choisir un point relais *</label>
                    <select
                      name="pointRelais"
                      data-label="Le point relais"
                      className="form-input"
                      value={formData.pointRelais}
                      onChange={handleChange}
                      required={formData.typeLivraison === 'point_relais'}
                    >
                      <option value="">Sélectionner un point relais...</option>
                      {POINTS_RELAIS[formData.wilaya]?.map((point, index) => (
                        <option key={index} value={point}>{point}</option>
                      ))}
                    </select>
                    {!POINTS_RELAIS[formData.wilaya] && (
                      <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>
                        Aucun point relais disponible dans cette wilaya
                      </p>
                    )}
                  </div>
                )}
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
                          {(price * item.quantity).toFixed(2)} DA
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="order-totals">
                  <div className="order-line">
                    <span>Sous-total:</span>
                    <span>{subtotal.toFixed(2)} DA</span>
                  </div>
                  <div className="order-line">
                    <span>Livraison:</span>
                    <span>{(WILAYAS.find(w => w.nom === formData.wilaya)?.prix || 0).toFixed(2)} DA</span>
                  </div>
                  <div className="order-line total">
                    <span>Total:</span>
                    <span>{(subtotal + (WILAYAS.find(w => w.nom === formData.wilaya)?.prix || 0)).toFixed(2)} DA</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? 'Traitement...' : user ? 'Confirmer la commande' : 'Commander en tant qu\'invité'}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
