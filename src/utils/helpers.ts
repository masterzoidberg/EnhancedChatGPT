import { ExtensionSettings, Folder, Prompt } from '@/types/messages';

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Format a date to a readable string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Check if the current theme is dark
 */
export const isDarkTheme = (settings: ExtensionSettings): boolean => {
  if (settings.theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return settings.theme === 'dark';
};

/**
 * Apply theme to the document
 */
export const applyTheme = (settings: ExtensionSettings): void => {
  const isDark = isDarkTheme(settings);
  document.documentElement.classList.toggle('dark', isDark);
};

/**
 * Debounce a function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Find a prompt by ID
 */
export const findPrompt = (folders: Folder[], promptId: string): Prompt | undefined => {
  for (const folder of folders) {
    const prompt = folder.prompts.find((p) => p.id === promptId);
    if (prompt) {
      return prompt;
    }
  }
  return undefined;
};

/**
 * Find a folder by ID
 */
export const findFolder = (folders: Folder[], folderId: string): Folder | undefined => {
  return folders.find((folder) => folder.id === folderId);
};

/**
 * Move a prompt to a different folder
 */
export const movePrompt = (
  folders: Folder[],
  promptId: string,
  sourceFolderId: string,
  targetFolderId: string
): Folder[] => {
  const sourceFolder = findFolder(folders, sourceFolderId);
  const targetFolder = findFolder(folders, targetFolderId);

  if (!sourceFolder || !targetFolder) {
    return folders;
  }

  const prompt = sourceFolder.prompts.find((p) => p.id === promptId);
  if (!prompt) {
    return folders;
  }

  return folders.map((folder) => {
    if (folder.id === sourceFolderId) {
      return {
        ...folder,
        prompts: folder.prompts.filter((p) => p.id !== promptId),
      };
    }
    if (folder.id === targetFolderId) {
      return {
        ...folder,
        prompts: [...folder.prompts, { ...prompt, folderId: targetFolderId }],
      };
    }
    return folder;
  });
};

/**
 * Validate prompt data
 */
export const validatePrompt = (prompt: Partial<Prompt>): boolean => {
  return (
    typeof prompt.title === 'string' &&
    prompt.title.length > 0 &&
    typeof prompt.content === 'string' &&
    prompt.content.length > 0 &&
    typeof prompt.folderId === 'string' &&
    prompt.folderId.length > 0
  );
};

/**
 * Validate folder data
 */
export const validateFolder = (folder: Partial<Folder>): boolean => {
  return typeof folder.name === 'string' && folder.name.length > 0;
}; 