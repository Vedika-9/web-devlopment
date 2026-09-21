import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('unfazed_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setTherapist(res.data))
      .catch(() => localStorage.removeItem('unfazed_token'))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('unfazed_token', res.data.token);
    setTherapist(res.data.therapist);
    return res.data.therapist;
  }

  async function register(payload) {
    const res = await api.post('/auth/register', payload);
    localStorage.setItem('unfazed_token', res.data.token);
    setTherapist(res.data.therapist);
    return res.data.therapist;
  }

  function logout() {
    localStorage.removeItem('unfazed_token');
    setTherapist(null);
  }

  return (
    <AuthContext.Provider value={{ therapist, setTherapist, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
