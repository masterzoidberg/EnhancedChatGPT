import { OverlayPanelProps } from '@/components/OverlayPanel';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  folderId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Folder {
  id: string;
  name: string;
  prompts: Prompt[];
}

export interface IPromptManager {
  getFavoritePrompts(): Promise<Prompt[]>;
  getFolders(): Promise<Folder[]>;
  createFolder(name: string): Promise<Folder>;
  updateFolder(folder: Folder): Promise<void>;
  deleteFolder(folderId: string): Promise<void>;
  createPrompt(prompt: Omit<Prompt, 'id'>): Promise<Prompt>;
  updatePrompt(prompt: Prompt): Promise<void>;
  deletePrompt(promptId: string): Promise<void>;
}

export interface QuickAccessBarProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
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