export class LocalStorageUtil {
  static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`[StorageUtil] Error setting key "${key}":`, error);
    }
  }

  static get<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
      console.warn(`[StorageUtil] Error getting key "${key}":`, error);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  }

  static clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.clear();
  }
}
