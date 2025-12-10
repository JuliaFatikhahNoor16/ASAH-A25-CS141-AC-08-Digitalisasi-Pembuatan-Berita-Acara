import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authcontext';
import { NotificationProvider } from './contexts/notification-context';
import { DisplayProvider } from './contexts/display-context';
import { UserProvider } from './contexts/user-context';
import './index.css'; 

// Public Pages
import HomePage from './pages/home-page';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import SettingsPage from './pages/setting/index';

// Layouts
import DireksiLayout from './layouts/direksi-layouts';
import PicLayout from './layouts/pic-layouts';
import VendorLayout from './layouts/vendor-layouts';

// Direksi Pages
import DireksiDashboard from './pages/direksi/direksi-dashboard';
import DokumenOverviewDireksi from './pages/direksi/dokumen-overview';
import DokumenOverviewDetailDireksi from './pages/direksi/dokumen-overview-detail';
import PersetujuanBappList from './pages/direksi/persetujuan-bapp-list';
import PersetujuanBappDetail from './pages/direksi/persetujuan-bapp-detail';
import NotifikasiDireksi from './pages/direksi/notifikasi-direksi';

// PIC Gudang Pages
import PicDashboard from './pages/pic-gudang/pic-dashboard';
import PengecekanOverview from './pages/pic-gudang/pengecekan-barang/pengecekan-overview';
import PengecekanBarang from './pages/pic-gudang/pengecekan-barang/pengecekan-barang';
import PersetujuanOverview from './pages/pic-gudang/persetujuan-bapb/persetujuan-overview';
import PersetujuanBapb from './pages/pic-gudang/persetujuan-bapb/persetujuan-bapb';
import NotifikasiPic from './pages/pic-gudang/notifikasi-pic';
import DokumenOverviewPic from './pages/pic-gudang/dokumen-overview/dokumen-overview';
import DokumenOverviewDetailPic from './pages/pic-gudang/dokumen-overview/dokumen-overview-detail';

// Vendor Pages
import VendorDashboard from './pages/vendor/vendor-dashboard';
import DokumenSaya from './pages/vendor/dokumen-saya';
import DetailDokumen from './pages/vendor/detail-dokumen';
import TambahDokumen from './pages/vendor/tambah-dokumen';
import TambahDokumenBapb from './pages/vendor/tambah-dokumen-bapb';
import TambahDokumenBapp from './pages/vendor/tambah-dokumen-bapp';
import NotifikasiVendor from './pages/vendor/notifikasi-vendor';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
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

      {/* ============================================ */}
      {/* SETTINGS ROUTE - STANDALONE (NO LAYOUT/SIDEBAR) */}
      {/* ============================================ */}
      <Route 
        path="/pengaturan" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />

      {/* Protected Routes - DIREKSI dengan Layout */}
      <Route 
        path="/direksi" 
        element={
          <ProtectedRoute requiredRole="direksi">
            <DireksiLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DireksiDashboard />} />
        <Route path="persetujuan-bapp" element={<PersetujuanBappList />} />
        <Route path="persetujuan-bapp/:id" element={<PersetujuanBappDetail />} />
        <Route path="dokumen-overview" element={<DokumenOverviewDireksi />} />
        <Route path="dokumen-overview/:id" element={<DokumenOverviewDetailDireksi />} />
        <Route path="notifikasi" element={<NotifikasiDireksi />} />
      </Route>

      {/* Protected Routes - PIC GUDANG dengan Layout */}
      <Route 
        path="/pic-gudang" 
        element={
          <ProtectedRoute requiredRole="gudang">
            <PicLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PicDashboard />} />
        
        {/* PENGECEKAN BARANG ROUTES */}
        <Route path="pengecekan-barang" element={<PengecekanOverview />} />
        <Route path="pengecekan-barang/:id" element={<PengecekanBarang />} />
        
        {/* PERSETUJUAN BAPB ROUTES */}
        <Route path="persetujuan-bapb" element={<PersetujuanOverview />} />
        <Route path="persetujuan-bapb/:id" element={<PersetujuanBapb />} />
        
        {/* OTHER ROUTES */}
        <Route path="notifikasi-pic" element={<NotifikasiPic />} />
        <Route path="dokumen-overview" element={<DokumenOverviewPic />} />
        <Route path="dokumen-overview/:id" element={<DokumenOverviewDetailPic />} />
      </Route>

      {/* Protected Routes - VENDOR dengan Layout */}
      <Route 
        path="/vendor" 
        element={
          <ProtectedRoute requiredRole="vendor">
            <VendorLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="dokumen-saya" element={<DokumenSaya />} />
        <Route path="dokumen-saya/:id" element={<DetailDokumen />} />
        <Route path="tambah-dokumen" element={<TambahDokumen />} />
        <Route path="tambah-dokumen/bapb" element={<TambahDokumenBapb />} />
        <Route path="tambah-dokumen/bapp" element={<TambahDokumenBapp />} />
        <Route path="notifikasi" element={<NotifikasiVendor />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
          <DisplayProvider>
            <NotificationProvider>
              <Router>
                <AppRoutes />
              </Router>
            </NotificationProvider>
          </DisplayProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
