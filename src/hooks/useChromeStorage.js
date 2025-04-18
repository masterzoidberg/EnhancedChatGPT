import { useState, useEffect } from 'react';
const defaultSettings = {
    theme: 'system',
    quickAccessEnabled: true,
    overlayEnabled: true,
    keyboardShortcuts: {
        toggleOverlay: "Alt+Shift+O",
        toggleQuickAccess: "Alt+Shift+Q"
    }
};
export function useChromeStorage({ key, defaultValue }) {
    const [value, setValue] = useState(defaultValue);
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
        const handleStorageChange = (changes) => {
            if (changes[key]) {
                setValue(changes[key].newValue);
            }
        };
        chrome.storage.onChanged.addListener(handleStorageChange);
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [key]);
    const updateValue = (newValue) => {
        setValue(newValue);
        chrome.storage.local.set({ [key]: newValue });
    };
    return { value, setValue: updateValue, isLoading };
}
// Specific hooks for common use cases
export function useFolders() {
    return useChromeStorage({
        key: 'folders',
        defaultValue: [],
    });
}
export function useSettings() {
    return useChromeStorage({
        key: 'settings',
        defaultValue: defaultSettings,
    });
}
export function useExtensionEnabled() {
    return useChromeStorage({
        key: 'isEnabled',
        defaultValue: true,
    });
}
