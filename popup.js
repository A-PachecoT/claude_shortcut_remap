// Get the default shortcuts
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

// Load and display shortcuts
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get('shortcuts', (data) => {
    const shortcuts = data.shortcuts || DEFAULT_SHORTCUTS;
    const container = document.getElementById('shortcuts-container');
    const modal = createShortcutsModal(shortcuts, true);
    container.appendChild(modal);
  });
});
