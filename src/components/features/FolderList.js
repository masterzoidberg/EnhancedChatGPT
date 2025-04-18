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
import { useEffect, useState } from 'react';
const FolderList = ({ promptManager, onFolderSelect }) => {
    const [folders, setFolders] = useState([]);
    const [activeFolderId, setActiveFolderId] = useState(null);
    useEffect(() => {
        loadFolders();
        const unsubscribe = promptManager.subscribe(() => {
            void loadFolders();
        });
        return () => {
            unsubscribe();
        };
    }, [promptManager]);
    const loadFolders = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const loadedFolders = yield promptManager.getFolders();
            setFolders(loadedFolders);
            const activeId = promptManager.getActiveFolderId();
            setActiveFolderId(activeId);
        }
        catch (error) {
            console.error('Error loading folders:', error);
            setFolders([]);
            setActiveFolderId(null);
        }
    });
    const handleFolderClick = (folderId) => {
        onFolderSelect(folderId);
    };
    const handleCreateFolder = () => __awaiter(void 0, void 0, void 0, function* () {
        const name = window.prompt('Enter folder name:');
        if (name) {
            const newFolder = yield promptManager.createFolder(name);
            const updatedFolders = yield promptManager.getFolders(); // Get the updated folders
            setFolders(updatedFolders); // Update local state with new folders
            handleFolderClick(newFolder.id); // Select the newly created folder
        }
    });
    const style = {
        borderRight: '1px solid #ccc',
        padding: '10px',
        height: '100%', // Take full height of its container
        overflowY: 'auto', // Add scroll if folders exceed height
        minWidth: '150px', // Ensure sidebar has some width
        backgroundColor: '#f7f7f7', // Slightly different background for sidebar
    };
    const newFolderButtonStyle = {
        width: '100%',
        padding: '8px',
        marginTop: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    };
    return (_jsxs("div", { style: style, children: [_jsx("h4", { children: "Folders" }), _jsx("div", { className: "space-y-2", children: folders.map((folder) => (_jsx("div", { className: `p-2 rounded cursor-pointer ${folder.id === activeFolderId ? 'bg-blue-100' : 'hover:bg-gray-100'}`, onClick: () => handleFolderClick(folder.id), children: folder.name }, folder.id))) }), _jsx("button", { style: newFolderButtonStyle, onClick: handleCreateFolder, children: "+ New Folder" })] }));
};
export default FolderList;
