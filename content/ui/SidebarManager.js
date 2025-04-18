/**
 * Manages the Chat Organization Sidebar feature.
 * Handles injection, UI creation, folder management, drag-and-drop, and persistence.
 */
class SidebarManager {
    constructor() {
        this.folders = this.loadFolders(); // { id: { name: string, chatIds: string[] } }
        this.chatFolderMap = this.loadChatFolderMap(); // { chatId: folderId }
        this.chatFoldersContainer = null;
        this.nativeSidebarNav = null;
    }

    /**
     * Loads folders from localStorage.
     * @returns {object} The loaded folders object.
     */
    loadFolders() {
        const storedFolders = localStorage.getItem('chatGptEnhancer_folders');
        try {
            return storedFolders ? JSON.parse(storedFolders) : {};
        } catch (e) {
            console.error("Error parsing folders from localStorage:", e);
            return {};
        }
    }

    /**
     * Saves folders to localStorage.
     */
    saveFolders() {
        localStorage.setItem('chatGptEnhancer_folders', JSON.stringify(this.folders));
        this.updateChatFolderMap(); // Ensure map is consistent after folder changes
        this.saveChatFolderMap();
        
        // Re-render folders in both UIs if needed
        this.renderFolders();
    }

    /**
     * Loads the chat-to-folder mapping from localStorage.
     * @returns {object} The loaded chat-folder map object.
     */
    loadChatFolderMap() {
        const storedMap = localStorage.getItem('chatGptEnhancer_chatFolderMap');
         try {
            return storedMap ? JSON.parse(storedMap) : {};
        } catch (e) {
            console.error("Error parsing chatFolderMap from localStorage:", e);
            return {};
        }
    }

    /**
     * Saves the chat-to-folder mapping to localStorage.
     */
    saveChatFolderMap() {
        localStorage.setItem('chatGptEnhancer_chatFolderMap', JSON.stringify(this.chatFolderMap));
    }

    /**
     * Updates the internal chatFolderMap based on the current state of folders.
     * Removes mappings for chats whose folders no longer exist.
     */
    updateChatFolderMap() {
        const updatedMap = {};
        Object.values(this.folders).forEach(folder => {
            folder.chatIds.forEach(chatId => {
                updatedMap[chatId] = folder.id;
            });
        });
        this.chatFolderMap = updatedMap;
    }


    /**
     * Initializes the sidebar manager by finding the target element and injecting the UI.
     */
    init() {
        console.log("SidebarManager: Initializing...");
        try {
            // Try to find the sidebar immediately first
            this.nativeSidebarNav = document.querySelector('nav[aria-label="Chat history"]');
            
            if (this.nativeSidebarNav) {
                console.log("SidebarManager: Native sidebar nav found immediately.");
                this.injectChatFoldersSection();
                this.renderFolders();
                this.observeNativeChatList();
                return;
            }
            
            // If not found, use MutationObserver to wait for it
            const observer = new MutationObserver((mutationsList, observer) => {
                try {
                    // Look for the specific nav element used by ChatGPT for chats
                    // Try multiple possible selectors
                    this.nativeSidebarNav = document.querySelector('nav[aria-label="Chat history"]') ||
                                           document.querySelector('nav[data-testid="chat-history"]') ||
                                           document.querySelector('nav.flex-col');
    
                    if (this.nativeSidebarNav) {
                        console.log("SidebarManager: Native sidebar nav found.");
                        this.injectChatFoldersSection();
                        this.renderFolders();
                        this.observeNativeChatList(); // Start observing the native list
                        observer.disconnect(); // Stop observing once found
                    } else {
                        console.log("SidebarManager: Waiting for native sidebar nav...");
                    }
                } catch (error) {
                    console.error("SidebarManager: Error in observer callback", error);
                }
            });
    
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Set a timeout to stop looking after a reasonable time
            setTimeout(() => {
                if (!this.nativeSidebarNav) {
                    console.warn("SidebarManager: Timed out waiting for sidebar nav");
                    observer.disconnect();
                }
            }, 30000); // 30 seconds timeout
        } catch (error) {
            console.error("SidebarManager: Error initializing", error);
        }
    }

