import { useEffect } from 'react';
import { isDarkTheme, applyTheme } from '@/utils/helpers';
export function useTheme(settings) {
    useEffect(() => {
        // Apply initial theme
        applyTheme(settings);
        // Listen for system theme changes if using system theme
        if (settings.theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                applyTheme(settings);
            };
            mediaQuery.addEventListener('change', handleChange);
            return () => {
                mediaQuery.removeEventListener('change', handleChange);
            };
        }
    }, [settings.theme]);
    return {
        isDark: isDarkTheme(settings),
    };
}
