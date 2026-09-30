import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/services/auth';
import { UserProfile, AuthState } from '@/types/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, additionalData: Partial<UserProfile>) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  syncProfile: (firebaseUser: User, data?: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    isLoading: true,
    isInitialLoading: true,
    error: null,
  });

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = authService.onAuthChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in, fetch their Firestore profile
          const profile = await authService.getUserProfile(firebaseUser.uid);

          setState(prev => ({
            ...prev,
            firebaseUser,
            user: profile,
            isLoading: false,
            isInitialLoading: false,
            error: null,
          }));
        } else {
          // User is signed out
          setState({
            user: null,
            firebaseUser: null,
            isLoading: false,
            isInitialLoading: false,
            error: null,
          });
        }
      } catch (error: any) {
        console.error('AuthProvider: Error on auth change', error);
        setState(prev => ({
          ...prev,
          isLoading: false,
          isInitialLoading: false,
          error: error.message,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await authService.signIn(email, password);
      // Auth state listener handles fetching profile and state update
      return user;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, additionalData: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const firebaseUser = await authService.signUp(email, password);
      const profile = await authService.syncUserProfile(firebaseUser, additionalData);
      setState(prev => ({
        ...prev,
        user: profile,
        firebaseUser,
        isLoading: false,
        error: null
      }));
      return profile;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await authService.signOut();
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  };

  /**
   * Called by UI to ensure profile exists and contains provided data.
   */
  const syncProfile = async (firebaseUser: User, additionalData?: Partial<UserProfile>) => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const profile = await authService.syncUserProfile(firebaseUser, additionalData);
      setState(prev => ({
        ...prev,
        user: profile,
        firebaseUser,
        isLoading: false,
        error: null
      }));
      return profile;
    } catch (error: any) {
      setState(prev => ({ ...prev, isLoading: false, error: error.message }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, syncProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
