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
      // Create new folder
      const newFolder: Folder = {
        id: Date.now().toString(),
        name,
        prompts: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setFolders([...folders, newFolder]);
      chrome.storage.local.set({ folders: [...folders, newFolder] });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Prompt Manager</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden flex">
          {/* Folders sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
            <button
              onClick={handleCreateFolder}
              className="w-full mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              New Folder
            </button>
            <div className="space-y-2">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleFolderSelect(folder)}
                  className={`w-full px-4 py-2 rounded ${
                    selectedFolder?.id === folder.id
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {folder.name}
                </button>
              ))}
            </div>
          </div>

          {/* Prompts content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {selectedFolder ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedFolder.name}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {selectedFolder.prompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handlePromptSelect(prompt)}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">{prompt.title}</h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {prompt.content}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                Select a folder to view prompts
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 