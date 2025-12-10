import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Settings, User, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../contexts/authcontext';

const Header = ({ user: propUser, role: propRole, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user: contextUser, logout: contextLogout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  
  // Use prop user/role if provided, otherwise use context
  const user = propUser || contextUser;
  const logout = onLogout || contextLogout;
  
  // Mock notifications data
  const notifications = [
    { id: 1, message: 'Dokumen BAPB-XYZ-234 telah disetujui', time: '5 menit yang lalu', unread: true },
    { id: 2, message: 'Dokumen BAPP-ABC-235 memerlukan revisi', time: '1 jam yang lalu', unread: true },
    { id: 3, message: 'Dokumen BAPB-XYZ-236 sedang direview', time: '3 jam yang lalu', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Determine base path based on user role
  const getBasePath = () => {
    if (!user) return '/';
    
    const role = propRole || user.role;
    switch (role) {
      case 'direksi':
        return '/direksi';
      case 'gudang':
      case 'pic':
        return '/pic-gudang';
      case 'vendor':
        return '/vendor';
      default:
        return '/';
    }
  };

  const basePath = getBasePath();
  
  const getRoleName = () => {
    const role = propRole || user?.role;
    if (role === 'vendor') return 'Dashboard Vendor';
    if (role === 'direksi') return 'Dashboard Direksi';
    if (role === 'pic' || role === 'gudang') return 'Dashboard PIC Gudang';
    return 'Dashboard';
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };
  
  // Get notification path based on role
  const getNotificationPath = () => {
    const role = propRole || user?.role;
    if (role === 'gudang' || role === 'pic') return `${basePath}/notifikasi-pic`;
    return `${basePath}/notifikasi`;
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    if (logout) {
      logout();
    }
    navigate('/login');
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      'vendor': 'Vendor',
      'gudang': 'PIC Gudang',
      'pic': 'PIC Gudang',
      'direksi': 'Direksi',
      'admin': 'Administrator'
    };
    return roleNames[role] || role;
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Page Title & Search */}
        <div className="flex items-center gap-6 flex-1">
          {/* Page Title */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{getRoleName()}</h2>
          </div>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Button */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notifikasi"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notifikasi</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          {unreadCount} baru
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notif.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <p className="text-sm text-gray-900">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <Bell size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Tidak ada notifikasi</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        navigate(getNotificationPath());
                      }}
                      className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Lihat Semua Notifikasi
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              title="Profile Menu"
            >
              <span className="text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 mt-1">{user?.email || 'user@example.com'}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {getRoleDisplayName(propRole || user?.role)}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/pengaturan');
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Settings size={16} />
                      Pengaturan
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
