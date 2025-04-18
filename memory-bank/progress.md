# 📈 Progress Tracker

## ✅ Milestones
- [x] Two-pane layout complete
- [x] Shadow DOM mount finalized
- [ ] PromptManager refactor in progress
- [ ] Drag + reorder system under construction
- [ ] Keyboard nav queued for Ω₄ end

## ⚠️ Blockers
- CSS encapsulation bleeding in narrow viewports
- Z-index conflicts on ChatGPT plugin pages

## 🔁 Next Steps
- Finalize folder reordering with optimistic UI
- Add SPEC.md auto-reminder on core file edits

## 🔁 Planned Features (Next Up)
- [ ] Prompt display area wired to active folder
- [ ] "New Folder" creation UI + PromptManager logic
- [ ] Simple pub/sub listener system in PromptManager
- [ ] chrome.storage.local persistence layer

## Recent Progress
☑ Completed pub/sub for cross-component sync via PromptManager.subscribe()
☑ Folder list reacts to PromptManager state