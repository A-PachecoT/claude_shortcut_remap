chrome.action.onClicked.addListener(async (tab) => {
  // Check if we're on a Claude page
  if (tab.url.startsWith('https://claude.ai')) {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: "toggleShortcuts" });
    } catch (error) {
      console.log('Could not send message to content script:', error);
      // Reload the tab if the content script isn't ready
      chrome.tabs.reload(tab.id);
    }
  } else {
    // Open Claude in a new tab if we're not on a Claude page
    chrome.tabs.create({ url: 'https://claude.ai' });
  }
});
