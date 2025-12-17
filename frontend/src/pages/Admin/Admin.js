import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { MdDelete, MdEdit } from 'react-icons/md';
import './Admin.css';

const Admin = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [ordersCount, setOrdersCount] = useState(0);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [lastNotifiedId, setLastNotifiedId] = useState(() => {
    try {
      return localStorage.getItem('lastNotifiedOrderId') || null;
    } catch (err) {
      return null;
    }
  });
  const [notificationStatus, setNotificationStatus] = useState('unknown');

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

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') return;

    if (typeof Notification === 'undefined') {
      setNotificationStatus('unsupported');
    } else {
      setNotificationStatus(Notification.permission || 'default');
    }
  }, [loading, user]);

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== 'admin') return;

    let timer;
    let isChecking = false;

    const fetchOrdersCount = async () => {
      if (isChecking) return; // Éviter les vérifications multiples simultanées
      isChecking = true;

      try {
        const res = await api.get('/orders?limite=1');
        const total = res.data?.total;
        const latest = res.data?.commandes?.[0];

        if (typeof total === 'number') {
          setOrdersCount(total);
          const alreadyNotified = lastNotifiedId && latest?._id === lastNotifiedId;
          if (
            latest?._id &&
            Notification?.permission === 'granted' &&
            !alreadyNotified &&
            latest._id !== lastOrderId
          ) {
            const nom = latest.utilisateur?.nom || latest.clientGuest?.nom || latest.adresseLivraison?.nom || 'Client';
            const prenom = latest.utilisateur?.prenom || latest.clientGuest?.prenom || latest.adresseLivraison?.prenom || '';
            const montant = latest.montantTotal ? `${latest.montantTotal} DA` : '';
            const produits = (latest.produits || []).map((p) => {
              const name = p.produit?.nom || 'Produit';
              return `${name} x${p.quantite || 1}`;
            }).filter(Boolean);

            const produitsTexte = produits.length ? ` · ${produits.join(', ')}` : '';
            const body = `${nom} ${prenom} vient de passer une commande${montant ? ` pour ${montant}` : ''}${produitsTexte}.`;

            const notification = new Notification('🛒 Nouvelle commande', {
              body: body.trim(),
              icon: 'https://via.placeholder.com/96?text=Shop',
              requireInteraction: true,
              tag: `order-${latest._id}`,
              silent: false,
              vibrate: [200, 100, 200]
            });

            // Son de notification (si supporté)
            if ('AudioContext' in window || 'webkitAudioContext' in window) {
              try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.value = 800;
                oscillator.type = 'sine';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 4);
              } catch (err) {
                // Son non supporté, continuer sans
              }
            }

            // Mettre en avant la notification
            notification.onclick = () => {
              window.focus();
              notification.close();
            };
            setLastOrderId(latest._id);
            setLastNotifiedId(latest._id);
            try {
              localStorage.setItem('lastNotifiedOrderId', latest._id);
            } catch (err) {
              // ignore storage failures
            }
          } else if (latest?._id && latest._id !== lastOrderId) {
            // Mettre à jour lastOrderId même si notification pas envoyée
            setLastOrderId(latest._id);
          }
        }
      } catch (err) {
        // silencieux pour ne pas polluer la console
      } finally {
        isChecking = false;
      }
    };

    fetchOrdersCount();
    timer = setInterval(fetchOrdersCount, 10000); // toutes les 10s pour plus de réactivité

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, user, lastOrderId, lastNotifiedId]);

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      toast.error('Les notifications push ne sont pas supportées par ce navigateur.');
      setNotificationStatus('unsupported');
      return;
    }

    if (Notification.permission === 'granted') {
      setNotificationStatus('granted');
      toast.info('Notifications déjà activées.');
      return;
    }

    if (Notification.permission === 'denied') {
      setNotificationStatus('denied');
      toast.warn("Notifications bloquées. Cliquez sur le cadenas à gauche de l'URL puis autorisez les notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission || 'default');
      if (permission === 'granted') {
        toast.success('Notifications push activées pour les nouvelles commandes.');
      } else if (permission === 'denied') {
        toast.warn("Notifications refusées. Vous pouvez changer ce réglage via le cadenas du navigateur.");
      }
    } catch (err) {
      toast.error('Impossible de demander la permission de notification.');
    }
  };

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
              <Route
                index
                element={
                  <Dashboard
                    notificationStatus={notificationStatus}
                    onEnableNotifications={requestNotificationPermission}
                  />
                }
              />
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

