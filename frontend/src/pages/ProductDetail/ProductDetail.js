import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import api from '../../utils/api';
import { CartContext } from '../../context/CartContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000';

  useEffect(() => {
    // Jump to top when entering a product from Home
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (_) {
      window.scrollTo(0, 0);
    }
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      // Erreur silencieuse
      setLoading(false);
      toast.error('Produit non trouvé');
      navigate('/produits');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${quantity > 1 ? 'produits ajoutés' : 'produit ajouté'} au panier !`);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const openLightbox = () => {
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (!product) {
    return <div className="container"><p>Produit non trouvé</p></div>;
  }

  const price = product.prixPromo || product.prix;
  const hasDiscount = product.prixPromo && product.prixPromo < product.prix;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          {/* Images Section */}
          <div className="product-images">
            <div className="main-image">
              {hasDiscount && (
                <span className="discount-badge">
                  -{Math.round(((product.prix - product.prixPromo) / product.prix) * 100)}%
                </span>
              )}
              {product.images && product.images.length > 0 ? (
                <img
                  src={`${API_URL}/${product.images[selectedImage]}`}
                  alt={product.nom}
                  onClick={openLightbox}
                  style={{ cursor: 'pointer' }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=Produit';
                  }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/600x600?text=Produit"
                  alt={product.nom}
                />
              )}
              {product.images && product.images.length > 1 && (
                <>
                  <button className="image-nav prev" onClick={prevImage}>
                    <span>‹</span>
                  </button>
                  <button className="image-nav next" onClick={nextImage}>
                    <span>›</span>
                  </button>
                </>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={`${API_URL}/${image}`}
                    alt={`${product.nom} ${index + 1}`}
                    className={selectedImage === index ? 'active' : ''}
                    onClick={() => setSelectedImage(index)}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x100?text=Img';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-detail">
            {product.marque && (
              <p className="product-brand">{product.marque}</p>
            )}

            <h1 className="product-title">{product.nom}</h1>

            <div className="product-price-detail">
              {hasDiscount && (
                <span className="old-price">{product.prix.toFixed(2)} DA</span>
              )}
              <span className="current-price">{price.toFixed(2)} DA</span>
            </div>

            {product.stock > 0 ? (
              <p className="stock-status in-stock">
                ✓ En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
              </p>
            ) : (
              <p className="stock-status out-of-stock">
                ✗ Rupture de stock
              </p>
            )}

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {product.caracteristiques && product.caracteristiques.length > 0 && (
              <div className="product-specs">
                <h3>Caractéristiques</h3>
                <ul>
                  {product.caracteristiques.map((spec, index) => (
                    <li key={index}>
                      <strong>{spec.nom}:</strong> {spec.valeur}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <button onClick={decreaseQuantity}>
                    <FaMinus />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={increaseQuantity}>
                    <FaPlus />
                  </button>
                </div>

                <button
                  className="btn btn-primary add-to-cart-large"
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart /> Ajouter au panier
                </button>
              </div>
            )}

            {product.categorie && (
              <div className="product-category">
                <strong>Catégorie:</strong> {product.categorie.nom}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && product.images && product.images.length > 0 && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>×</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${API_URL}/${product.images[selectedImage]}`}
              alt={product.nom}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x800?text=Produit';
              }}
            />
            {product.images.length > 1 && (
              <>
                <button className="lightbox-nav prev" onClick={prevImage}>
                  <span>‹</span>
                </button>
                <button className="lightbox-nav next" onClick={nextImage}>
                  <span>›</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
