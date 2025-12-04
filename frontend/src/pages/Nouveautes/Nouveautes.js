import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Nouveautes.css';

const Nouveautes = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNewProducts();
    }, []);

    const fetchNewProducts = async () => {
        try {
            const response = await api.get('/products?sort=-createdAt&limite=20');
            setProducts(response.data.produits || response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des nouveautés:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="nouveautes-page">
            <div className="container">
                <div className="page-header">
                    <h1>✨ Nouveautés</h1>
                    <p>Découvrez nos derniers produits</p>
                </div>

                {products.length === 0 ? (
                    <div className="no-products">
                        <p>Aucune nouveauté pour le moment.</p>
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

export default Nouveautes;
