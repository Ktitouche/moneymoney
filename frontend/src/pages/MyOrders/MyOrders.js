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
      // Erreur silencieuse
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
                  {(order.produits || []).map((item, index) => {
                    const nomProduit = item?.produit?.nom || 'Produit inconnu';
                    const quantite = item?.quantite || 0;
                    const prixUnitaire = item?.prix || 0;
                    const prixTotal = (prixUnitaire * quantite).toFixed(2);
                    return (
                      <div key={index} className="order-item">
                        <div className="order-item-info">
                          <span className="order-item-name">{nomProduit}</span>
                          <span className="order-item-qty">Quantité: {quantite}</span>
                        </div>
                        <span className="order-item-price">
                          {prixTotal} DA
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="order-footer">
                  <div className="order-summary">
                    <div className="summary-line">
                      <span>Sous-total:</span>
                      <span>{((order.montantTotal || 0) - (order.fraisLivraison || 0)).toFixed(2)} DA</span>
                    </div>
                    {order.fraisLivraison > 0 && (
                      <div className="summary-line">
                        <span>Livraison:</span>
                        <span>{(order.fraisLivraison || 0).toFixed(2)} DA</span>
                      </div>
                    )}
                    <div className="summary-line total">
                      <span>Total:</span>
                      <strong>{(order.montantTotal || 0).toFixed(2)} DA</strong>
                    </div>
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
