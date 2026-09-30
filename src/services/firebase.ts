import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  Auth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, CustomProvider } from 'firebase/app-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { APP_CONFIG } from '@/config';

/**
 * Initialize Firebase
 */
const firebaseConfig = {
  apiKey: APP_CONFIG.firebase.apiKey,
  authDomain: APP_CONFIG.firebase.authDomain,
  projectId: APP_CONFIG.firebase.projectId,
  storageBucket: APP_CONFIG.firebase.storageBucket,
  messagingSenderId: APP_CONFIG.firebase.messagingSenderId,
  appId: APP_CONFIG.firebase.appId,
  measurementId: APP_CONFIG.firebase.measurementId,
};

/**
 * Initialize Firebase
 */
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * Initialize Auth with Persistence
 */
let auth: Auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  // Firebase's React Native bundle provides this function at runtime.
  // Firebase 12.x typings may not expose it through the generic
  // firebase/auth TypeScript entry point.
  const { getReactNativePersistence } = require('firebase/auth');

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

/**
 * Initialize Firestore
 */
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

// Initialize with settings to help debug/resolve connectivity issues
const db = initializeFirestore(app, {
  // Use persistent cache if possible on native
  localCache: Platform.OS === 'web' ? undefined : persistentLocalCache(),
});

// Diagnostic Logging
console.log('Firebase: Initialized App Name:', app.name);
console.log('Firebase: Project ID:', app.options.projectId);
if (Platform.OS === 'web') {
  console.log('Firebase: Web Environment detected');
}

/**
 * Diagnostic Test: Verify Firestore Connectivity
 * This is for debugging the "client is offline" issue.
 */
export const testFirestoreConnection = async () => {
  if (Platform.OS !== 'web') return;

  try {
    console.log('Firestore: Starting connectivity test...');
    const { doc, setDoc, getDoc, enableNetwork } = await import('firebase/firestore');

    // Explicitly ensure network is enabled
    await enableNetwork(db);
    console.log('Firestore: Network explicitly enabled');

    const testRef = doc(db, '_connection_test', 'status');
    console.log('Firestore: Attempting write to _connection_test/status');

    await setDoc(testRef, {
      lastAttempt: Date.now(),
      platform: Platform.OS,
      environment: 'web'
    });

    console.log('Firestore: Write successful. Attempting read...');
    const snap = await getDoc(testRef);

    if (snap.exists()) {
      console.log('Firestore: Read successful. Connection verified.', snap.data());
      return true;
    } else {
      console.warn('Firestore: Write succeeded but read returned empty. Rule issue?');
      return false;
    }
  } catch (error: any) {
    console.error('Firestore: Connectivity test FAILED', {
      code: error.code,
      message: error.message,
      name: error.name
    });
    return false;
  }
};

/**
 * Initialize App Check
 *
 * Web: Uses ReCaptcha Enterprise.
 * Native: Requires further native configuration and Play Integrity/Device Check integration.
 * In development: Uses debug tokens.
 */
const initAppCheck = () => {
  if (!APP_CONFIG.firebase.appCheckTokenKey) return;

  // Expo Web can evaluate modules before browser globals exist.
  // Do not initialize browser-only App Check during SSR/build evaluation.
  if (Platform.OS === 'web' && typeof document === 'undefined') {
    return;
  }

  if (Platform.OS === 'web') {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(APP_CONFIG.firebase.appCheckTokenKey),
      isTokenAutoRefreshEnabled: true,
    });
  } else {
    /**
     * For Native Android/iOS:
     * App Check integration for Native Expo requires 'expo-firebase-app-check' (not yet standard in JS SDK initialization)
     * or a CustomProvider for custom attestation.
     *
     * IMPORTANT: Secure production implementation for native requires linking native SDKs.
     * For this phase, we establish the architecture.
     */
    const provider = new CustomProvider({
      getToken: () => {
        // Placeholder for native attestation token
        return Promise.reject('Native App Check provider requires further configuration.');
      }
    });

    initializeAppCheck(app, {
      provider,
      isTokenAutoRefreshEnabled: true,
    });
  }
};

initAppCheck();

export { app, auth, db };
