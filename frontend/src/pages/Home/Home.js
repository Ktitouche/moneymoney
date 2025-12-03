import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, featuredRes] = await Promise.all([
        api.get('/products?limite=8'),
        api.get('/categories'),
        api.get('/products?enVedette=true&limite=4')
      ]);

      setProducts(productsRes.data.produits || []);
      setCategories(categoriesRes.data || []);
      setFeaturedProducts(featuredRes.data.produits || []);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Bienvenue dans votre boutique</h1>
            <p>Découvrez nos produits de qualité à prix imbattables</p>
            <a href="/produits" className="btn btn-primary btn-large">
              Voir tous les produits
            </a>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="categories-section">
          <div className="container">
            <h2 className="section-title">Catégories</h2>
            <div className="categories-grid">
              {categories.map((category) => (
                <a 
                  key={category._id} 
                  href={`/produits?categorie=${category._id}`}
                  className="category-card"
                >
                  <div className="category-image">
                    {category.image ? (
                      <img 
                        src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/${category.image}`} 
                        alt={category.nom}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200x200?text=Categorie';
                        }}
                      />
                    ) : (
                      <img 
                        src="https://via.placeholder.com/200x200?text=Categorie" 
                        alt={category.nom} 
                      />
                    )}
                  </div>
                  <h3>{category.nom}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <h2 className="section-title">Produits en vedette</h2>
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products */}
      <section className="products-section">
        <div className="container">
          <h2 className="section-title">Nouveautés</h2>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <div className="text-center mt-4">
            <a href="/produits" className="btn btn-outline">
              Voir plus de produits
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Livraison Gratuite</h3>
              <p>Pour toute commande supérieure à 50€</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Paiement Sécurisé</h3>
              <p>Vos transactions sont 100% sécurisées</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">↩️</div>
              <h3>Retours Faciles</h3>
              <p>30 jours pour changer d'avis</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Support 24/7</h3>
              <p>Notre équipe est là pour vous aider</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
