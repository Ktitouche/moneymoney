import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import './Categories.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="categories-page">
            <div className="container">
                <h1>Toutes les catégories</h1>

                {categories.length === 0 ? (
                    <div className="no-categories">
                        <p>Aucune catégorie disponible pour le moment.</p>
                    </div>
                ) : (
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link
                                key={category._id}
                                to={`/produits?categorie=${category._id}`}
                                className="category-card"
                            >
                                <div className="category-image">
                                    {category.image ? (
                                        <img
                                            src={`${process.env.REACT_APP_API_URL?.replace('/api', '')}/${category.image}`}
                                            alt={category.nom}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x300?text=Categorie';
                                            }}
                                        />
                                    ) : (
                                        <img
                                            src="https://via.placeholder.com/300x300?text=Categorie"
                                            alt={category.nom}
                                        />
                                    )}
                                </div>
                                <div className="category-content">
                                    <h3>{category.nom}</h3>
                                    {category.description && (
                                        <p>{category.description}</p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;
