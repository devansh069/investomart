import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'investormart.session.v1';

export interface StoredSession {
  accessToken: string;
  account: {
    id: string;
    phone: string;
    name?: string | null;
    email?: string | null;
    role: 'client' | 'builder' | 'owner' | 'broker' | 'admin';
    provider_type?: 'builder' | 'owner' | 'broker' | null;
    company_name?: string | null;
    is_admin: boolean;
  };
}

export async function readSession(): Promise<StoredSession | null> {
  const serialized = await SecureStore.getItemAsync(SESSION_KEY);
  if (!serialized) return null;

  try {
    return JSON.parse(serialized) as StoredSession;
  } catch {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    return null;
  }
}

export async function saveSession(session: StoredSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
