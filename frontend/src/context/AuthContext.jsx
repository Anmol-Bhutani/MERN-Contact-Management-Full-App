import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,      setUser]      = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until token validated

  // ── On mount: restore session from localStorage ────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('contacthub_token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.removeItem('contacthub_token'))
      .finally(() => setIsLoading(false));
  }, []);

  // ── Auth actions ────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem('contacthub_token', data.token);
    setUser(data.user);
  };

  const register = async (formData) => {
    const { data } = await authApi.register(formData);
    localStorage.setItem('contacthub_token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('contacthub_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
