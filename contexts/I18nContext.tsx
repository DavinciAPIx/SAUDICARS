import React, { createContext, useContext, useEffect } from 'react';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { en, ar } from '@/localization';
import { useSelectedLanguage } from './SelectedLanguageContext';
import { I18nManager, Platform } from 'react-native';

// Create the i18n instance
const i18n = new I18n({
  en,
  ar,
});

// Create a context to expose i18n functions to the app
type I18nContextType = {
  t: (scope: string, options?: object) => string;
  locale: string;
  isRTL: boolean;
};

const I18nContext = createContext<I18nContextType>({
  t: (scope: string) => scope,
  locale: 'en',
  isRTL: false,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { selectedLanguage } = useSelectedLanguage();

  // Set the locale based on user selection or device locale
  useEffect(() => {
    const locale = selectedLanguage || Localization.locale.split('-')[0] || 'en';
    
    // Ensure the locale is either 'en' or 'ar'
    const normalizedLocale = locale.startsWith('ar') ? 'ar' : 'en';
    
    i18n.locale = normalizedLocale;
    const isRTL = normalizedLocale === 'ar';
    
    // Configure RTL for the app
    if (Platform.OS !== 'web') {
      I18nManager.forceRTL(isRTL);
    }
  }, [selectedLanguage]);

  // Default to the device locale if no selection
  i18n.defaultLocale = 'en';
  i18n.enableFallback = true;

  // Create a wrapper function for translation
  const t = (scope: string, options?: object) => {
    return i18n.t(scope, options);
  };

  const value = {
    t,
    locale: i18n.locale,
    isRTL: i18n.locale === 'ar',
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

// Custom hook to use the i18n context
export const useI18n = () => useContext(I18nContext);