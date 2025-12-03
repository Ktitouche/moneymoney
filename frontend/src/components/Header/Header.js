import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Fermer le menu utilisateur en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/produits?recherche=${searchTerm}`;
    }
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <h1>Ma Boutique</h1>
            </Link>

            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <FaSearch />
              </button>
            </form>

            <div className="header-actions">
              <Link to="/panier" className="cart-icon">
                <FaShoppingCart />
                {getCartCount() > 0 && (
                  <span className="cart-count">{getCartCount()}</span>
                )}
              </Link>

              {user ? (
                <div className="user-menu" ref={userMenuRef}>
                  <button 
                    className="user-btn"
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                    onClick={() => setUserMenuOpen((v) => !v)}
                  >
                    <FaUser /> {user.prenom}
                  </button>
                  <div className={`dropdown ${userMenuOpen ? 'show' : ''}`}>
                    <Link to="/profil">Mon Profil</Link>
                    <Link to="/mes-commandes">Mes Commandes</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin">Administration</Link>
                    )}
                    <button onClick={logout}>Déconnexion</button>
                  </div>
                </div>
              ) : (
                <Link to="/connexion" className="btn btn-primary">
                  Connexion
                </Link>
              )}

              <button 
                className="menu-toggle"
                onClick={() => setShowMenu(!showMenu)}
              >
                <FaBars />
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className={`header-nav ${showMenu ? 'active' : ''}`}>
        <div className="container">
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/produits">Tous les Produits</Link></li>
            <li><Link to="/categories">Catégories</Link></li>
            <li><Link to="/nouveautes">Nouveautés</Link></li>
            <li><Link to="/promotions">Promotions</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
