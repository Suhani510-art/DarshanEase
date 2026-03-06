import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('darshanease_token'));
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const { data } = await authAPI.getMe();
          setUser(data.user);
        } catch {
          logout(); 
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

 
  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem('darshanease_token', data.token);
    localStorage.setItem('darshanease_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  
  const register = useCallback(async (name, email, password, role) => {
    const { data } = await authAPI.register({ name, email, password, role });
    localStorage.setItem('darshanease_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);


  const logout = useCallback(() => {
    localStorage.removeItem('darshanease_token');
    localStorage.removeItem('darshanease_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';
  const isOrganizer = user?.role === 'ORGANIZER';

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, isAdmin, isOrganizer, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};