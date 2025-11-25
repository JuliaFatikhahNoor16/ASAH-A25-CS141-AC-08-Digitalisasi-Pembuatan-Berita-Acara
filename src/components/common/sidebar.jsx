// components/common/sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ role, currentPage, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = {
    vendor: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/vendor/dashboard' },
      { id: 'tambah-dokumen', label: 'Tambah Dokumen', icon: '📝', path: '/vendor/tambah-dokumen' },
      { id: 'dokumen-saya', label: 'Dokumen Saya', icon: '📁', path: '/vendor/dokumen-saya' },
      { id: 'notifikasi', label: 'Notifikasi', icon: '🔔', path: '/vendor/notifikasi' }
    ],
    direksi: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/direksi/dashboard' },
      { id: 'persetujuan-bapp', label: 'Persetujuan BAPP', icon: '✅', path: '/direksi/persetujuan-bapp' },
      { id: 'projek-overview', label: 'Projek Overview', icon: '📈', path: '/direksi/projek-overview' },
      { id: 'dokumen-strategic', label: 'Dokumen Strategic', icon: '📑', path: '/direksi/dokumen-strategic' },
      { id: 'notifikasi', label: 'Notifikasi', icon: '🔔', path: '/direksi/notifikasi' }
    ],
    pic: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/pic/dashboard' },
      { id: 'persetujuan-bapb', label: 'Persetujuan BAPB', icon: '✅', path: '/pic/persetujuan-bapb' },
      { id: 'dokumen-overview', label: 'Dokumen Overview', icon: '📑', path: '/pic/dokumen-overview' },
      { id: 'notifikasi', label: 'Notifikasi', icon: '🔔', path: '/pic/notifikasi' }
    ]
  };

  const currentMenu = menuItems[role] || [];

  // Function untuk handle navigation
  const handleNavigation = (item) => {
    // Navigate menggunakan React Router
    navigate(item.path);
    
    // Panggil callback jika ada (untuk update currentPage state)
    if (onNavigate) {
      onNavigate(item.id);
    }
  };

  // Check active page berdasarkan current path
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-slate-800 text-white min-h-screen p-4">
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-8 p-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">DB</span>
        </div>
        <h1 className="text-xl font-bold">DigiBA</h1>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {currentMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;