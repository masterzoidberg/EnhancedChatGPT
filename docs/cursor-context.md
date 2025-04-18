# Cursor Quick Context – ChatGPT Enhancer

## PowerShell Script: `build-and-package.ps1`

This is a build and packaging script for a Chrome extension that:

1. **Directory Setup**
   - Creates `dist` and `builds` directories if they don't exist
   - Cleans the `dist` directory of any previous builds

2. **Build Process**
   - Compiles TypeScript code using `tsc`
   - Builds the content script separately using Vite with `vite.content.config.ts`
   - Builds the rest of the extension using `vite.config.ts`
   - Copies `manifest.json` to `dist`

3. **Packaging**
   - Creates a timestamped ZIP in `builds`
   - Uses .NET's `System.IO.Compression` for ZIP creation

4. **Output**
   - Provides console feedback
   - Displays the packaged extension location

This follows modern practices with TypeScript, Vite, timestamped builds, and a clean directory structure.

---

## PromptManager Instantiation

- `PromptManager` is instantiated in `src/content/content.tsx` at the module level.
- This instance manages state and prompt operations within the content script.

Two implementations found:
1. `src/components/PromptManager.tsx`: Advanced version with folder and settings UI
2. `src/utils/PromptManager.ts`: Lightweight manager focused on storing favorite prompts

The content script is importing from `@/utils/PromptManager`, indicating it's using the simpler version for content context logic.