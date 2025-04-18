// OverlayPanel.js - Manages the overlay panel UI and interactions
import PromptManager from './PromptManager.js';

class OverlayPanel {
  constructor() {
    this.container = null;
    this.leftPane = null;
    this.rightPane = null;
    this.initialize();
  }

  initialize() {
    this.container = document.getElementById('chatgpt-enhancer-overlay');
    if (!this.container) return;

    // Create header
    const header = document.createElement('div');
    header.className = 'overlay-header';
    header.innerHTML = `
      <h2>ChatGPT Enhancer</h2>
      <button class="close-button" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    `;

    // Create main content area with two panes
    const content = document.createElement('div');
    content.className = 'overlay-content';

    // Left pane - Folder tree
    this.leftPane = document.createElement('div');
    this.leftPane.className = 'overlay-pane left';
    this.leftPane.innerHTML = `
      <div class="pane-header">
        <h3>Folders</h3>
        <button class="add-folder-button" aria-label="Add Folder">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </button>
      </div>
      <div class="folder-tree"></div>
    `;

    // Right pane - Prompt list/editor
    this.rightPane = document.createElement('div');
    this.rightPane.className = 'overlay-pane right';
    this.rightPane.innerHTML = `
      <div class="pane-header">
        <h3>Prompts</h3>
        <button class="add-prompt-button" aria-label="Add Prompt">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </button>
      </div>
      <div class="prompt-list"></div>
    `;

    // Assemble the overlay
    content.appendChild(this.leftPane);
    content.appendChild(this.rightPane);
    this.container.appendChild(header);
    this.container.appendChild(content);

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close button handler
    const closeButton = this.container.querySelector('.close-button');
    closeButton?.addEventListener('click', () => {
      this.container.classList.remove('visible');
      const backdrop = document.getElementById('chatgpt-enhancer-backdrop');
      backdrop?.classList.remove('visible');
    });

    // Add folder button handler
    const addFolderButton = this.container.querySelector('.add-folder-button');
    addFolderButton?.addEventListener('click', () => {
      // Will implement folder creation later
      console.log('Add folder clicked');
    });

    // Add prompt button handler
    const addPromptButton = this.container.querySelector('.add-prompt-button');
    addPromptButton?.addEventListener('click', () => {
      // Will implement prompt creation later
      console.log('Add prompt clicked');
    });
  }
}

export default OverlayPanel;