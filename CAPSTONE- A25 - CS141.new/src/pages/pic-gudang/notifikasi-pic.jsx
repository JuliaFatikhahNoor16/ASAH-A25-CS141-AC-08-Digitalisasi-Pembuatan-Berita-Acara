import React, { useState } from 'react';
import Sidebar from '../../components/common/sidebar';
import Header from '../../components/common/header';
import { useAuth } from '../../contexts/authcontext';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, CheckCircle, XCircle, Clock, AlertCircle, Eye, Check, Trash2 } from 'lucide-react';

const NotifikasiPic = () => {
  const { userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [selectedIds, setSelectedIds] = useState([]);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'bapb_new',
      title: 'Dokumen BAPB Baru',
      message: 'BAPB-2024-065 dari PT. Konstruksi Indonesia telah diajukan dan menunggu review Anda',
      time: '5 menit lalu',
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      isRead: false,
      dokumenNo: 'BAPB-2024-065'
    },
    {
      id: 2,
      type: 'deadline',
      title: 'Deadline Mendekat',
      message: 'BAPB-2024-064 dari PT. Jaya Abadi akan jatuh tempo dalam 2 hari',
      time: '1 jam lalu',
      icon: Clock,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      isRead: false,
      dokumenNo: 'BAPB-2024-064'
    },
    {
      id: 3,
      type: 'approval',
      title: 'Dokumen Disetujui',
      message: 'BAPB-2024-063 dari CV. Mandiri telah Anda setujui',
      time: '3 jam lalu',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      isRead: true,
      dokumenNo: 'BAPB-2024-063'
    },
    {
      id: 4,
      type: 'bapb_new',
      title: 'Dokumen BAPB Baru',
      message: 'BAPB-2024-062 dari PT. Bangun Jaya telah diajukan dan menunggu review',
      time: '5 jam lalu',
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      isRead: true,
      dokumenNo: 'BAPB-2024-062'
    },
    {
      id: 5,
      type: 'approval',
      title: 'Dokumen Ditolak',
      message: 'BAPB-2024-061 dari PT. Vendor Lama telah Anda tolak karena ketidaksesuaian spesifikasi',
      time: '1 hari lalu',
      icon: XCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      isRead: true,
      dokumenNo: 'BAPB-2024-061'
    },
    {
      id: 6,
      type: 'deadline',
      title: 'Deadline Terlewat',
      message: 'BAPB-2024-060 dari CV. Kontraktor telah melewati deadline tanpa persetujuan',
      time: '2 hari lalu',
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      isRead: true,
      dokumenNo: 'BAPB-2024-060'
    },
    {
      id: 7,
      type: 'bapb_new',
      title: 'Dokumen BAPB Baru',
      message: 'BAPB-2024-059 dari PT. Material Utama telah diajukan',
      time: '3 hari lalu',
      icon: FileText,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      isRead: true,
      dokumenNo: 'BAPB-2024-059'
    },
    {
      id: 8,
      type: 'approval',
      title: 'Dokumen Disetujui',
      message: 'BAPB-2024-058 dari PT. Supplier Bangunan telah Anda setujui',
      time: '4 hari lalu',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      isRead: true,
      dokumenNo: 'BAPB-2024-058'
    }
  ]);

  const handleLogout = () => {
    const confirm = window.confirm('Apakah Anda yakin ingin logout?');
    if (confirm) {
      logout();
      navigate('/login');
    }
  };

  const user = {
    name: 'PIC Gudang',
    role: 'gudang',
    email: userEmail
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const handleDelete = (id) => {
    if (window.confirm('Hapus notifikasi ini?')) {
      setNotifications(notifications.filter(notif => notif.id !== id));
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Hapus ${selectedIds.length} notifikasi yang dipilih?`)) {
      setNotifications(notifications.filter(notif => !selectedIds.includes(notif.id)));
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const handleViewDokumen = (dokumenNo) => {
    alert(`Navigating to dokumen ${dokumenNo}`);
    // navigate to dokumen detail
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'read') return notif.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar role="gudang" />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <Header user={user} onLogout={handleLogout} />
        
        {/* Page Content */}
        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Bell size={32} />
                Notifikasi
                {unreadCount > 0 && (
                  <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                    {unreadCount} baru
                  </span>
                )}
              </h1>
              <p className="text-gray-500 mt-1">
                Lihat semua aktivitas dan update terbaru
              </p>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Left side - Filter and Select */}
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <option value="all">Semua ({notifications.length})</option>
                    <option value="unread">Belum Dibaca ({unreadCount})</option>
                    <option value="read">Sudah Dibaca ({notifications.length - unreadCount})</option>
                  </select>

                  {filteredNotifications.length > 0 && (
                    <button
                      onClick={toggleSelectAll}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                      {selectedIds.length === filteredNotifications.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                    </button>
                  )}
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                  {selectedIds.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      <span>Hapus ({selectedIds.length})</span>
                    </button>
                  )}

                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Check size={18} />
                      <span className="hidden sm:inline">Tandai Semua Dibaca</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Tidak Ada Notifikasi
                  </h3>
                  <p className="text-gray-500">
                    Tidak ada notifikasi untuk filter ini
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`bg-white rounded-xl shadow-sm border transition-all ${
                        notif.isRead
                          ? 'border-gray-200 hover:border-gray-300'
                          : 'border-blue-200 hover:border-blue-300 shadow-md border-l-4 border-l-blue-600'
                      }`}
                    >
                      <div className="p-5">
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(notif.id)}
                            onChange={() => toggleSelect(notif.id)}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />

                          {/* Icon */}
                          <div className={`flex-shrink-0 w-12 h-12 ${notif.bgColor} rounded-xl flex items-center justify-center`}>
                            <Icon size={24} className={notif.iconColor} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className={`text-base font-semibold text-gray-900 mb-1 ${!notif.isRead ? 'font-bold' : ''}`}>
                              {notif.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              {notif.message}
                            </p>
                            <span className="text-xs text-gray-500">
                              {notif.time}
                            </span>
                          </div>

                          {/* Right Side Actions */}
                          <div className="flex items-center gap-3">
                            {/* Blue dot for unread */}
                            {!notif.isRead && (
                              <span className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}

                            {/* Mark as Read Button */}
                            {!notif.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notif.id)}
                                className="flex-shrink-0 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                title="Tandai sebagai dibaca"
                              >
                                <Check size={18} />
                              </button>
                            )}

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(notif.id)}
                              className="flex-shrink-0 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              title="Hapus notifikasi"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Summary */}
            {filteredNotifications.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-500">
                Menampilkan {filteredNotifications.length} dari {notifications.length} notifikasi
              </div>
            )}

            {/* Empty State untuk semua notifikasi dibaca */}
            {filteredNotifications.length > 0 && unreadCount === 0 && (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <CheckCircle size={24} className="mx-auto text-green-600 mb-2" />
                <p className="text-sm text-green-800 font-medium">
                  Semua notifikasi telah dibaca! ✓
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotifikasiPic;
