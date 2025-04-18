/**
 * Core interfaces used throughout the extension
 */

export interface Folder {
  id: string;
  name: string;
  prompts: Prompt[];
  createdAt: number;
  updatedAt: number;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  folderId: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
} 