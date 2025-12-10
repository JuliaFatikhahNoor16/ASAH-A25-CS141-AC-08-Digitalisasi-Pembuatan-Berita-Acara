// src/components/settings/DisplaySetting.jsx
import React, { useState, useEffect } from 'react';
import { useDisplay } from '../../contexts/display-context';

const DisplaySetting = () => {
  const { preferences, loading, updatePreferences, resetToDefault } = useDisplay();
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Update local state when context preferences change
  useEffect(() => {
    setLocalPrefs(preferences);
  }, [preferences]);

  const handleThemeChange = (theme) => {
    setLocalPrefs(prev => ({
      ...prev,
      theme
    }));
    // Apply immediately for better UX
    applyThemeImmediately(theme);
  };

  const handleLanguageChange = (language) => {
    setLocalPrefs(prev => ({
      ...prev,
      language
    }));
  };

  const handleFontSizeChange = (fontSize) => {
    setLocalPrefs(prev => ({
      ...prev,
      fontSize
    }));
    // Apply font size immediately
    applyFontSizeImmediately(fontSize);
  };

  const handleToggleSidebar = () => {
    setLocalPrefs(prev => ({
      ...prev,
      sidebarVisible: !prev.sidebarVisible
    }));
  };

  const applyThemeImmediately = (theme) => {
    const root = document.documentElement;
    if (theme === 'dark' || 
        (theme === 'system' && 
         window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const applyFontSizeImmediately = (fontSize) => {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.fontSize = sizes[fontSize];
  };

  const handleSave = async () => {
    setMessage({ type: '', text: '' });
    const result = await updatePreferences(localPrefs);
    
    if (result.success) {
      setMessage({ 
        type: 'success', 
        text: 'Preferensi tampilan berhasil disimpan!' 
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } else {
      setMessage({ 
        type: 'error', 
        text: result.error || 'Gagal menyimpan preferensi' 
      });
    }
  };

  const handleReset = async () => {
    if (window.confirm('Yakin ingin mengembalikan ke pengaturan default?')) {
      const result = await resetToDefault();
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Preferensi telah direset ke default!' 
        });
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Gagal mereset preferensi' 
        });
      }
    }
  };

  const themeOptions = [
    { value: 'light', label: 'Terang', icon: '☀️', desc: 'Tema terang standar' },
    { value: 'dark', label: 'Gelap', icon: '🌙', desc: 'Tema gelap untuk mata' },
    { value: 'system', label: 'Sistem', icon: '🖥️', desc: 'Ikuti sistem operasi' },
  ];

  const languageOptions = [
    { value: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Kecil', size: 'text-sm' },
    { value: 'medium', label: 'Sedang', size: 'text-base' },
    { value: 'large', label: 'Besar', size: 'text-lg' },
  ];

  return (
    <div className="p-4 md:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Pengaturan Tampilan
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Sesuaikan tampilan aplikasi sesuai preferensi Anda
        </p>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {message.type === 'success' ? '✅' : '❌'}
            </span>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Theme Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Tema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((theme) => (
              <button
                key={theme.value}
                onClick={() => handleThemeChange(theme.value)}
                className={`flex flex-col items-center p-4 border-2 rounded-xl transition-all duration-200 ${
                  localPrefs.theme === theme.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-3xl mb-3">{theme.icon}</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {theme.label}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-center">
                  {theme.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Bahasa
          </h3>
          <div className="flex flex-wrap gap-4">
            {languageOptions.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleLanguageChange(lang.value)}
                className={`flex items-center gap-3 px-6 py-3 border-2 rounded-lg transition-all duration-200 ${
                  localPrefs.language === lang.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium text-gray-800 dark:text-white">
                  {lang.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Ukuran Teks
          </h3>
          <div className="flex flex-wrap gap-4">
            {fontSizeOptions.map((size) => (
              <button
                key={size.value}
                onClick={() => handleFontSizeChange(size.value)}
                className={`px-6 py-3 border-2 rounded-lg transition-all duration-200 ${
                  localPrefs.fontSize === size.value
                    ? 'border-blue-500 bg-blue-500 text-white'
                    : 'border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:border-gray-300 dark:hover:border-gray-600'
                } ${size.size}`}
              >
                {size.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Ukuran teks akan mempengaruhi seluruh tampilan aplikasi
          </p>
        </div>

        {/* Sidebar Setting */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Sidebar Default
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Tampilkan sidebar secara default saat membuka aplikasi
              </p>
            </div>
            <button
              onClick={handleToggleSidebar}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                localPrefs.sidebarVisible 
                  ? 'bg-blue-500' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                  localPrefs.sidebarVisible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              'Simpan Perubahan'
            )}
          </button>
          
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset ke Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default DisplaySetting;
