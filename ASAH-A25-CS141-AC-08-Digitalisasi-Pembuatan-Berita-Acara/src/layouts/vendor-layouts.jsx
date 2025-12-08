// src/layouts/vendor-layouts.jsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/sidebar';
import Header from '../components/common/header';
import { useAuth } from '../contexts/authcontext';

const VendorLayout = () => {
  const navigate = useNavigate();
  const { userEmail, logout } = useAuth();

  // Data user untuk Header
  const user = {
    name: 'PT. Vendor',
    role: 'vendor',
    email: userEmail,
    avatar: null
  };

  // Handle logout function
  const handleLogout = () => {
    console.log('Logging out...');
    const confirmLogout = window.confirm('Apakah Anda yakin ingin logout?');
    if (confirmLogout) {
      logout();
      navigate('');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - pass role "vendor" */}
      <Sidebar role="vendor" />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header
          title="Dashboard Vendor"
          user={user} // Gunakan variabel user yang sudah didefinisikan
          onLogout={handleLogout}
          showSearch={true}
          searchPlaceholder="Cari dokumen..."
        />
        
        {/* Page Content - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;