import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useI18n } from '@/contexts/I18nContext';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useSelectedLanguage } from '@/contexts/SelectedLanguageContext';
import { useState } from 'react';
import { router } from 'expo-router';
import { User, Car, CalendarCheck, MessageSquare, CreditCard, Settings, CircleHelp as HelpCircle, ChevronRight, Globe, Bell, Moon } from 'lucide-react-native'-react-native';

export default function ProfileScreen() {
  const { t, isRTL, locale } = useI18n();
  const { selectedLanguage, setSelectedLanguage } = useSelectedLanguage();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme];
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const [notifications, setNotifications] = useState(true);
  
  const handleLanguageToggle = async () => {
    const newLanguage = locale === 'ar' ? 'en' : 'ar';
    await setSelectedLanguage(newLanguage);
  };

  const MenuOption = ({ 
    icon, 
    title, 
    onPress,
    showToggle = false,
    toggleValue = false,
    onToggle,
  }: { 
    icon: JSX.Element, 
    title: string, 
    onPress?: () => void,
    showToggle?: boolean,
    toggleValue?: boolean,
    onToggle?: (value: boolean) => void,
  }) => (
    <TouchableOpacity 
      style={[styles.menuOption, { borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={showToggle}
    >
      <View style={styles.menuOptionLeft}>
        {icon}
        <Text style={[
          styles.menuOptionText,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          {title}
        </Text>
      </View>
      {showToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={toggleValue ? colors.primary : colors.card}
        />
      ) : (
        <ChevronRight size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[
          styles.title,
          { 
            color: colors.text,
            fontFamily: isRTL ? 'Cairo-Bold' : 'Poppins-Bold'
          }
        ]}>
          {t('profile.title')}
        </Text>
      </View>
      
      <View style={styles.profileSection}>
        <Image
          source={{ 
            uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={[
            styles.profileName,
            { 
              color: colors.text,
              fontFamily: isRTL ? 'Cairo-SemiBold' : 'Poppins-SemiBold'
            }
          ]}>
            {'User Name'}
          </Text>
          <Text style={[
            styles.profileVerified,
            { 
              color: colors.success,
              fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
            }
          ]}>
            {t('carDetails.verifiedUser')}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.editButton, { borderColor: colors.border }]}
          onPress={() => router.push('/edit-profile')}
        >
          <Text style={[
            styles.editButtonText,
            { 
              color: colors.primary,
              fontFamily: isRTL ? 'Cairo-Medium' : 'Poppins-Medium'
            }
          ]}>
            {t('profile.editProfile')}
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        <MenuOption 
          icon={<User size={20} color={colors.primary} />}
          title={t('profile.personalInfo')}
          onPress={() => router.push('/personal-info')}
        />
        <MenuOption 
          icon={<Car size={20} color={colors.primary} />}
          title={t('profile.myListings')}
          onPress={() => router.push('/(tabs)/listings')}
        />
        <MenuOption 
          icon={<CalendarCheck size={20} color={colors.primary} />}
          title={t('profile.myBookings')}
          onPress={() => router.push('/bookings')}
        />
        <MenuOption 
          icon={<MessageSquare size={20} color={colors.primary} />}
          title={t('profile.inbox')}
          onPress={() => router.push('/(tabs)/messages')}
        />
        <MenuOption 
          icon={<CreditCard size={20} color={colors.primary} />}
          title={t('profile.paymentMethods')}
          onPress={() => router.push('/payment-methods')}
        />
      </View>
      
      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        <MenuOption 
          icon={<Globe size={20} color={colors.secondary} />}
          title={t('profile.language')}
          onPress={handleLanguageToggle}
        />
        <Text style={[
          styles.languageValue,
          { 
            color: colors.textSecondary,
            fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
          }
        ]}>
          {locale === 'ar' ? 'العربية' : 'English'}
        </Text>
        <MenuOption 
          icon={<Bell size={20} color={colors.secondary} />}
          title={t('profile.notifications')}
          showToggle
          toggleValue={notifications}
          onToggle={setNotifications}
        />
        <MenuOption 
          icon={<Moon size={20} color={colors.secondary} />}
          title={t('profile.darkMode')}
          showToggle
          toggleValue={darkMode}
          onToggle={setDarkMode}
        />
      </View>
      
      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        <MenuOption 
          icon={<CircleHelp size={20} color={colors.accent} />}
          title={t('profile.help')}
          onPress={() => router.push('/help')}
        />
        <MenuOption 
          icon={<Settings size={20} color={colors.accent} />}
          title={t('profile.settings')}
          onPress={() => router.push('/settings')}
        />
      </View>
      
      <Text style={[
        styles.version,
        { 
          color: colors.textSecondary,
          fontFamily: isRTL ? 'Cairo-Regular' : 'Poppins-Regular'
        }
      ]}>
        {t('profile.version')} 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileVerified: {
    fontSize: 14,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  menuSection: {
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 12,
    overflow: 'hidden',
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuOptionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  languageValue: {
    fontSize: 12,
    position: 'absolute',
    right: 40,
    top: 19,
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 20,
  },
});