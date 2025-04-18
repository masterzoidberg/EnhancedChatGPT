import { useState, useCallback } from 'react';
import { generateId, validateFolder, validatePrompt } from '@/utils/helpers';
export function usePrompts({ initialFolders = [] } = {}) {
    const [folders, setFolders] = useState(initialFolders);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const createFolder = useCallback((name) => {
        if (!validateFolder({ name })) {
            throw new Error('Invalid folder name');
        }
        const newFolder = {
            id: generateId(),
            name,
            prompts: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        setFolders((prev) => [...prev, newFolder]);
        return newFolder;
    }, []);
    const deleteFolder = useCallback((folderId) => {
        setFolders((prev) => prev.filter((folder) => folder.id !== folderId));
        if ((selectedFolder === null || selectedFolder === void 0 ? void 0 : selectedFolder.id) === folderId) {
            setSelectedFolder(null);
        }
    }, [selectedFolder]);
    const createPrompt = useCallback((folderId, title, content, isFavorite = false) => {
        if (!validatePrompt({ title, content, folderId })) {
            throw new Error('Invalid prompt data');
        }
        const newPrompt = {
            id: generateId(),
            title,
            content,
            isFavorite,
            folderId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setFolders((prev) => prev.map((folder) => folder.id === folderId
            ? Object.assign(Object.assign({}, folder), { prompts: [...folder.prompts, newPrompt] }) : folder));
        return newPrompt;
    }, []);
    const updatePrompt = useCallback((prompt) => {
        if (!validatePrompt(prompt)) {
            throw new Error('Invalid prompt data');
        }
        setFolders((prev) => prev.map((folder) => folder.id === prompt.folderId
            ? Object.assign(Object.assign({}, folder), { prompts: folder.prompts.map((p) => p.id === prompt.id ? Object.assign(Object.assign({}, prompt), { updatedAt: Date.now() }) : p) }) : folder));
    }, []);
    const deletePrompt = useCallback((folderId, promptId) => {
        setFolders((prev) => prev.map((folder) => folder.id === folderId
            ? Object.assign(Object.assign({}, folder), { prompts: folder.prompts.filter((p) => p.id !== promptId) }) : folder));
    }, []);
    const toggleFavorite = useCallback((folderId, promptId) => {
        setFolders((prev) => prev.map((folder) => folder.id === folderId
            ? Object.assign(Object.assign({}, folder), { prompts: folder.prompts.map((p) => p.id === promptId ? Object.assign(Object.assign({}, p), { isFavorite: !p.isFavorite }) : p) }) : folder));
    }, []);
    const getFavoritePrompts = useCallback(() => {
        return folders.flatMap((folder) => folder.prompts.filter((prompt) => prompt.isFavorite));
    }, [folders]);
    return {
        folders,
        selectedFolder,
        setSelectedFolder,
        createFolder,
        deleteFolder,
        createPrompt,
        updatePrompt,
        deletePrompt,
        toggleFavorite,
        getFavoritePrompts,
    };
}
