// Debugging function to log element details
function debugElement(element, label = '') {
    console.log(`${label} Element:`, {
      tagName: element?.tagName,
      id: element?.id,
      className: element?.className,
      attributes: Array.from(element?.attributes || []).map(attr => `${attr.name}="${attr.value}"`),
      element
    });
  }  

// Default shortcuts matching ChatGPT
const DEFAULT_SHORTCUTS = {
  'submit': { key: 'Enter', ctrlKey: true, altKey: false, shiftKey: false },
  'newLine': { key: 'Enter', ctrlKey: false, altKey: false, shiftKey: true },
  'stop': { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: false },
  'newChat': { key: 'O', ctrlKey: true, altKey: false, shiftKey: true },
  'focusInput': { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: true },
  'copyLastCode': { key: ';', ctrlKey: true, altKey: false, shiftKey: true },
  'copyLastResponse': { key: 'C', ctrlKey: true, altKey: false, shiftKey: true },
  'showShortcuts': { key: '/', ctrlKey: true, altKey: false, shiftKey: false },
  'clearChat': { key: 'L', ctrlKey: true, altKey: false, shiftKey: true },
  'uploadFile': { key: 'U', ctrlKey: true, altKey: false, shiftKey: true },
  'toggleSidebar': { key: 'S', ctrlKey: true, altKey: false, shiftKey: true }
};

let currentShortcuts = {...DEFAULT_SHORTCUTS};
let lastResponse = null;
let lastCodeBlock = null;

// Load custom shortcuts if they exist
chrome.storage.sync.get('shortcuts', (data) => {
  if (data.shortcuts) {
    currentShortcuts = {...DEFAULT_SHORTCUTS, ...data.shortcuts};
  }
});

