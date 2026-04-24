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
                            <a href="tel:+213654172718">+213 654 172 718</a>
                            <br></br>
                            <a href="tel:+2130549308911">+213 54 930 8911</a>
                            <br></br>
                            <small>Dim–Jeu 9h00–18h00</small>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Email</span>
                            <a href="mailto:Decofeustudio18@gmail.com">Decofeustudio18@gmail.com</a>
                            <br></br>
                            <small>Réponse sous 24h ouvrées</small>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Adresse</span>
                            <p className="no-margin">Ben Zerga Alger, Algérie</p>
                            <small>Retrait sur rendez-vous</small>
                        </div>
                    </div>

                    <div className="cta-row">
                        <a className="btn btn-primary" href="tel:+213654172718">Appeler maintenant</a>
                        <Link className="btn btn-outline" to="/produits">Voir les produits</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Contact;
