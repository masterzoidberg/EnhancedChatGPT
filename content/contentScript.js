// contentScript.js - ChatGPT Enhancer

(() => {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  console.log('ChatGPT Enhancer: Content script loaded');

  // Module URLs
  const QuickAccessBarURL = chrome.runtime.getURL('content/ui/QuickAccessBar.js');
  const OverlayPanelURL = chrome.runtime.getURL('content/ui/OverlayPanel.js');
  const SidebarManagerURL = chrome.runtime.getURL('content/ui/SidebarManager.js');
  const PromptManagerURL = chrome.runtime.getURL('content/ui/PromptManager.js');

  class OverlayManager {
    constructor() {
      this.isVisible = false;
      this.overlay = null;
      this.backdrop = null;
      this.toggleButton = null;
      this.initialize();
    }

    initialize() {
      this.createOverlay();
      this.createBackdrop();
      this.createToggleButton();
      this.setupEventListeners();
    }

    createOverlay() {
      this.overlay = document.createElement('div');
      this.overlay.id = 'chatgpt-enhancer-overlay';
      document.body.appendChild(this.overlay);
    }

    createBackdrop() {
      this.backdrop = document.createElement('div');
      this.backdrop.id = 'chatgpt-enhancer-backdrop';
      document.body.appendChild(this.backdrop);
    }

    createToggleButton() {
      this.toggleButton = document.createElement('button');
      this.toggleButton.id = 'chatgpt-enhancer-toggle';
      this.toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      `;
      document.body.appendChild(this.toggleButton);
    }

    setupEventListeners() {
      this.toggleButton.addEventListener('click', () => this.toggle());
      this.backdrop.addEventListener('click', () => this.hide());

      // Handle keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isVisible) {
          this.hide();
        }
      });

      // Handle navigation (for SPAs)
      const observer = new MutationObserver(() => {
        if (!document.body.contains(this.overlay)) {
          this.initialize();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    show() {
      this.isVisible = true;
      this.overlay.classList.add('visible');
      this.backdrop.classList.add('visible');
      document.body.style.overflow = 'hidden';
    }

    hide() {
      this.isVisible = false;
      this.overlay.classList.remove('visible');
      this.backdrop.classList.remove('visible');
      document.body.style.overflow = '';
    }

    toggle() {
      if (this.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    }
  }

  // Initialize the overlay
  const overlayManager = new OverlayManager();

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TOGGLE_OVERLAY') {
      overlayManager.toggle();
    }
    sendResponse({ success: true });
  });
})();