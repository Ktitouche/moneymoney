import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import './MyOrders.css';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/mes-commandes');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
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

  const getStatusClass = (status) => {
    const classes = {
      'en_attente': 'warning',
      'confirmee': 'info',
      'en_preparation': 'info',
      'expediee': 'primary',
      'livree': 'success',
      'annulee': 'danger'
    };
    return classes[status] || 'secondary';
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="my-orders-page">
      <div className="container">
        <h1 className="page-title">Mes Commandes</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>Vous n'avez pas encore passé de commande.</p>
            <button onClick={() => navigate('/produits')} className="btn btn-primary">
              Découvrir nos produits
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-number">
                    <strong>Commande #{order._id.slice(-8).toUpperCase()}</strong>
                    <span className="order-date">
                      {new Date(order.dateCommande).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <span className={`order-status ${getStatusClass(order.statut)}`}>
                    {getStatusText(order.statut)}
                  </span>
                </div>

                <div className="order-items">
                  {order.produits.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="order-item-info">
                        <span className="order-item-name">{item.produit.nom}</span>
                        <span className="order-item-qty">Quantité: {item.quantite}</span>
                      </div>
                      <span className="order-item-price">
                        {(item.prix * item.quantite).toFixed(2)} €
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>{order.montantTotal.toFixed(2)} DA</strong>
                  </div>
                  <button 
                    onClick={() => navigate(`/commande-confirmee/${order._id}`)}
                    className="btn btn-outline btn-sm"
                  >
                    Voir les détails
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
