import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'cartflow-auth-token';
let tokenEmMemoria: string | null = null;

export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return tokenEmMemoria;
  }

  if (!(await SecureStore.isAvailableAsync())) {
    return null;
  }

  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function saveAuthToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    tokenEmMemoria = token;
    return;
  }

  if (!(await SecureStore.isAvailableAsync())) {
    throw new Error('O armazenamento seguro não está disponível neste dispositivo.');
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
}
