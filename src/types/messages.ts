import { Folder, Prompt } from './common';

export type { Folder, Prompt };

export enum MessageType {
  // State management
  GET_STATE = 'GET_STATE',
  TOGGLE_ENABLED = 'TOGGLE_ENABLED',
  TOGGLE_EXTENSION = 'TOGGLE_EXTENSION',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  GET_FAVORITE_PROMPTS = 'GET_FAVORITE_PROMPTS',
  STATE_CHANGED = 'STATE_CHANGED',

  // Prompt management
  SAVE_PROMPT = 'SAVE_PROMPT',
  DELETE_PROMPT = 'DELETE_PROMPT',
  GET_PROMPTS = 'GET_PROMPTS',
  UPDATE_PROMPT = 'UPDATE_PROMPT',

  // Folder management
  CREATE_FOLDER = 'CREATE_FOLDER',
  DELETE_FOLDER = 'DELETE_FOLDER',
  RENAME_FOLDER = 'RENAME_FOLDER',
  MOVE_PROMPT = 'MOVE_PROMPT',

  // UI actions
  INITIALIZE = 'INITIALIZE',
  SHOW_OVERLAY = 'SHOW_OVERLAY',
  HIDE_OVERLAY = 'HIDE_OVERLAY',
  TOGGLE_QUICK_ACCESS = 'TOGGLE_QUICK_ACCESS',
}

export interface Message {
  type: MessageType;
  settings?: Partial<ExtensionSettings>;
  prompt?: Prompt;
}

export interface ExtensionState {
  isEnabled: boolean;
  settings: ExtensionSettings;
  folders: Folder[];
}

export interface ExtensionSettings {
  theme: 'light' | 'dark' | 'system';
  quickAccessEnabled: boolean;
  overlayEnabled: boolean;
  keyboardShortcuts: {
    toggleOverlay: string;
    toggleQuickAccess: string;
  };
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

export interface OverlayPanelProps {
  isVisible: boolean;
  onClose: () => void;
  promptManager: IPromptManager;
}

export interface QuickAccessBarProps {
  isVisible: boolean;
  onClose: () => void;
  promptManager: IPromptManager;
} 