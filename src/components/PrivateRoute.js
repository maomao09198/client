import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (user === null) {
    return <LoadingSpinner />;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;