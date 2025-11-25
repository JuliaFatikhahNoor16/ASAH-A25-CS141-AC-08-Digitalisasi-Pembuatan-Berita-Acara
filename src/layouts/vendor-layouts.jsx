// layouts/vendor-layouts.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/sidebar';
import Header from '../components/common/header';

const VendorLayout = () => {
  const location = useLocation();
  
  // Determine current page based on path
  const getCurrentPage = () => {
    if (location.pathname.includes('dashboard')) return 'dashboard';
    if (location.pathname.includes('dokumen-saya')) return 'dokumen-saya';
    if (location.pathname.includes('tambah-dokumen')) return 'tambah-dokumen';
    if (location.pathname.includes('notifikasi')) return 'notifikasi';
    return 'dashboard';
  };

  // Mock user data
  const mockUser = {
    name: 'PT. Vendor',
    role: 'vendor'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - TETAP sama untuk semua halaman */}
      <Sidebar 
        role="vendor" 
        currentPage={getCurrentPage()}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header - TETAP sama */}
        <Header 
          user={mockUser}
          onLogout={() => console.log('Logout clicked')}
        />
        
        {/* Page Content - BERUBAH berdasarkan halaman */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendorLayout;