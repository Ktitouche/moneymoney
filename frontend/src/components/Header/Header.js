import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaBell } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import api from '../../utils/api';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('default');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifItems, setNotifItems] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifError, setNotifError] = useState('');
  const [notifHasNew, setNotifHasNew] = useState(false);
  const [dismissedIds, setDismissedIds] = useState(() => {
    try {
      const stored = localStorage.getItem('notifDismissed');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch (err) {
      return new Set();
    }
  });
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Fermer le menu utilisateur en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof Notification === 'undefined') {
      setNotificationStatus('unsupported');
      return;
    }
    setNotificationStatus(Notification.permission);
  }, []);

  useEffect(() => {
    try {
      const arr = Array.from(dismissedIds);
      localStorage.setItem('notifDismissed', JSON.stringify(arr));
    } catch (err) {
      // ignore storage errors
    }
  }, [dismissedIds]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/produits?recherche=${searchTerm}`;
    }
  };

  const loadNotifications = async () => {
    setNotifLoading(true);
    setNotifError('');
    try {
      const res = await api.get('/orders?limite=5');
      const commandes = res.data?.commandes || [];
      const mapped = commandes.map((cmd) => {
        const nom = cmd.utilisateur?.nom || cmd.clientGuest?.nom || cmd.adresseLivraison?.nom || 'Client';
        const prenom = cmd.utilisateur?.prenom || cmd.clientGuest?.prenom || cmd.adresseLivraison?.prenom || '';
        const montant = cmd.montantTotal ? `${cmd.montantTotal} DA` : '';
        const produits = (cmd.produits || [])
          .map((p) => p.produit?.nom || 'Produit')
          .filter(Boolean)
          .join(', ');
        const date = cmd.createdAt ? new Date(cmd.createdAt).toLocaleString('fr-FR') : '';
        return {
          id: cmd._id,
          nomPrenom: `${nom} ${prenom}`.trim(),
          montant,
          produits,
          date,
        };
      });
      const filtered = mapped.filter((m) => !dismissedIds.has(m.id));
      setNotifItems(filtered);
      setNotifHasNew(filtered.length > 0);
    } catch (err) {
      setNotifError('Impossible de charger les dernières commandes.');
    } finally {
      setNotifLoading(false);
    }
  };

  const toggleNotifications = () => {
    const next = !notifOpen;
    setNotifOpen(next);
    if (next) {
      loadNotifications();
    }
  };

  const deleteNotifications = () => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      notifItems.forEach((item) => next.add(item.id));
      return next;
    });
    setNotifItems([]);
    setNotifHasNew(false);
    setNotifOpen(false);
  };

  const deleteNotification = (id) => {
    setNotifItems((prev) => {
      const next = prev.filter((item) => item.id !== id);
      setNotifHasNew(next.length > 0);
      return next;
    });
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              <h1>Ma Boutique</h1>
            </Link>

            <form className="search-form search-form-desktop" onSubmit={handleSearch}>
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
              <button 
                className="search-icon-mobile" 
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                aria-label="Rechercher"
              >
                <FaSearch />
              </button>
              <Link to="/panier" className="cart-icon">
                <FaShoppingCart />
                {getCartCount() > 0 && (
                  <span className="cart-count">{getCartCount()}</span>
                )}
              </Link>

              {user?.role === 'admin' && notificationStatus !== 'unsupported' && (
                <div className="notif-menu" ref={notifMenuRef}>
                  <button
                    type="button"
                    className={`notif-btn status-${notificationStatus}`}
                    onClick={toggleNotifications}
                    title={
                      notificationStatus === 'granted'
                        ? 'Voir les dernières commandes'
                        : notificationStatus === 'denied'
                          ? 'Notifications push bloquées : la cloche affiche uniquement l’historique'
                          : 'Consulter l’historique des commandes (activez les push depuis le Tableau de bord)'
                    }
                    aria-label="Notifications commandes"
                  >
                    <FaBell />
                    {notifHasNew && <span className="notif-dot" />}
                  </button>
                  {notifOpen && (
                    <div className="notif-dropdown">
                      {notifLoading && <div className="notif-item">Chargement...</div>}
                      {notifError && <div className="notif-item error">{notifError}</div>}
                      {!notifLoading && !notifError && notifItems.length === 0 && (
                        <div className="notif-item">Aucune commande récente.</div>
                      )}
                      {!notifLoading && !notifError && notifItems.map((n) => (
                        <div key={n.id} className="notif-item">
                          <div className="notif-line">
                            <span className="notif-name">{n.nomPrenom}</span>
                            {n.montant && <span className="notif-amount">{n.montant}</span>}
                            <button
                              className="notif-delete"
                              onClick={() => deleteNotification(n.id)}
                              aria-label="Supprimer cette notification"
                            >
                              ×
                            </button>
                          </div>
                          {n.produits && <div className="notif-products">{n.produits}</div>}
                          {n.date && <div className="notif-date">{n.date}</div>}
                        </div>
                      ))}
                      {!notifLoading && !notifError && notifItems.length > 0 && (
                        <button className="notif-clear" onClick={deleteNotifications}>
                          Supprimer toutes les notifications
                        </button>
                      )}
                      {notificationStatus !== 'granted' && (
                        <div className="notif-item info">
                          Notifications push désactivées.
                          <br />
                          Activez-les depuis le Tableau de bord admin.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

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
          
          {mobileSearchOpen && (
            <form className="search-form search-form-mobile" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              <button type="submit">
                <FaSearch />
              </button>
            </form>
          )}
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
