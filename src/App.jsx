import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authcontext';
import { NotificationProvider } from './contexts/notification-context';

// Import Pages
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';

// Import Dashboard Pages (akan dibuat)
import DireksiDashboard from './pages/direksi/direksi-dashboard';
import PicDashboard from './pages/pic-gudang/pic-dashboard';
import VendorDashboard from './pages/vendor/vendor-dashboard';

import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Public Route Component (redirect jika sudah login)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();
  
  if (isAuthenticated) {
    // Redirect ke dashboard berdasarkan role
    switch (userRole) {
      case 'direksi':
        return <Navigate to="/direksi/dashboard" replace />;
      case 'gudang':
        return <Navigate to="/pic-gudang/dashboard" replace />;
      case 'vendor':
        return <Navigate to="/vendor/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />

      {/* Protected Routes - Direksi */}
      <Route 
        path="/direksi/dashboard" 
        element={
          <ProtectedRoute requiredRole="direksi">
            <DireksiDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected Routes - PIC Gudang */}
      <Route 
        path="/pic-gudang/dashboard" 
        element={
          <ProtectedRoute requiredRole="gudang">
            <PicDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Protected Routes - Vendor */}
      <Route 
        path="/vendor/dashboard" 
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;