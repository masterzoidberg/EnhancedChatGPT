import React, { useEffect, useState } from 'react';
import { Prompt } from '@/types/messages';
import { MessageType } from '@/types/messages';

interface QuickAccessBarProps {
  promptManager: any; // TODO: Replace with proper type
}

export const QuickAccessBar: React.FC<QuickAccessBarProps> = ({ promptManager }) => {
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load favorite prompts
    const loadFavoritePrompts = () => {
      chrome.storage.local.get(['folders'], (result) => {
        if (result.folders) {
          const favorites = result.folders
            .flatMap((folder: any) => folder.prompts)
            .filter((prompt: Prompt) => prompt.isFavorite);
          setFavoritePrompts(favorites);
        }
      });
    };

    loadFavoritePrompts();

    // Listen for prompt updates
    chrome.runtime.onMessage.addListener((message) => {
      if (
        message.type === MessageType.UPDATE_PROMPT ||
        message.type === MessageType.DELETE_PROMPT
      ) {
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

  const handlePromptClick = (prompt: Prompt) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = prompt.content;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex space-x-2 max-w-[90vw] overflow-x-auto">
      {favoritePrompts.map((prompt) => (
        <button
          key={prompt.id}
          onClick={() => handlePromptClick(prompt)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          {prompt.title}
        </button>
      ))}
    </div>
  );
}; 