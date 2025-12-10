// src/contexts/DisplayContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const DisplayContext = createContext();

export const useDisplay = () => {
  const context = useContext(DisplayContext);
  if (!context) {
    throw new Error('useDisplay must be used within a DisplayProvider');
  }
  return context;
};

export const DisplayProvider = ({ children }) => {
  const defaultPreferences = {
    theme: 'light', // Default light mode
    language: 'id',
    fontSize: 'medium',
    sidebarVisible: true,
  };

  // Load from localStorage first
  const [preferences, setPreferences] = useState(() => {
    // PAKSA HAPUS DARK MODE DI AWAL
    document.documentElement.classList.remove('dark');
    
    try {
      const saved = localStorage.getItem('displayPreferences');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('✅ Loaded display preferences from localStorage:', parsed);
        
        // Jika tema dark tersimpan, tapi kita mau mulai dengan light
        // Uncomment baris ini untuk FORCE reset ke light mode
        // parsed.theme = 'light';
        
        return parsed;
      }
    } catch (error) {
      console.error('❌ Error loading display preferences:', error);
    }
    console.log('ℹ️ Using default display preferences');
    return defaultPreferences;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Apply theme and font size whenever preferences change
  useEffect(() => {
    console.log('🎨 Applying theme:', preferences.theme);
    applyTheme(preferences.theme);
    applyFontSize(preferences.fontSize);
  }, [preferences.theme, preferences.fontSize]);

  // Listen to system theme changes when theme is 'system'
  useEffect(() => {
    if (preferences.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        console.log('🌐 System theme changed:', e.matches ? 'dark' : 'light');
        applySystemTheme(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      // Apply immediately on mount
      applySystemTheme(mediaQuery.matches);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [preferences.theme]);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      console.log('✅ Dark mode applied');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      console.log('✅ Light mode applied');
    } else if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applySystemTheme(isDark);
    }
  };

  const applySystemTheme = (isDark) => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      console.log('✅ System theme: Dark mode applied');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      console.log('✅ System theme: Light mode applied');
    }
  };

  const applyFontSize = (fontSize) => {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    const size = sizes[fontSize] || '16px';
    document.documentElement.style.fontSize = size;
    console.log('✅ Font size applied:', size);
  };

  const updatePreferences = async (newPreferences) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('💾 Saving preferences:', newPreferences);
      
      // Apply changes immediately
      if (newPreferences.theme !== preferences.theme) {
        applyTheme(newPreferences.theme);
      }
      if (newPreferences.fontSize !== preferences.fontSize) {
        applyFontSize(newPreferences.fontSize);
      }
      
      // Update state
      setPreferences(newPreferences);
      
      // Save to localStorage
      localStorage.setItem('displayPreferences', JSON.stringify(newPreferences));
      console.log('✅ Preferences saved to localStorage');
      
      // Simulate API call (500ms delay)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLoading(false);
      return { 
        success: true, 
        data: newPreferences,
        message: 'Preferensi berhasil disimpan'
      };
    } catch (error) {
      console.error('❌ Error updating display preferences:', error);
      setError(error.message);
      
      setLoading(false);
      return { 
        success: false, 
        error: 'Gagal menyimpan preferensi',
        data: preferences
      };
    }
  };

  const resetToDefault = async () => {
    console.log('🔄 Resetting to default preferences');
    return await updatePreferences(defaultPreferences);
  };

  return (
    <DisplayContext.Provider
      value={{
        preferences,
        loading,
        error,
        updatePreferences,
        resetToDefault,
      }}
    >
      {children}
    </DisplayContext.Provider>
  );
};
