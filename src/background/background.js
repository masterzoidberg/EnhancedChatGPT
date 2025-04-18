// ChatGPT Enhancer - Background script
console.log('ChatGPT Enhancer background script loaded');

// This function logs icon paths to help with debugging
function logIconPaths() {
  const iconSizes = [16, 32, 48, 128];
  console.log('Icon paths that should exist:');
  
  iconSizes.forEach(size => {
    const path = `assets/icon${size}.png`;
    console.log(`- ${path}`);
  });
}

// Initialize when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log('ChatGPT Enhancer extension installed/updated');
  
  // Log icon paths for debugging
  logIconPaths();
  
  // Initialize storage with default values
  chrome.storage.local.set({
    isEnabled: true,
    settings: {
      theme: 'system',
      quickAccessEnabled: true,
      overlayEnabled: true
    },
    folders: []
  }, () => {
    console.log('Default settings initialized');
  });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background script received message:', message);
  
  // Simple message acknowledgment
  sendResponse({ status: 'received' });
  return true;
});

// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('chat.openai.com')) {
    console.log('ChatGPT page detected');
  }
});

// Set up the extension icon to show enabled/disabled state
function updateIcon(isEnabled) {
  const iconPath = isEnabled 
    ? {
        16: 'assets/icon16.png',
        32: 'assets/icon32.png',
        48: 'assets/icon48.png',
        128: 'assets/icon128.png'
      }
    : {
        16: 'assets/icon16-disabled.png',
        32: 'assets/icon32-disabled.png',
        48: 'assets/icon48-disabled.png',
        128: 'assets/icon128-disabled.png'
      };
  
  chrome.action.setIcon({ path: iconPath });
}

// Initialize icon state
chrome.storage.local.get('isEnabled', (result) => {
  const isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
  updateIcon(isEnabled);
});