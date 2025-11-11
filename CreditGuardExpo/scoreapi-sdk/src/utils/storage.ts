/**
 * Token storage adapter
 * Supports localStorage (web), AsyncStorage (React Native), and in-memory storage
 */

export interface StorageAdapter {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(key: string, value: string): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

/**
 * In-memory storage (fallback)
 */
class MemoryStorage implements StorageAdapter {
  private storage: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.storage.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }
}

/**
 * localStorage adapter (Browser)
 */
class LocalStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage not available', e);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn('localStorage not available', e);
    }
  }

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('localStorage not available', e);
    }
  }
}

/**
 * AsyncStorage adapter (React Native)
 */
class AsyncStorageAdapter implements StorageAdapter {
  private asyncStorage: any;

  constructor(asyncStorage: any) {
    this.asyncStorage = asyncStorage;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await this.asyncStorage.getItem(key);
    } catch (e) {
      console.warn('AsyncStorage getItem failed', e);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await this.asyncStorage.setItem(key, value);
    } catch (e) {
      console.warn('AsyncStorage setItem failed', e);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.asyncStorage.removeItem(key);
    } catch (e) {
      console.warn('AsyncStorage removeItem failed', e);
    }
  }
}

/**
 * Create storage adapter based on environment
 */
export function createStorageAdapter(storage?: string | StorageAdapter): StorageAdapter {
  // If custom adapter provided, use it
  if (typeof storage === 'object' && storage !== null) {
    return storage;
  }

  // If string type provided
  if (storage === 'localStorage') {
    return new LocalStorageAdapter();
  }

  if (storage === 'asyncStorage') {
    // User needs to pass AsyncStorage instance separately
    throw new Error('AsyncStorage instance must be provided when using asyncStorage mode');
  }

  if (storage === 'memory') {
    return new MemoryStorage();
  }

  // Auto-detect
  if (typeof window !== 'undefined' && window.localStorage) {
    return new LocalStorageAdapter();
  }

  // Fallback to memory storage
  return new MemoryStorage();
}

/**
 * Create AsyncStorage adapter for React Native
 */
export function createAsyncStorageAdapter(asyncStorage: any): StorageAdapter {
  return new AsyncStorageAdapter(asyncStorage);
}
