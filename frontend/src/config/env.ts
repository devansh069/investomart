const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

export const env = Object.freeze({
  appEnv: process.env.EXPO_PUBLIC_APP_ENV ?? 'local',
  apiBaseUrl: (process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, ''),
});
