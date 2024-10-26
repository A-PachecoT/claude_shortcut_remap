// Constants for Claude's design system
window.CLAUDE_COLORS = {
  background: '#eeece2',
  backgroundHover: '#e6e3d6',
  text: '#3d3929',
  accent: '#da7756',
  accentHover: '#bd5d3a',
  border: '#3d3929'
};

window.CLAUDE_STYLES = {
  fontPrimary: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  fontMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  borderRadius: '8px',
  modalBorderRadius: '12px',
  transition: 'all 0.2s ease'
};

// Shared modal creation
window.createShortcutsModal = function(shortcuts, isPopup = false) {
  const modal = document.createElement('div');
  modal.id = 'shortcuts-modal';
  
  const baseStyles = `
    background: ${CLAUDE_COLORS.background};
    padding: 24px;
    border-radius: ${CLAUDE_STYLES.modalBorderRadius};
    border: 1.5px solid ${CLAUDE_COLORS.border};
    font-family: ${CLAUDE_STYLES.fontPrimary};
    color: ${CLAUDE_COLORS.text};
    min-width: 320px;
    max-width: 480px;
  `;

  modal.style.cssText = isPopup ? baseStyles : `
    ${baseStyles}
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 24px rgba(61, 57, 41, 0.1);
  `;

  const shortcutsList = `
    <table style="width: 100%; border-spacing: 0; border-collapse: separate;">
      <tbody>
        ${Object.entries(shortcuts).map(([action, shortcut]) => {
          const keys = [];
          if (shortcut.ctrlKey) keys.push('Ctrl');
          if (shortcut.altKey) keys.push('Alt');
          if (shortcut.shiftKey) keys.push('Shift');
          keys.push(shortcut.key);
          
          return `
            <tr style="
              border-bottom: 1px solid rgba(61, 57, 41, 0.1);
            ">
              <td style="
                padding: 8px 0;
                font-size: 14px;
                color: ${CLAUDE_COLORS.text};
              ">
                ${action}
              </td>
              <td style="
                padding: 8px 0;
                text-align: right;
              ">
                <span style="
                  font-family: ${CLAUDE_STYLES.fontMono};
                  font-size: 13px;
                  color: ${CLAUDE_COLORS.accentHover};
                  padding: 4px 8px;
                  background: rgba(189, 93, 58, 0.1);
                  border-radius: 4px;
                ">
                  ${keys.join(' + ')}
                </span>
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;

  const closeButton = !isPopup ? `
    <button id="close-shortcuts-modal" style="
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      color: ${CLAUDE_COLORS.text};
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  ` : '';

  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
      <h2 style="margin: 0; font-size: 18px; font-weight: 500; color: ${CLAUDE_COLORS.text};">
        Keyboard Shortcuts
      </h2>
      ${closeButton}
    </div>
    ${shortcutsList}
  `;

  return modal;
};

// Shared floating button creation
window.createFloatingButton = function() {
  const button = document.createElement('button');
  button.id = 'shortcuts-floating-button';
  button.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 5H4V19H20V5Z" stroke="${CLAUDE_COLORS.text}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M8 9H8.01M12 9H12.01M16 9H16.01M8 13H8.01M12 13H12.01M16 13H16.01M8 17H16" 
            stroke="${CLAUDE_COLORS.text}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  button.title = 'Keyboard Shortcuts';
  
  button.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    width: 36px;
    height: 36px;
    border-radius: ${CLAUDE_STYLES.borderRadius};
    background: ${CLAUDE_COLORS.background};
    border: 1.5px solid ${CLAUDE_COLORS.border};
    cursor: pointer;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: ${CLAUDE_STYLES.transition};
    padding: 6px;
  `;

  button.onmouseover = () => {
    button.style.background = CLAUDE_COLORS.backgroundHover;
  };
  
  button.onmouseout = () => {
    button.style.background = CLAUDE_COLORS.background;
  };

  return button;
};
