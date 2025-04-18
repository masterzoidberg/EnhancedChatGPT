/**
 * Generate a unique ID
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
/**
 * Format a date to a readable string
 */
export const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};
/**
 * Check if the current theme is dark
 */
export const isDarkTheme = (settings) => {
    if (settings.theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return settings.theme === 'dark';
};
/**
 * Apply theme to the document
 */
export const applyTheme = (settings) => {
    const isDark = isDarkTheme(settings);
    document.documentElement.classList.toggle('dark', isDark);
};
/**
 * Debounce a function
 */
export const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};
/**
 * Find a prompt by ID
 */
export const findPrompt = (folders, promptId) => {
    for (const folder of folders) {
        const prompt = folder.prompts.find((p) => p.id === promptId);
        if (prompt) {
            return prompt;
        }
    }
    return undefined;
};
/**
 * Find a folder by ID
 */
export const findFolder = (folders, folderId) => {
    return folders.find((folder) => folder.id === folderId);
};
/**
 * Move a prompt to a different folder
 */
export const movePrompt = (folders, promptId, sourceFolderId, targetFolderId) => {
    const sourceFolder = findFolder(folders, sourceFolderId);
    const targetFolder = findFolder(folders, targetFolderId);
    if (!sourceFolder || !targetFolder) {
        return folders;
    }
    const prompt = sourceFolder.prompts.find((p) => p.id === promptId);
    if (!prompt) {
        return folders;
    }
    return folders.map((folder) => {
        if (folder.id === sourceFolderId) {
            return Object.assign(Object.assign({}, folder), { prompts: folder.prompts.filter((p) => p.id !== promptId) });
        }
        if (folder.id === targetFolderId) {
            return Object.assign(Object.assign({}, folder), { prompts: [...folder.prompts, Object.assign(Object.assign({}, prompt), { folderId: targetFolderId })] });
        }
        return folder;
    });
};
/**
 * Validate prompt data
 */
export const validatePrompt = (prompt) => {
    return (typeof prompt.title === 'string' &&
        prompt.title.length > 0 &&
        typeof prompt.content === 'string' &&
        prompt.content.length > 0 &&
        typeof prompt.folderId === 'string' &&
        prompt.folderId.length > 0);
};
/**
 * Validate folder data
 */
export const validateFolder = (folder) => {
    return typeof folder.name === 'string' && folder.name.length > 0;
};
