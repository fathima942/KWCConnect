import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile } from '@/types';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
const mapAuthError = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.';
    case 'auth/invalid-email':
      return 'The email address is invalid.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact the Commission.';
    default:
      return 'An unexpected authentication error occurred. Please try again.';
  }
};

/**
 * Helper to convert Firestore data to UserProfile.
 */
const mapToUserProfile = (data: any, uid: string): UserProfile => {
  return {
    uid,
    phoneNumber: data.phoneNumber || '',
    displayName: data.displayName,
    email: data.email,
    dob: data.dob,
    gender: data.gender,
    district: data.district,
    address: data.address,
    role: data.role || 'citizen',
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : (typeof data.createdAt === 'number' ? data.createdAt : Date.now()),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : (typeof data.updatedAt === 'number' ? data.updatedAt : Date.now()),
    isProfileComplete: !!data.isProfileComplete,
  };
};

/**
 * Authentication Service for KWC Connect.
 * Provides abstraction for Firebase Email/Password operations.
 */
class AuthService {
  /**
   * Observe authentication state changes
   */
  onAuthChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Sign up a new user with Email and Password
   */
  async signUp(email: string, password: string): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      console.error('AuthService: Error signing up', error);
      throw new Error(mapAuthError(error.code));
    }
  }

  /**
   * Sign in an existing user with Email and Password
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      console.error('AuthService: Error signing in', error);
      throw new Error(mapAuthError(error.code));
    }
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error: any) {
      console.error('AuthService: Error signing out', error);
      throw new Error(mapAuthError(error.code));
    }
  }

  /**
   * Get the current user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        return mapToUserProfile(userDoc.data(), uid);
      }
      return null;
    } catch (error: any) {
      console.error('AuthService: Error getting user profile', error.code, error.message);
      throw new Error('Failed to retrieve user profile.');
    }
  }

  /**
   * Create or update user profile in Firestore
   */
  async syncUserProfile(user: User, additionalData?: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const newProfileData = {
          uid: user.uid,
          phoneNumber: additionalData?.phoneNumber || '',
          displayName: additionalData?.displayName || '',
          email: user.email || additionalData?.email || '',
          dob: additionalData?.dob || '',
          gender: additionalData?.gender || '',
          district: additionalData?.district || '',
          address: additionalData?.address || '',
          role: 'citizen',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isProfileComplete: !!additionalData?.displayName,
        };

        await setDoc(userRef, newProfileData);

        return {
          ...newProfileData,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          role: 'citizen',
        };
      } else {
        const existingData = userDoc.data();
        const updateData = {
          ...additionalData,
          updatedAt: serverTimestamp(),
        };

        await setDoc(userRef, updateData, { merge: true });

        return mapToUserProfile({
          ...existingData,
          ...additionalData,
          updatedAt: Timestamp.now(),
        }, user.uid);
      }
    } catch (error: any) {
      console.error('AuthService: Error syncing user profile', error.code, error.message);
      throw new Error('Failed to synchronize user profile.');
    }
  }
}

export const authService = new AuthService();
