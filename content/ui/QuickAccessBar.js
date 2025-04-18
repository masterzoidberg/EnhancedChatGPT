// QuickAccessBar.js - Manages the quick access bar above the input
import PromptManager from './PromptManager.js';

class QuickAccessBar {
  constructor(promptManager) {
    this.promptManager = promptManager;
    this.container = null;
    this.formParent = null;
    this.retryCount = 0;
    this.maxRetries = 10;
    this.retryInterval = 500;
    this.isAttached = false;
  }

  async initialize() {
    this.container = document.createElement('div');
    this.container.id = 'chatgpt-enhancer-quick-access-bar';
    await this.render();
    this.setupEventListeners();
    this.findAndAttachToForm();
  }

  async render() {
    if (!this.container) return;
    
    this.container.innerHTML = '';
    
    // Handle cases where promptManager isn't available yet
    let favoritePrompts = [];
    try {
      if (this.promptManager && typeof this.promptManager.getFavoritePrompts === 'function') {
        favoritePrompts = await this.promptManager.getFavoritePrompts();
      }
    } catch (error) {
      console.error('Error getting favorite prompts:', error);
    }
    
    if (!favoritePrompts || favoritePrompts.length === 0) {
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'flex';
    favoritePrompts.forEach(prompt => {
      const button = document.createElement('button');
      button.textContent = prompt.title;
      button.title = prompt.content;
      button.addEventListener('click', () => this.insertPrompt(prompt));
      this.container.appendChild(button);
    });
  }

  findAndAttachToForm() {
    // More specific selector for ChatGPT's form
    const form = document.querySelector('form:has(textarea[placeholder*="Send a message"])');
    if (!form) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        setTimeout(() => this.findAndAttachToForm(), this.retryInterval);
      }
      return;
    }

    // Find the appropriate parent element for insertion
    const formParent = form.closest('div[class*="stretch"]') || form.parentElement;
    if (!formParent) return;

    // Only proceed if we haven't already attached or if the container was removed
    if (!this.isAttached || !document.body.contains(this.container)) {
      // Insert before the form's parent to avoid disrupting the form structure
      formParent.parentElement?.insertBefore(this.container, formParent);
      this.formParent = formParent;
      this.isAttached = true;
      this.retryCount = 0;
    }
  }

  setupEventListeners() {
    // Listen for navigation events and DOM changes
    const observer = new MutationObserver((mutations) => {
      // Check if our container is still in the document
      if (!document.body.contains(this.container)) {
        this.isAttached = false;
        this.findAndAttachToForm();
      }

      // Check if the form structure has changed
      const form = document.querySelector('form:has(textarea[placeholder*="Send a message"])');
      if (form && this.formParent && !document.body.contains(this.formParent)) {
        this.isAttached = false;
        this.findAndAttachToForm();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Listen for favorite prompts updates
    window.addEventListener('favoritesUpdated', async () => {
      await this.render();
      if (!this.isAttached) {
        this.findAndAttachToForm();
      }
    });

    // Cleanup on page unload
    window.addEventListener('unload', () => {
      observer.disconnect();
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
    });
  }

  insertPrompt(prompt) {
    const textarea = document.querySelector('form textarea[placeholder*="Send a message"]');
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;
    
    textarea.value = text.substring(0, startPos) + prompt.content + text.substring(endPos);
    
    // Set cursor position after inserted text
    const newCursorPos = startPos + prompt.content.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    
    // Focus and trigger input event
    textarea.focus();
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

export default QuickAccessBar;