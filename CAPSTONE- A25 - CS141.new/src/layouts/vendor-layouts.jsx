// layouts/vendor-layout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/common/sidebar';
import Header from '../components/common/header';
import { useUser } from '../context/user-context'; 

const VendorLayout = () => {
  // Gunakan user dari UserContext jika ada, fallback ke mock
  const { user: contextUser, loading } = useUser();
  
  // Gabungkan data: prioritaskan dari context, fallback ke mock
  const user = contextUser || {
    name: 'PT. Vendor',
    role: 'vendor',
    avatar: null
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // Jika UserContext punya logout function, panggil di sini
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed */}
      <Sidebar role="vendor" />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header - Sticky at top */}
        <Header 
          user={user}
          role={user.role || 'vendor'}
          onLogout={handleLogout}
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
