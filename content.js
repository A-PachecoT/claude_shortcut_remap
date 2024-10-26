// Default shortcuts matching ChatGPT
const DEFAULT_SHORTCUTS = {
  'submit': { key: 'Enter', ctrlKey: true, altKey: false, shiftKey: false },
  'newLine': { key: 'Enter', ctrlKey: false, altKey: false, shiftKey: true },
  'stop': { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: false },
  'newChat': { key: 'O', ctrlKey: true, altKey: false, shiftKey: true },
  'customInstructions': { key: 'I', ctrlKey: true, altKey: false, shiftKey: true },
  'focusInput': { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: true },
  'toggleSidebar': { key: 'S', ctrlKey: true, altKey: false, shiftKey: true },
  'copyLastCode': { key: ';', ctrlKey: true, altKey: false, shiftKey: true },
  'deleteChat': { key: 'X', ctrlKey: true, altKey: false, shiftKey: true },
  'copyLastResponse': { key: 'C', ctrlKey: true, altKey: false, shiftKey: true },
  'showShortcuts': { key: '/', ctrlKey: true, altKey: false, shiftKey: false }
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
          const submitButton = document.querySelector('button[type="submit"]');
          if (submitButton) submitButton.click();
          break;
          
        case 'newLine':
          if (textarea) textarea.value += '\n';
          break;
          
        case 'stop':
          const stopButton = document.querySelector('button[aria-label="Stop generating"]');
          if (stopButton) stopButton.click();
          break;

        case 'newChat':
          const newChatButton = document.querySelector('button[aria-label="New chat"]');
          if (newChatButton) newChatButton.click();
          break;

        case 'focusInput':
          if (textarea) textarea.focus();
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
