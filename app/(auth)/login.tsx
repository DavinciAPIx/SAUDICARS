import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import { MaskedTextInput } from 'react-native-mask-text';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const { t, isRTL } = useI18n();
  const { login, isLoading } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    // Format the phone number (remove mask characters)
    const formattedPhone = phoneNumber.replace(/\D/g, '');
    
    // Save phone for later use
    await AsyncStorage.setItem('phoneNumber', formattedPhone);
    
    // Attempt to login
    const success = await login(formattedPhone);
    
    if (success) {
      router.push('/(auth)/otp');
    } else {
      setError('Failed to send verification code. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background }
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={{ 
              uri: 'https://images.pexels.com/photos/5874719/pexels-photo-5874719.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
            }}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>
        
        <Text style={[
          styles.welcomeText,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
          }
        ]}>
          {t('auth.welcome')}
        </Text>
        
        <Text style={[
          styles.subtitle,
          { 
            color: colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          {t('auth.loginSubtitle')}
        </Text>

        <View style={styles.formContainer}>
          <Text style={[
            styles.inputLabel,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {t('auth.phoneNumber')}
          </Text>
          
          <View style={[
            styles.inputContainer,
            { backgroundColor: colors.card, borderColor: colors.border }
          ]}>
            <Text style={[
              styles.countryCode,
              { color: colors.text }
            ]}>
              +966
            </Text>
            <MaskedTextInput
              mask="5 9999 9999"
              placeholder={t('auth.phoneNumberPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
              style={[
                styles.input,
                { 
                  color: colors.text,
                  fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                }
              ]}
              value={phoneNumber}
              onChangeText={(text, rawText) => {
                setPhoneNumber(rawText);
                setError('');
              }}
            />
          </View>
          
          {error ? (
            <Text style={[
              styles.errorText,
              { fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular' }
            ]}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: colors.primary },
              isLoading && styles.disabledButton
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={[
                styles.loginButtonText,
                { fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold' }
              ]}>
                {t('auth.login')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={[
            styles.noAccountText,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            {t('auth.dontHaveAccount')}
          </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={[
              styles.registerText,
              { 
                color: colors.primary,
                fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
              }
            ]}>
              {t('auth.register')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 30,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 56,
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 16,
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 20,
  },
  noAccountText: {
    fontSize: 14,
    marginRight: 4,
  },
  registerText: {
    fontSize: 14,
    fontWeight: '600',
  },
});