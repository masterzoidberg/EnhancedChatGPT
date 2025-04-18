import { useState, useEffect } from 'react';
export function useVisibility({ initialValue = true, settingKey } = {}) {
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
            const handleStorageChange = (changes) => {
                var _a, _b;
                if (((_b = (_a = changes.settings) === null || _a === void 0 ? void 0 : _a.newValue) === null || _b === void 0 ? void 0 : _b[settingKey]) !== undefined) {
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
