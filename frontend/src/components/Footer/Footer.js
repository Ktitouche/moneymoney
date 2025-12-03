import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>À Propos</h3>
            <p>
              Votre boutique en ligne de confiance pour tous vos besoins. 
              Des produits de qualité, livrés rapidement.
            </p>
            <div className="social-links">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Liens Rapides</h3>
            <ul>
              <li><Link to="/produits">Produits</Link></li>
              <li><Link to="/categories">Catégories</Link></li>
              <li><Link to="/nouveautes">Nouveautés</Link></li>
              <li><Link to="/promotions">Promotions</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Aide</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/livraison">Livraison</Link></li>
              <li><Link to="/retours">Retours</Link></li>
              <li><Link to="/cgv">CGV</Link></li>
              <li><Link to="/confidentialite">Confidentialité</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact</h3>
            <ul className="contact-info">
              <li>
                <FaMapMarkerAlt />
                <span>123 Rue du Commerce, Paris, France</span>
              </li>
              <li>
                <FaPhone />
                <span>+33 1 23 45 67 89</span>
              </li>
              <li>
                <FaEnvelope />
                <span>contact@maboutique.fr</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Ma Boutique. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
