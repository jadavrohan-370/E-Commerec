import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await api('/api/users/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.role === 'admin') {
            setUser(data);
        } else {
          // Not an admin
            await logout();
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    const handleAuthFailed = () => {
      setUser(null);
    };

    globalThis.addEventListener('auth-failed', handleAuthFailed);
    return () => globalThis.removeEventListener('auth-failed', handleAuthFailed);
  }, []);

  const login = async (email, password) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.role === 'admin') {
        setUser(data);
        return { success: true };
      } else {
        return { success: false, message: 'Access denied. Admins only.' };
      }
    } else {
      const error = await res.json();
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    await fetch('/api/users/logout', { method: 'POST' });
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
