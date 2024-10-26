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
  'uploadFile': { key: 'U', ctrlKey: true, altKey: false, shiftKey: true }
};

const ACTIONS = {
  'submit': 'Submit Message',
  'newLine': 'New Line',
  'stop': 'Stop Generation',
  'newChat': 'New Chat',
  'focusInput': 'Focus Input',
  'copyLastCode': 'Copy Last Code',
  'copyLastResponse': 'Copy Last Response',
  'showShortcuts': 'Show Shortcuts',
  'clearChat': 'Clear Chat',
  'uploadFile': 'Upload File',
  'toggleSidebar': 'Toggle Sidebar'
};

function createShortcutRow(action, shortcut) {
  const div = document.createElement('div');
  div.className = 'shortcut-row';
  div.style.cssText = `
    padding: 12px;
    border-radius: ${CLAUDE_STYLES.borderRadius};
    background: ${CLAUDE_COLORS.background};
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 16px;
    font-family: ${CLAUDE_STYLES.fontPrimary};
  `;
  
  div.innerHTML = `
    <label style="color: ${CLAUDE_COLORS.text}; flex: 1;">${ACTIONS[action]}:</label>
    <input type="text" class="key-input" data-action="${action}" 
           value="${shortcut.key}" placeholder="Press a key"
           style="
             padding: 4px 8px;
             border-radius: 4px;
             border: 1.5px solid ${CLAUDE_COLORS.border};
             font-family: ${CLAUDE_STYLES.fontMono};
             width: 80px;
           ">
    <span class="checkbox-group" style="display: flex; gap: 8px;">
      <label style="display: flex; align-items: center; gap: 4px;">
        <input type="checkbox" class="ctrl-check" 
               ${shortcut.ctrlKey ? 'checked' : ''}>
        <span style="color: ${CLAUDE_COLORS.text};">Ctrl</span>
      </label>
      <label style="display: flex; align-items: center; gap: 4px;">
        <input type="checkbox" class="alt-check" 
               ${shortcut.altKey ? 'checked' : ''}>
        <span style="color: ${CLAUDE_COLORS.text};">Alt</span>
      </label>
      <label style="display: flex; align-items: center; gap: 4px;">
        <input type="checkbox" class="shift-check" 
               ${shortcut.shiftKey ? 'checked' : ''}>
        <span style="color: ${CLAUDE_COLORS.text};">Shift</span>
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

// Style the buttons
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.style.cssText = `
      padding: 8px 16px;
      background: ${CLAUDE_COLORS.accent};
      color: white;
      border: none;
      border-radius: ${CLAUDE_STYLES.borderRadius};
      cursor: pointer;
      font-family: ${CLAUDE_STYLES.fontPrimary};
      transition: ${CLAUDE_STYLES.transition};
    `;
    
    button.onmouseover = () => {
      button.style.background = CLAUDE_COLORS.accentHover;
    };
    
    button.onmouseout = () => {
      button.style.background = CLAUDE_COLORS.accent;
    };
  });
});
