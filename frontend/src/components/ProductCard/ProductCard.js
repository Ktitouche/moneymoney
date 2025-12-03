import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import './ProductCard.css';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success('Produit ajouté au panier !');
  };

  const price = product.prixPromo || product.prix;
  const hasDiscount = product.prixPromo && product.prixPromo < product.prix;

  return (
    <div className="product-card">
      <Link to={`/produit/${product._id}`}>
        <div className="product-image">
          {hasDiscount && (
            <span className="discount-badge">
              -{Math.round(((product.prix - product.prixPromo) / product.prix) * 100)}%
            </span>
          )}
          {product.images && product.images.length > 0 ? (
            <img 
              src={`${API_URL}/${product.images[0]}`} 
              alt={product.nom}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x300?text=Produit';
              }}
            />
          ) : (
            <img 
              src="https://via.placeholder.com/300x300?text=Produit" 
              alt={product.nom} 
            />
          )}
          {product.stock === 0 && (
            <div className="out-of-stock">Rupture de stock</div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.nom}</h3>
          
          {product.marque && (
            <p className="product-brand">{product.marque}</p>
          )}

          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="star" />
            ))}
            <span>(4.5)</span>
          </div>

          <div className="product-price">
            {hasDiscount && (
              <span className="old-price">{product.prix.toFixed(2)} €</span>
            )}
            <span className="current-price">{price.toFixed(2)} €</span>
          </div>
        </div>
      </Link>

      <button 
        className="add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        <FaShoppingCart /> Ajouter au panier
      </button>
    </div>
  );
};

export default ProductCard;
