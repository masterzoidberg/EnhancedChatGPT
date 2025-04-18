// src/components/OverlayPanel.tsx
import React from 'react';
import { IPromptManager } from '@/types/messages';

export type OverlayPanelProps = {
  promptManager: IPromptManager;
  isVisible: boolean;
  onClose: () => void;
};

export const OverlayPanel: React.FC<OverlayPanelProps> = ({ 
  promptManager, 
  isVisible, 
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <button onClick={onClose}>✖</button>
        <p>Hello from Overlay!</p>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 9998,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  panel: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
  },
};
