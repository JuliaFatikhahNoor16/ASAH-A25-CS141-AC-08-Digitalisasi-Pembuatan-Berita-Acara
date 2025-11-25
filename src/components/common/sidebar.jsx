// components/common/Sidebar.jsx
import React from 'react';

const Sidebar = ({ role, currentPage, onNavigate }) => {
  const menuItems = {
    vendor: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'tambah-dokumen', label: 'Tambah Dokumen', icon: '📝' },
      { id: 'dokumen-saya', label: 'Dokumen Saya', icon: '📁' },
      { id: 'notifikasi', label: 'Notifikasi', icon: '🔔' }
    ],
    direksi: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'persetujuan-bapp', label: 'Persetujuan BAPP', icon: '✅' },
      { id: 'projek-overview', label: 'Projek Overview', icon: '📈' },
      { id: 'dokumen-strategic', label: 'Dokumen Strategic', icon: '📑' },
      { id: 'notifikasi', label: 'Notifikasi', icon: '🔔' }
    ],
    pic: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'persetujuan-bapb', label: 'Persetujuan BAPB', icon: '✅' },
      { id: 'dokumen-overview', label: 'Dokumen Overview', icon: '📑' },
      { id: 'notifikasi', label: 'Notifikasi', icon: '🔔' }
    ]
  };

  const currentMenu = menuItems[role] || [];

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
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              currentPage === item.id
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