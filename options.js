const DEFAULT_SHORTCUTS = {
  'submit': { key: 'Enter', ctrlKey: true, altKey: false, shiftKey: false },
  'newLine': { key: 'Enter', ctrlKey: false, altKey: false, shiftKey: true },
  'stop': { key: 'Escape', ctrlKey: false, altKey: false, shiftKey: false }
};

const ACTIONS = {
  'submit': 'Submit Message',
  'newLine': 'New Line',
  'stop': 'Stop Generation',
  'newChat': 'New Chat',
  'customInstructions': 'Custom Instructions',
  'focusInput': 'Focus Input',
  'toggleSidebar': 'Toggle Sidebar',
  'copyLastCode': 'Copy Last Code',
  'deleteChat': 'Delete Chat',
  'copyLastResponse': 'Copy Last Response',
  'showShortcuts': 'Show Shortcuts'
};

function createShortcutRow(action, shortcut) {
  const div = document.createElement('div');
  div.className = 'shortcut-row';
  
  div.innerHTML = `
    <label>${ACTIONS[action]}:</label>
    <input type="text" class="key-input" data-action="${action}" 
           value="${shortcut.key}" placeholder="Press a key">
    <span class="checkbox-group">
      <label>
        <input type="checkbox" class="ctrl-check" 
               ${shortcut.ctrlKey ? 'checked' : ''}>
        Ctrl
      </label>
      <label>
        <input type="checkbox" class="alt-check" 
               ${shortcut.altKey ? 'checked' : ''}>
        Alt
      </label>
      <label>
        <input type="checkbox" class="shift-check" 
               ${shortcut.shiftKey ? 'checked' : ''}>
        Shift
      </label>
    </span>
  `;
  
  return div;
}

function loadShortcuts() {
  const container = document.getElementById('shortcuts-container');
  container.innerHTML = '';
  
  chrome.storage.sync.get('shortcuts', (data) => {
    const shortcuts = data.shortcuts || DEFAULT_SHORTCUTS;
    
    for (const [action, shortcut] of Object.entries(shortcuts)) {
      container.appendChild(createShortcutRow(action, shortcut));
    }
  });
}

function saveShortcuts() {
  const shortcuts = {};
  
  document.querySelectorAll('.shortcut-row').forEach(row => {
    const action = row.querySelector('.key-input').dataset.action;
    shortcuts[action] = {
      key: row.querySelector('.key-input').value,
      ctrlKey: row.querySelector('.ctrl-check').checked,
      altKey: row.querySelector('.alt-check').checked,
      shiftKey: row.querySelector('.shift-check').checked
    };
  });
  
  chrome.storage.sync.set({ shortcuts }, () => {
    alert('Shortcuts saved!');
  });
}

document.addEventListener('DOMContentLoaded', loadShortcuts);
document.getElementById('save').addEventListener('click', saveShortcuts);
document.getElementById('reset').addEventListener('click', () => {
  chrome.storage.sync.set({ shortcuts: DEFAULT_SHORTCUTS }, () => {
    loadShortcuts();
    alert('Shortcuts reset to default!');
  });
});

// Handle key input
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('key-input')) {
    const input = e.target;
    input.addEventListener('keydown', (e) => {
      e.preventDefault();
      input.value = e.key;
    }, { once: true });
  }
});
