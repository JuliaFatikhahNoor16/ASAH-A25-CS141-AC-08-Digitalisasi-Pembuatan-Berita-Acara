import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/sidebar';
import Header from '../components/common/header';
import { useAuth } from '../contexts/authcontext';

const DireksiLayout = () => {
  const navigate = useNavigate();
  const { userEmail, userRole, logout } = useAuth();

  // Prepare user object untuk Header
  const user = {
    name: userEmail?.split('@')[0] || 'User',
    email: userEmail,
    role: userRole === 'direksi' ? 'Direksi' : userRole
  };

  // Handle logout function
  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    navigate('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hanya pass role */}
      <Sidebar role="direksi" />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <Header
          title="Dashboard Direksi"
          user={user}
          onLogout={handleLogout}
          showSearch={true}
          searchPlaceholder="Cari BAPP..."
        />

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DireksiLayout;
