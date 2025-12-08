// src/contexts/DisplayContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { displayAPI } from '../services/api-service';

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
    theme: 'light',
    language: 'id',
    fontSize: 'medium',
    sidebarVisible: true,
  };

  // Load from localStorage first
  const [preferences, setPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem('displayPreferences');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading display preferences:', error);
    }
    return defaultPreferences;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Apply theme and font size on initial load
  useEffect(() => {
    if (!initialized) {
      applyTheme(preferences.theme);
      applyFontSize(preferences.fontSize);
      setInitialized(true);
    }
  }, [preferences.theme, preferences.fontSize, initialized]);

  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('dark', 'light');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.add('light');
    } else if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const applyFontSize = (fontSize) => {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    document.documentElement.style.fontSize = sizes[fontSize] || '16px';
  };

  const updatePreferences = async (newPreferences) => {
    setLoading(true);
    setError(null);
    
    try {
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
      
      // Try to save to backend (non-blocking)
      try {
        await displayAPI.updatePreferences(newPreferences);
      } catch (backendError) {
        console.warn('Failed to save to backend:', backendError.message);
        // Continue anyway since localStorage is saved
      }
      
      setLoading(false);
      return { 
        success: true, 
        data: newPreferences,
        message: 'Preferensi berhasil disimpan'
      };
    } catch (error) {
      console.error('Error updating display preferences:', error);
      setError(error.message);
      
      setLoading(false);
      return { 
        success: false, 
        error: 'Gagal menyimpan preferensi',
        data: preferences // Return old preferences
      };
    }
  };

  const resetToDefault = async () => {
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