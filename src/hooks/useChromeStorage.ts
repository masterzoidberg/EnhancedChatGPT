import { useState, useEffect } from 'react';
import { ExtensionSettings } from '@/types/messages';
import { Folder } from '@/types/common';

type StorageKey = 'folders' | 'settings' | 'isEnabled';

interface UseChromeStorageOptions<T> {
  key: StorageKey;
  defaultValue: T;
}

const defaultSettings: ExtensionSettings = {
  theme: 'system',
  quickAccessEnabled: true,
  overlayEnabled: true,
  keyboardShortcuts: {
    toggleOverlay: "Alt+Shift+O",
    toggleQuickAccess: "Alt+Shift+Q"
  }
};

export function useChromeStorage<T>({ key, defaultValue }: UseChromeStorageOptions<T>) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial value
    chrome.storage.local.get([key], (result: { [key: string]: T }) => {
      if (result[key] !== undefined) {
        setValue(result[key]);
      }
      setIsLoading(false);
    });

    // Listen for changes
    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (changes[key]) {
        setValue(changes[key].newValue as T);
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
    defaultValue: defaultSettings,
  });
}

export function useExtensionEnabled() {
  return useChromeStorage<boolean>({
    key: 'isEnabled',
    defaultValue: true,
  });
} 