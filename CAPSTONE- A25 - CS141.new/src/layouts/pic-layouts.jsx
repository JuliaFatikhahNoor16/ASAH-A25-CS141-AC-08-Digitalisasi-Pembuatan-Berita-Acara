// layouts/pic-layouts.jsx
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/sidebar';
import Header from '../components/common/header';
import { useAuth } from '../contexts/authcontext';

const PicLayout = () => {
  const navigate = useNavigate();
  const { userEmail, logout, isAuthenticated } = useAuth();

  // ✅ Cek authentication saat komponen mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // ✅ Tampilkan loading jika belum selesai cek
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // Prepare user object untuk Header
  const user = {
    name: 'PIC Gudang',
    role: 'gudang',
    email: userEmail
  };

  // Handle logout function dengan confirmation
  const handleLogout = () => {
    const confirm = window.confirm('Apakah Anda yakin ingin logout?');
    if (confirm) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role="gudang" />
      
      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <Header
          user={user}
          onLogout={handleLogout}
        />
        
        {/* Page Content - Outlet untuk child routes */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PicLayout;