    /**
     * Injects the main "Chat Folders" collapsible section into the native sidebar.
     */
    injectChatFoldersSection() {
        if (!this.nativeSidebarNav) {
            console.error("SidebarManager: Cannot inject, native sidebar nav not found.");
            return;
        }

        // Check if already injected
        if (document.getElementById('chat-folders-section')) {
            console.log("SidebarManager: Chat Folders section already injected.");
            return;
        }

        console.log("SidebarManager: Injecting Chat Folders section...");

        const sectionContainer = document.createElement('div');
        sectionContainer.id = 'chat-folders-section';
        sectionContainer.className = 'mt-5'; // Add some margin top

        const detailsElement = document.createElement('details');
        detailsElement.className = 'group';
        detailsElement.open = true; // Start open by default

        const summaryElement = document.createElement('summary');
        summaryElement.className = 'flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-700 group-open:bg-gray-700'; // Basic styling
        summaryElement.innerHTML = `
            <span class="text-sm font-medium text-gray-100">Chat Folders</span>
            <svg class="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        `;

        this.chatFoldersContainer = document.createElement('div');
        this.chatFoldersContainer.className = 'mt-2 space-y-1 pl-2 pr-1'; // Indentation and spacing

        // Add "Create New Folder" button
        const createButton = document.createElement('button');
        createButton.textContent = '+ New Folder';
        createButton.className = 'w-full text-left px-2 py-1 text-sm text-gray-300 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500';
        createButton.onclick = () => this.promptForNewFolder();

        detailsElement.appendChild(summaryElement);
        detailsElement.appendChild(this.chatFoldersContainer);
        detailsElement.appendChild(createButton); // Add button inside the details element

        sectionContainer.appendChild(detailsElement);

        // Safer injection approach
        try {
            // Try to find a good insertion point
            const firstChatItem = this.nativeSidebarNav.querySelector('a[href^="/c/"]');
            
            if (firstChatItem) {
                // Find the closest parent that is a direct child of nativeSidebarNav
                let parent = firstChatItem;
                while (parent && parent.parentNode !== this.nativeSidebarNav) {
                    parent = parent.parentNode;
                    if (!parent || parent === document.body) break;
                }
                
                if (parent && parent.parentNode === this.nativeSidebarNav) {
                    // Found a valid insertion point
                    this.nativeSidebarNav.insertBefore(sectionContainer, parent);
                    console.log("SidebarManager: Inserted before first chat item");
                } else {
                    // Fallback to prepend
                    this.nativeSidebarNav.prepend(sectionContainer);
                    console.log("SidebarManager: Prepended to sidebar (no valid insertion point)");
                }
            } else {
                // No chats found, just append
                this.nativeSidebarNav.appendChild(sectionContainer);
                console.log("SidebarManager: Appended to sidebar (no chats found)");
            }
        } catch (error) {
            // Last resort fallback
            console.error("SidebarManager: Error inserting section, using fallback", error);
            try {
                this.nativeSidebarNav.appendChild(sectionContainer);
            } catch (e) {
                console.error("SidebarManager: Critical error inserting section", e);
            }
        }
         console.log("SidebarManager: Chat Folders section injected.");
    }

    /**
     * Renders the list of folders and their contents.
     */
    renderFolders() {
        // If we're using the container-based approach (overlay panel)
        if (this.folderListContainer) {
            this.renderFoldersInContainer();
            return;
        }
        
        // Otherwise, render in the sidebar
        if (!this.chatFoldersContainer) return;

        console.log("SidebarManager: Rendering folders in sidebar...");
        this.chatFoldersContainer.innerHTML = ''; // Clear existing folders

        Object.values(this.folders).sort((a, b) => a.name.localeCompare(b.name)).forEach(folder => {
            const folderElement = this.createFolderElement(folder);
            this.chatFoldersContainer.appendChild(folderElement);
        });
        this.makeFoldersDropTargets(); // Re-apply drop target logic after re-render
        console.log("SidebarManager: Folders rendered in sidebar.");
    }

