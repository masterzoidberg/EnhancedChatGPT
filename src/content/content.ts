// Immediately-invoked content script
(() => {
  class ContentScript {
    private isInitialized = false;

    constructor() {
      this.initialize();
    }

    private initialize() {
      if (this.isInitialized) return;
      this.isInitialized = true;

      // Example: Add a custom button to the ChatGPT page
      this.injectOverlayButton();

      // Notify background script (optional hook)
      chrome.runtime.sendMessage({ type: 'contentScriptReady' });
    }

    private injectOverlayButton() {
      const existing = document.getElementById('chatgpt-enhancer-btn');
      if (existing) return;

      const button = document.createElement('button');
      button.id = 'chatgpt-enhancer-btn';
      button.innerText = '⚙️ Enhancer';
      button.style.position = 'fixed';
      button.style.top = '10px';
      button.style.right = '10px';
      button.style.zIndex = '9999';
      button.style.padding = '6px 12px';
      button.style.backgroundColor = '#10a37f';
      button.style.color = '#fff';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.fontSize = '14px';
      button.style.cursor = 'pointer';

      button.onclick = () => {
        alert('ChatGPT Enhancer clicked!');
        // You can later dynamically import components here
      };

      document.body.appendChild(button);
    }
  }

  // Start the content script
  new ContentScript();
})();
