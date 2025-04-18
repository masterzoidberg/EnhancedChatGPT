import { MessageType } from '../types/messages';
const defaultSettings = {
    theme: 'system',
    quickAccessEnabled: true,
    overlayEnabled: true,
    keyboardShortcuts: {
        toggleOverlay: 'Alt+Shift+O',
        toggleQuickAccess: 'Alt+Shift+Q'
    }
};
// Initialize extension state
let state = {
    isEnabled: true,
    settings: defaultSettings,
    folders: []
};
// Load state from storage
chrome.storage.local.get(['state'], (result) => {
    if (result.state) {
        state = result.state;
    }
    else {
        chrome.storage.local.set({ state });
    }
});
// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    let favoritePrompts = [];
    switch (message.type) {
        case MessageType.GET_STATE:
            sendResponse(state);
            break;
        case MessageType.TOGGLE_ENABLED:
            state.isEnabled = !state.isEnabled;
            chrome.storage.local.set({ state });
            sendResponse(state);
            break;
        case MessageType.UPDATE_SETTINGS:
            if (message.settings) {
                state.settings = Object.assign(Object.assign({}, state.settings), message.settings);
                chrome.storage.local.set({ state });
            }
            sendResponse(state);
            break;
        case MessageType.GET_FAVORITE_PROMPTS:
            favoritePrompts = state.folders
                .flatMap(folder => folder.prompts)
                .filter(prompt => prompt.isFavorite);
            sendResponse(favoritePrompts);
            break;
        case MessageType.SAVE_PROMPT:
            if (message.prompt) {
                const folder = state.folders.find(f => { var _a; return f.id === ((_a = message.prompt) === null || _a === void 0 ? void 0 : _a.folderId); });
                if (folder) {
                    const promptIndex = folder.prompts.findIndex(p => { var _a; return p.id === ((_a = message.prompt) === null || _a === void 0 ? void 0 : _a.id); });
                    if (promptIndex >= 0) {
                        folder.prompts[promptIndex] = message.prompt;
                    }
                    else {
                        folder.prompts.push(message.prompt);
                    }
                    chrome.storage.local.set({ state });
                }
            }
            sendResponse(state);
            break;
    }
});
// Handle tab updates to inject content scripts
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var _a;
    if (changeInfo.status === 'complete' && ((_a = tab.url) === null || _a === void 0 ? void 0 : _a.includes('chat.openai.com'))) {
        chrome.scripting.executeScript({
            target: { tabId },
            files: ['content/content.js']
        }).catch(err => console.error('Failed to inject content script:', err));
        chrome.scripting.insertCSS({
            target: { tabId },
            files: ['content/contentStyle.css']
        }).catch(err => console.error('Failed to inject CSS:', err));
    }
});
