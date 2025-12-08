import React, { useState } from 'react';
import ProfileSetting from '../../components/settings/profile-setting';
import NotificationSetting from '../../components/settings/notification-setting';
import SecuritySetting from '../../components/settings/security-setting';
import DisplaySetting from '../../components/settings/display-setting';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profil', component: <ProfileSetting /> },
    { id: 'security', label: 'Keamanan', component: <SecuritySetting /> },
    { id: 'notifications', label: 'Notifikasi', component: <NotificationSetting /> },
    { id: 'display', label: 'Tampilan', component: <DisplaySetting /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Pengaturan Akun
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              {tabs.find(tab => tab.id === activeTab)?.component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;