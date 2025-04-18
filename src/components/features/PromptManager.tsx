import React, { useEffect, useState } from 'react';
import { ExtensionSettings } from '@/types/messages';
import { Folder, Prompt } from '@/types/common';
import { IPromptManager } from '@/content/types';

export class PromptManager implements IPromptManager {
  private folders: Folder[] = [];
  private listeners: Set<() => void> = new Set();
  private activeFolderId: string | null = null;
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

  public subscribe(callback: () => void): () => void {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }

  private async loadState() {
    return new Promise<void>((resolve) => {
      chrome.storage.local.get(['folders', 'settings', 'activeFolderId'], (result) => {
        if (result.folders) {
          this.folders = result.folders;
        }
        if (result.settings) {
          this.settings = result.settings;
        }
        if (result.activeFolderId) {
          this.activeFolderId = result.activeFolderId;
        }
        resolve();
      });
    });
  }

  public getActiveFolderId(): string | null {
    return this.activeFolderId;
  }

  public async getFolderPrompts(folderId: string): Promise<Prompt[]> {
    await this.loadState();
    const folder = this.folders.find(f => f.id === folderId);
    return folder?.prompts || [];
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
    this.notifyListeners();
    return newFolder;
  }

  public async updateFolder(folder: Folder): Promise<void> {
    const index = this.folders.findIndex((f) => f.id === folder.id);
    if (index !== -1) {
      this.folders[index] = folder;
      await this.saveFolders();
      this.notifyListeners();
    }
  }

  public async deleteFolder(folderId: string): Promise<void> {
    this.folders = this.folders.filter((folder) => folder.id !== folderId);
    if (this.activeFolderId === folderId) {
      this.activeFolderId = this.folders.length > 0 ? this.folders[0].id : null;
    }
    await this.saveFolders();
    this.notifyListeners();
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
      this.notifyListeners();
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
        this.notifyListeners();
      }
    }
  }

  public async deletePrompt(promptId: string): Promise<void> {
    for (const folder of this.folders) {
      const index = folder.prompts.findIndex((p) => p.id === promptId);
      if (index !== -1) {
        folder.prompts.splice(index, 1);
        await this.saveFolders();
        this.notifyListeners();
        break;
      }
    }
  }

  public async selectPrompt(prompt: Prompt): Promise<void> {
    // Implementation depends on what should happen when a prompt is selected
    // For now, just notify listeners
    this.notifyListeners();
  }

  private async saveFolders(): Promise<void> {
    return new Promise<void>((resolve) => {
      chrome.storage.local.set({
        folders: this.folders,
        activeFolderId: this.activeFolderId
      }, () => {
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
        this.notifyListeners();
        resolve();
      });
    });
  }
} 