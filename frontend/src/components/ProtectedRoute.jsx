import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  // 1. Check if the user has a token and user data in their browser
  const token = localStorage.getItem('pothik_token');
  const userStr = localStorage.getItem('pothik_user');

  // If they aren't logged in at all, kick them to the login page
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  // 2. Parse the user data so we can check their role
  const user = JSON.parse(userStr);

  // 3. Check if they have the correct permissions
  if (allowedRole && user.role !== allowedRole) {
    // If a normal CLIENT tries to type /admin-dashboard, kick them back to their own portal
    if (user.role === 'CLIENT') return <Navigate to="/client-dashboard" replace />;
    
    // Default kick to login
    return <Navigate to="/login" replace />;
  }

  // 4. If they pass all the security checks, let them see the page!
  return children;
};

export default ProtectedRoute;