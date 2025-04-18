# 🏗️ System Patterns — ChatGPT Enhancer
*Architecture Snapshot | Updated: {{today}}*

## 🧱 Component Structure
- `OverlayPanel.tsx` – Shadow DOM mounted root UI
- `PromptManager.ts` – Stateful logic manager
- `contentScript.ts` – Mount logic, mutation observer, DOM entry

## 🔄 Design Patterns
- Singleton manager (PromptManager)
- Shadow DOM encapsulation for isolation
- Event-driven architecture via custom event dispatchers (planned)

## 📐 Z-Index Reservation
- Overlay: `z-index: 10000`
- Backdrop: `z-index: 9999`
- Reserved: `10000–10050`

## 🔒 Pattern Mandates
- Every component must self-unmount on navigation
- No multiple React root mounts
- PromptManager must be stateless across reloads
