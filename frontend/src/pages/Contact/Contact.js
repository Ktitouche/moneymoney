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
                            <a href="tel:+213550000000">+213 55 00 00 000</a>
                            <small>Dim–Jeu 9h00–18h00</small>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Email</span>
                            <a href="mailto:support@moneymoney.dz">support@moneymoney.dz</a>
                            <small>Réponse sous 24h ouvrées</small>
                        </div>
                        <div className="contact-item">
                            <span className="contact-label">Adresse</span>
                            <p className="no-margin">Alger, Algérie</p>
                            <small>Retrait sur rendez-vous</small>
                        </div>
                    </div>

                    <div className="cta-row">
                        <a className="btn btn-primary" href="tel:+213550000000">Appeler maintenant</a>
                        <Link className="btn btn-outline" to="/produits">Voir les produits</Link>
                    </div>
                </section>

                <section className="contact-card alt">
                    <h2>Support & FAQ</h2>
                    <ul className="faq-list">
                        <li>
                            <strong>Suivi de commande</strong>
                            <span>Consultez vos commandes dans l'espace "Mes commandes".</span>
                        </li>
                        <li>
                            <strong>Livraison</strong>
                            <span>Livraison à domicile ou point relais partout en Algérie.</span>
                        </li>
                        <li>
                            <strong>Retours</strong>
                            <span>Vous disposez de 7 jours après réception pour signaler un problème.</span>
                        </li>
                    </ul>

                    <div className="support-box">
                        <p className="eyebrow">Envie d'écrire ?</p>
                        <p className="no-margin">support@moneymoney.dz</p>
                        <small>Précisez votre numéro de commande si nécessaire.</small>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Contact;
