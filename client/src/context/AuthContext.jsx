import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('goalsync_user') || 'null'));
  const [loading, setLoading] = useState(false);

  async function login(email, password) {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('goalsync_token', data.token);
      localStorage.setItem('goalsync_user', JSON.stringify(data.user));
      setUser(data.user);
    } finally { setLoading(false); }
  }

  async function switchRole(role) {
    const { data } = await api.post('/auth/switch-role', { role });
    localStorage.setItem('goalsync_token', data.token);
    localStorage.setItem('goalsync_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('goalsync_token'); localStorage.removeItem('goalsync_user'); setUser(null);
  }

  useEffect(() => {
    if (localStorage.getItem('goalsync_token')) api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(logout);
  }, []);

  const value = useMemo(() => ({ user, loading, login, logout, switchRole }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
