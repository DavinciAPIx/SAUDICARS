import { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StatusBar 
} from 'react-native';
import { router } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import { useSelectedLanguage } from '@/contexts/SelectedLanguageContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function LanguageScreen() {
  const { t } = useI18n();
  const { selectedLanguage, setSelectedLanguage } = useSelectedLanguage();
  const [selected, setSelected] = useState(selectedLanguage || 'en');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleLanguageSelect = async (language: string) => {
    setSelected(language);
  };

  const handleContinue = async () => {
    await setSelectedLanguage(selected);
    router.push('/(auth)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/5874719/pexels-photo-5874719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>
      
      <Text style={[
        styles.title, 
        { 
          color: colors.text,
          fontFamily: 'Poppins-Bold'
        }
      ]}>
        {t('onboarding.chooseLanguage')}
      </Text>
      
      <View style={styles.languagesContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            selected === 'en' && { borderColor: colors.primary },
            { backgroundColor: colors.card }
          ]}
          onPress={() => handleLanguageSelect('en')}
        >
          <Text style={[
            styles.languageName,
            selected === 'en' && { color: colors.primary },
            { 
              color: selected === 'en' ? colors.primary : colors.text,
              fontFamily: 'Poppins-Medium'
            }
          ]}>
            {t('onboarding.english')}
          </Text>
          {selected === 'en' && (
            <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.languageButton,
            selected === 'ar' && { borderColor: colors.primary },
            { backgroundColor: colors.card }
          ]}
          onPress={() => handleLanguageSelect('ar')}
        >
          <Text style={[
            styles.languageName,
            selected === 'ar' && { color: colors.primary },
            { 
              color: selected === 'ar' ? colors.primary : colors.text,
              fontFamily: 'Cairo-Medium'
            }
          ]}>
            {t('onboarding.arabic')}
          </Text>
          {selected === 'ar' && (
            <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[styles.continueButton, { backgroundColor: colors.primary }]}
        onPress={handleContinue}
      >
        <Text style={[
          styles.continueButtonText, 
          { 
            fontFamily: selected === 'ar' ? 'Cairo-Bold' : 'Poppins-Bold' 
          }
        ]}>
          {t('common.next')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 40,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  languagesContainer: {
    width: '100%',
    marginBottom: 40,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageName: {
    fontSize: 18,
    fontWeight: '500',
  },
  selectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  continueButton: {
    width: '100%',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});