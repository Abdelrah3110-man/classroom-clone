import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useNotification();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      showToast("Login Error: " + message, "error");
      console.error("Login error", err);
      return null;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/register', { name, email, password });
      const userData = res.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error("Register error", err);
      const message = err.response?.data?.message || err.message || "Unknown error";
      showToast("Register Error: " + message, "error");
      return null;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (err) {
      console.error("Logout error", err);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
