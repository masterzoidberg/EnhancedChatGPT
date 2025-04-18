# 🧠 Project Brief — ChatGPT Enhancer
*Phase: Ω₄ EXECUTE | Updated: {{today}}*

## 🎯 Overview
A Chrome extension that enhances the ChatGPT interface with folder management, prompt organization, and quick-access features.

## ✅ Goals (Current Phase)
- [ ] Finalize shadow DOM overlay mount and style encapsulation
- [ ] Implement drag-reorderable prompt folders
- [ ] Add keyboard navigation and focus trapping
- [ ] Ensure SPEC.md is kept in sync with architecture

## 📋 Requirements
- Runs on Manifest V3, supports React 18
- Compatible with ChatGPT at both `chat.openai.com` and `chatgpt.com`
- Clean, responsive UI inside a content-script overlay

## 🔒 Constraints
- Z-index conflicts must be avoided
- Only one overlay mount per page
- Cursor must follow RIPER agent expectations
