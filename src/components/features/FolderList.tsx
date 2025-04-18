import React, { useEffect, useState } from 'react';
import { IPromptManager } from '@/content/types';
import { Folder } from '@/types/common';
import FolderItem from './FolderItem';

interface FolderListProps {
  promptManager: IPromptManager;
  onFolderSelect: (folderId: string) => void;
}

const FolderList: React.FC<FolderListProps> = ({ promptManager, onFolderSelect }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  useEffect(() => {
    loadFolders();
    const unsubscribe = promptManager.subscribe(() => {
      void loadFolders();
    });
    return () => {
      unsubscribe();
    };
  }, [promptManager]);

  const loadFolders = async (): Promise<void> => {
    try {
      const loadedFolders = await promptManager.getFolders();
      setFolders(loadedFolders);
      const activeId = promptManager.getActiveFolderId();
      setActiveFolderId(activeId);
    } catch (error) {
      console.error('Error loading folders:', error);
      setFolders([]);
      setActiveFolderId(null);
    }
  };

  const handleFolderClick = (folderId: string) => {
    onFolderSelect(folderId);
  };

  const handleCreateFolder = async () => {
    const name = window.prompt('Enter folder name:');
    if (name) {
      const newFolder = await promptManager.createFolder(name);
      const updatedFolders = await promptManager.getFolders(); // Get the updated folders
      setFolders(updatedFolders); // Update local state with new folders
      handleFolderClick(newFolder.id); // Select the newly created folder
    }
  };

  const style: React.CSSProperties = {
    borderRight: '1px solid #ccc',
    padding: '10px',
    height: '100%', // Take full height of its container
    overflowY: 'auto', // Add scroll if folders exceed height
    minWidth: '150px', // Ensure sidebar has some width
    backgroundColor: '#f7f7f7', // Slightly different background for sidebar
  };

  const newFolderButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px',
    marginTop: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  };

  return (
    <div style={style}>
      <h4>Folders</h4>
      <div className="space-y-2">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`p-2 rounded cursor-pointer ${
              folder.id === activeFolderId ? 'bg-blue-100' : 'hover:bg-gray-100'
            }`}
            onClick={() => handleFolderClick(folder.id)}
          >
            {folder.name}
          </div>
        ))}
      </div>
      <button 
        style={newFolderButtonStyle}
        onClick={handleCreateFolder}
      >
        + New Folder
      </button>
    </div>
  );
};

export default FolderList; 