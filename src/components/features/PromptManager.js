var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class PromptManager {
    constructor() {
        this.folders = [];
        this.listeners = new Set();
        this.activeFolderId = null;
        this.settings = {
            theme: 'system',
            quickAccessEnabled: true,
            overlayEnabled: true,
            keyboardShortcuts: {
                toggleOverlay: "Ctrl+Shift+O",
                toggleQuickAccess: "Ctrl+Shift+A"
            }
        };
        this.loadState();
    }
    subscribe(callback) {
        this.listeners.add(callback);
        return () => {
            this.listeners.delete(callback);
        };
    }
    notifyListeners() {
        this.listeners.forEach(callback => callback());
    }
    loadState() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                chrome.storage.local.get(['folders', 'settings', 'activeFolderId'], (result) => {
                    if (result.folders) {
                        this.folders = result.folders;
                    }
                    if (result.settings) {
                        this.settings = result.settings;
                    }
                    if (result.activeFolderId) {
                        this.activeFolderId = result.activeFolderId;
                    }
                    resolve();
                });
            });
        });
    }
    getActiveFolderId() {
        return this.activeFolderId;
    }
    getFolderPrompts(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadState();
            const folder = this.folders.find(f => f.id === folderId);
            return (folder === null || folder === void 0 ? void 0 : folder.prompts) || [];
        });
    }
    getFolders() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadState();
            return this.folders;
        });
    }
    getFavoritePrompts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadState();
            return this.folders
                .flatMap((folder) => folder.prompts)
                .filter((prompt) => prompt.isFavorite);
        });
    }
    createFolder(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFolder = {
                id: Date.now().toString(),
                name,
                prompts: [],
                createdAt: Date.now(),
                updatedAt: Date.now()
            };
            this.folders.push(newFolder);
            yield this.saveFolders();
            this.notifyListeners();
            return newFolder;
        });
    }
    updateFolder(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.folders.findIndex((f) => f.id === folder.id);
            if (index !== -1) {
                this.folders[index] = folder;
                yield this.saveFolders();
                this.notifyListeners();
            }
        });
    }
    deleteFolder(folderId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.folders = this.folders.filter((folder) => folder.id !== folderId);
            if (this.activeFolderId === folderId) {
                this.activeFolderId = this.folders.length > 0 ? this.folders[0].id : null;
            }
            yield this.saveFolders();
            this.notifyListeners();
        });
    }
    createPrompt(promptData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPrompt = Object.assign(Object.assign({ id: Date.now().toString() }, promptData), { createdAt: Date.now(), updatedAt: Date.now() });
            const folder = this.folders.find((f) => f.id === promptData.folderId);
            if (folder) {
                folder.prompts.push(newPrompt);
                yield this.saveFolders();
                this.notifyListeners();
            }
            return newPrompt;
        });
    }
    updatePrompt(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            const folder = this.folders.find((f) => f.id === prompt.folderId);
            if (folder) {
                const index = folder.prompts.findIndex((p) => p.id === prompt.id);
                if (index !== -1) {
                    folder.prompts[index] = Object.assign(Object.assign({}, prompt), { updatedAt: Date.now() });
                    yield this.saveFolders();
                    this.notifyListeners();
                }
            }
        });
    }
    deletePrompt(promptId) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const folder of this.folders) {
                const index = folder.prompts.findIndex((p) => p.id === promptId);
                if (index !== -1) {
                    folder.prompts.splice(index, 1);
                    yield this.saveFolders();
                    this.notifyListeners();
                    break;
                }
            }
        });
    }
    selectPrompt(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementation depends on what should happen when a prompt is selected
            // For now, just notify listeners
            this.notifyListeners();
        });
    }
    saveFolders() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                chrome.storage.local.set({
                    folders: this.folders,
                    activeFolderId: this.activeFolderId
                }, () => {
                    resolve();
                });
            });
        });
    }
    getSettings() {
        return this.settings;
    }
    updateSettings(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign(Object.assign({}, this.settings), settings);
            return new Promise((resolve) => {
                chrome.storage.local.set({ settings: this.settings }, () => {
                    this.notifyListeners();
                    resolve();
                });
            });
        });
    }
}
