import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categorie: '',
    recherche: '',
    page: 1
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    pageActuelle: 1,
    total: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data || []);
    } catch (error) {
      // Erreur silencieuse
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const categorieParam = params.get('categorie') || filters.categorie;
      const rechercheParam = params.get('recherche') || filters.recherche;

      const queryParams = new URLSearchParams({
        page: filters.page,
        limite: 12
      });

      if (categorieParam) queryParams.append('categorie', categorieParam);
      if (rechercheParam) queryParams.append('recherche', rechercheParam);

      const response = await api.get(`/products?${queryParams}`);
      setProducts(response.data.produits || []);
      setPagination({
        totalPages: response.data.totalPages,
        pageActuelle: response.data.pageActuelle,
        total: response.data.total
      });
      setLoading(false);
    } catch (error) {
      // Erreur silencieuse
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Tous les Produits</h1>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-section">
              <h3>Rechercher</h3>
              <input
                type="text"
                className="form-input"
                placeholder="Rechercher un produit..."
                value={filters.recherche}
                onChange={(e) => handleFilterChange('recherche', e.target.value)}
              />
            </div>

            <div className="filter-section">
              <h3>Catégories</h3>
              <div className="category-filters">
                <button
                  className={`category-filter ${!filters.categorie ? 'active' : ''}`}
                  onClick={() => handleFilterChange('categorie', '')}
                >
                  Toutes
                </button>
                {categories.map((category) => (
                  <button
                    key={category._id}
                    className={`category-filter ${filters.categorie === category._id ? 'active' : ''}`}
                    onClick={() => handleFilterChange('categorie', category._id)}
                  >
                    {category.nom}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-content">
            <div className="products-header">
              <p className="results-count">
                {pagination.total} produit{pagination.total > 1 ? 's' : ''} trouvé{pagination.total > 1 ? 's' : ''}
              </p>
            </div>

            {loading ? (
              <div className="loading">Chargement des produits...</div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <p>Aucun produit trouvé.</p>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="btn btn-secondary"
                    >
                      Précédent
                    </button>

                    <div className="page-numbers">
                      {[...Array(pagination.totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`page-number ${filters.page === index + 1 ? 'active' : ''}`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === pagination.totalPages}
                      className="btn btn-secondary"
                    >
                      Suivant
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