    /**
     * Creates the DOM element for a single folder.
     * @param {object} folder - The folder object { id, name, chatIds }.
     * @returns {HTMLElement} The created folder element.
     */
    createFolderElement(folder) {
        const folderDiv = document.createElement('div');
        folderDiv.id = `folder-${folder.id}`;
        folderDiv.className = 'group folder-drop-target p-2 rounded-md hover:bg-gray-700 relative'; // Added relative for button positioning
        folderDiv.dataset.folderId = folder.id;

        const folderNameSpan = document.createElement('span');
        folderNameSpan.textContent = folder.name;
        folderNameSpan.className = 'text-sm text-gray-200 cursor-pointer';
        folderNameSpan.onclick = (e) => {
             // Basic toggle for showing/hiding chats within the folder (optional)
             const chatList = folderDiv.querySelector('.folder-chat-list');
             if (chatList) chatList.classList.toggle('hidden');
        };

        // --- Folder Actions (Rename/Delete) ---
        const actionsContainer = document.createElement('div');
        actionsContainer.className = 'absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1'; // Show on hover

        const renameButton = document.createElement('button');
        renameButton.innerHTML = '✏️'; // Pencil emoji
        renameButton.title = 'Rename Folder';
        renameButton.className = 'text-xs p-1 rounded hover:bg-gray-600';
        renameButton.onclick = (e) => {
            e.stopPropagation(); // Prevent folder click
            this.promptForRenameFolder(folder.id);
        };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️'; // Trash can emoji
        deleteButton.title = 'Delete Folder';
        deleteButton.className = 'text-xs p-1 rounded hover:bg-gray-600 text-red-400 hover:text-red-300';
        deleteButton.onclick = (e) => {
            e.stopPropagation(); // Prevent folder click
            this.confirmDeleteFolder(folder.id);
        };

        actionsContainer.appendChild(renameButton);
        actionsContainer.appendChild(deleteButton);
        // --- End Folder Actions ---


        // --- Chat List within Folder (Initially hidden or empty) ---
        const chatListDiv = document.createElement('div');
        chatListDiv.className = 'folder-chat-list mt-1 pl-3 space-y-1 hidden'; // Indented, hidden by default
        // Populate this later when rendering chats
        folder.chatIds.forEach(chatId => {
             const chatItem = this.createFolderChatItemElement(chatId);
             if (chatItem) {
                 chatListDiv.appendChild(chatItem);
             }
        });
        if (folder.chatIds.length > 0) {
            chatListDiv.classList.remove('hidden'); // Show if not empty
        }
        // --- End Chat List ---

        folderDiv.appendChild(folderNameSpan);
        folderDiv.appendChild(actionsContainer);
        folderDiv.appendChild(chatListDiv);

        return folderDiv;
    }

    /**
     * Creates a simple representation of a chat item within a folder.
     * Tries to find the title from the native sidebar.
     * @param {string} chatId - The ID of the chat.
     * @returns {HTMLElement | null} The created chat item element or null if title not found.
     */
    createFolderChatItemElement(chatId) {
        // Find the original chat link element in the native sidebar
        const nativeChatLink = this.nativeSidebarNav?.querySelector(`a[href="/c/${chatId}"]`);
        const chatTitle = nativeChatLink ? (nativeChatLink.textContent?.trim() || 'Untitled Chat') : 'Chat (loading...)';

        if (!nativeChatLink) {
            console.warn(`SidebarManager: Native link for chat ${chatId} not found.`);
            // Optionally, still render a placeholder
        }

        const chatItemDiv = document.createElement('div');
        chatItemDiv.className = 'text-xs text-gray-400 hover:text-gray-200 truncate';
        chatItemDiv.textContent = chatTitle;
        chatItemDiv.dataset.chatId = chatId;
        // Optional: Add click handler to navigate to the chat
        chatItemDiv.onclick = () => {
            if (nativeChatLink) nativeChatLink.click();
        };
        // Optional: Make these draggable *out* of folders later if needed

        return chatItemDiv;
    }


    /**
     * Prompts the user for a new folder name and creates it.
     */
    promptForNewFolder() {
        const folderName = prompt("Enter name for the new folder:");
        if (folderName && folderName.trim()) {
            this.createFolder(folderName.trim());
        }
    }

