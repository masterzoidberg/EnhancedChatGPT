import { useState, useEffect } from 'react';
import { ExtensionSettings } from '@/types/messages';

interface UseVisibilityOptions {
  initialValue?: boolean;
  settingKey?: keyof ExtensionSettings;
}

export function useVisibility({ initialValue = true, settingKey }: UseVisibilityOptions = {}) {
  const [isVisible, setIsVisible] = useState(initialValue);

  useEffect(() => {
    if (settingKey) {
      // Load initial visibility from settings
      chrome.storage.local.get(['settings'], (result) => {
        if (result.settings && result.settings[settingKey] !== undefined) {
          setIsVisible(result.settings[settingKey]);
        }
      });

      // Listen for settings changes
      const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
        if (changes.settings?.newValue?.[settingKey] !== undefined) {
          setIsVisible(changes.settings.newValue[settingKey]);
        }
      };

      chrome.storage.onChanged.addListener(handleStorageChange);

      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, [settingKey]);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  const show = () => {
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
  };

  return {
    isVisible,
    toggleVisibility,
    show,
    hide,
  };
} 