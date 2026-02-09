import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get('auth/profile/');  // CHANGED from auth/user/
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleData) => {
    const response = await api.post('auth/google-login/', googleData);
    setUser(response.data.user);
    return response.data;
  };
  const login = async (email, password) => {
    const response = await api.post('auth/login/', { email, password });
    setUser(response.data.user);
    return response.data;
  };

  const register = async (userData) => {
    try {
      const response = await api.post('auth/register/', userData);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error.response?.data);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, googleLogin, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);