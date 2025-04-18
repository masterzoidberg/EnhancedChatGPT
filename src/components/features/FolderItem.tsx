import React from 'react';
import { Folder } from '@/types/common';

type FolderItemProps = {
  folder: Folder;
  isActive: boolean;
  onSelect: (folderId: string) => void;
};

const FolderItem: React.FC<FolderItemProps> = ({ folder, isActive, onSelect }) => {
  const style: React.CSSProperties = {
    padding: '8px 12px',
    cursor: 'pointer',
    backgroundColor: isActive ? '#e0e0e0' : 'transparent', // Basic highlight
    borderBottom: '1px solid #eee',
  };

  const handleClick = () => {
    onSelect(folder.id);
  };

  return (
    <div style={style} onClick={handleClick}>
      {folder.name}
    </div>
  );
};

export default FolderItem; 