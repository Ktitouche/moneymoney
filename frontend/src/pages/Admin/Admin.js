import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './Admin.css';

const Admin = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Attendre la fin du chargement de l'authentification
    if (loading) return;
    // Rediriger vers la connexion si non connecté
    if (!user) {
      navigate('/connexion', { replace: true });
      return;
    }
    // Rediriger vers l'accueil si connecté mais non admin
    if (user.role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="loading">Chargement...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="page-title">Administration</h1>

        <div className="admin-layout">
          <aside className="admin-sidebar">
            <nav className="admin-nav">
              <Link to="/admin" className="admin-nav-item">
                📊 Tableau de bord
              </Link>
              <Link to="/admin/produits" className="admin-nav-item">
                📦 Gestion des produits
              </Link>
              <Link to="/admin/categories" className="admin-nav-item">
                🏷️ Gestion des catégories
              </Link>
              <Link to="/admin/commandes" className="admin-nav-item">
                🛒 Gestion des commandes
              </Link>
              <Link to="/admin/utilisateurs" className="admin-nav-item">
                👥 Gestion des utilisateurs
              </Link>
            </nav>
          </aside>

          <div className="admin-content">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="produits" element={<ProductsManagement />} />
              <Route path="categories" element={<CategoriesManagement />} />
              <Route path="commandes" element={<OrdersManagement />} />
              <Route path="utilisateurs" element={<UsersManagement />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h2>Tableau de bord</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Ventes du mois</h3>
          <p className="stat-value">0 €</p>
        </div>
        <div className="stat-card">
          <h3>Commandes</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Produits</h3>
          <p className="stat-value">0</p>
        </div>
        <div className="stat-card">
          <h3>Clients</h3>
          <p className="stat-value">0</p>
        </div>
      </div>
      <p className="admin-note">
        💡 Utilisez le menu latéral pour gérer les produits, catégories, commandes et utilisateurs.
      </p>
    </div>
  );
};

