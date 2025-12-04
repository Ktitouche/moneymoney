import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Promotions.css';

const Promotions = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const response = await api.get('/products');
            const allProducts = response.data.produits || response.data;
            // Filtrer uniquement les produits avec un prix promo
            const promoProducts = allProducts.filter(product => product.prixPromo && product.prixPromo < product.prix);
            setProducts(promoProducts);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des promotions:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="promotions-page">
            <div className="container">
                <div className="page-header">
                    <h1>🔥 Promotions</h1>
                    <p>Profitez de nos meilleures offres</p>
                </div>

                {products.length === 0 ? (
                    <div className="no-products">
                        <p>Aucune promotion disponible pour le moment.</p>
                        <p className="small-text">Revenez bientôt pour découvrir nos offres exceptionnelles !</p>
                        <Link to="/produits" className="btn btn-primary">
                            Voir tous les produits
                        </Link>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Promotions;
