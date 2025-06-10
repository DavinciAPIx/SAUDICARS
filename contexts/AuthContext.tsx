import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, initializeAuthSystem } from '@/services/auth';
import { firebaseAuth } from '@/services/firebase';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: (phoneNumber: string) => Promise<boolean>;
  verifyOTP: (otp: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  uploadDriverLicense: (uri: string) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isInitialized: false,
  login: async () => false,
  verifyOTP: async () => false,
  register: async () => false,
  logout: async () => {},
  updateProfile: async () => false,
  uploadDriverLicense: async () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const isMountedRef = useRef(true);

  // Initialize auth system and check for existing user
  useEffect(() => {
    isMountedRef.current = true;
    
    const initialize = async () => {
      try {
        // Initialize Firebase Auth and other systems
        await initializeAuthSystem();
        
        // Check for existing user session
        const userJson = await AsyncStorage.getItem('user');
        if (userJson && isMountedRef.current) {
          const parsedUser = JSON.parse(userJson);
          setUser(parsedUser);
        }
        
        // Setup Firebase Auth state observer
        const unsubscribe = firebaseAuth.onAuthStateChanged((firebaseUser) => {
          if (firebaseUser && isMountedRef.current) {
            // User is signed in
            // You can update user data from firebase user object
          } else if (isMountedRef.current) {
            // User is signed out
            setUser(null);
            AsyncStorage.removeItem('user');
          }
        });
        
        if (isMountedRef.current) {
          setIsInitialized(true);
          setIsLoading(false);
        }
        
        // Clean up the subscription
        return () => unsubscribe();
      } catch (error) {
        console.error('Auth initialization failed:', error);
        if (isMountedRef.current) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };
    
    initialize();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const login = async (phoneNumber: string): Promise<boolean> => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      // In a real app, this would be where you'd initiate OTP verification
      // For demo purposes, we'll simulate this process
      console.log(`Sending OTP to ${phoneNumber}`);
      
      // Store phone number for verification step
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return true;
    } catch (error) {
      console.error('Login error:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return false;
    }
  };

  const verifyOTP = async (otp: string): Promise<boolean> => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      // In a real app, this would verify the OTP with Firebase or similar
      // For demo purposes, we'll simulate this process
      console.log(`Verifying OTP: ${otp}`);
      
      // Create a dummy user for demonstration
      const phoneNumber = await AsyncStorage.getItem('phoneNumber') || '';
      const mockUser: User = {
        id: 'user-1',
        phoneNumber,
        displayName: '',
        email: '',
        isVerified: false,
        created: new Date().toISOString(),
      };
      
      if (isMountedRef.current) {
        setUser(mockUser);
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        setIsLoading(false);
      }
      return true;
    } catch (error) {
      console.error('OTP verification error:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return false;
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      // In a real app, this would create a user profile
      // For demo purposes, we'll update our mock user
      const currentUser = user;
      if (currentUser && isMountedRef.current) {
        const updatedUser: User = {
          ...currentUser,
          ...userData,
          isVerified: true,
        };
        
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      
      // Sign out from Firebase
      await firebaseAuth.signOut();
      
      // Clear local storage
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('phoneNumber');
      
      if (isMountedRef.current) {
        setUser(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Logout error:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      
      if (user && isMountedRef.current) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return false;
    }
  };

  const uploadDriverLicense = async (uri: string): Promise<string | null> => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      // In a real app, this would upload the image to Firebase Storage
      // For demo purposes, we'll simulate this process
      console.log(`Uploading driver's license: ${uri}`);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDownloadUrl = 'https://example.com/license.jpg';
      
      if (user && isMountedRef.current) {
        const updatedUser = { 
          ...user, 
          driverLicense: mockDownloadUrl,
          isVerified: true
        };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return mockDownloadUrl;
    } catch (error) {
      console.error('License upload error:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return null;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isInitialized,
        login, 
        verifyOTP, 
        register, 
        logout,
        updateProfile,
        uploadDriverLicense
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);