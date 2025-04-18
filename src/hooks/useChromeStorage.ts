import { useState, useEffect } from 'react';
import { ExtensionSettings, Folder } from '@/types/messages';

type StorageKey = 'folders' | 'settings' | 'isEnabled';

interface UseChromeStorageOptions<T> {
  key: StorageKey;
  defaultValue: T;
}

export function useChromeStorage<T>({ key, defaultValue }: UseChromeStorageOptions<T>) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial value
    chrome.storage.local.get([key], (result) => {
      if (result[key] !== undefined) {
        setValue(result[key]);
      }
      setIsLoading(false);
    });

    // Listen for changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[key]) {
        setValue(changes[key].newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [key]);

  const updateValue = (newValue: T) => {
    setValue(newValue);
    chrome.storage.local.set({ [key]: newValue });
  };

  return { value, setValue: updateValue, isLoading };
}

// Specific hooks for common use cases
export function useFolders() {
  return useChromeStorage<Folder[]>({
    key: 'folders',
    defaultValue: [],
  });
}

export function useSettings() {
  return useChromeStorage<ExtensionSettings>({
    key: 'settings',
    defaultValue: {
      theme: 'system',
      quickAccessEnabled: true,
      overlayEnabled: true,
    },
  });
}

export function useExtensionEnabled() {
  return useChromeStorage<boolean>({
    key: 'isEnabled',
    defaultValue: true,
  });
} 