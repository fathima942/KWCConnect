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
    baseUrl: '',
    timeout: 10000,
  },
  firebase: {
    // To be populated in future milestones
    enabled: false,
  },
} as const;
