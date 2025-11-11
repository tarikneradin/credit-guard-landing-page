import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  HOST_ID: 'host_id',
} as const;

// Token management
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch {
    return null;
  }
};

export const setAccessToken = async (token: string | null): Promise<void> => {
  try {
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
  } catch {
    // Silently fail
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    return null;
  }
};

export const setRefreshToken = async (token: string | null): Promise<void> => {
  try {
    if (token) {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
  } catch {
    // Silently fail
  }
};

// User data management
export const getUserData = async (): Promise<unknown | null> => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const setUserData = async (userData: unknown): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch {
    // Silently fail
  }
};

// Biometric settings
export const getBiometricEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_ENABLED);
    return enabled === 'true';
  } catch {
    return false;
  }
};

export const setBiometricEnabled = async (enabled: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, enabled.toString());
  } catch {
    // Silently fail
  }
};

// Host ID management (for registration)
export const getHostId = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.HOST_ID);
  } catch {
    return null;
  }
};

export const setHostId = async (hostId: string | null): Promise<void> => {
  try {
    if (hostId) {
      await AsyncStorage.setItem(STORAGE_KEYS.HOST_ID, hostId);
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.HOST_ID);
    }
  } catch {
    // Silently fail
  }
};

// Clear all stored data (logout)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
    // Note: We don't clear HOST_ID on logout as it's needed for registration
  } catch {
    // Silently fail
  }
};
