import { MessageType } from '@/types/messages';
import { ExtensionSettings } from '@/types/messages';

// Get DOM elements
const toggleExtension = document.getElementById('toggleExtension') as HTMLButtonElement;
const quickAccessEnabled = document.getElementById('quickAccessEnabled') as HTMLInputElement;
const overlayEnabled = document.getElementById('overlayEnabled') as HTMLInputElement;
const themeSelect = document.getElementById('theme') as HTMLSelectElement;
const managePrompts = document.getElementById('managePrompts') as HTMLButtonElement;

// Load current settings
chrome.storage.local.get(['isEnabled', 'settings'], (result) => {
  if (result.isEnabled !== undefined) {
    toggleExtension.classList.toggle('active', result.isEnabled);
  }

  if (result.settings) {
    const settings = result.settings as ExtensionSettings;
    quickAccessEnabled.checked = settings.quickAccessEnabled;
    overlayEnabled.checked = settings.overlayEnabled;
    themeSelect.value = settings.theme;
  }
});

// Handle extension toggle
toggleExtension.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: MessageType.TOGGLE_EXTENSION }, (response) => {
    if (response.success) {
      toggleExtension.classList.toggle('active', response.isEnabled);
    }
  });
});

// Handle settings changes
quickAccessEnabled.addEventListener('change', () => {
  updateSettings({ quickAccessEnabled: quickAccessEnabled.checked });
});

overlayEnabled.addEventListener('change', () => {
  updateSettings({ overlayEnabled: overlayEnabled.checked });
});

themeSelect.addEventListener('change', () => {
  updateSettings({ theme: themeSelect.value as 'system' | 'light' | 'dark' });
});

// Handle manage prompts button
managePrompts.addEventListener('click', () => {
  chrome.tabs.create({ url: 'options.html' });
});

// Update settings in storage
function updateSettings(settings: Partial<ExtensionSettings>) {
  chrome.storage.local.get(['settings'], (result) => {
    const currentSettings = result.settings || {};
    const newSettings = { ...currentSettings, ...settings };
    chrome.storage.local.set({ settings: newSettings }, () => {
      // Notify content script of settings change
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: MessageType.UPDATE_SETTINGS,
            settings: newSettings,
          });
        }
      });
    });
  });
}

// Listen for settings changes from other parts of the extension
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === MessageType.STATE_CHANGED) {
    toggleExtension.classList.toggle('active', message.isEnabled);
  }
}); 