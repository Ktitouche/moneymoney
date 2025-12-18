import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            <div className="container contact-grid">
                <section className="contact-card">
                    <p className="eyebrow">Parlons-en</p>
                    <h1>Contactez-nous</h1>
                    <p className="lead">
                        Une question sur un produit, une commande ou la livraison ? Notre équipe est là pour vous aider.
                    </p>

                    <div className="contact-list">
                        <div className="contact-item">
                            <span className="contact-label">Téléphone</span>
                            <a href="tel:+213557937423">+213 55 79 37 423</a>
                            <small>Dim–Jeu 9h00–18h00</small>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Email</span>
                            <a href="mailto:support@moneymoney.dz">support@moneymoney.dz</a>
                            <small>Réponse sous 24h ouvrées</small>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Adresse</span>
                            <p className="no-margin">Bordj El Bahri Alger, Algérie</p>
                            <small>Retrait sur rendez-vous</small>
                        </div>
                    </div>

                    <div className="cta-row">
                        <a className="btn btn-primary" href="tel:+213557937423">Appeler maintenant</a>
                        <Link className="btn btn-outline" to="/produits">Voir les produits</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Contact;
