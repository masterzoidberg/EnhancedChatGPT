import { OverlayPanel } from '@/components/OverlayPanel';
import { QuickAccessBar } from '@/components/QuickAccessBar';
import { PromptManager } from '@/components/PromptManager';

class ContentScript {
  private overlayPanel: OverlayPanel | null = null;
  private quickAccessBar: QuickAccessBar | null = null;
  private promptManager: PromptManager | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    try {
      // Initialize components
      this.promptManager = new PromptManager();
      this.overlayPanel = new OverlayPanel(this.promptManager);
      this.quickAccessBar = new QuickAccessBar(this.promptManager);

      // Wait for the chat form to be available
      await this.waitForChatForm();

      // Attach components to the page
      this.attachComponents();

      // Set up mutation observer to handle dynamic page changes
      this.setupMutationObserver();
    } catch (error) {
      console.error('Failed to initialize content script:', error);
    }
  }

  private async waitForChatForm(): Promise<HTMLFormElement> {
    return new Promise((resolve) => {
      const checkForm = () => {
        const form = document.querySelector('form');
        if (form) {
          resolve(form);
        } else {
          setTimeout(checkForm, 100);
        }
      };
      checkForm();
    });
  }

  private attachComponents() {
    if (this.overlayPanel) {
      this.overlayPanel.attach();
    }
    if (this.quickAccessBar) {
      this.quickAccessBar.attach();
    }
  }

  private setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if the chat form was removed or added
          const form = document.querySelector('form');
          if (!form && this.quickAccessBar) {
            this.quickAccessBar.detach();
          } else if (form && this.quickAccessBar) {
            this.quickAccessBar.attach();
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }
}

// Initialize the content script
new ContentScript(); 