// background.js - ChatGPT Enhancer Extension Service Worker (Minimal Version)

// Initialize local storage on install only
chrome.runtime.onInstalled.addListener(() => {
  console.log('ChatGPT Enhancer installed - safe mode active');
  
  // Clear existing context menus to prevent duplicates
  chrome.contextMenus.removeAll();
  
  // Initialize storage if needed - minimal setup
  chrome.storage.local.get(['promptFolders'], (result) => {
    if (!result.promptFolders) {
      chrome.storage.local.set({ promptFolders: [] });
    }
  });
});

// Simple message handling
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  sendResponse({status: 'received'});
  return true; // Keep message channel open
});

console.log('ChatGPT Enhancer background script loaded - safe mode active');