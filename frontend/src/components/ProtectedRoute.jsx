import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('pothik_token');
  const userStr = localStorage.getItem('pothik_user');

  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  if (allowedRole && user.role !== allowedRole) {
   if (user.role === 'CLIENT')
      return <Navigate to="/client-dashboard" replace />;
    
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;