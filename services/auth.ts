import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseAuth } from './firebase';

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
  // Any setup code for Firebase Auth or other systems
  console.log('Auth system initialized');
};

/**
 * Send OTP to a phone number
 */
export const sendOTP = async (phoneNumber: string): Promise<string | AuthError> => {
  try {
    // In a real app, this would use Firebase Phone Auth
    // For demo, we'll simulate the process
    console.log(`Sending OTP to ${phoneNumber}`);
    
    // Simulate OTP verification ID
    const verificationId = 'mock-verification-id';
    
    // Store verification ID for later use
    await AsyncStorage.setItem('verificationId', verificationId);
    
    return verificationId;
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
    // In a real app, this would verify with Firebase
    // For demo, we'll simulate the process
    console.log(`Verifying OTP: ${code}`);
    
    // Get the verification ID
    const verificationId = await AsyncStorage.getItem('verificationId');
    
    if (!verificationId) {
      throw new Error('Verification session expired');
    }
    
    // Simulate user
    const mockUser: User = {
      id: 'user-1',
      phoneNumber: await AsyncStorage.getItem('phoneNumber') || '',
      displayName: '',
      email: '',
      isVerified: false,
      created: new Date().toISOString()
    };
    
    return mockUser;
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
    // In a real app, this would create a Firestore document
    // For demo, we'll simulate the process
    console.log('Creating user profile:', userData);
    
    // Create a mock user
    const mockUser: User = {
      id: 'user-1',
      phoneNumber: userData.phoneNumber || '',
      displayName: userData.displayName || '',
      email: userData.email || '',
      nationalId: userData.nationalId,
      driverLicense: userData.driverLicense,
      isVerified: true,
      created: new Date().toISOString()
    };
    
    // Save to AsyncStorage for demo purposes
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    
    return mockUser;
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
    // In a real app, this would update Firestore
    // For demo, we'll simulate the process
    console.log(`Updating user ${userId} profile:`, data);
    
    // Get current user data
    const userJson = await AsyncStorage.getItem('user');
    if (!userJson) {
      throw new Error('User not found');
    }
    
    const currentUser: User = JSON.parse(userJson);
    const updatedUser = { ...currentUser, ...data };
    
    // Save updated user data
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    
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
    // Sign out from Firebase
    await firebaseAuth.signOut();
    
    // Clear local storage
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('verificationId');
    await AsyncStorage.removeItem('phoneNumber');
    
    console.log('User signed out');
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};