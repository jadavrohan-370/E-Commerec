import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // If user is not authenticated (token expired), try to refresh
  React.useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && !loading) {
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            credentials: 'include'
          });

          if (response.ok) {
            console.log('Token refreshed successfully');
            // No need to do anything else, Context will handle re-render
          } else {
            // Force logout
            window.location.href = '/login';
          }
        } catch (error) {
          console.error('Refresh token failed', error);
          window.location.href = '/login';
        }
      }
    };

    checkAuth();
  }, [isAuthenticated, loading]);

  return isAuthenticated && user && user.role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
