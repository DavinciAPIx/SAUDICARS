import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SelectedLanguageContextType = {
  selectedLanguage: string | null;
  setSelectedLanguage: (language: string) => Promise<void>;
};

const SelectedLanguageContext = createContext<SelectedLanguageContextType>({
  selectedLanguage: null,
  setSelectedLanguage: async () => {},
});

export const SelectedLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // Load the saved language preference on app start
  useEffect(() => {
    isMountedRef.current = true;
    
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('userLanguage');
        if (savedLanguage && isMountedRef.current) {
          setSelectedLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error('Failed to load language preference:', error);
      }
    };

    loadLanguage();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Save the language preference when it changes
  const setSelectedLanguage = async (language: string) => {
    try {
      await AsyncStorage.setItem('userLanguage', language);
      if (isMountedRef.current) {
        setSelectedLanguageState(language);
      }
    } catch (error) {
      console.error('Failed to save language preference:', error);
    }
  };

  return (
    <SelectedLanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </SelectedLanguageContext.Provider>
  );
};

export const useSelectedLanguage = () => useContext(SelectedLanguageContext);