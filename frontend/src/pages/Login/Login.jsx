import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: '',
    nom: '',
    prenom: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(false);
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'telephone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);

      setFormData((prev) => {
        if (!digitsOnly) {
          return { ...prev, telephone: '' };
        }

        if (digitsOnly.length === 1) {
          return digitsOnly === '0' ? { ...prev, telephone: digitsOnly } : prev;
        }

        const prefix = digitsOnly.slice(0, 2);
        const isValidPrefix = ['05', '06', '07'].includes(prefix);
        if (!isValidPrefix) {
          return prev;
        }

        return { ...prev, telephone: digitsOnly };
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.motDePasse);
        if (result.success) {
          toast.success('Connexion réussie !');
          navigate('/');
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await register(formData);
        if (result.success) {
          toast.success('Inscription réussie !');
          navigate('/');
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-tabs">
            <button
              className={`tab ${isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Connexion
            </button>
            <button
              className={`tab ${!isLogin ? 'active' : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {!isLogin && (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nom *</label>
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
                    <label className="form-label">Prénom *</label>
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
                  <label className="form-label">Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    className="form-input"
                    value={formData.telephone}
                    onChange={handleChange}
                    inputMode="numeric"
                    pattern="0[5-7][0-9]{8}"
                    maxLength={10}
                    minLength={10}
                    placeholder="05XXXXXXXX"
                  />
                  <small className="form-hint">Numéro algérien : commence par 05 / 06 / 07, 10 chiffres</small>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mot de passe *</label>
              <input
                type="password"
                name="motDePasse"
                className="form-input"
                value={formData.motDePasse}
                onChange={handleChange}
                required
                minLength={6}
              />
              {!isLogin && (
                <small className="form-hint">
                  Au moins 6 caractères
                </small>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              {isLogin ? "Pas encore de compte ? " : "Déjà inscrit ? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="link-button"
              >
                {isLogin ? 'Créer un compte' : 'Se connecter'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
