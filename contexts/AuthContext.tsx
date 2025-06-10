import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, initializeAuthSystem, sendOTP, verifyOTP, createUserProfile, updateUserProfile, signOut, getCurrentSession, getCurrentUser } from '@/services/auth';
import { supabase } from '@/services/supabase';

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
        // Initialize Supabase Auth
        await initializeAuthSystem();
        
        // Check for existing session
        const session = await getCurrentSession();
        if (session?.user && isMountedRef.current) {
          // Get user profile from database - use maybeSingle() to handle cases where profile doesn't exist
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          
          // Create user data from session and profile (if exists)
          const userData: User = {
            id: session.user.id,
            phoneNumber: profile?.phone || session.user.phone || '',
            displayName: profile?.full_name || '',
            email: profile?.email || '',
            isVerified: profile?.is_verified || false,
            driverLicense: profile?.driver_license,
            nationalId: profile?.national_id,
            profileImage: profile?.avatar_url,
            created: profile?.created_at || session.user.created_at
          };
          
          setUser(userData);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        }
        
        // Setup Supabase Auth state observer
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user && isMountedRef.current) {
            // User signed in - get profile using maybeSingle()
            const { data: profile } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            // Create user data from session and profile (if exists)
            const userData: User = {
              id: session.user.id,
              phoneNumber: profile?.phone || session.user.phone || '',
              displayName: profile?.full_name || '',
              email: profile?.email || '',
              isVerified: profile?.is_verified || false,
              driverLicense: profile?.driver_license,
              nationalId: profile?.national_id,
              profileImage: profile?.avatar_url,
              created: profile?.created_at || session.user.created_at
            };
            
            setUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
          } else if (event === 'SIGNED_OUT' && isMountedRef.current) {
            // User signed out
            setUser(null);
            await AsyncStorage.removeItem('user');
          }
        });
        
        if (isMountedRef.current) {
          setIsInitialized(true);
          setIsLoading(false);
        }
        
        // Clean up the subscription
        return () => subscription.unsubscribe();
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
      
      const result = await sendOTP(phoneNumber);
      
      if (typeof result === 'string') {
        // OTP sent successfully
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        return true;
      } else {
        // Error occurred
        console.error('Login error:', result.message);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return false;
    }
  };

  const verifyOTPCode = async (otp: string): Promise<boolean> => {
    try {
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      
      const result = await verifyOTP(otp);
      
      if ('id' in result) {
        // Verification successful - the auth state change listener will handle user state update
        // But we also set it immediately to ensure it's available for registration
        if (isMountedRef.current) {
          setUser(result);
          await AsyncStorage.setItem('user', JSON.stringify(result));
          setIsLoading(false);
        }
        return true;
      } else {
        // Error occurred
        console.error('OTP verification error:', result.message);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        return false;
      }
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
      
      // First, try to get user from context
      let currentUser = user;
      let phoneNumber = '';
      
      // If no user in context, try to get from Supabase session
      if (!currentUser) {
        const supabaseUser = await getCurrentUser();
        if (!supabaseUser) {
          console.error('Registration error: No authenticated session found');
          if (isMountedRef.current) {
            setIsLoading(false);
          }
          return false;
        }
        
        // Get phone number from storage
        phoneNumber = await AsyncStorage.getItem('phoneNumber') || '';
        
        // Create temporary user object for registration
        currentUser = {
          id: supabaseUser.id,
          phoneNumber: supabaseUser.phone || phoneNumber,
          displayName: '',
          email: '',
          isVerified: false,
          created: supabaseUser.created_at
        };
      } else {
        phoneNumber = currentUser.phoneNumber;
      }
      
      // Create user profile in database
      const result = await createUserProfile(currentUser.id, phoneNumber, userData);
      
      if ('id' in result) {
        // Registration successful - update user state immediately
        if (isMountedRef.current) {
          setUser(result);
          await AsyncStorage.setItem('user', JSON.stringify(result));
          setIsLoading(false);
        }
        return true;
      } else {
        // Error occurred
        console.error('Registration error:', result.message);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        return false;
      }
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
      
      await signOut();
      
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
      if (!user) return false;
      
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      
      const result = await updateUserProfile(user.id, data);
      
      if ('id' in result) {
        // Update successful
        if (isMountedRef.current) {
          setUser(result);
          await AsyncStorage.setItem('user', JSON.stringify(result));
          setIsLoading(false);
        }
        return true;
      } else {
        // Error occurred
        console.error('Profile update error:', result.message);
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        return false;
      }
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
      if (!user) return null;
      
      if (isMountedRef.current) {
        setIsLoading(true);
      }
      
      // In a real app, this would upload the image to Supabase Storage
      // For demo purposes, we'll simulate this process
      console.log(`Uploading driver's license: ${uri}`);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDownloadUrl = 'https://example.com/license.jpg';
      
      // Update user profile with license URL
      const result = await updateUserProfile(user.id, { 
        driverLicense: mockDownloadUrl,
        isVerified: true
      });
      
      if ('id' in result && isMountedRef.current) {
        setUser(result);
        await AsyncStorage.setItem('user', JSON.stringify(result));
        setIsLoading(false);
        return mockDownloadUrl;
      }
      
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      return null;
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
        verifyOTP: verifyOTPCode, 
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

export { AuthProvider }