// Track last response and code block
const observeResponses = () => {
  const observer = new MutationObserver((mutations) => {
    const responses = document.querySelectorAll('.claude-response');
    if (responses.length > 0) {
      lastResponse = responses[responses.length - 1];
      const codeBlocks = lastResponse.querySelectorAll('pre code');
      if (codeBlocks.length > 0) {
        lastCodeBlock = codeBlocks[codeBlocks.length - 1];
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

document.addEventListener('DOMContentLoaded', observeResponses);

document.addEventListener('keydown', (event) => {
  const textarea = document.querySelector('textarea');
  
  // Check if the event matches any of our shortcuts
  for (const [action, shortcut] of Object.entries(currentShortcuts)) {
    if (event.key === shortcut.key &&
        event.ctrlKey === shortcut.ctrlKey &&
        event.altKey === shortcut.altKey &&
        event.shiftKey === shortcut.shiftKey) {
      
      event.preventDefault();
      
      switch (action) {
        case 'submit':
          const submitButton = document.querySelector('button[type="submit"], button.send-button, button[aria-label*="Send"]');
          if (submitButton && !submitButton.disabled) {
            submitButton.click();
            }
          if (textarea && !textarea.disabled) {
            const enterEvent = new KeyboardEvent('keydown', {
              key: 'Enter',
              code: 'Enter',
              keyCode: 13,
              which: 13,
              bubbles: true,
              cancelable: true
            });
            textarea.dispatchEvent(enterEvent);
          }
          break;
          
        case 'newLine':
          if (textarea) textarea.value += '\n';
          break;
          
        case 'stop':
          const stopButton = document.querySelector('button[aria-label="Stop generating"]');
          if (stopButton) stopButton.click();
          break;

        case 'newChat':
          const newChatButton = document.querySelector(
            'button[data-state="closed"] svg[viewBox="0 0 16 16"], ' + // First try the specific new chat icon
            'button.inline-flex[class*="bg-accent-main-100"]' // Then try the button with accent color
          );
          
          if (newChatButton) {
            debugElement(newChatButton, 'Found New Chat Button');
            newChatButton.closest('button').click(); // Make sure we click the button, not just the SVG
          } else {
            console.warn('New chat button not found');
          }
          break;

        case 'toggleSidebar':
          console.log('Attempting to toggle sidebar...');
          
          // Try to find both mobile and desktop close buttons
          const closeButtons = document.querySelectorAll('button svg[viewBox="0 0 256 256"]');
          console.log('Found close buttons:', closeButtons.length);
          
          const sidebarOpenButtons = [
            // Desktop open button (three dots)
            document.querySelector('button.inline-flex.items-center.justify-center.relative.shrink-0[class*="rounded-md"]'),
            // Mobile open button (hamburger menu) - more specific selector
            document.querySelector('.pointer-events-auto.absolute.left-2.top-3.z-20.md\\:hidden button')
          ].filter(Boolean); // Remove null values
          
          console.log('Found open buttons:', sidebarOpenButtons.length);
          
          // Check if sidebar is open by looking for visible close button
          const isOpen = Array.from(closeButtons)
            .some(btn => {
              const button = btn.closest('button');
              const isVisible = button && 
                               window.getComputedStyle(button).display !== 'none' && 
                               button.offsetParent !== null;
              console.log('Close button visibility:', isVisible);
              return isVisible;
            });
          
          console.log('Sidebar is:', isOpen ? 'open' : 'closed');
          
          if (isOpen) {
            // If sidebar is open, find and click the visible close button
            const visibleCloseButton = Array.from(closeButtons)
              .find(btn => {
                const button = btn.closest('button');
                return button && 
                       window.getComputedStyle(button).display !== 'none' && 
                       button.offsetParent !== null;
              });
            
            if (visibleCloseButton) {
              debugElement(visibleCloseButton, 'Clicking Close Button');
              visibleCloseButton.closest('button').click();
            }
          } else {
            // If sidebar is closed, find and click the visible open button
            const visibleOpenButton = sidebarOpenButtons
              .find(btn => {
                return btn && 
                       window.getComputedStyle(btn).display !== 'none' && 
                       btn.offsetParent !== null;
              });
            
            if (visibleOpenButton) {
              debugElement(visibleOpenButton, 'Clicking Open Button');
              visibleOpenButton.click();
            } else {
              console.warn('No visible sidebar buttons found');
            }
          }
          break;

        case 'focusInput':
          const proseMirrorInput = document.querySelector('div.ProseMirror[contenteditable="true"]');
          debugElement(proseMirrorInput, 'Found ProseMirror Input');
          
          if (proseMirrorInput) {
            // First try direct focus
            proseMirrorInput.focus();
            
            // If that doesn't work, simulate Tab key
            const tabEvent = new KeyboardEvent('keydown', {
              key: 'Tab',
              code: 'Tab',
              keyCode: 9,
              which: 9,
              bubbles: true,
              cancelable: true
            });
            document.dispatchEvent(tabEvent);
            
            // After focusing, try to place cursor at the end
            const lastParagraph = proseMirrorInput.querySelector('p:last-child');
            if (lastParagraph) {
              const selection = window.getSelection();
              const range = document.createRange();
              range.selectNodeContents(lastParagraph);
              range.collapse(false); // collapse to end
              selection.removeAllRanges();
              selection.addRange(range);
            }
          } else {
            console.warn('No ProseMirror input found');
          }
          break;

        case 'copyLastCode':
          if (lastCodeBlock) {
            navigator.clipboard.writeText(lastCodeBlock.textContent);
          }
          break;

        case 'copyLastResponse':
          if (lastResponse) {
            navigator.clipboard.writeText(lastResponse.textContent);
          }
          break;

        case 'showShortcuts':
          showShortcutsModal();
          break;

        case 'clearChat':
          const clearButton = document.querySelector('button[aria-label="Clear chat"]');
          if (clearButton) clearButton.click();
          break;

        case 'uploadFile':
          const uploadButton = document.querySelector('button[aria-label="Upload file"]');
          if (uploadButton) uploadButton.click();
          break;
      }
      
      break;
    }
  }
});

function showShortcutsModal() {
  // Remove existing modal if it exists
  const existingModal = document.querySelector('#shortcuts-modal');
  if (existingModal) {
    existingModal.remove();
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'shortcuts-modal';  // Add ID for easy reference
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #eeece2;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    z-index: 1000;
    max-height: 80vh;
    overflow-y: auto;
    font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    color: #3d3929;
    min-width: 300px;
    max-width: 500px;
  `;

  const shortcuts = Object.entries(currentShortcuts).map(([action, shortcut]) => {
    const keys = [];
    if (shortcut.ctrlKey) keys.push('Ctrl');
    if (shortcut.altKey) keys.push('Alt');
    if (shortcut.shiftKey) keys.push('Shift');
    keys.push(shortcut.key);
    return `<div style="margin: 12px 0; display: flex; justify-content: space-between; align-items: center">
      <span style="font-weight: 500">${action}</span>
      <span style="color: #da7756; background: rgba(218, 119, 86, 0.1); 
                   padding: 4px 8px; border-radius: 4px; font-size: 0.9em">
        ${keys.join(' + ')}
      </span>
    </div>`;
  }).join('');

  modal.innerHTML = `
    <h2 style="margin-top: 0; margin-bottom: 20px; font-weight: normal">Keyboard Shortcuts</h2>
    ${shortcuts}
    <button id="close-shortcuts-modal" 
            style="margin-top: 20px; padding: 8px 16px; background: #da7756; 
                   color: white; border: none; border-radius: 6px; cursor: pointer;
                   font-family: inherit; font-size: 0.9em">Close</button>
  `;

  document.body.appendChild(modal);

  // Add event listener to close button
  document.getElementById('close-shortcuts-modal').addEventListener('click', () => {
    modal.remove();
  });
}
