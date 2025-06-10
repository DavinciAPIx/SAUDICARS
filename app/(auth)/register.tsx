import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Switch
} from 'react-native';
import { router } from 'expo-router';
import { useI18n } from '@/contexts/I18nContext';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ChevronLeft, Camera } from 'lucide-react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { MaskedTextInput } from 'react-native-mask-text';

interface FormValues {
  fullName: string;
  email: string;
  nationalId: string;
}

export default function RegisterScreen() {
  const { t, isRTL } = useI18n();
  const { register, isLoading } = useAuth();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    nationalId: Yup.string().required('National ID is required').length(10, 'National ID must be 10 digits'),
  });

  const handleRegister = async (values: FormValues) => {
    if (!termsAccepted) {
      return;
    }
    
    const userData = {
      displayName: values.fullName,
      email: values.email,
      nationalId: values.nationalId,
    };
    
    const success = await register(userData);
    
    if (success) {
      router.push('/(auth)/scan-license');
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
            {t('auth.createAccount')}
          </Text>
        </View>

        <Formik
          initialValues={{ fullName: '', email: '', nationalId: '' }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={[
                  styles.inputLabel,
                  { 
                    color: colors.text,
                    fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
                  }
                ]}>
                  {t('auth.fullName')}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.card,
                      borderColor: errors.fullName && touched.fullName ? colors.error : colors.border,
                      color: colors.text,
                      fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                    }
                  ]}
                  placeholder={t('auth.fullName')}
                  placeholderTextColor={colors.textSecondary}
                  onChangeText={handleChange('fullName')}
                  onBlur={handleBlur('fullName')}
                  value={values.fullName}
                />
                {errors.fullName && touched.fullName && (
                  <Text style={[
                    styles.errorText,
                    { fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular' }
                  ]}>
                    {errors.fullName}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[
                  styles.inputLabel,
                  { 
                    color: colors.text,
                    fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
                  }
                ]}>
                  {t('auth.email')}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.card,
                      borderColor: errors.email && touched.email ? colors.error : colors.border,
                      color: colors.text,
                      fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                    }
                  ]}
                  placeholder={t('auth.email')}
                  placeholderTextColor={colors.textSecondary}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && touched.email && (
                  <Text style={[
                    styles.errorText,
                    { fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular' }
                  ]}>
                    {errors.email}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={[
                  styles.inputLabel,
                  { 
                    color: colors.text,
                    fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
                  }
                ]}>
                  {t('auth.nationalId')}
                </Text>
                <MaskedTextInput
                  mask="9999999999"
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.card,
                      borderColor: errors.nationalId && touched.nationalId ? colors.error : colors.border,
                      color: colors.text,
                      fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                    }
                  ]}
                  placeholder={t('auth.nationalId')}
                  placeholderTextColor={colors.textSecondary}
                  onChangeText={handleChange('nationalId')}
                  onBlur={handleBlur('nationalId')}
                  value={values.nationalId}
                  keyboardType="number-pad"
                />
                {errors.nationalId && touched.nationalId && (
                  <Text style={[
                    styles.errorText,
                    { fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular' }
                  ]}>
                    {errors.nationalId}
                  </Text>
                )}
              </View>

              <View style={styles.licenseSection}>
                <Text style={[
                  styles.inputLabel,
                  { 
                    color: colors.text,
                    fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium',
                    marginBottom: 12
                  }
                ]}>
                  {t('auth.driverLicense')}
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.licenseButton,
                    { backgroundColor: colors.card }
                  ]}
                  onPress={() => {}}
                >
                  <View style={styles.licenseIcon}>
                    <Camera size={24} color={colors.primary} />
                  </View>
                  <Text style={[
                    styles.licenseButtonText,
                    { 
                      color: colors.primary,
                      fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
                    }
                  ]}>
                    {t('auth.scanLicense')}
                  </Text>
                </TouchableOpacity>
                <Text style={[
                  styles.licenseHelp,
                  { 
                    color: colors.textSecondary,
                    fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                  }
                ]}>
                  We'll take you to this step next
                </Text>
              </View>

              <View style={styles.termsContainer}>
                <Switch
                  value={termsAccepted}
                  onValueChange={setTermsAccepted}
                  trackColor={{ false: colors.border, true: colors.primaryLight }}
                  thumbColor={termsAccepted ? colors.primary : colors.card}
                />
                <Text style={[
                  styles.termsText,
                  { 
                    color: colors.textSecondary,
                    fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
                  }
                ]}>
                  {t('auth.termsConditions')}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  { backgroundColor: colors.primary },
                  (isLoading || !termsAccepted) && styles.disabledButton
                ]}
                onPress={() => handleSubmit()}
                disabled={isLoading || !termsAccepted}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={[
                    styles.registerButtonText,
                    { fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold' }
                  ]}>
                    {t('common.next')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
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
  formContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 4,
  },
  licenseSection: {
    marginBottom: 20,
  },
  licenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  licenseIcon: {
    marginRight: 8,
  },
  licenseButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  licenseHelp: {
    fontSize: 14,
    textAlign: 'center',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  termsText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  registerButton: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});