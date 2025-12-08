import React, { useState, useEffect } from 'react';
import { Bell, Mail, Smartphone, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import apiService from '../../services/api-service';
import { mockNotificationSettings } from '../../services/mock-data';

const NotificationSetting = () => {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);

  // Mock user data - dalam real app, ini dari context/auth
  const user = {
    role: 'vendor' // 'vendor', 'pic', 'direksi', 'admin'
  };

  // Initial settings structure
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
      paymentNotifications: false
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '06:00'
    },
    digestFrequency: 'daily'
  };

  // Notification types based on role
  const getNotificationTypes = (role) => {
    const baseTypes = [
      {
        id: 'securityAlerts',
        label: 'Peringatan Keamanan',
        description: 'Notifikasi untuk aktivitas mencurigakan dan perubahan keamanan',
        category: 'keamanan'
      },
      {
        id: 'systemMaintenance',
        label: 'Pemeliharaan Sistem',
        description: 'Pemberitahuan tentang jadwal maintenance dan update sistem',
        category: 'sistem'
      }
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
      ],
      admin: [
        {
          id: 'userActivities',
          label: 'Aktivitas Pengguna',
          description: 'Notifikasi untuk aktivitas pengguna penting',
          category: 'sistem'
        },
        {
          id: 'systemAlerts',
          label: 'Peringatan Sistem',
          description: 'Notifikasi untuk issue dan error sistem',
          category: 'sistem'
        },
        {
          id: 'backupNotifications',
          label: 'Backup Database',
          description: 'Notifikasi hasil backup database',
          category: 'sistem'
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

  // Fetch notification settings
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getNotificationSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load notification settings:', error);
      // Fallback to mock data
      setSettings(mockNotificationSettings);
      setMessage({
        type: 'warning',
        text: 'Menggunakan data demo. Pastikan backend terhubung untuk data real.'
      });
    } finally {
      setIsLoading(false);
    }
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
    setHasChanges(true);
  };

  const handleTogglePreference = (preferenceId, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preferenceId]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      const savedSettings = await apiService.updateNotificationSettings(settings);
      
      setSettings(savedSettings);
      setMessage({
        type: 'success',
        text: 'Pengaturan notifikasi berhasil disimpan'
      });
      setHasChanges(false);
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setMessage({
        type: 'error',
        text: 'Gagal menyimpan pengaturan: ' + error.message
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(initialSettings);
    setHasChanges(true);
    setMessage({
      type: 'info',
      text: 'Pengaturan telah direset ke default'
    });
  };

  const getRoleDisplayName = () => {
    const roleNames = {
      'vendor': 'Vendor',
      'pic': 'PIC Gudang',
      'direksi': 'Direksi',
      'admin': 'Administrator'
    };
    return roleNames[user.role] || user.role;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const notificationTypes = getNotificationTypes(user.role);
  const groupedNotifications = groupByCategory(notificationTypes);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pengaturan Notifikasi</h2>
          <p className="text-gray-600 mt-1">
            Kelola preferensi notifikasi untuk akun {getRoleDisplayName()} Anda
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <RefreshCw size={18} />
            Reset
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
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
            <CheckCircle size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Global Notification Switch */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Aktifkan Notifikasi
              </h3>
              <p className="text-gray-600">
                Nyalakan atau matikan semua notifikasi sistem
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleToggleSetting('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Saluran Notifikasi</h3>
          <p className="text-gray-600 mb-6">Pilih bagaimana Anda ingin menerima notifikasi</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600 text-sm">Notifikasi via email</p>
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
                  !settings.enabled ? 'bg-gray-100' : 'bg-gray-200 peer-checked:bg-blue-600'
                } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Smartphone className="text-green-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Push Notification</p>
                  <p className="text-gray-600 text-sm">Notifikasi di perangkat</p>
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
                  !settings.enabled ? 'bg-gray-100' : 'bg-gray-200 peer-checked:bg-blue-600'
                } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="text-purple-600" size={20} />
                <div>
                  <p className="font-medium text-gray-900">Dalam Aplikasi</p>
                  <p className="text-gray-600 text-sm">Notifikasi di aplikasi</p>
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
                  !settings.enabled ? 'bg-gray-100' : 'bg-gray-200 peer-checked:bg-blue-600'
                } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Types by Category */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Jenis Notifikasi</h3>
          <p className="text-gray-600 mb-6">
            Pilih jenis notifikasi yang ingin Anda terima sebagai {getRoleDisplayName()}
          </p>

          <div className="space-y-6">
            {Object.entries(groupedNotifications).map(([category, items]) => (
              <div key={category} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 capitalize">
                    {category === 'keamanan' && '🔒 Keamanan'}
                    {category === 'sistem' && '⚙️ Sistem'}
                    {category === 'dokumen' && '📄 Dokumen'}
                    {category === 'inventori' && '📦 Inventori'}
                    {category === 'kualitas' && '✅ Kualitas'}
                    {category === 'proyek' && '📊 Proyek'}
                    {category === 'keuangan' && '💰 Keuangan'}
                  </h4>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.preferences[item.id]}
                          onChange={(e) => handleTogglePreference(item.id, e.target.checked)}
                          disabled={!settings.enabled}
                          className="sr-only peer"
                        />
                        <div className={`w-11 h-6 rounded-full peer ${
                          !settings.enabled ? 'bg-gray-100' : 'bg-gray-200 peer-checked:bg-blue-600'
                        } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Jam Tenang</h3>
          <p className="text-gray-600 mb-6">Atur waktu dimana notifikasi akan diminimalkan</p>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-gray-900">Aktifkan Jam Tenang</p>
              <p className="text-gray-600 text-sm">Notifikasi akan diminimalkan selama jam tenang</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.quietHours.enabled}
                onChange={(e) => handleToggleSetting('quietHours.enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.quietHours.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mulai
                </label>
                <input
                  type="time"
                  value={settings.quietHours.start}
                  onChange={(e) => handleToggleSetting('quietHours.start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selesai
                </label>
                <input
                  type="time"
                  value={settings.quietHours.end}
                  onChange={(e) => handleToggleSetting('quietHours.end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationSetting;