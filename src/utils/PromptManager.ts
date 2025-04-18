interface Prompt {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  folderId?: string;
}

interface Folder {
  id: string;
  name: string;
  prompts: Prompt[];
}

export class PromptManager {
  private folders: Folder[] = [];

  constructor() {
    this.loadFolders();
  }

  private async loadFolders() {
    const result = await chrome.storage.local.get('folders');
    this.folders = result.folders || [];
  }

  public getFavoritePrompts(): Prompt[] {
    const favoritePrompts: Prompt[] = [];
    for (const folder of this.folders) {
      const folderFavorites = folder.prompts.filter(prompt => prompt.isFavorite);
      favoritePrompts.push(...folderFavorites);
    }
    return favoritePrompts;
  }

  public async saveFolders() {
    await chrome.storage.local.set({ folders: this.folders });
  }
} 