// layouts/vendor-layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/sidebar';
import Header from '../components/common/header';

const VendorLayout = () => {
  const mockUser = {
    name: 'PT. Vendor',
    role: 'vendor',
    avatar: null
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed */}
      <Sidebar role="vendor" />
      
      {/* Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header - Sticky at top */}
        <Header 
          user={mockUser}
          role="vendor"
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
