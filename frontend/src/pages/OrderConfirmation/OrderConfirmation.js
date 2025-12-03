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
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!order) {
    return (
      <div className="container">
        <p>Commande non trouvée</p>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="success-icon">
            <FaCheckCircle />
          </div>
          
          <h1>Commande confirmée !</h1>
          <p className="confirmation-message">
            Merci pour votre commande. Nous avons bien reçu votre demande et 
            nous la traiterons dans les plus brefs délais.
          </p>

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
              <strong>{order.montantTotal.toFixed(2)} €</strong>
            </div>
            <div className="detail-line">
              <span>Statut:</span>
              <strong className="status">{getStatusText(order.statut)}</strong>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Adresse de livraison</h3>
            <p>
              {order.adresseLivraison.prenom} {order.adresseLivraison.nom}<br />
              {order.adresseLivraison.rue}<br />
              {order.adresseLivraison.codePostal} {order.adresseLivraison.ville}<br />
              {order.adresseLivraison.pays}
            </p>
          </div>

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
