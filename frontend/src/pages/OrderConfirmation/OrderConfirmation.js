import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import api from '../../utils/api';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      // Erreur silencieuse
      // Même sans les détails (ex: invité non connecté), on affiche une page de remerciement
      setOrder(null);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>

          <h1>Merci pour votre commande !</h1>
          <p className="confirmation-message">
            Nous l'avons bien reçue et nous la préparerons dans les plus brefs délais.
          </p>

          {order ? (
            <>
              <div className="order-details">
                <h2>Détails de la commande</h2>
                <div className="detail-line">
                  <span>Numéro de commande:</span>
                  <strong>#{order._id.slice(-8).toUpperCase()}</strong>
                </div>
                <div className="detail-line">
                  <span>Date:</span>
                  <strong>{new Date(order.dateCommande).toLocaleDateString('fr-FR')}</strong>
                </div>
                <div className="detail-line">
                  <span>Montant total:</span>
                  <strong>{order.montantTotal.toFixed(2)} DA</strong>
                </div>
                <div className="detail-line">
                  <span>Statut:</span>
                  <strong className="status">{getStatusText(order.statut)}</strong>
                </div>
              </div>

              {order.produits?.length > 0 && (
                <div className="order-items">
                  <h3>Détails de la commande</h3>
                  {order.produits.map((item, idx) => {
                    const prixLigne = (item.quantite * item.prix).toFixed(2);
                    return (
                      <div className="item-line" key={idx}>
                        <div className="item-details">
                          <div className="item-name">{item.produit?.nom || 'Produit'}</div>
                          <div className="item-breakdown">
                            <span>{item.prix?.toFixed(2)} DA × {item.quantite} = {prixLigne} DA</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="order-summary-breakdown">
                    <div className="summary-line">
                      <span>Sous-total:</span>
                      <span>{(order.montantTotal - (order.fraisLivraison || 0)).toFixed(2)} DA</span>
                    </div>
                    {order.fraisLivraison > 0 && (
                      <div className="summary-line">
                        <span>Frais de livraison:</span>
                        <span>{order.fraisLivraison.toFixed(2)} DA</span>
                      </div>
                    )}
                    <div className="summary-line total">
                      <span>Total:</span>
                      <strong>{order.montantTotal.toFixed(2)} DA</strong>
                    </div>
                  </div>
                </div>
              )}

              {order.adresseLivraison && (
                <div className="shipping-info">
                  <h3>Adresse de livraison</h3>
                  <p>
                    {(order.adresseLivraison.prenom || order.adresseLivraison.nom) && (
                      <>
                        {order.adresseLivraison.prenom} {order.adresseLivraison.nom}<br />
                      </>
                    )}
                    {order.adresseLivraison.rue && (<>{order.adresseLivraison.rue}<br /></>)}
                    {(order.adresseLivraison.codePostal || order.adresseLivraison.ville) && (
                      <>
                        {order.adresseLivraison.codePostal} {order.adresseLivraison.ville}<br />
                      </>
                    )}
                    {order.adresseLivraison.pays}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="order-details" style={{ textAlign: 'center' }}>
              <h2>Commande enregistrée</h2>
              <p>Merci ! Votre commande a été prise en compte.</p>
            </div>
          )}

          <div className="order-actions">
            <button onClick={() => navigate('/mes-commandes')} className="btn btn-primary">
              Voir mes commandes
            </button>
            <button onClick={() => navigate('/')} className="btn btn-outline">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusText = (status) => {
  const statuses = {
    'en_attente': 'En attente',
    'confirmee': 'Confirmée',
    'en_preparation': 'En préparation',
    'expediee': 'Expédiée',
    'livree': 'Livrée',
    'annulee': 'Annulée'
  };
  return statuses[status] || status;
};

export default OrderConfirmation;
