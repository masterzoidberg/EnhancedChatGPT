# 🧰 Technology Context
*Stack + Tooling*

## 🖥️ Stack
- **Frontend**: React 18, TypeScript
- **Bundler**: Vite (dual config: `vite.config.ts` and `vite.content.config.ts`)
- **Extension API**: Manifest V3
- **Build Script**: `build-and-package.ps1`

## 🧪 Testing Tools
- Manual DOM inspection
- Unit test plan in-progress

## 🔄 Build & Deployment
- Run `build-and-package.ps1` to generate dist zip
- Manual reload in Chrome DevTools

## ⚠️ Environment Constraints
- React must be isolated from page
- Ensure no duplication of React versions
