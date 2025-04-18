// src/components/OverlayPanel.tsx
import React, { useState, useEffect } from 'react';
import { IPromptManager } from '@/content/types';
import { Prompt } from '@/types/common';
import FolderList from './FolderList';
import { PromptList } from './PromptList';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export type OverlayPanelProps = {
  promptManager: IPromptManager;
  isVisible: boolean;
  onClose: () => void;
};

export const OverlayPanel: React.FC<OverlayPanelProps> = ({ 
  promptManager, 
  isVisible, 
  onClose 
}) => {
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  useEffect(() => {
    if (isVisible) {
      setActiveFolderId(promptManager.getActiveFolderId());
      loadPrompts();
    }
  }, [isVisible, promptManager]);

  useEffect(() => {
    if (activeFolderId) {
      loadPrompts();
    }
  }, [activeFolderId]);

  useEffect(() => {
    // Subscribe to PromptManager updates
    const unsubscribe = promptManager.subscribe(() => {
      loadPrompts();
    });

    return () => {
      unsubscribe();
    };
  }, [promptManager]);

  const loadPrompts = async () => {
    if (activeFolderId) {
      const folderPrompts = await promptManager.getFolderPrompts(activeFolderId);
      setPrompts(folderPrompts);
    }
  };

  const handleFolderSelect = (folderId: string) => {
    setActiveFolderId(folderId);
  };

  const handlePromptClick = async (prompt: Prompt) => {
    await promptManager.selectPrompt(prompt);
  };

  const handlePromptEdit = async (prompt: Prompt) => {
    await promptManager.updatePrompt(prompt);
  };

  const handlePromptDelete = async (prompt: Prompt) => {
    await promptManager.deletePrompt(prompt.id);
  };

  const handlePromptFavorite = async (prompt: Prompt) => {
    const updatedPrompt = { ...prompt, isFavorite: !prompt.isFavorite };
    await promptManager.updatePrompt(updatedPrompt);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <Card className="w-[70vw] max-w-[1000px] h-[80vh] max-h-[600px] flex">
        <div className="w-1/3 border-r">
          <FolderList promptManager={promptManager} onFolderSelect={handleFolderSelect} />
        </div>
        <div className="flex-1 relative p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2"
          >
            ✖
          </Button>
          <PromptList
            prompts={prompts}
            onPromptClick={handlePromptClick}
            onPromptEdit={handlePromptEdit}
            onPromptDelete={handlePromptDelete}
            onPromptFavorite={handlePromptFavorite}
          />
        </div>
      </Card>
    </div>
  );
};

// --- Styles --- (Keep existing, add closeButton if needed)
const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 9998,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: { // Base panel styles (used by panelStyle above)
    backgroundColor: 'white',
    padding: '0', // Remove padding here, apply to inner sections
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    overflow: 'hidden', // Prevent content overflow before inner scroll
  },
  closeButton: {
    position: 'absolute' as const, // Position relative to the panel
    top: '8px', // Adjust position slightly
    right: '8px',
    background: 'none',
    border: 'none',
    fontSize: '1.4em', // Slightly larger
    cursor: 'pointer',
    padding: '5px',
    lineHeight: '1',
    zIndex: 10, // Ensure it's above PromptList content
  }
};
