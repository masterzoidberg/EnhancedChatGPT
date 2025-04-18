import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { OverlayPanel } from '@/components/features/OverlayPanel';
import { PromptManager } from '@/components/features/PromptManager';
import { QuickAccessBar } from '@/components/features/QuickAccessBar';
import { Message, MessageType } from '@/types/messages';
import { IPromptManager } from '@/content/types';

const promptManager: IPromptManager = new PromptManager();

const containerId = 'chatgpt-enhancer-overlay-root';

const injectOverlayRoot = () => {
  if (!document.getElementById(containerId)) {
    const div = document.createElement('div');
    div.id = containerId;
    document.body.appendChild(div);
  }
};

const App = () => {
  const [isOverlayVisible, setOverlayVisible] = useState(false);

  const handleToggleOverlay = () => setOverlayVisible(!isOverlayVisible);
  const handleCloseOverlay = () => setOverlayVisible(false);

  useEffect(() => {
    // Inject floating button
    const button = document.createElement('button');
    button.textContent = '⚙️';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 12px';
    button.style.backgroundColor = '#2563eb';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    button.title = 'Open Prompt Overlay';

    button.addEventListener('click', handleToggleOverlay);
    document.body.appendChild(button);

    return () => {
      button.remove();
    };
  }, []);

  return (
    <React.StrictMode>
      <OverlayPanel
        promptManager={promptManager}
        isVisible={isOverlayVisible}
        onClose={handleCloseOverlay}
      />
    </React.StrictMode>
  );
};

injectOverlayRoot();

const root = createRoot(document.getElementById(containerId)!);
root.render(<App />);
