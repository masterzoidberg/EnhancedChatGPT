import { MessageType } from '@/types/messages';

// Initialize extension state
chrome.runtime.onInstalled.addListener(() => {
  // Set default extension state
  chrome.storage.local.set({
    isEnabled: true,
    folders: [],
    settings: {
      theme: 'system',
      quickAccessEnabled: true,
      overlayEnabled: true,
    },
  });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MessageType.GET_STATE:
      chrome.storage.local.get(['isEnabled', 'settings'], (result) => {
        sendResponse(result);
      });
      break;

    case MessageType.UPDATE_SETTINGS:
      chrome.storage.local.set({ settings: message.settings }, () => {
        sendResponse({ success: true });
      });
      break;

    case MessageType.TOGGLE_EXTENSION:
      chrome.storage.local.get(['isEnabled'], (result) => {
        const newState = !result.isEnabled;
        chrome.storage.local.set({ isEnabled: newState }, () => {
          // Notify all tabs about the state change
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              if (tab.id) {
                chrome.tabs.sendMessage(tab.id, {
                  type: MessageType.STATE_CHANGED,
                  isEnabled: newState,
                });
              }
            });
          });
          sendResponse({ success: true, isEnabled: newState });
        });
      });
      break;
  }

  // Return true to indicate we will respond asynchronously
  return true;
});

// Handle tab updates to inject content script when needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('chat.openai.com')) {
    chrome.storage.local.get(['isEnabled'], (result) => {
      if (result.isEnabled) {
        chrome.tabs.sendMessage(tabId, {
          type: MessageType.INITIALIZE,
        });
      }
    });
  }
}); 