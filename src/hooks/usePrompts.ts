import { useState, useCallback } from 'react';
import { Folder, Prompt } from '@/types/messages';
import { generateId, validatePrompt, validateFolder } from '@/utils/helpers';

interface UsePromptsOptions {
  initialFolders?: Folder[];
}

export function usePrompts({ initialFolders = [] }: UsePromptsOptions = {}) {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const createFolder = useCallback((name: string) => {
    if (!validateFolder({ name })) {
      throw new Error('Invalid folder name');
    }

    const newFolder: Folder = {
      id: generateId(),
      name,
      prompts: [],
    };

    setFolders((prev) => [...prev, newFolder]);
    return newFolder;
  }, []);

  const deleteFolder = useCallback((folderId: string) => {
    setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
    if (selectedFolder?.id === folderId) {
      setSelectedFolder(null);
    }
  }, [selectedFolder]);

  const createPrompt = useCallback(
    (folderId: string, title: string, content: string, isFavorite = false) => {
      if (!validatePrompt({ title, content, folderId })) {
        throw new Error('Invalid prompt data');
      }

      const newPrompt: Prompt = {
        id: generateId(),
        title,
        content,
        isFavorite,
        folderId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      setFolders((prev) =>
        prev.map((folder) =>
          folder.id === folderId
            ? { ...folder, prompts: [...folder.prompts, newPrompt] }
            : folder
        )
      );

      return newPrompt;
    },
    []
  );

  const updatePrompt = useCallback((prompt: Prompt) => {
    if (!validatePrompt(prompt)) {
      throw new Error('Invalid prompt data');
    }

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === prompt.folderId
          ? {
              ...folder,
              prompts: folder.prompts.map((p) =>
                p.id === prompt.id ? { ...prompt, updatedAt: Date.now() } : p
              ),
            }
          : folder
      )
    );
  }, []);

  const deletePrompt = useCallback((folderId: string, promptId: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? { ...folder, prompts: folder.prompts.filter((p) => p.id !== promptId) }
          : folder
      )
    );
  }, []);

  const toggleFavorite = useCallback((folderId: string, promptId: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId
          ? {
              ...folder,
              prompts: folder.prompts.map((p) =>
                p.id === promptId ? { ...p, isFavorite: !p.isFavorite } : p
              ),
            }
          : folder
      )
    );
  }, []);

  const getFavoritePrompts = useCallback(() => {
    return folders.flatMap((folder) =>
      folder.prompts.filter((prompt) => prompt.isFavorite)
    );
  }, [folders]);

  return {
    folders,
    selectedFolder,
    setSelectedFolder,
    createFolder,
    deleteFolder,
    createPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    getFavoritePrompts,
  };
} 