const Dashboard = ({ notificationStatus, onEnableNotifications }) => {
  const statusLabel = (() => {
    if (notificationStatus === 'granted') return 'Activées';
    if (notificationStatus === 'denied') return 'Bloquées (via le cadenas du navigateur)';
    if (notificationStatus === 'unsupported') return 'Non supportées par ce navigateur';
    return 'Inactives';
  })();

  return (
    <div className="dashboard">
      <h2>Tableau de bord</h2>
      <div className="notif-card">
        <div className="notif-card-text">
          <h3>Notifications de commandes</h3>
          <p>Recevez une alerte bureau pour chaque nouvelle commande.</p>
          <p className="notif-status">Statut : {statusLabel}</p>
        </div>
        {notificationStatus === 'unsupported' ? (
          <div className="notif-status warning">Notifications non supportées sur ce navigateur.</div>
        ) : notificationStatus !== 'granted' ? (
          <button className="notif-activate-btn" onClick={onEnableNotifications}>
            Activer les notifications
          </button>
        ) : (
          <div className="notif-status success">Notifications actives</div>
        )}
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Ventes du mois</h3>
          <p className="stat-value">0 DA</p>
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
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'add'
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
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editImages, setEditImages] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, prodRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products?limite=100')
      ]);
      setCategories(catRes.data || []);
      setProduits(prodRes.data?.produits || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des données');
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

  const handleEditImages = (e) => {
    setEditImages(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'enVedette') {
          fd.append(key, String(value));
        } else if (value) {
          fd.append(key, value);
        }
      });
      fd.append('caracteristiques', JSON.stringify([]));
      images.forEach((file) => fd.append('images', file));

      const res = await api.post('/products', fd);
      const nouveau = res.data?.produit;
      if (nouveau) {
        setProduits((prev) => [nouveau, ...prev]);
        toast.success('Produit créé avec succès');
        setForm({ nom: '', description: '', prix: '', prixPromo: '', categorie: '', stock: '', marque: '', enVedette: false });
        setImages([]);
        e.target.reset();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la création');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (prod) => {
    setEditingProduct(prod);
    setEditForm({
      nom: prod.nom || '',
      description: prod.description || '',
      prix: prod.prix || '',
      prixPromo: prod.prixPromo || '',
      categorie: prod.categorie?._id || prod.categorie || '',
      stock: prod.stock || 0,
      marque: prod.marque || '',
      enVedette: !!prod.enVedette,
      caracteristiques: prod.caracteristiques || [],
    });
    setEditImages([]);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm(null);
    setEditImages([]);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct || !editForm) return;

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (key === 'caracteristiques') {
          fd.append(key, JSON.stringify(value || []));
        } else if (key === 'enVedette') {
          fd.append(key, String(value));
        } else if (value) {
          fd.append(key, value);
        }
      });
      editImages.forEach((file) => fd.append('images', file));

      const res = await api.put(`/products/${editingProduct._id}`, fd);
      const updated = res.data?.produit || res.data?.product;

      if (updated?._id) {
        setProduits((prev) => prev.map((p) => p._id === updated._id ? updated : p));
      } else {
        await fetchData();
      }

      toast.success('Produit mis à jour avec succès');
      cancelEdit();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        setLoading(true);
        await api.delete(`/products/${productId}`);
        setProduits((prev) => prev.filter((p) => p._id !== productId));
        toast.success('Produit supprimé avec succès');
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Erreur lors de la suppression');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <h2>Gestion des Produits</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button type="button" onClick={() => setViewMode('list')} disabled={viewMode === 'list'}>
          Liste des produits
        </button>
        <button type="button" onClick={() => setViewMode('add')} disabled={viewMode === 'add'}>
          Ajouter un produit
        </button>
      </div>

      {viewMode === 'add' && (
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
              <label>Prix (DA)</label>
              <input name="prix" type="number" step="0.01" value={form.prix} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <label>Prix promo (DA)</label>
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
            <small>Formats conseillés : JPG/PNG/WebP • 1200x1200px minimum • Taille max 2 Mo par image</small>
          </div>
          <button type="submit" disabled={loading}>Ajouter le produit</button>
        </form>
      )}

      {viewMode === 'list' && (
        <>
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
                    <th style={{ width: '120px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.map((p) => (
                    <tr key={p._id}>
                      <td>{p.nom}</td>
                      <td>{p.categorie?.nom || '—'}</td>
                      <td>{p.prixPromo || p.prix} DA</td>
                      <td>{p.stock}</td>
                      <td>
                        <div className="table-actions">
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() => openEdit(p)}
                            title="Modifier"
                            aria-label={`Modifier ${p.nom}`}
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            className="icon-btn danger"
                            onClick={() => handleDeleteProduct(p._id)}
                            title="Supprimer"
                            aria-label={`Supprimer ${p.nom}`}
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {produits.length === 0 && (
                    <tr><td colSpan="5">Aucun produit.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {editingProduct && editForm && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Modifier le produit</h4>
              <button type="button" className="modal-close" onClick={cancelEdit}>×</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-row">
                <label>Nom</label>
                <input name="nom" value={editForm.nom} onChange={handleEditChange} required />
              </div>
              <div className="form-row">
                <label>Description</label>
                <textarea name="description" value={editForm.description} onChange={handleEditChange} required />
              </div>
              <div className="form-grid">
                <div className="form-row">
                  <label>Prix (DA)</label>
                  <input name="prix" type="number" step="0.01" value={editForm.prix} onChange={handleEditChange} required />
                </div>
                <div className="form-row">
                  <label>Prix promo (DA)</label>
                  <input name="prixPromo" type="number" step="0.01" value={editForm.prixPromo} onChange={handleEditChange} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-row">
                  <label>Catégorie</label>
                  <select name="categorie" value={editForm.categorie} onChange={handleEditChange} required>
                    <option value="">Choisir…</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.nom}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Stock</label>
                  <input name="stock" type="number" value={editForm.stock} onChange={handleEditChange} required />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-row">
                  <label>Marque</label>
                  <input name="marque" value={editForm.marque} onChange={handleEditChange} />
                </div>
                <div className="form-row">
                  <label>En vedette</label>
                  <input name="enVedette" type="checkbox" checked={editForm.enVedette} onChange={handleEditChange} />
                </div>
              </div>
              <div className="form-row">
                <label>Nouvelle image (optionnel)</label>
                <input name="images" type="file" multiple accept="image/*" onChange={handleEditImages} />
                <small>Formats conseillés : JPG/PNG/WebP • 1200x1200px min • Remplace les images actuelles (max ~2 Mo chacune)</small>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                <button type="submit" disabled={loading}>Enregistrer</button>
                <button type="button" onClick={cancelEdit}>Annuler</button>
              </div>
            </form>
          </div>
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
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ nom: '', description: '' });
  const [editImage, setEditImage] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
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
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('nom', form.nom);
      fd.append('description', form.description);
      if (image) fd.append('image', image);

      const res = await api.post('/categories', fd);
      const cat = res.data?.category;

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
      toast.error(err?.response?.data?.message || 'Erreur lors de la création');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category._id);
    setEditForm({ nom: category.nom || '', description: category.description || '' });
    setEditImage(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('nom', editForm.nom);
      fd.append('description', editForm.description);
      if (editImage) fd.append('image', editImage);

      const res = await api.put(`/categories/${editingId}`, fd);
      const updated = res.data?.category;
      if (updated) {
        setCategories((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
        toast.success('Catégorie mise à jour');
      } else {
        await loadCategories();
      }
      setEditingId(null);
      setEditForm({ nom: '', description: '' });
      setEditImage(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ nom: '', description: '' });
    setEditImage(null);
  };

  const deleteCategory = async (id) => {
    const confirmed = window.confirm('Supprimer cette catégorie ?');
    if (!confirmed) return;
    setLoading(true);
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success('Catégorie supprimée');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Impossible de supprimer cette catégorie');
    } finally {
      setLoading(false);
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
            <small>Formats conseillés : JPG/PNG/WebP, 1200x1200px min</small>
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
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id}>
                  <td>{c.nom}</td>
                  <td>{c.description || '—'}</td>
                  <td>
                    {c.image ? (
                      <img
                        src={c.image.startsWith('http') ? c.image : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}/${c.image}`}
                        alt={c.nom}
                        style={{ height: 40, width: 40, objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : '—'}
                  </td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => startEdit(c)}
                        title="Modifier"
                        aria-label={`Modifier ${c.nom}`}
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger"
                        onClick={() => deleteCategory(c._id)}
                        title="Supprimer"
                        aria-label={`Supprimer ${c.nom}`}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan="4">Aucune catégorie.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Modifier la catégorie</h3>
            <form onSubmit={submitEdit}>
              <div className="form-row">
                <label>Nom</label>
                <input name="nom" value={editForm.nom} onChange={handleEditChange} required />
              </div>
              <div className="form-row">
                <label>Description</label>
                <textarea name="description" value={editForm.description} onChange={handleEditChange} />
              </div>
              <div className="form-row">
                <label>Nouvelle image (optionnel)</label>
                <input type="file" accept="image/*" onChange={(e) => setEditImage(e.target.files[0])} />
                <small>Formats conseillés : JPG/PNG/WebP, 1200x1200px min</small>
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                <button type="submit" disabled={loading}>Enregistrer</button>
                <button type="button" onClick={cancelEdit}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersManagement = () => {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtre, setFiltre] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const url = filtre ? `/orders?statut=${encodeURIComponent(filtre)}` : '/orders';
      const res = await api.get(url);
      setCommandes(res.data?.commandes || []);
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
      setCommandes((prev) => prev.map((c) => c._id === id ? { ...c, statut } : c));
      toast.success('Statut mis à jour avec succès');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Impossible de mettre à jour le statut');
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
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
                <th>Nom Prénom</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Type livraison</th>
                <th>Montant</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((c) => {
                const nom = c.utilisateur?.nom || c.clientGuest?.nom || c.adresseLivraison?.nom || '-';
                const prenom = c.utilisateur?.prenom || c.clientGuest?.prenom || c.adresseLivraison?.prenom || '';
                const telephone = c.utilisateur?.telephone || c.clientGuest?.telephone || c.adresseLivraison?.telephone || '-';
                const adresse = c.adresseLivraison
                  ? `${c.adresseLivraison.rue || ''}, ${c.adresseLivraison.ville || ''}, ${c.adresseLivraison.codePostal || ''}`.trim().replace(/^,\s*|,\s*$/g, '')
                  : '-';
                const typeLivraisonLabel = c.typeLivraison === 'point_relais' ? 'Stop Desk' : c.typeLivraison === 'domicile' ? 'À domicile' : '-';

                return (
                  <tr key={c._id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(c)}>
                    <td>{new Date(c.dateCommande).toLocaleString()}</td>
                    <td>{nom} {prenom}</td>
                    <td>{telephone}</td>
                    <td>{adresse}</td>
                    <td>{typeLivraisonLabel}</td>
                    <td>{c.montantTotal} DA</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <select value={c.statut} onChange={(e) => updateStatut(c._id, e.target.value)}>
                        <option value="en_attente">En attente</option>
                        <option value="en_cours">En cours</option>
                        <option value="expediee">Expédiée</option>
                        <option value="livree">Livrée</option>
                        <option value="annulee">Annulée</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {commandes.length === 0 && (
                <tr><td colSpan="8">Aucune commande.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal détail commande */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails de la commande #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Client</h3>
                <p><strong>Nom:</strong> {selectedOrder.utilisateur?.nom || selectedOrder.clientGuest?.nom || selectedOrder.adresseLivraison?.nom || '-'}</p>
                <p><strong>Prénom:</strong> {selectedOrder.utilisateur?.prenom || selectedOrder.clientGuest?.prenom || selectedOrder.adresseLivraison?.prenom || '-'}</p>
                <p><strong>Téléphone:</strong> {selectedOrder.utilisateur?.telephone || selectedOrder.clientGuest?.telephone || selectedOrder.adresseLivraison?.telephone || '-'}</p>
              </div>

              <div className="modal-section">
                <h3>Adresse de livraison</h3>
                <p><strong>Rue:</strong> {selectedOrder.adresseLivraison?.rue || '-'}</p>
                <p><strong>Wilaya:</strong> {selectedOrder.adresseLivraison?.wilaya || '-'}</p>
                <p><strong>Type de livraison:</strong> {selectedOrder.typeLivraison === 'point_relais' ? 'Stop Desk' : 'À domicile'}</p>
              </div>

              <div className="modal-section">
                <h3>Produits</h3>
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>Quantité</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.produits || []).map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.produit?.nom || item.produit || 'Produit inconnu'}</td>
                        <td>{item.quantite}</td>
                        <td>{item.prix} DA</td>
                        <td>{item.prix * item.quantite} DA</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-section">
                <h3>Résumé financier</h3>
                <p><strong>Prix de la commande:</strong> {(selectedOrder.montantHT || (selectedOrder.montantTotal - (selectedOrder.fraisLivraison || 0))).toFixed(2)} DA</p>
                <p><strong>Frais de livraison:</strong> {selectedOrder.fraisLivraison || 0} DA</p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                  <strong>Total:</strong> {selectedOrder.montantTotal} DA
                </p>
              </div>

              <div className="modal-section">
                <h3>Statut</h3>
                <select value={selectedOrder.statut} onChange={(e) => {
                  updateStatut(selectedOrder._id, e.target.value);
                  setSelectedOrder({ ...selectedOrder, statut: e.target.value });
                }}>
                  <option value="en_attente">En attente</option>
                  <option value="en_cours">En cours</option>
                  <option value="expediee">Expédiée</option>
                  <option value="livree">Livrée</option>
                  <option value="annulee">Annulée</option>
                </select>
                <p><strong>Date commande:</strong> {new Date(selectedOrder.dateCommande).toLocaleString()}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeModal}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
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