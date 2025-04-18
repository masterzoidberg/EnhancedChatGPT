# 🔮 Active Context
*Working Memory for Ω₄ EXECUTE*

## 🔮 Next Plan
- Display prompts for selected folder
- Add folder creation flow
- Refactor PromptManager for event listeners
- Connect to chrome.storage.local

## 🏗️ Active Focus
- Building prompt management UI inside overlay
- Ensuring drag/drop reordering syncs with chrome.storage
- Adding SPEC.md auto-update reminder

## 📎 Context References
- 💻 Active Code: OverlayPanel.tsx, PromptManager.ts
- 📄 Active Files: SPEC.md, manifest.json
- 📁 Active Folders: content/, utils/
- 🔄 Git References: `fix/overlay-bug`, `main`
- 📏 Active Rules: `nick.riper.cursor-agent`

## 📡 Status
- 🟢 Active: OverlayPanel, PromptManager
- 🟣 Essential: Prompt structure, SPEC enforcement
- 🔴 Deprecated: Old drag-drop util in `legacy/`

## Current Implementation Status
☑ OverlayPanel syncs via promptManager.subscribe()
☑ Folder creation now triggers full UI refresh

## Next Steps
- [ ] Implement inline prompt editing
- [ ] Add drag-and-drop folder reordering
