import axios from 'axios';

// In development, Vite proxies /api → http://localhost:5000
// In production, set VITE_API_URL to your deployed backend URL + /api
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const http = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Auto-attach JWT token to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('contacthub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  register: (data) => http.post('/auth/register', data),
  login:    (data) => http.post('/auth/login', data),
  me:       ()     => http.get('/auth/me'),
};

export const contactsApi = {
  getAll:          (params)     => http.get('/contacts', { params }),
  getById:         (id)         => http.get(`/contacts/${id}`),
  create:          (data)       => http.post('/contacts', data),
  update:          (id, data)   => http.put(`/contacts/${id}`, data),
  remove:          (id)         => http.delete(`/contacts/${id}`),
  toggleFavorite:  (id)         => http.patch(`/contacts/${id}/favorite`),
  exportCsv:       ()           => http.get('/contacts/export/csv', { responseType: 'blob' }),
  importCsv:       (csvText)    => http.post('/contacts/import/csv', { csvText }),
};