const ProductsManagement = () => {
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    description: '',
    prix: '',
    prixPromo: '',
    categorie: '',
    stock: '',
    marque: '',
    enVedette: false,
  });
  const [images, setImages] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products?limite=100')
      ]);
      setCategories(catRes.data || []);
      setProduits((prodRes.data && prodRes.data.produits) || []);
    } catch (err) {
      toast.error("Erreur lors du chargement des données produits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImages = (e) => {
    setImages(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('nom', form.nom);
      fd.append('description', form.description);
      fd.append('prix', form.prix);
      if (form.prixPromo) fd.append('prixPromo', form.prixPromo);
      fd.append('categorie', form.categorie);
      fd.append('stock', form.stock);
      if (form.marque) fd.append('marque', form.marque);
      fd.append('caracteristiques', JSON.stringify([]));
      fd.append('enVedette', String(form.enVedette));
      images.forEach((file) => fd.append('images', file));

      const res = await api.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const nouveau = res.data && res.data.produit ? res.data.produit : null;
      if (nouveau) setProduits((prev) => [nouveau, ...prev]);
      toast.success('Produit créé avec succès');
      setForm({ nom: '', description: '', prix: '', prixPromo: '', categorie: '', stock: '', marque: '', enVedette: false });
      setImages([]);
      e.target.reset();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur lors de la création du produit';
      toast.error(msg);
    }
  };

  return (
    <div>
      <h2>Gestion des Produits</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Nom</label>
          <input name="nom" value={form.nom} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
        </div>
        <div className="form-grid">
          <div className="form-row">
            <label>Prix (€)</label>
            <input name="prix" type="number" step="0.01" value={form.prix} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Prix promo (€)</label>
            <input name="prixPromo" type="number" step="0.01" value={form.prixPromo} onChange={handleChange} />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-row">
            <label>Catégorie</label>
            <select name="categorie" value={form.categorie} onChange={handleChange} required>
              <option value="">Choisir…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.nom}</option>
              ))}
            </select>
          </div>
          <div className="form-row">
            <label>Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-row">
            <label>Marque</label>
            <input name="marque" value={form.marque} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>En vedette</label>
            <input name="enVedette" type="checkbox" checked={form.enVedette} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <label>Images (max 5)</label>
          <input name="images" type="file" multiple accept="image/*" onChange={handleImages} />
        </div>
        <button type="submit" disabled={loading}>Ajouter le produit</button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Liste des produits</h3>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p) => (
                <tr key={p._id}>
                  <td>{p.nom}</td>
                  <td>{p.categorie?.nom || '—'}</td>
                  <td>{p.prixPromo || p.prix} €</td>
                  <td>{p.stock}</td>
                </tr>
              ))}
              {produits.length === 0 && (
                <tr><td colSpan="4">Aucun produit.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nom: '', description: '' });
  const [image, setImage] = useState(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('nom', form.nom);
      fd.append('description', form.description);
      if (image) fd.append('image', image);
      const res = await api.post('/categories', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const cat = res.data && res.data.category ? res.data.category : res.data?.category;
      // Certaines réponses retournent { category }, sinon recharger
      if (cat) {
        setCategories((prev) => [cat, ...prev]);
      } else {
        await loadCategories();
      }
      toast.success('Catégorie créée avec succès');
      setForm({ nom: '', description: '' });
      setImage(null);
      e.target.reset();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Erreur lors de la création de la catégorie';
      toast.error(msg);
    }
  };

  return (
    <div>
      <h2>Gestion des Catégories</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-row">
            <label>Nom</label>
            <input name="nom" value={form.nom} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
        </div>
        <div className="form-row">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} />
        </div>
        <button type="submit">Ajouter la catégorie</button>
      </form>

      <hr style={{ margin: '2rem 0' }} />

      <h3>Liste des catégories</h3>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>{c.nom}</td>
                  <td>{c.description || '—'}</td>
                  <td>{c.image ? <img src={c.image.startsWith('http') ? c.image : `${process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:5000'}/${c.image}`} alt={c.nom} style={{ height: 40 }} /> : '—'}</td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan="3">Aucune catégorie.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const OrdersManagement = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtre, setFiltre] = useState('');

  const loadOrders = async () => {
    try {
      setLoading(true);
      const url = filtre ? `/orders?statut=${encodeURIComponent(filtre)}` : '/orders';
      const res = await api.get(url);
      setCommandes((res.data && res.data.commandes) || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtre]);

  const updateStatut = async (id, statut) => {
    try {
      await api.put(`/orders/${id}/statut`, { statut });
      toast.success('Statut mis à jour');
      await loadOrders();
    } catch (err) {
      toast.error("Impossible de mettre à jour le statut");
    }
  };

  return (
    <div>
      <h2>Gestion des Commandes</h2>
      <div className="form-row">
        <label>Filtrer par statut</label>
        <select value={filtre} onChange={(e) => setFiltre(e.target.value)}>
          <option value="">Tous</option>
          <option value="en_attente">En attente</option>
          <option value="en_cours">En cours</option>
          <option value="expediee">Expédiée</option>
          <option value="livree">Livrée</option>
          <option value="annulee">Annulée</option>
        </select>
      </div>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((c) => (
                <tr key={c._id}>
                  <td>{new Date(c.dateCommande).toLocaleString()}</td>
                  <td>{c.utilisateur?.nom} {c.utilisateur?.prenom}</td>
                  <td>{c.montantTotal} €</td>
                  <td>{c.statut}</td>
                  <td>
                    <select value={c.statut} onChange={(e) => updateStatut(c._id, e.target.value)}>
                      <option value="en_attente">En attente</option>
                      <option value="en_cours">En cours</option>
                      <option value="expediee">Expédiée</option>
                      <option value="livree">Livrée</option>
                      <option value="annulee">Annulée</option>
                    </select>
                  </td>
                </tr>
              ))}
              {commandes.length === 0 && (
                <tr><td colSpan="5">Aucune commande.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h2>Gestion des Utilisateurs</h2>
      {loading ? (
        <p>Chargement…</p>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Inscription</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.nom} {u.prenom}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.dateCreation).toLocaleDateString()}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="4">Aucun utilisateur.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
