import { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft } from 'lucide-react-native';

export default function OTPScreen() {
  const { t, isRTL } = useI18n();
  const { user, verifyOTP, isLoading } = useAuth();
  const [otp, setOTP] = useState(['', '', '', '']);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timer, setTimer] = useState(60);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const isMountedRef = useRef(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  useEffect(() => {
    isMountedRef.current = true;
    
    // Load phone number
    AsyncStorage.getItem('phoneNumber').then(number => {
      if (number && isMountedRef.current) {
        // Format the phone number for display
        const formattedNumber = number.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3');
        setPhoneNumber(formattedNumber);
      }
    });

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Watch for user state changes after OTP verification
  useEffect(() => {
    if (user && isMountedRef.current) {
      // User is now authenticated, check if profile is complete
      if (user.isVerified && user.displayName) {
        router.replace('/(tabs)');
      } else {
        router.push('/(auth)/register');
      }
    }
  }, [user]);

  const focusNextInput = (index: number) => {
    if (index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const focusPrevInput = (index: number) => {
    if (index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOTPChange = (text: string, index: number) => {
    if (text.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = text;
      if (isMountedRef.current) {
        setOTP(newOTP);
        setError('');
      }

      if (text.length === 1) {
        focusNextInput(index);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index]) {
      focusPrevInput(index);
    }
  };

  const handleResendOTP = () => {
    if (timer === 0) {
      if (isMountedRef.current) {
        setIsResending(true);
      }
      // Simulate OTP resend
      setTimeout(() => {
        if (isMountedRef.current) {
          setTimer(60);
          setIsResending(false);
        }
      }, 1500);
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 4) {
      if (isMountedRef.current) {
        setError('Please enter a valid OTP');
      }
      return;
    }

    const success = await verifyOTP(otpValue);
    
    if (!success && isMountedRef.current) {
      setError('Invalid OTP. Please try again.');
    }
    // Navigation will be handled by the useEffect watching user state
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
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[
            styles.headerTitle,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
            }
          ]}>
            {t('auth.enterOTP')}
          </Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={[
            styles.subtitle,
            { 
              color: colors.textSecondary,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            {t('auth.otpSent')}
          </Text>
          
          <Text style={[
            styles.phoneNumber,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            +966 {phoneNumber}
          </Text>

          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  { 
                    color: colors.text,
                    backgroundColor: colors.card,
                    borderColor: otp[index] ? colors.primary : colors.border
                  }
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={otp[index]}
                onChangeText={(text) => handleOTPChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectionColor={colors.primary}
              />
            ))}
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
              styles.resendContainer,
              timer > 0 && styles.resendDisabled
            ]}
            onPress={handleResendOTP}
            disabled={timer > 0 || isResending}
          >
            {isResending ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Text style={[
                  styles.resendText,
                  { 
                    color: timer > 0 ? colors.textSecondary : colors.primary,
                    fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
                  }
                ]}>
                  {t('auth.resendOTP')}
                </Text>
                {timer > 0 && (
                  <Text style={[
                    styles.timerText,
                    { 
                      color: colors.textSecondary,
                      fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                    }
                  ]}>
                    ({timer} {t('auth.seconds')})
                  </Text>
                )}
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              { backgroundColor: colors.primary },
              isLoading && styles.disabledButton
            ]}
            onPress={handleVerifyOTP}
            disabled={isLoading || otp.join('').length !== 4}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={[
                styles.verifyButtonText,
                { fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold' }
              ]}>
                {t('auth.confirmOTP')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  phoneNumber: {
    fontSize: 18,
    marginBottom: 40,
    fontWeight: '500',
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 30,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    marginBottom: 20,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  resendDisabled: {
    opacity: 0.6,
  },
  resendText: {
    fontSize: 16,
    marginRight: 4,
  },
  timerText: {
    fontSize: 14,
  },
  verifyButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    width: '100%',
    maxWidth: 400,
  },
  disabledButton: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});