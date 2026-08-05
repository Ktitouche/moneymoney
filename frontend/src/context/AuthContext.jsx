import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        await api.get('/auth/csrf-token');
        const response = await api.get('/users/profil');
        setUser(response.data || null);
      } catch (_) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const login = async (email, motDePasse) => {
    try {
      const response = await api.post('/auth/connexion', { email, motDePasse });
      const { user } = response.data;

      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/inscription', userData);
      const { user } = response.data;

      setUser(user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur d\'inscription'
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/deconnexion');
    } catch (_) {
      // Ignorer les erreurs réseau lors de la déconnexion locale
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
