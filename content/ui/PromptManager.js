/**
 * Manages the Prompt Management UI within the ChatGPT Enhancer overlay
 * Handles prompt creation, organization, and insertion
 */
class PromptManager {
  /**
   * Initialize the prompt manager
   * @param {HTMLElement} container - The container element
   */
  constructor(container) {
    this.container = container;
    this.folders = [];
    this.currentFolderId = null;
    this.initialize();
  }

  async initialize() {
    await this.loadFolders();
    this.setupUI();
    this.setupEventListeners();
    this.renderFolderList();
  }

  /**
   * Loads saved folders from localStorage
   */
  async loadFolders() {
    try {
      // Try to get data from storage
      const data = await chrome.storage.local.get('promptFolders');
      
      // Initialize with existing data or empty array
      this.folders = data.promptFolders || [];
      
      // Select first folder if available
      if (this.folders.length > 0) {
        this.currentFolderId = this.folders[0].id;
      } else {
        this.currentFolderId = null;
      }
      
      return;
    } catch (error) {
      // If error occurs (like context invalidation), initialize with empty data
      console.error('Error loading folders:', error);
      this.folders = [];
      this.currentFolderId = null;
      
      // Only try to save empty folders if not a context invalidation error
      if (!error.message?.includes('invalidated')) {
        try {
          await chrome.storage.local.set({ promptFolders: [] });
        } catch (e) {
          // Ignore secondary errors
        }
      }
    }
  }

  setupUI() {
    this.container.innerHTML = `
      <div class="prompt-manager-sidebar">
        <div class="folder-search">
          <input type="text" placeholder="Search folders..." id="folder-search">
        </div>
        <div class="folder-list"></div>
        <button class="add-folder-btn">+ New Folder</button>
      </div>
      <div class="prompt-manager-content">
        <div class="folder-header">
          <h2 class="folder-title"></h2>
          <button class="add-prompt-btn">+ New Prompt</button>
        </div>
        <div class="prompts-list"></div>
      </div>
    `;
  }

  /**
   * Sets up event listeners for the prompt manager
   */
  setupEventListeners() {
    const searchInput = this.container.querySelector('#folder-search');
    searchInput.addEventListener('input', (e) => this.filterFolders(e.target.value));

    const addFolderBtn = this.container.querySelector('.add-folder-btn');
    addFolderBtn.addEventListener('click', () => this.showFolderEditor());

    const addPromptBtn = this.container.querySelector('.add-prompt-btn');
    addPromptBtn.addEventListener('click', () => this.showPromptEditor());
  }

