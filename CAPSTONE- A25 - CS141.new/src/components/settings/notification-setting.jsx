import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Save, RefreshCw, CheckCircle, AlertCircle, Edit3, X } from 'lucide-react';
import { useAuth } from '../../contexts/authcontext';

const NotificationSetting = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(true); // Always in edit mode
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Initial settings structure with default values
  const initialSettings = {
    enabled: true,
    channels: {
      email: true,
      push: true,
      inApp: true
    },
    preferences: {
      securityAlerts: true,
      systemMaintenance: true,
      documentApprovals: true,
      documentRejections: true,
      documentComments: false,
      projectUpdates: false,
      inventoryAlerts: false,
      paymentNotifications: false,
      stockAlerts: false,
      qualityAlerts: false,
      userActivities: false,
      systemAlerts: false,
      backupNotifications: false,
      financialReports: false
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '06:00'
    }
  };

  const [settings, setSettings] = useState(initialSettings);

  // Load settings from localStorage or use defaults
  useEffect(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error parsing notification settings:', e);
      }
    }
  }, []);

  // Notification types based on role
  const getNotificationTypes = (role) => {
    const baseTypes = [
      {
        id: 'securityAlerts',
        label: 'Peringatan Keamanan',
        description: 'Notifikasi untuk aktivitas mencurigakan dan perubahan keamanan',
        category: 'keamanan'
      },
    ];

    const roleSpecificTypes = {
      vendor: [
        {
          id: 'documentApprovals',
          label: 'Persetujuan Dokumen',
          description: 'Notifikasi ketika dokumen BAPP disetujui',
          category: 'dokumen'
        },
        {
          id: 'documentRejections',
          label: 'Penolakan Dokumen',
          description: 'Notifikasi ketika dokumen BAPP ditolak atau perlu revisi',
          category: 'dokumen'
        },
        {
          id: 'documentComments',
          label: 'Komentar Dokumen',
          description: 'Notifikasi ketika ada komentar baru pada dokumen',
          category: 'dokumen'
        },
        {
          id: 'paymentNotifications',
          label: 'Pembayaran',
          description: 'Notifikasi terkait status pembayaran dan invoice',
          category: 'keuangan'
        }
      ],
      pic: [
        {
          id: 'inventoryAlerts',
          label: 'Barang Masuk/Keluar',
          description: 'Notifikasi untuk barang yang masuk atau keluar gudang',
          category: 'inventori'
        },
        {
          id: 'documentApprovals',
          label: 'Persetujuan Dokumen',
          description: 'Notifikasi untuk dokumen yang butuh persetujuan',
          category: 'dokumen'
        },
      ],
      gudang: [
        {
          id: 'inventoryAlerts',
          label: 'Barang Masuk/Keluar',
          description: 'Notifikasi untuk barang yang masuk atau keluar gudang',
          category: 'inventori'
        },
        {
          id: 'stockAlerts',
          label: 'Peringatan Stok',
          description: 'Notifikasi ketika stok barang mencapai batas minimum',
          category: 'inventori'
        },
        {
          id: 'documentApprovals',
          label: 'Persetujuan Dokumen',
          description: 'Notifikasi untuk dokumen yang butuh persetujuan',
          category: 'dokumen'
        },
        {
          id: 'qualityAlerts',
          label: 'Kualitas Barang',
          description: 'Notifikasi terkait hasil quality control',
          category: 'kualitas'
        }
      ],
      direksi: [
        {
          id: 'documentApprovals',
          label: 'Persetujuan Dokumen',
          description: 'Notifikasi untuk dokumen penting yang butuh persetujuan',
          category: 'dokumen'
        },
        {
          id: 'documentComments',
          label: 'Komentar Dokumen',
          description: 'Notifikasi ketika ada komentar baru pada dokumen penting',
          category: 'dokumen'
        },
        {
          id: 'projectUpdates',
          label: 'Update Proyek',
          description: 'Notifikasi progress dan milestone proyek',
          category: 'proyek'
        },
        {
          id: 'financialReports',
          label: 'Laporan Keuangan',
          description: 'Notifikasi untuk laporan keuangan penting',
          category: 'keuangan'
        }
      ]
    };

    return [...baseTypes, ...(roleSpecificTypes[role] || [])];
  };

  // Group notifications by category
  const groupByCategory = (notifications) => {
    return notifications.reduce((groups, item) => {
      const category = item.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
      return groups;
    }, {});
  };

  const handleToggleSetting = (path, value) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleTogglePreference = (preferenceId, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preferenceId]: value
      }
    }));
  };

  const handleCancel = () => {
    // Reload from localStorage without changing edit mode
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    } else {
      setSettings(initialSettings);
    }
    setMessage({ type: '', text: '' });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
      
      setMessage({
        type: 'success',
        text: 'Pengaturan notifikasi berhasil disimpan'
      });
      // Stay in edit mode
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setMessage({
        type: 'error',
        text: 'Gagal menyimpan pengaturan'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setMessage({
      type: 'info',
      text: 'Pengaturan telah direset ke default'
    });
  };

  const getRoleDisplayName = () => {
    const roleNames = {
      'vendor': 'Vendor',
      'gudang': 'PIC Gudang',
      'pic': 'PIC Gudang',
      'direksi': 'Direksi',
      'admin': 'Administrator'
    };
    return roleNames[user?.role] || 'User';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'keamanan': '🔒',
      'sistem': '⚙️',
      'dokumen': '📄',
      'inventori': '📦',
      'kualitas': '✅',
      'proyek': '📊',
      'keuangan': '💰'
    };
    return icons[category] || '📋';
  };

  const getCategoryName = (category) => {
    const names = {
      'keamanan': 'Keamanan',
      'sistem': 'Sistem',
      'dokumen': 'Dokumen',
      'inventori': 'Inventori',
      'kualitas': 'Kualitas',
      'proyek': 'Proyek',
      'keuangan': 'Keuangan'
    };
    return names[category] || category;
  };

  const notificationTypes = getNotificationTypes(user?.role || 'pic');
  const groupedNotifications = groupByCategory(notificationTypes);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pengaturan Notifikasi
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Kelola preferensi notifikasi untuk akun {getRoleDisplayName()} Anda
        </p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg mb-6 flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800'
            : message.type === 'error'
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle size={20} className="flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-6 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                <Bell size={36} />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Preferensi Notifikasi
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Atur bagaimana dan kapan Anda ingin menerima notifikasi
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Global Switch */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Aktifkan Notifikasi
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Nyalakan atau matikan semua notifikasi sistem
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleToggleSetting('enabled', e.target.checked)}
                disabled={false}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full peer bg-gray-200 dark:bg-gray-700 peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {/* Notification Channels */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Saluran Notifikasi
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Pilih bagaimana Anda ingin menerima notifikasi
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Email */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="text-blue-600 dark:text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.channels.email}
                    onChange={(e) => handleToggleSetting('channels.email', e.target.checked)}
                    disabled={!settings.enabled}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${
                    !settings.enabled ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 peer-checked:bg-blue-600'
                  } peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>

              {/* Push */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Smartphone className="text-green-600 dark:text-green-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Push</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Di perangkat</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.channels.push}
                    onChange={(e) => handleToggleSetting('channels.push', e.target.checked)}
                    disabled={!settings.enabled}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${
                    !settings.enabled ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 peer-checked:bg-blue-600'
                  } peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>

              {/* In-App */}
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Bell className="text-purple-600 dark:text-purple-400" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">In-App</p>
                    <p className="text-gray-600 dark:text-gray-400 text-xs">Dalam aplikasi</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.channels.inApp}
                    onChange={(e) => handleToggleSetting('channels.inApp', e.target.checked)}
                    disabled={!settings.enabled}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${
                    !settings.enabled ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 peer-checked:bg-blue-600'
                  } peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Jenis Notifikasi
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Pilih jenis notifikasi yang ingin Anda terima
            </p>

            <div className="space-y-4">
              {Object.entries(groupedNotifications).map(([category, items]) => (
                <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <h5 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span>{getCategoryIcon(category)}</span>
                      <span>{getCategoryName(category)}</span>
                    </h5>
                  </div>
                  
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{item.description}</p>
                        </div>
                        
                        <label className="relative inline-flex items-center cursor-pointer ml-4">
                          <input
                            type="checkbox"
                            checked={settings.preferences[item.id]}
                            onChange={(e) => handleTogglePreference(item.id, e.target.checked)}
                            disabled={!settings.enabled}
                            className="sr-only peer"
                          />
                          <div className={`w-11 h-6 rounded-full peer ${
                            !settings.enabled ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gray-200 peer-checked:bg-blue-600'
                          } peer-focus:outline-none peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Jam Tenang
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Notifikasi akan diminimalkan selama jam tenang
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.quietHours.enabled}
                  onChange={(e) => handleToggleSetting('quietHours.enabled', e.target.checked)}
                  disabled={false}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 rounded-full peer bg-gray-200 peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>

            {settings.quietHours.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mulai
                  </label>
                  <input
                    type="time"
                    value={settings.quietHours.start}
                    onChange={(e) => handleToggleSetting('quietHours.start', e.target.value)}
                    disabled={false}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Selesai
                  </label>
                  <input
                    type="time"
                    value={settings.quietHours.end}
                    onChange={(e) => handleToggleSetting('quietHours.end', e.target.value)}
                    disabled={false}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Always show */}
        <div className="flex gap-3 px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
          >
            <X size={18} />
            Batal
          </button>

          <button
            onClick={handleReset}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 ml-auto"
          >
            <RefreshCw size={18} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSetting;
