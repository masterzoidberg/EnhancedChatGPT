import { OverlayPanelProps } from '@/components/features/OverlayPanel';
import { QuickAccessBarProps } from '@/types/messages';
import { Folder, Prompt } from '@/types/common';

export interface IPromptManager {
  getFavoritePrompts(): Promise<Prompt[]>;
  getFolders(): Promise<Folder[]>;
  createFolder(name: string): Promise<Folder>;
  updateFolder(folder: Folder): Promise<void>;
  deleteFolder(folderId: string): Promise<void>;
  createPrompt(prompt: Omit<Prompt, 'id'>): Promise<Prompt>;
  updatePrompt(prompt: Prompt): Promise<void>;
  deletePrompt(promptId: string): Promise<void>;
  subscribe(callback: () => void): () => void;
  getActiveFolderId(): string | null;
  getFolderPrompts(folderId: string): Promise<Prompt[]>;
  selectPrompt(prompt: Prompt): Promise<void>;
}

export interface PromptManagerProps {
  promptManager: IPromptManager;
}

export interface ContentScriptState {
  isInitialized: boolean;
  overlayPanel: React.ComponentType<OverlayPanelProps> | null;
  quickAccessBar: React.ComponentType<QuickAccessBarProps> | null;
  promptManager: IPromptManager;
}

export type { OverlayPanelProps, QuickAccessBarProps }; 