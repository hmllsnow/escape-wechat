// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = localStorage.getItem('token');

  if (isAuthenticated) {
    return <Outlet />;
  } else if (token) {
    return <div>Loading...</div>;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoute;