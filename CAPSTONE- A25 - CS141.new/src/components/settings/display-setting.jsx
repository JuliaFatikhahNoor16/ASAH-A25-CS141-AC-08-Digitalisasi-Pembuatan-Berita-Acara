import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Moon, Sun, Globe, Save, Palette, Layout } from 'lucide-react';

const DisplaySetting = () => {
  const { t, i18n } = useTranslation();
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'id',
    fontSize: 'medium',
    sidebarCollapsed: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [hasChanges, setHasChanges] = useState(false);

  // Theme options
  const themeOptions = [
    {
      id: 'light',
      name: t('displaySettings.theme.light'),
      description: t('displaySettings.theme.lightDescription'),
      icon: Sun,
    },
    {
      id: 'dark',
      name: t('displaySettings.theme.dark'),
      description: t('displaySettings.theme.darkDescription'),
      icon: Moon,
    },
    {
      id: 'system',
      name: t('displaySettings.theme.system'),
      description: t('displaySettings.theme.systemDescription'),
      icon: Monitor,
    }
  ];

  // Language options
  const languageOptions = [
    {
      id: 'id',
      name: t('displaySettings.language.indonesian'),
      description: t('displaySettings.language.indonesianDescription'),
      flag: '🇮🇩'
    },
    {
      id: 'en',
      name: t('displaySettings.language.english'),
      description: t('displaySettings.language.englishDescription'),
      flag: '🇺🇸'
    }
  ];

  // Font size options
  const fontSizeOptions = [
    {
      id: 'small',
      name: t('displaySettings.fontSize.small'),
      description: t('displaySettings.fontSize.smallDescription'),
      size: 'text-small'
    },
    {
      id: 'medium',
      name: t('displaySettings.fontSize.medium'),
      description: t('displaySettings.fontSize.mediumDescription'),
      size: 'text-medium'
    },
    {
      id: 'large',
      name: t('displaySettings.fontSize.large'),
      description: t('displaySettings.fontSize.largeDescription'),
      size: 'text-large'
    }
  ];

  // OptionCard Component
  const OptionCard = ({ option, currentValue, onChange, type = 'theme' }) => {
    const isSelected = currentValue === option.id;
    const Icon = option.icon;
    
    return (
      <button
        onClick={() => onChange(option.id)}
        className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:border-blue-300 ${
          isSelected
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
        }`}
      >
        <div className="flex items-start gap-3">
          {type === 'theme' && Icon && (
            <div className={`p-2 rounded-lg ${
              isSelected ? 'bg-blue-100 text-blue-600 dark:bg-blue-800' : 'bg-gray-100 text-gray-600 dark:bg-gray-700'
            }`}>
              <Icon size={20} />
            </div>
          )}
          
          {type === 'language' && (
            <span className="text-2xl">{option.flag}</span>
          )}
          
          {type === 'fontSize' && (
            <div className={`p-2 rounded-lg ${
              isSelected ? 'bg-blue-100 text-blue-600 dark:bg-blue-800' : 'bg-gray-100 text-gray-600 dark:bg-gray-700'
            }`}>
              <Palette size={20} />
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-semibold ${
                isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-gray-100'
              }`}>
                {option.name}
              </span>
              {isSelected && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <p className={`text-sm ${
              isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {option.description}
            </p>
          </div>
        </div>
      </button>
    );
  };

  // Load preferences on component mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = () => {
    try {
      setIsLoading(true);
      console.log('📂 Loading preferences...');
      
      // Get from localStorage
      const saved = localStorage.getItem('digiba-display-preferences');
      
      if (saved) {
        const savedPrefs = JSON.parse(saved);
        console.log('📁 Found saved preferences:', savedPrefs);
        
        // Validate and set preferences
        const validatedPrefs = {
          theme: ['light', 'dark', 'system'].includes(savedPrefs.theme) 
            ? savedPrefs.theme 
            : 'light',
          language: ['id', 'en'].includes(savedPrefs.language) 
            ? savedPrefs.language 
            : 'id',
          fontSize: ['small', 'medium', 'large'].includes(savedPrefs.fontSize) 
            ? savedPrefs.fontSize 
            : 'medium',
          sidebarCollapsed: typeof savedPrefs.sidebarCollapsed === 'boolean' 
            ? savedPrefs.sidebarCollapsed 
            : false
        };
        
        setPreferences(validatedPrefs);
        console.log('✅ Set preferences to:', validatedPrefs);
        
      } else {
        console.log('📭 No saved preferences, using defaults');
        // Default sudah di state
      }
      
    } catch (error) {
      console.error('❌ Error loading preferences:', error);
      setMessage({
        type: 'error',
        text: t('displaySettings.messages.loadError')
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = (theme) => {
    console.log('🎨 Applying theme:', theme);
    
    // Validate theme
    let themeToApply = theme;
    if (!['light', 'dark', 'system'].includes(theme)) {
      console.warn('Invalid theme, defaulting to light');
      themeToApply = 'light';
    }
    
    // Handle system theme
    if (themeToApply === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      themeToApply = prefersDark ? 'dark' : 'light';
      console.log('🖥️ System theme resolved to:', themeToApply);
    }
    
    // Apply to DOM
    const html = document.documentElement;
    const body = document.body;
    
    if (themeToApply === 'dark') {
      html.classList.add('theme-dark');
      body.classList.add('theme-dark');
      console.log('🌙 Added theme-dark class');
    } else {
      html.classList.remove('theme-dark');
      body.classList.remove('theme-dark');
      console.log('☀️ Removed theme-dark class');
    }
    
    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeToApply === 'dark' ? '#111827' : '#ffffff');
    }
    
    // Update state with original theme (not applied theme)
    setPreferences(prev => ({ ...prev, theme }));
  };

  const applyFontSize = (fontSize) => {
    const html = document.documentElement;
    
    // Validate
    const validFontSize = ['small', 'medium', 'large'].includes(fontSize) 
      ? fontSize 
      : 'medium';
    
    // Remove all font size classes
    html.classList.remove('text-small', 'text-medium', 'text-large');
    
    // Add selected font size
    html.classList.add(`text-${validFontSize}`);
    
    console.log('🔤 Applied font size:', validFontSize);
  };

  const applyLanguage = async (language) => {
    try {
      // Validate
      const validLanguage = ['id', 'en'].includes(language) ? language : 'id';
      
      // Change language
      await i18n.changeLanguage(validLanguage);
      
      // Update html lang attribute
      document.documentElement.lang = validLanguage;
      
      console.log('🌍 Applied language:', validLanguage);
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const handlePreferenceChange = (key, value) => {
    console.log(`🔄 Changing ${key} to:`, value);
    
    setPreferences(prev => {
      const newPrefs = { ...prev, [key]: value };
      
      // Apply changes immediately
      if (key === 'theme') applyTheme(value);
      if (key === 'fontSize') applyFontSize(value);
      if (key === 'language') applyLanguage(value);
      
      return newPrefs;
    });
    
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    try {
      console.log('💾 Saving preferences...');
      
      // Validate data
      const validatedPreferences = {
        theme: ['light', 'dark', 'system'].includes(preferences.theme) 
          ? preferences.theme 
          : 'light',
        language: ['id', 'en'].includes(preferences.language) 
          ? preferences.language 
          : 'id',
        fontSize: ['small', 'medium', 'large'].includes(preferences.fontSize) 
          ? preferences.fontSize 
          : 'medium',
        sidebarCollapsed: typeof preferences.sidebarCollapsed === 'boolean' 
          ? preferences.sidebarCollapsed 
          : false
      };
      
      // Save to localStorage
      localStorage.setItem('digiba-display-preferences', JSON.stringify(validatedPreferences));
      console.log('✅ Saved to localStorage:', validatedPreferences);
      
      // Apply theme one more time to ensure consistency
      applyTheme(validatedPreferences.theme);
      
      // Show success message
      setMessage({
        type: 'success',
        text: t('displaySettings.messages.saveSuccess')
      });
      setHasChanges(false);
      
      // Dispatch event for other components
      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: validatedPreferences.theme
      }));
      
    } catch (error) {
      console.error('❌ Error saving:', error);
      setMessage({
        type: 'error',
        text: t('displaySettings.messages.saveError')
      });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleReset = () => {
    console.log('🔄 Resetting to defaults');
    
    const defaultPreferences = {
      theme: 'light',
      language: 'id',
      fontSize: 'medium',
      sidebarCollapsed: false
    };
    
    setPreferences(defaultPreferences);
    setHasChanges(true);
    
    // Apply defaults
    applyTheme('light');
    applyFontSize('medium');
    applyLanguage('id');
    
    setMessage({
      type: 'info',
      text: t('displaySettings.messages.resetSuccess')
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('displaySettings.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {t('displaySettings.subtitle')}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            {t('displaySettings.buttons.reset')}
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSaving ? t('displaySettings.buttons.saving') : t('displaySettings.buttons.save')}
          </button>
        </div>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
            : message.type === 'error'
            ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
            : 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-8">
        {/* Theme Selection */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-blue-600 dark:text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('displaySettings.sections.theme')}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('displaySettings.sections.themeDescription')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((theme) => (
              <OptionCard
                key={theme.id}
                option={theme}
                currentValue={preferences.theme}
                onChange={(value) => handlePreferenceChange('theme', value)}
                type="theme"
              />
            ))}
          </div>
          
          {/* Debug Panel */}
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Theme Status
            </h4>
            <div className="text-sm space-y-1">
              <p>Selected: <strong>{preferences.theme}</strong></p>
              <p>Applied: <strong>
                {document.documentElement.classList.contains('theme-dark') ? 'Dark' : 'Light'}
              </strong></p>
              <p>LocalStorage: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                {localStorage.getItem('digiba-display-preferences') ? 'Saved' : 'Empty'}
              </code></p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    localStorage.removeItem('digiba-display-preferences');
                    window.location.reload();
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 text-xs rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                >
                  Clear & Reload
                </button>
                <button
                  onClick={() => console.log('Current theme state:', {
                    preferences,
                    htmlClass: document.documentElement.classList.toString(),
                    localStorage: localStorage.getItem('digiba-display-preferences')
                  })}
                  className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800"
                >
                  Log State
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Language Selection */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Globe className="text-blue-600 dark:text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('displaySettings.sections.language')}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('displaySettings.sections.languageDescription')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            {languageOptions.map((language) => (
              <OptionCard
                key={language.id}
                option={language}
                currentValue={preferences.language}
                onChange={(value) => handlePreferenceChange('language', value)}
                type="language"
              />
            ))}
          </div>
        </section>

        {/* Font Size Selection */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-blue-600 dark:text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('displaySettings.sections.fontSize')}
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('displaySettings.sections.fontSizeDescription')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl">
            {fontSizeOptions.map((size) => (
              <OptionCard
                key={size.id}
                option={size}
                currentValue={preferences.fontSize}
                onChange={(value) => handlePreferenceChange('fontSize', value)}
                type="fontSize"
              />
            ))}
          </div>
        </section>

        {/* Additional Settings */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <Layout className="text-blue-600 dark:text-blue-400" size={24} />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('displaySettings.sections.otherSettings')}
            </h3>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {t('displaySettings.other.hideSidebar')}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('displaySettings.other.hideSidebarDescription')}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.sidebarCollapsed}
                  onChange={(e) => handlePreferenceChange('sidebarCollapsed', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* Preview Section */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          {t('displaySettings.preview.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
            <div className={`font-semibold ${fontSizeOptions.find(f => f.id === preferences.fontSize)?.size}`}>
              {t('displaySettings.preview.cardTitle')}
            </div>
            <p className={`text-gray-600 dark:text-gray-400 ${
              preferences.fontSize === 'small' ? 'text-xs' : 
              preferences.fontSize === 'large' ? 'text-base' : 'text-sm'
            }`}>
              {t('displaySettings.preview.cardDescription')}
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                {t('displaySettings.preview.buttonPrimary')}
              </button>
              <button className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm">
                {t('displaySettings.preview.buttonSecondary')}
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-2">{t('displaySettings.preview.currentSettings')}</p>
            <ul className="space-y-1">
              <li>• {t('displaySettings.preview.theme')}: {themeOptions.find(t => t.id === preferences.theme)?.name}</li>
              <li>• {t('displaySettings.preview.language')}: {languageOptions.find(l => l.id === preferences.language)?.name}</li>
              <li>• {t('displaySettings.preview.fontSize')}: {fontSizeOptions.find(f => f.id === preferences.fontSize)?.name}</li>
              <li>• {t('displaySettings.preview.sidebar')}: {preferences.sidebarCollapsed ? t('displaySettings.preview.hidden') : t('displaySettings.preview.visible')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySetting;