import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const CSRF_HEADER_NAME = 'x-csrf-token';

const getCookieValue = (name) => {
  if (typeof document === 'undefined') return null;
  const escaped = name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
};

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// L'auth se fait via cookie HttpOnly envoyé automatiquement.
api.interceptors.request.use((config) => {
  // Définir Content-Type seulement si ce n'est pas FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  const method = String(config.method || 'get').toLowerCase();
  if (['post', 'put', 'patch', 'delete'].includes(method)) {
    const csrfToken = getCookieValue('csrf_token');
    if (csrfToken) {
      config.headers[CSRF_HEADER_NAME] = csrfToken;
    }
  }

  return config;
});

export default api;