    /**
     * Creates a new folder.
     * @param {string} name - The name of the new folder.
     */
    createFolder(name) {
        const newFolderId = `folder_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        this.folders[newFolderId] = { id: newFolderId, name: name, chatIds: [] };
        this.saveFolders(); // Saves and re-renders
        console.log(`SidebarManager: Created folder "${name}" (ID: ${newFolderId})`);
    }

    /**
     * Prompts the user to rename a folder.
     * @param {string} folderId - The ID of the folder to rename.
     */
    promptForRenameFolder(folderId) {
        const folder = this.folders[folderId];
        if (!folder) return;

        const newName = prompt(`Enter new name for folder "${folder.name}":`, folder.name);
        if (newName && newName.trim() && newName.trim() !== folder.name) {
            this.renameFolder(folderId, newName.trim());
        }
    }

    /**
     * Renames a folder.
     * @param {string} folderId - The ID of the folder to rename.
     * @param {string} newName - The new name for the folder.
     */
    renameFolder(folderId, newName) {
        if (this.folders[folderId]) {
            this.folders[folderId].name = newName;
            this.saveFolders(); // Saves and re-renders
            console.log(`SidebarManager: Renamed folder ${folderId} to "${newName}"`);
        }
    }

    /**
     * Asks for confirmation before deleting a folder.
     * @param {string} folderId - The ID of the folder to delete.
     */
    confirmDeleteFolder(folderId) {
        const folder = this.folders[folderId];
        if (!folder) return;

        const confirmation = confirm(`Are you sure you want to delete the folder "${folder.name}"? Chats inside will be moved back to the main list.`);
        if (confirmation) {
            this.deleteFolder(folderId);
        }
    }

    /**
     * Deletes a folder. Chats within it are disassociated.
     * @param {string} folderId - The ID of the folder to delete.
     */
    deleteFolder(folderId) {
        if (this.folders[folderId]) {
            const deletedFolderName = this.folders[folderId].name;
            // Disassociate chats first
            this.folders[folderId].chatIds.forEach(chatId => {
                delete this.chatFolderMap[chatId];
                // Make the original chat visible again if it was hidden
                const nativeChatLink = this.nativeSidebarNav?.querySelector(`a[href="/c/${chatId}"]`);
                nativeChatLink?.parentNode?.classList.remove('hidden'); // Show parent element
            });

            delete this.folders[folderId];
            this.saveFolders(); // Saves updated folders and map and re-renders
            console.log(`SidebarManager: Deleted folder "${deletedFolderName}" (ID: ${folderId})`);
        }
    }

    // --- Drag and Drop Logic ---

    /**
     * Observes the native chat list for additions/removals and applies drag handlers.
     */
    observeNativeChatList() {
        try {
            if (!this.nativeSidebarNav) {
                console.warn("SidebarManager: Cannot observe chat list, sidebar nav not found");
                return;
            }

            console.log("SidebarManager: Observing native chat list...");

            const handleChatListChanges = (mutationsList) => {
                try {
                    let needsRender = false;
                    for (const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                            // Handle added nodes (new chats)
                            mutation.addedNodes.forEach(node => {
                                if (node && node.nodeType === Node.ELEMENT_NODE) {
                                    // Find potential chat links within the added node
                                    try {
                                        const chatLinks = node.matches && node.matches('a[href^="/c/"]') ?
                                            [node] : node.querySelectorAll('a[href^="/c/"]');
                                        chatLinks.forEach(link => this.makeChatDraggable(link));
                                    } catch (e) {
                                        console.error("SidebarManager: Error processing added node", e);
                                    }
                                }
                            });
                            // Handle attribute changes (e.g., title updates) - might need re-render
                            needsRender = true; // Re-render folder contents if native list changes
                        } else if (mutation.type === 'attributes' &&
                                  mutation.target &&
                                  mutation.target.matches &&
                                  mutation.target.matches('a[href^="/c/"]')) {
                            needsRender = true; // Title might have changed
                        }
                    }
                    
                    // Process existing chats
                    try {
                        const chatLinks = this.nativeSidebarNav.querySelectorAll('a[href^="/c/"]');
                        chatLinks.forEach(link => this.makeChatDraggable(link));
                    } catch (e) {
                        console.error("SidebarManager: Error processing existing chats", e);
                    }

                    if (needsRender) {
                        this.renderFolders(); // Update folder contents if native list changed
                    }
                } catch (error) {
                    console.error("SidebarManager: Error handling chat list changes", error);
                }
            };

            const observer = new MutationObserver(handleChatListChanges);
            observer.observe(this.nativeSidebarNav, {
                childList: true,
                subtree: true,
                attributes: true, // Observe attribute changes like title updates if needed
                attributeFilter: ['href', 'title'] // Be specific if possible
            });

            // Initial pass for existing chats
            try {
                const chatLinks = this.nativeSidebarNav.querySelectorAll('a[href^="/c/"]');
                chatLinks.forEach(link => this.makeChatDraggable(link));
                this.renderFolders(); // Initial render includes populating folders with chats
                console.log("SidebarManager: Initial chat list processed for drag & drop.");
            } catch (e) {
                console.error("SidebarManager: Error in initial chat processing", e);
            }
        } catch (error) {
            console.error("SidebarManager: Error setting up chat list observer", error);
        }
    }

    /**
     * Makes a native chat list item draggable.
     * @param {HTMLAnchorElement} chatLinkElement - The anchor element of the chat.
     */
    makeChatDraggable(chatLinkElement) {
        try {
            if (!chatLinkElement || !chatLinkElement.href) return;
            
            const parentElement = chatLinkElement.closest('li') || chatLinkElement.parentNode; // Adjust based on actual structure
            if (!parentElement || parentElement.draggable) return; // Already processed or structure issue

            parentElement.draggable = true;
            parentElement.addEventListener('dragstart', this.handleDragStart.bind(this));
            parentElement.addEventListener('dragend', this.handleDragEnd.bind(this));

            // Visually hide chats that are assigned to a folder
            const chatId = this.getChatIdFromUrl(chatLinkElement.href);
            if (chatId && this.chatFolderMap[chatId]) {
                parentElement.classList.add('hidden'); // Hide if in a folder
            } else {
                parentElement.classList.remove('hidden'); // Ensure visible if not in a folder
            }
        } catch (error) {
            console.error("SidebarManager: Error making chat draggable", error);
        }
    }

    /**
     * Makes the folder elements drop targets.
     */
    makeFoldersDropTargets() {
        this.chatFoldersContainer?.querySelectorAll('.folder-drop-target').forEach(folderEl => {
            // Prevent adding multiple listeners if called repeatedly
            if (folderEl.dataset.dragListenersAdded === 'true') return;

            folderEl.addEventListener('dragover', this.handleDragOver.bind(this));
            folderEl.addEventListener('dragleave', this.handleDragLeave.bind(this));
            folderEl.addEventListener('drop', this.handleDrop.bind(this));
            folderEl.dataset.dragListenersAdded = 'true'; // Mark as processed
        });
    }

    /**
     * Handles the drag start event on a chat item.
     * @param {DragEvent} event
     */
    handleDragStart(event) {
        const target = event.target.closest('li') || event.target; // Get the draggable element (li or parent)
        const chatLink = target.querySelector('a[href^="/c/"]');
        if (!chatLink) return;

        const chatId = this.getChatIdFromUrl(chatLink.href);
        if (!chatId) return;

        event.dataTransfer.setData('text/plain', chatId);
        event.dataTransfer.effectAllowed = 'move';
        target.classList.add('dragging'); // Optional: style the dragged item
        console.log(`SidebarManager: Dragging chat ${chatId}`);
    }

     /**
     * Handles the drag end event on a chat item.
     * @param {DragEvent} event
     */
    handleDragEnd(event) {
        const target = event.target.closest('li') || event.target;
        target.classList.remove('dragging'); // Remove dragging style
    }


    /**
     * Handles the drag over event on a folder.
     * @param {DragEvent} event
     */
    handleDragOver(event) {
        event.preventDefault(); // Necessary to allow drop
        event.dataTransfer.dropEffect = 'move';
        const folderEl = event.currentTarget;
        folderEl.classList.add('drag-over'); // Add visual feedback
    }

    /**
     * Handles the drag leave event on a folder.
     * @param {DragEvent} event
     */
    handleDragLeave(event) {
        const folderEl = event.currentTarget;
        folderEl.classList.remove('drag-over'); // Remove visual feedback
    }

    /**
     * Handles the drop event on a folder.
     * @param {DragEvent} event
     */
    handleDrop(event) {
        event.preventDefault();
        const folderEl = event.currentTarget;
        folderEl.classList.remove('drag-over');

        try {
            const chatId = event.dataTransfer.getData('text/plain');
            const folderId = folderEl.dataset.folderId;

            if (chatId && folderId && this.folders[folderId]) {
                this.assignChatToFolder(chatId, folderId);
                console.log(`SidebarManager: Dropped chat ${chatId} onto folder ${folderId}`);
            } else {
                console.warn("SidebarManager: Drop failed - invalid chatId or folderId.", { chatId, folderId });
            }
        } catch (error) {
            console.error("SidebarManager: Error handling drop", error);
        }
    }

    /**
     * Assigns a chat to a specific folder, updating state and persistence.
     * @param {string} chatId
     * @param {string} folderId
     */
    assignChatToFolder(chatId, folderId) {
        // Remove from previous folder if exists
        const previousFolderId = this.chatFolderMap[chatId];
        if (previousFolderId && this.folders[previousFolderId]) {
            this.folders[previousFolderId].chatIds = this.folders[previousFolderId].chatIds.filter(id => id !== chatId);
        }

        // Add to new folder
        if (this.folders[folderId]) {
             if (!this.folders[folderId].chatIds.includes(chatId)) {
                this.folders[folderId].chatIds.push(chatId);
             }
            this.chatFolderMap[chatId] = folderId;

            // Hide the original chat item in the native list
            const nativeChatLink = this.nativeSidebarNav?.querySelector(`a[href="/c/${chatId}"]`);
            nativeChatLink?.parentNode?.classList.add('hidden');

            this.saveFolders(); // Saves both folders and the map
            this.renderFolders(); // Re-render folders to show the new chat
        } else {
             console.error(`SidebarManager: Attempted to assign chat ${chatId} to non-existent folder ${folderId}`);
        }
    }

    /**
     * Extracts the chat ID from a ChatGPT chat URL.
     * @param {string} url - The chat URL (e.g., "https://chat.openai.com/c/abc-123").
     * @returns {string | null} The chat ID or null if not found.
     */
    getChatIdFromUrl(url) {
        const match = url.match(/\/c\/([a-zA-Z0-9-]+)/);
        return match ? match[1] : null;
    }

    /**
     * Renders the folder UI in a provided container element (for use in the overlay panel).
     * @param {HTMLElement} container - The container element to render in.
     */
    renderInContainer(container) {
        if (!container) return;
        
        console.log("SidebarManager: Rendering in container...");
        
        // Create a simplified version of the UI for the overlay panel
        container.innerHTML = `
            <div class="p-2">
                <div class="flex justify-between items-center mb-3">
                    <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Chat Folders</h3>
                    <button id="create-folder-btn" class="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">+ New Folder</button>
                </div>
                <div id="folder-list" class="space-y-2 mb-4"></div>
            </div>
        `;
        
        // Store reference to the folder list
        this.folderListContainer = container.querySelector('#folder-list');
        
        // Add event listener for the create folder button
        container.querySelector('#create-folder-btn').addEventListener('click', () => {
            this.promptForNewFolder();
        });
        
        // Render the folders
        this.renderFoldersInContainer();
        
        // Start observing the native chat list if not already
        if (!this.nativeSidebarNav) {
            // Find the native sidebar nav
            this.nativeSidebarNav = document.querySelector('nav[aria-label="Chat history"]');
            if (this.nativeSidebarNav) {
                this.observeNativeChatList();
            }
        }
    }
    
    /**
     * Renders the folders in the container for the overlay panel.
     */
    renderFoldersInContainer() {
        if (!this.folderListContainer) return;
        
        this.folderListContainer.innerHTML = '';
        
        if (Object.keys(this.folders).length === 0) {
            this.folderListContainer.innerHTML = '<p class="text-sm text-gray-500 dark:text-gray-400">No folders yet. Create one to organize your chats.</p>';
            return;
        }
        
        Object.values(this.folders).sort((a, b) => a.name.localeCompare(b.name)).forEach(folder => {
            const folderEl = document.createElement('div');
            folderEl.className = 'p-2 bg-gray-100 dark:bg-gray-800 rounded';
            folderEl.innerHTML = `
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium">${folder.name}</span>
                    <div class="space-x-1">
                        <button class="rename-folder-btn text-xs text-blue-500 hover:text-blue-700" data-folder-id="${folder.id}">Rename</button>
                        <button class="delete-folder-btn text-xs text-red-500 hover:text-red-700" data-folder-id="${folder.id}">Delete</button>
                    </div>
                </div>
                <div class="mt-2 space-y-1 pl-2 chat-list" data-folder-id="${folder.id}"></div>
            `;
            
            // Add chats to the folder
            const chatList = folderEl.querySelector('.chat-list');
            folder.chatIds.forEach(chatId => {
                const chatItem = this.createFolderChatItemElement(chatId);
                if (chatItem) {
                    chatList.appendChild(chatItem);
                }
            });
            
            // Add event listeners for rename and delete buttons
            folderEl.querySelector('.rename-folder-btn').addEventListener('click', () => {
                this.promptForRenameFolder(folder.id);
            });
            
            folderEl.querySelector('.delete-folder-btn').addEventListener('click', () => {
                this.confirmDeleteFolder(folder.id);
            });
            
            this.folderListContainer.appendChild(folderEl);
        });
    }
}

export default SidebarManager;