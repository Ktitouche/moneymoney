import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>À Propos</h3>
            <p>
              Votre boutique spécialiste des braseros, accessoires de feu et ambiances extérieures.
              Des pièces robustes, pensées pour vos soirées en plein air.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/decofeu1600/"><FaFacebook /></a>
              <a href="https://www.instagram.com/decofeu/"><FaInstagram /></a>
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
                <span>Ben zerga, Alger, Algérie</span>
              </li>
              <li>
                <FaPhone />
                <span>0549308911</span>
              </li>
              <li>
                <FaPhone />
                <span>0654172718</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Deco Feu. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
