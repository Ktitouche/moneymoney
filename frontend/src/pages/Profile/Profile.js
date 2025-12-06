import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    rue: '',
    ville: '',
    codePostal: '',
    pays: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profil');
      const userData = response.data;
      setFormData({
        nom: userData.nom || '',
        prenom: userData.prenom || '',
        telephone: userData.telephone || '',
        rue: userData.adresse?.rue || '',
        ville: userData.adresse?.ville || '',
        codePostal: userData.adresse?.codePostal || '',
        pays: userData.adresse?.pays || ''
      });
    } catch (error) {
      // Erreur silencieuse
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/users/profil', {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        adresse: {
          rue: formData.rue,
          ville: formData.ville,
          codePostal: formData.codePostal,
          pays: formData.pays
        }
      });

      toast.success('Profil mis à jour avec succès !');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="page-title">Mon Profil</h1>

        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-card">
              <div className="profile-avatar">
                {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
              </div>
              <h3>{user?.prenom} {user?.nom}</h3>
              <p>{user?.email}</p>
            </div>

            <nav className="profile-nav">
              <button className="nav-item active">Informations personnelles</button>
              <button onClick={() => navigate('/mes-commandes')} className="nav-item">
                Mes commandes
              </button>
              <button onClick={logout} className="nav-item logout">
                Déconnexion
              </button>
            </nav>
          </aside>

          <div className="profile-content">
            <div className="profile-section">
              <h2>Informations personnelles</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom</label>
                    <input
                      type="text"
                      name="nom"
                      className="form-input"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      className="form-input"
                      value={formData.prenom}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={user?.email}
                    disabled
                  />
                  <small className="form-hint">L'email ne peut pas être modifié</small>
                </div>

                <div className="form-group">
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    className="form-input"
                    value={formData.telephone}
                    onChange={handleChange}
                  />
                </div>

                <h3>Adresse</h3>

                <div className="form-group">
                  <label className="form-label">Rue</label>
                  <input
                    type="text"
                    name="rue"
                    className="form-input"
                    value={formData.rue}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Ville</label>
                    <input
                      type="text"
                      name="ville"
                      className="form-input"
                      value={formData.ville}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Code postal</label>
                    <input
                      type="text"
                      name="codePostal"
                      className="form-input"
                      value={formData.codePostal}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Pays</label>
                  <input
                    type="text"
                    name="pays"
                    className="form-input"
                    value={formData.pays}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