  /**
   * Renders the folder list within the sidebar
   */
  renderFolderList(searchQuery = '') {
    const folderList = this.container.querySelector('.folder-list');
    folderList.innerHTML = '';

    const filteredFolders = searchQuery ? 
      this.folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())) :
      this.folders;

    filteredFolders.forEach(folder => {
      const folderElement = document.createElement('div');
      folderElement.className = `folder-item ${folder.id === this.currentFolderId ? 'active' : ''}`;
      folderElement.innerHTML = `
        <span class="folder-name">${folder.name}</span>
        <div class="folder-actions">
          <button class="edit-folder" data-folder-id="${folder.id}">Edit</button>
          <button class="delete-folder" data-folder-id="${folder.id}">Delete</button>
        </div>
      `;

      folderElement.querySelector('.folder-name').addEventListener('click', () => {
        this.selectFolder(folder.id);
      });

      folderElement.querySelector('.edit-folder').addEventListener('click', () => {
        this.showFolderEditor(folder.id);
      });

      folderElement.querySelector('.delete-folder').addEventListener('click', () => {
        this.deleteFolder(folder.id);
      });

      folderList.appendChild(folderElement);
    });

    this.renderPrompts();
  }

  /**
   * Selects a folder and renders its prompts
   * @param {string} folderId - The ID of the folder to select
   */
  selectFolder(folderId) {
    this.currentFolderId = folderId;
    this.renderFolderList();
  }

  /**
   * Renders the prompts within the main content area
   */
  renderPrompts() {
    const promptsList = this.container.querySelector('.prompts-list');
    const folderTitle = this.container.querySelector('.folder-title');
    promptsList.innerHTML = '';

    const currentFolder = this.folders.find(f => f.id === this.currentFolderId);
    if (!currentFolder) return;

    folderTitle.textContent = currentFolder.name;

    currentFolder.prompts.forEach((prompt, index) => {
      const promptElement = document.createElement('div');
      promptElement.className = 'prompt-item';
      promptElement.innerHTML = `
        <div class="prompt-header">
          <h3 class="prompt-title">${prompt.title}</h3>
          <div class="prompt-actions">
            <button class="edit-prompt" data-index="${index}">Edit</button>
            <button class="delete-prompt" data-index="${index}">Delete</button>
          </div>
        </div>
        <div class="prompt-content">${prompt.content}</div>
      `;

      promptElement.querySelector('.edit-prompt').addEventListener('click', () => {
        this.showPromptEditor(prompt, index);
      });

      promptElement.querySelector('.delete-prompt').addEventListener('click', () => {
        this.deletePrompt(index);
      });

      promptsList.appendChild(promptElement);
    });
  }

  /**
   * Shows the folder editor modal
   * @param {string} folderId - Optional folder ID to edit
   */
  showFolderEditor(folderId = null) {
    const folder = folderId ? this.folders.find(f => f.id === folderId) : null;
    const modal = document.createElement('div');
    modal.id = 'folder-editor-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>${folder ? 'Edit Folder' : 'New Folder'}</h2>
        <input type="text" id="folder-name" value="${folder ? folder.name : ''}" placeholder="Folder name">
        <div class="modal-actions">
          <button class="cancel-btn">Cancel</button>
          <button class="save-btn">Save</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.cancel-btn').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.save-btn').addEventListener('click', () => {
      const name = modal.querySelector('#folder-name').value.trim();
      if (!name) return;

      if (folder) {
        folder.name = name;
      } else {
        this.folders.push({
          id: Date.now().toString(),
          name,
          prompts: []
        });
      }

      this.saveFolders();
      modal.remove();
    });
  }

  /**
   * Shows the prompt editor modal
   * @param {Object} prompt - Optional prompt object to edit
   */
  showPromptEditor(prompt = null, index = null) {
    const modal = document.createElement('div');
    modal.id = 'prompt-editor-modal';
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h2>${prompt ? 'Edit Prompt' : 'New Prompt'}</h2>
        <input type="text" id="prompt-title" value="${prompt ? prompt.title : ''}" placeholder="Prompt title">
        <textarea id="prompt-content" placeholder="Prompt content">${prompt ? prompt.content : ''}</textarea>
        <label class="favorite-checkbox">
          <input type="checkbox" id="prompt-favorite" ${prompt && prompt.isFavorite ? 'checked' : ''}>
          Add to Quick Access Bar
        </label>
        <div class="modal-actions">
          <button class="cancel-btn">Cancel</button>
          <button class="save-btn">Save</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.cancel-btn').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.save-btn').addEventListener('click', () => {
      const title = modal.querySelector('#prompt-title').value.trim();
      const content = modal.querySelector('#prompt-content').value.trim();
      const isFavorite = modal.querySelector('#prompt-favorite').checked;
      if (!title || !content) return;

      const currentFolder = this.folders.find(f => f.id === this.currentFolderId);
      if (!currentFolder) return;

      if (prompt && index !== null) {
        currentFolder.prompts[index] = { title, content, isFavorite };
      } else {
        currentFolder.prompts.push({ title, content, isFavorite });
      }

      this.saveFolders();
      document.dispatchEvent(new CustomEvent('promptsUpdated'));
      modal.remove();
    });
  }

  /**
   * Deletes a folder
   * @param {string} folderId - The ID of the folder to delete
   */
  deleteFolder(folderId) {
    if (!confirm('Are you sure you want to delete this folder and all its prompts?')) return;

    const index = this.folders.findIndex(f => f.id === folderId);
    if (index === -1) return;

    this.folders.splice(index, 1);
    if (this.currentFolderId === folderId) {
      this.currentFolderId = this.folders.length > 0 ? this.folders[0].id : null;
    }

    this.saveFolders();
  }

  /**
   * Deletes a prompt
   * @param {number} index - The index of the prompt to delete
   */
  deletePrompt(index) {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    const currentFolder = this.folders.find(f => f.id === this.currentFolderId);
    if (!currentFolder) return;

    currentFolder.prompts.splice(index, 1);
    this.saveFolders();
  }

  /**
   * Filters the folder list based on a search query
   * @param {string} query - The search query
   */
  filterFolders(query) {
    this.renderFolderList(query);
  }

  /**
   * Saves folders to localStorage
   */
  async saveFolders() {
    try {
      await chrome.storage.local.set({ promptFolders: this.folders });
      this.renderFolderList();
    } catch (error) {
      console.error('Error saving folders:', error);
    }
  }

  /**
   * Gets all prompts marked as favorites
   * @returns {Array} Array of favorite prompts with folder information
   */
  getFavoritePrompts() {
    const favorites = [];
    this.folders.forEach(folder => {
      folder.prompts.forEach(prompt => {
        if (prompt.isFavorite) {
          favorites.push({
            ...prompt,
            folderId: folder.id,
            folderName: folder.name
          });
        }
      });
    });
    return favorites;
  }

  /**
   * Toggles favorite status of a prompt
   * @param {string} folderId - The ID of the folder containing the prompt
   * @param {number} promptIndex - The index of the prompt in the folder
   */
  toggleFavorite(folderId, promptIndex) {
    const folder = this.folders.find(f => f.id === folderId);
    if (!folder) return;

    const prompt = folder.prompts[promptIndex];
    if (!prompt) return;

    prompt.isFavorite = !prompt.isFavorite;
    this.saveFolders();
    
    // Dispatch event to notify QuickAccessBar
    document.dispatchEvent(new CustomEvent('promptsUpdated'));
  }
}

export default PromptManager;
