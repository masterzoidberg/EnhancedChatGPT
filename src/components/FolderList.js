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
            loadFolders();
        });
        return () => {
            unsubscribe();
        };
    }, [promptManager]);
    const loadFolders = () => __awaiter(void 0, void 0, void 0, function* () {
        const loadedFolders = yield promptManager.getFolders();
        setFolders(loadedFolders);
        const activeId = promptManager.getActiveFolderId();
        setActiveFolderId(activeId);
    });
    const handleFolderClick = (folderId) => {
        onFolderSelect(folderId);
    };
    return (_jsxs("div", { className: "p-4", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: "Folders" }), _jsx("div", { className: "space-y-2", children: folders.map((folder) => (_jsx("div", { className: `p-2 rounded cursor-pointer ${folder.id === activeFolderId ? 'bg-blue-100' : 'hover:bg-gray-100'}`, onClick: () => handleFolderClick(folder.id), children: folder.name }, folder.id))) })] }));
};
export default FolderList;
