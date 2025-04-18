import React, { useEffect, useState } from 'react';
import { Folder, Prompt } from '@/types/messages';
import { MessageType } from '@/types/messages';

interface OverlayPanelProps {
  promptManager: any; // TODO: Replace with proper type
}

export const OverlayPanel: React.FC<OverlayPanelProps> = ({ promptManager }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  useEffect(() => {
    // Load folders from storage
    chrome.storage.local.get(['folders'], (result) => {
      if (result.folders) {
        setFolders(result.folders);
      }
    });

    // Listen for folder updates
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === MessageType.UPDATE_PROMPT || message.type === MessageType.DELETE_PROMPT) {
        chrome.storage.local.get(['folders'], (result) => {
          if (result.folders) {
            setFolders(result.folders);
          }
        });
      }
    });
  }, []);

  const handleFolderSelect = (folder: Folder) => {
    setSelectedFolder(folder);
  };

  const handlePromptSelect = (prompt: Prompt) => {
    // Insert prompt into chat input
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = prompt.content;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    setIsVisible(false);
  };

  const handleCreateFolder = () => {
    const name = prompt('Enter folder name:');
    if (name) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name,
        prompts: [],
      };
      const updatedFolders = [...folders, newFolder];
      chrome.storage.local.set({ folders: updatedFolders }, () => {
        setFolders(updatedFolders);
      });
    }
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Prompt Manager</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={handleCreateFolder}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Create Folder
          </button>
        </div>

        <div className="space-y-2">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className={`p-2 rounded cursor-pointer ${
                selectedFolder?.id === folder.id
                  ? 'bg-blue-100 dark:bg-blue-900'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleFolderSelect(folder)}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-800 dark:text-white">{folder.name}</span>
                <span className="text-gray-500 dark:text-gray-400">
                  {folder.prompts.length} prompts
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedFolder && (
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              {selectedFolder.name}
            </h3>
            <div className="space-y-2">
              {selectedFolder.prompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => handlePromptSelect(prompt)}
                >
                  <div className="text-gray-800 dark:text-white">{prompt.title}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {prompt.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 