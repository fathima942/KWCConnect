import { User } from 'firebase/auth';

/**
 * Authentication and User Role types for KWC Connect.
 */

export type UserRole = 'citizen' | 'officer' | 'admin' | 'akshaya_worker';

export interface UserProfile {
  uid: string;
  phoneNumber: string;
  displayName?: string;
  email?: string;
  dob?: string;
  gender?: string;
  district?: string;
  address?: string;
  role: UserRole;
  createdAt: number; // Unix timestamp (ms)
  updatedAt: number; // Unix timestamp (ms)
  isProfileComplete: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  firebaseUser: User | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  error: string | null;
}

export type PhoneVerificationResult = {
  verificationId: string;
  error?: string;
};
