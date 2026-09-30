/**
 * Application configuration for KWC Connect.
 * Centralizes non-sensitive metadata and prepares for future feature flags/API config.
 */

export const APP_CONFIG = {
  name: 'KWC Connect',
  version: '1.0.0',
  organization: 'Kerala Women\'s Commission',
  api: {
    // To be populated in future milestones
    baseUrl: process.env.EXPO_PUBLIC_API_URL || '',
    timeout: 10000,
  },
  firebase: {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
    appCheckTokenKey: process.env.EXPO_PUBLIC_FIREBASE_APP_CHECK_TOKEN_KEY || '',
  },
} as const;
