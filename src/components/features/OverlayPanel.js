var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/OverlayPanel.tsx
import { useState, useEffect } from 'react';
import FolderList from './FolderList';
import { PromptList } from './PromptList';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
export const OverlayPanel = ({ promptManager, isVisible, onClose }) => {
    const [activeFolderId, setActiveFolderId] = useState(null);
    const [prompts, setPrompts] = useState([]);
    useEffect(() => {
        if (isVisible) {
            setActiveFolderId(promptManager.getActiveFolderId());
            loadPrompts();
        }
    }, [isVisible, promptManager]);
    useEffect(() => {
        if (activeFolderId) {
            loadPrompts();
        }
    }, [activeFolderId]);
    useEffect(() => {
        // Subscribe to PromptManager updates
        const unsubscribe = promptManager.subscribe(() => {
            loadPrompts();
        });
        return () => {
            unsubscribe();
        };
    }, [promptManager]);
    const loadPrompts = () => __awaiter(void 0, void 0, void 0, function* () {
        if (activeFolderId) {
            const folderPrompts = yield promptManager.getFolderPrompts(activeFolderId);
            setPrompts(folderPrompts);
        }
    });
    const handleFolderSelect = (folderId) => {
        setActiveFolderId(folderId);
    };
    const handlePromptClick = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
        yield promptManager.selectPrompt(prompt);
    });
    const handlePromptEdit = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
        yield promptManager.updatePrompt(prompt);
    });
    const handlePromptDelete = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
        yield promptManager.deletePrompt(prompt.id);
    });
    const handlePromptFavorite = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedPrompt = Object.assign(Object.assign({}, prompt), { isFavorite: !prompt.isFavorite });
        yield promptManager.updatePrompt(updatedPrompt);
    });
    if (!isVisible)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50", children: _jsxs(Card, { className: "w-[70vw] max-w-[1000px] h-[80vh] max-h-[600px] flex", children: [_jsx("div", { className: "w-1/3 border-r", children: _jsx(FolderList, { promptManager: promptManager, onFolderSelect: handleFolderSelect }) }), _jsxs("div", { className: "flex-1 relative p-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "absolute top-2 right-2", children: "\u2716" }), _jsx(PromptList, { prompts: prompts, onPromptClick: handlePromptClick, onPromptEdit: handlePromptEdit, onPromptDelete: handlePromptDelete, onPromptFavorite: handlePromptFavorite })] })] }) }));
};
// --- Styles --- (Keep existing, add closeButton if needed)
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 9998,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    panel: {
        backgroundColor: 'white',
        padding: '0', // Remove padding here, apply to inner sections
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        overflow: 'hidden', // Prevent content overflow before inner scroll
    },
    closeButton: {
        position: 'absolute', // Position relative to the panel
        top: '8px', // Adjust position slightly
        right: '8px',
        background: 'none',
        border: 'none',
        fontSize: '1.4em', // Slightly larger
        cursor: 'pointer',
        padding: '5px',
        lineHeight: '1',
        zIndex: 10, // Ensure it's above PromptList content
    }
};
