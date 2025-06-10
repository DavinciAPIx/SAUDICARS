import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

export interface User {
  id: string;
  phoneNumber: string;
  displayName: string;
  email: string;
  isVerified: boolean;
  driverLicense?: string;
  nationalId?: string;
  profileImage?: string;
  created: string;
}

export type AuthError = {
  code: string;
  message: string;
};

/**
 * Initialize the authentication system
 */
export const initializeAuthSystem = async (): Promise<void> => {
  try {
    // Set up auth state listener
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
    });
    
    console.log('Supabase auth system initialized');
  } catch (error) {
    console.error('Error initializing auth system:', error);
  }
};

/**
 * Send OTP to a phone number
 */
export const sendOTP = async (phoneNumber: string): Promise<string | AuthError> => {
  try {
    // Format phone number for Saudi Arabia
    const formattedPhone = phoneNumber.startsWith('+966') 
      ? phoneNumber 
      : `+966${phoneNumber.replace(/^0/, '')}`;
    
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    
    if (error) {
      return {
        code: error.message,
        message: error.message
      };
    }
    
    // Store phone number for verification step
    await AsyncStorage.setItem('phoneNumber', phoneNumber);
    
    return 'otp-sent';
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    return {
      code: error.code || 'unknown',
      message: error.message || 'Failed to send OTP'
    };
  }
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (code: string): Promise<User | AuthError> => {
  try {
    const phoneNumber = await AsyncStorage.getItem('phoneNumber');
    if (!phoneNumber) {
      throw new Error('Phone number not found');
    }
    
    // Format phone number for Saudi Arabia
    const formattedPhone = phoneNumber.startsWith('+966') 
      ? phoneNumber 
      : `+966${phoneNumber.replace(/^0/, '')}`;
    
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: code,
      type: 'sms'
    });
    
    if (error) {
      return {
        code: error.message,
        message: error.message
      };
    }
    
    if (data.user) {
      // Check if user profile exists
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      const user: User = {
        id: data.user.id,
        phoneNumber: data.user.phone || phoneNumber,
        displayName: profile?.full_name || '',
        email: profile?.email || '',
        isVerified: profile?.is_verified || false,
        driverLicense: profile?.driver_license,
        nationalId: profile?.national_id,
        profileImage: profile?.avatar_url,
        created: data.user.created_at || new Date().toISOString()
      };
      
      return user;
    }
    
    throw new Error('Authentication failed');
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    return {
      code: error.code || 'unknown',
      message: error.message || 'Failed to verify OTP'
    };
  }
};

/**
 * Create a new user profile
 */
export const createUserProfile = async (userData: Partial<User>): Promise<User | AuthError> => {
  try {
    // Get the current session first
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    
    if (!user) {
      return {
        code: 'no_user',
        message: 'No authenticated user found. Please verify your phone number first.'
      };
    }
    
    // Insert or update user profile
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        phone: user.phone,
        full_name: userData.displayName,
        email: userData.email,
        national_id: userData.nationalId,
        driver_license: userData.driverLicense,
        is_verified: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      return {
        code: error.code || 'unknown',
        message: error.message || 'Failed to create user profile'
      };
    }
    
    const createdUser: User = {
      id: data.id,
      phoneNumber: data.phone || user.phone || '',
      displayName: data.full_name || '',
      email: data.email || '',
      nationalId: data.national_id,
      driverLicense: data.driver_license,
      isVerified: data.is_verified,
      profileImage: data.avatar_url,
      created: data.created_at || user.created_at
    };
    
    return createdUser;
  } catch (error: any) {
    console.error('Error creating user profile:', error);
    return {
      code: error.code || 'unknown',
      message: error.message || 'Failed to create user profile'
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<User | AuthError> => {
  try {
    const { data: updatedData, error } = await supabase
      .from('users')
      .update({
        full_name: data.displayName,
        email: data.email,
        national_id: data.nationalId,
        driver_license: data.driverLicense,
        avatar_url: data.profileImage,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      return {
        code: error.code || 'unknown',
        message: error.message || 'Failed to update user profile'
      };
    }
    
    const updatedUser: User = {
      id: updatedData.id,
      phoneNumber: updatedData.phone || '',
      displayName: updatedData.full_name || '',
      email: updatedData.email || '',
      nationalId: updatedData.national_id,
      driverLicense: updatedData.driver_license,
      isVerified: updatedData.is_verified,
      profileImage: updatedData.avatar_url,
      created: updatedData.created_at
    };
    
    return updatedUser;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return {
      code: error.code || 'unknown',
      message: error.message || 'Failed to update user profile'
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    // Clear local storage
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('phoneNumber');
    
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Get current session
 */
export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting current session:', error);
    return null;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<SupabaseUser | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};