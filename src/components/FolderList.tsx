import React, { useEffect, useState } from 'react';
import { IPromptManager } from '@/content/types';
import { Folder } from '@/types/common';

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
      loadFolders();
    });
    return () => {
      unsubscribe();
    };
  }, [promptManager]);

  const loadFolders = async () => {
    const loadedFolders = await promptManager.getFolders();
    setFolders(loadedFolders);
    const activeId = promptManager.getActiveFolderId();
    setActiveFolderId(activeId);
  };

  const handleFolderClick = (folderId: string) => {
    onFolderSelect(folderId);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Folders</h2>
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
    </div>
  );
};

export default FolderList; 