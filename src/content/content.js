// Content script for ChatGPT Enhancer
(() => {
  // Check if we've already run on this page
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  // Initialize extension
  function initializeExtension() {
    try {
      // Create and inject the toggle button
      const toggleButton = document.createElement('button');
      toggleButton.id = 'chatgpt-enhancer-toggle';
      toggleButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      toggleButton.addEventListener('click', () => toggleOverlay());
      document.body.appendChild(toggleButton);

      // Create and inject the overlay panel
      const overlay = document.createElement('div');
      overlay.id = 'chatgpt-enhancer-overlay';
      overlay.className = 'hidden';
      document.body.appendChild(overlay);

      // Create and inject the backdrop
      const backdrop = document.createElement('div');
      backdrop.id = 'chatgpt-enhancer-backdrop';
      backdrop.className = 'hidden';
      document.body.appendChild(backdrop);

      // Create and inject the quick access bar
      const quickAccessBar = document.createElement('div');
      quickAccessBar.id = 'chatgpt-enhancer-quick-access-bar';
      quickAccessBar.className = 'hidden';
      document.body.appendChild(quickAccessBar);

      // Listen for messages from the popup
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        switch (message.type) {
          case 'TOGGLE_OVERLAY':
            toggleOverlay(message.isVisible);
            break;
          case 'TOGGLE_QUICK_ACCESS':
            toggleQuickAccess(message.isVisible);
            break;
          case 'INSERT_PROMPT':
            insertPrompt(message.prompt);
            break;
        }
      });

      // Listen for keyboard shortcuts
      document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'P') {
          toggleOverlay();
        }
      });

    } catch (error) {
      console.error('Error initializing ChatGPT Enhancer:', error);
    }
  }

  // Toggle overlay visibility
  function toggleOverlay(isVisible) {
    const overlay = document.getElementById('chatgpt-enhancer-overlay');
    const backdrop = document.getElementById('chatgpt-enhancer-backdrop');
    
    if (isVisible === undefined) {
      isVisible = overlay.classList.contains('hidden');
    }

    if (isVisible) {
      overlay.classList.remove('hidden');
      backdrop.classList.remove('hidden');
      setTimeout(() => {
        overlay.classList.add('visible');
        backdrop.classList.add('visible');
      }, 10);
    } else {
      overlay.classList.remove('visible');
      backdrop.classList.remove('visible');
      setTimeout(() => {
        overlay.classList.add('hidden');
        backdrop.classList.add('hidden');
      }, 200);
    }
  }

  // Toggle quick access bar visibility
  function toggleQuickAccess(isVisible) {
    const quickAccessBar = document.getElementById('chatgpt-enhancer-quick-access-bar');
    
    if (isVisible === undefined) {
      isVisible = quickAccessBar.classList.contains('hidden');
    }

    if (isVisible) {
      quickAccessBar.classList.remove('hidden');
    } else {
      quickAccessBar.classList.add('hidden');
    }
  }

  // Insert prompt into the chat input
  function insertPrompt(prompt) {
    const textarea = document.querySelector('textarea[data-id="root"]');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      
      textarea.value = before + prompt + after;
      textarea.selectionStart = textarea.selectionEnd = start + prompt.length;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Initialize when the page is fully loaded
  if (document.readyState === 'complete') {
    initializeExtension();
  } else {
    window.addEventListener('load', initializeExtension);
  }
})(); 