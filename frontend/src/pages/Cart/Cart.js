import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const handleCheckout = () => {
    navigate('/commander');
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Votre panier est vide</h2>
            <p>Vous n'avez pas encore ajouté de produits à votre panier.</p>
            <button onClick={() => navigate('/produits')} className="btn btn-primary">
              Continuer vos achats
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Mon Panier</h1>

        <div className="cart-layout">
          <div className="cart-items">
            <div className="cart-header">
              <span>Produit</span>
              <span>Prix</span>
              <span>Quantité</span>
              <span>Total</span>
              <span></span>
            </div>

            {cart.map((item) => {
              const price = item.prixPromo || item.prix;
              const itemTotal = price * item.quantity;

              return (
                <div key={item._id} className="cart-item">
                  <div className="item-product">
                    <img 
                      src={item.images?.[0] ? `${API_URL}/${item.images[0]}` : 'https://via.placeholder.com/100x100?text=Produit'}
                      alt={item.nom}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Produit';
                      }}
                    />
                    <div className="item-info">
                      <h3>{item.nom}</h3>
                      {item.marque && <p className="item-brand">{item.marque}</p>}
                    </div>
                  </div>

                  <div className="item-price">
                    {price.toFixed(2)} DA
                  </div>

                  <div className="item-quantity">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <div className="item-total">
                    {itemTotal.toFixed(2)} DA
                  </div>

                  <button 
                    className="item-remove"
                    onClick={() => removeFromCart(item._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })}

            <div className="cart-actions">
              <button onClick={() => navigate('/produits')} className="btn btn-outline">
                Continuer vos achats
              </button>
              <button onClick={clearCart} className="btn btn-secondary">
                Vider le panier
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <h2>Résumé de la commande</h2>
            



            <div className="summary-row total">
              <span>Total : </span>
              <span>{(getCartTotal() + (getCartTotal() >= 50 ? 0 : 5)).toFixed(2)} DA</span>
            </div>

            {getCartTotal() < 50 && (
              <p className="free-shipping-msg">
                Ajoutez {(50 - getCartTotal()).toFixed(2)} DA pour bénéficier de la livraison gratuite
              </p>
            )}

            <button onClick={handleCheckout} className="btn btn-primary btn-checkout">
              Passer la commande
            </button>

            <div className="security-badges">
              <p>🔒 Paiement 100% sécurisé</p>
              <p>✓ Garantie satisfait ou remboursé</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
