import React from 'react';
import { Navigate,Outlet } from 'react-router-dom';
import authService from './authService';

const ProtectedRoute = () => {
  const isAuthenticated = authService.getAuthStatus();

  return isAuthenticated ? (
    <Outlet /> //If authenticated render the child routes
    
  ):(
    <Navigate to="/login" replace state={{ protectedRoute: true }}/> // If not authenticated, redirect to login page
  );

}

export default ProtectedRoute;