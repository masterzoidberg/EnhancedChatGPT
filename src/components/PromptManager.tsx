import React, { useEffect, useState } from 'react';
import { Folder, Prompt, ExtensionSettings, IPromptManager } from '@/types/messages';
import { MessageType } from '@/types/messages';

export class PromptManager implements IPromptManager {
  private folders: Folder[] = [];
  private settings: ExtensionSettings = {
    theme: 'system',
    quickAccessEnabled: true,
    overlayEnabled: true,
    keyboardShortcuts: {
      toggleOverlay: "Ctrl+Shift+O",
      toggleQuickAccess: "Ctrl+Shift+A"
    }
  };

  constructor() {
    this.loadState();
  }

  private async loadState() {
    return new Promise<void>((resolve) => {
      chrome.storage.local.get(['folders', 'settings'], (result) => {
        if (result.folders) {
          this.folders = result.folders;
        }
        if (result.settings) {
          this.settings = result.settings;
        }
        resolve();
      });
    });
  }

  public async getFolders(): Promise<Folder[]> {
    await this.loadState();
    return this.folders;
  }

  public async getFavoritePrompts(): Promise<Prompt[]> {
    await this.loadState();
    return this.folders
      .flatMap((folder) => folder.prompts)
      .filter((prompt) => prompt.isFavorite);
  }

  public async createFolder(name: string): Promise<Folder> {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      prompts: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.folders.push(newFolder);
    await this.saveFolders();
    return newFolder;
  }

  public async updateFolder(folder: Folder): Promise<void> {
    const index = this.folders.findIndex((f) => f.id === folder.id);
    if (index !== -1) {
      this.folders[index] = folder;
      await this.saveFolders();
    }
  }

  public async deleteFolder(folderId: string): Promise<void> {
    this.folders = this.folders.filter((folder) => folder.id !== folderId);
    await this.saveFolders();
  }

  public async createPrompt(promptData: Omit<Prompt, 'id'>): Promise<Prompt> {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      ...promptData,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const folder = this.folders.find((f) => f.id === promptData.folderId);
    if (folder) {
      folder.prompts.push(newPrompt);
      await this.saveFolders();
    }

    return newPrompt;
  }

  public async updatePrompt(prompt: Prompt): Promise<void> {
    const folder = this.folders.find((f) => f.id === prompt.folderId);
    if (folder) {
      const index = folder.prompts.findIndex((p) => p.id === prompt.id);
      if (index !== -1) {
        folder.prompts[index] = {
          ...prompt,
          updatedAt: Date.now(),
        };
        await this.saveFolders();
      }
    }
  }

  public async deletePrompt(promptId: string): Promise<void> {
    for (const folder of this.folders) {
      const index = folder.prompts.findIndex((p) => p.id === promptId);
      if (index !== -1) {
        folder.prompts.splice(index, 1);
        await this.saveFolders();
        break;
      }
    }
  }

  private async saveFolders(): Promise<void> {
    return new Promise<void>((resolve) => {
      chrome.storage.local.set({ folders: this.folders }, () => {
        resolve();
      });
    });
  }

  public getSettings(): ExtensionSettings {
    return this.settings;
  }

  public async updateSettings(settings: Partial<ExtensionSettings>): Promise<void> {
    this.settings = { ...this.settings, ...settings };
    return new Promise<void>((resolve) => {
      chrome.storage.local.set({ settings: this.settings }, () => {
        resolve();
      });
    });
  }
} 