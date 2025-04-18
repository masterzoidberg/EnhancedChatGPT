export enum MessageType {
  // State management
  GET_STATE = 'GET_STATE',
  STATE_CHANGED = 'STATE_CHANGED',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  TOGGLE_EXTENSION = 'TOGGLE_EXTENSION',

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
  [key: string]: any;
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
}

export interface Folder {
  id: string;
  name: string;
  prompts: Prompt[];
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  folderId: string;
  createdAt: number;
  updatedAt: number;
} 