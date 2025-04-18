import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { MessageType } from '@/types/messages';
export const QuickAccessBar = ({ promptManager }) => {
    const [favoritePrompts, setFavoritePrompts] = useState([]);
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        // Load favorite prompts
        const loadFavoritePrompts = () => {
            chrome.storage.local.get(['folders'], (result) => {
                if (result.folders) {
                    const favorites = result.folders
                        .flatMap((folder) => folder.prompts)
                        .filter((prompt) => prompt.isFavorite);
                    setFavoritePrompts(favorites);
                }
            });
        };
        loadFavoritePrompts();
        // Listen for prompt updates
        chrome.runtime.onMessage.addListener((message) => {
            if (message.type === MessageType.UPDATE_PROMPT ||
                message.type === MessageType.DELETE_PROMPT) {
                loadFavoritePrompts();
            }
        });
        // Check extension settings
        chrome.storage.local.get(['settings'], (result) => {
            if (result.settings) {
                setIsVisible(result.settings.quickAccessEnabled);
            }
        });
    }, []);
    const handlePromptClick = (prompt) => {
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.value = prompt.content;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };
    if (!isVisible) {
        return null;
    }
    return (_jsx("div", { className: "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-2 max-w-[90vw] overflow-x-auto", children: favoritePrompts.map((prompt) => (_jsx("button", { onClick: () => handlePromptClick(prompt), className: "px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap", children: prompt.title }, prompt.id))) }));
};
